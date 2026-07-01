import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Physiotherapist,
  ContactRequest,
} from "@/lib/database.types";

export interface SpecialtyTag {
  id: string;
  name: string;
  slug: string;
}
export interface ConcelhoTag {
  id: string;
  name: string;
  slug: string;
  distrito: string;
}
export interface PhysioCard extends Physiotherapist {
  specialties: SpecialtyTag[];
  concelhos: ConcelhoTag[];
}

export interface DirectoryFilters {
  especialidade?: string;
  concelho?: string;
}

type Supa = Awaited<ReturnType<typeof createClient>>;

async function loadReferenceMaps(supabase: Supa) {
  const [{ data: specs }, { data: concs }] = await Promise.all([
    supabase.from("specialties").select("id, name, slug").order("sort_order"),
    supabase.from("concelhos").select("id, name, slug, distrito").order("name"),
  ]);
  return {
    specs: (specs ?? []) as SpecialtyTag[],
    concs: (concs ?? []) as ConcelhoTag[],
  };
}

function stitchTags(
  physios: Physiotherapist[],
  specLinks: { physiotherapist_id: string; specialty_id: string }[],
  concLinks: { physiotherapist_id: string; concelho_id: string }[],
  specById: Map<string, SpecialtyTag>,
  concById: Map<string, ConcelhoTag>,
): PhysioCard[] {
  return physios.map((p) => ({
    ...p,
    specialties: specLinks
      .filter((l) => l.physiotherapist_id === p.id)
      .map((l) => specById.get(l.specialty_id))
      .filter((x): x is SpecialtyTag => Boolean(x)),
    concelhos: concLinks
      .filter((l) => l.physiotherapist_id === p.id)
      .map((l) => concById.get(l.concelho_id))
      .filter((x): x is ConcelhoTag => Boolean(x)),
  }));
}

/**
 * Lista fisioterapeutas PUBLICADOS + VERIFICADOS, opcionalmente filtrados por
 * especialidade e/ou concelho (por slug). Só estes aparecem no diretório público.
 */
export async function listPhysiotherapists(
  filters: DirectoryFilters = {},
): Promise<PhysioCard[]> {
  const supabase = await createClient();
  const { specs, concs } = await loadReferenceMaps(supabase);
  const specBySlug = new Map(specs.map((s) => [s.slug, s]));
  const concBySlug = new Map(concs.map((c) => [c.slug, c]));
  const specById = new Map(specs.map((s) => [s.id, s]));
  const concById = new Map(concs.map((c) => [c.id, c]));

  // Resolver ids que satisfazem os filtros (interseção quando ambos presentes).
  let idFilter: string[] | null = null;

  if (filters.especialidade) {
    const s = specBySlug.get(filters.especialidade);
    const links = s
      ? (
          await supabase
            .from("physiotherapist_specialties")
            .select("physiotherapist_id")
            .eq("specialty_id", s.id)
        ).data ?? []
      : [];
    idFilter = links.map((l) => l.physiotherapist_id);
  }

  if (filters.concelho) {
    const c = concBySlug.get(filters.concelho);
    const links = c
      ? (
          await supabase
            .from("physiotherapist_concelhos")
            .select("physiotherapist_id")
            .eq("concelho_id", c.id)
        ).data ?? []
      : [];
    const ids = links.map((l) => l.physiotherapist_id);
    idFilter =
      idFilter === null ? ids : idFilter.filter((id) => ids.includes(id));
  }

  // Se um filtro foi pedido mas não devolveu nada, o resultado é vazio.
  if (idFilter !== null && idFilter.length === 0) return [];

  let query = supabase
    .from("physiotherapists")
    .select("*")
    .eq("is_published", true)
    .eq("verification", "verified");
  if (idFilter !== null) query = query.in("id", idFilter);

  const { data: physios } = await query.order("display_name");
  const list = (physios ?? []) as Physiotherapist[];
  if (list.length === 0) return [];

  const physioIds = list.map((p) => p.id);
  const [{ data: sLinks }, { data: cLinks }] = await Promise.all([
    supabase
      .from("physiotherapist_specialties")
      .select("physiotherapist_id, specialty_id")
      .in("physiotherapist_id", physioIds),
    supabase
      .from("physiotherapist_concelhos")
      .select("physiotherapist_id, concelho_id")
      .in("physiotherapist_id", physioIds),
  ]);

  return stitchTags(list, sLinks ?? [], cLinks ?? [], specById, concById);
}

/** Perfil público completo por slug (só se publicado + verificado). */
export async function getPhysiotherapistBySlug(
  slug: string,
): Promise<PhysioCard | null> {
  const supabase = await createClient();
  const { data: physio } = await supabase
    .from("physiotherapists")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("verification", "verified")
    .maybeSingle();

  if (!physio) return null;

  const { specs, concs } = await loadReferenceMaps(supabase);
  const specById = new Map(specs.map((s) => [s.id, s]));
  const concById = new Map(concs.map((c) => [c.id, c]));

  const [{ data: sLinks }, { data: cLinks }] = await Promise.all([
    supabase
      .from("physiotherapist_specialties")
      .select("physiotherapist_id, specialty_id")
      .eq("physiotherapist_id", physio.id),
    supabase
      .from("physiotherapist_concelhos")
      .select("physiotherapist_id, concelho_id")
      .eq("physiotherapist_id", physio.id),
  ]);

  return stitchTags(
    [physio as Physiotherapist],
    sLinks ?? [],
    cLinks ?? [],
    specById,
    concById,
  )[0];
}

/** Slugs de todos os perfis públicos (para sitemap e generateStaticParams). */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("physiotherapists")
    .select("slug")
    .eq("is_published", true)
    .eq("verification", "verified");
  return (data ?? [])
    .map((r) => r.slug)
    .filter((s): s is string => Boolean(s));
}

/**
 * Combinações (especialidade, concelho) que têm pelo menos um profissional.
 * Usado para gerar estaticamente as landings SEO /[especialidade]/[concelho].
 */
export async function getActiveSpecialtyConcelhoCombos(): Promise<
  { especialidade: string; concelho: string }[]
> {
  const supabase = await createClient();
  const { specs, concs } = await loadReferenceMaps(supabase);
  const specById = new Map(specs.map((s) => [s.id, s.slug]));
  const concById = new Map(concs.map((c) => [c.id, c.slug]));

  const { data: physios } = await supabase
    .from("physiotherapists")
    .select("id")
    .eq("is_published", true)
    .eq("verification", "verified");
  const ids = (physios ?? []).map((p) => p.id);
  if (ids.length === 0) return [];

  const [{ data: sLinks }, { data: cLinks }] = await Promise.all([
    supabase
      .from("physiotherapist_specialties")
      .select("physiotherapist_id, specialty_id")
      .in("physiotherapist_id", ids),
    supabase
      .from("physiotherapist_concelhos")
      .select("physiotherapist_id, concelho_id")
      .in("physiotherapist_id", ids),
  ]);

  const pushInto = (map: Map<string, string[]>, key: string, value: string) => {
    const arr = map.get(key);
    if (arr) arr.push(value);
    else map.set(key, [value]);
  };

  const specByPhysio = new Map<string, string[]>();
  for (const l of sLinks ?? []) {
    const slug = specById.get(l.specialty_id);
    if (slug) pushInto(specByPhysio, l.physiotherapist_id, slug);
  }
  const concByPhysio = new Map<string, string[]>();
  for (const l of cLinks ?? []) {
    const slug = concById.get(l.concelho_id);
    if (slug) pushInto(concByPhysio, l.physiotherapist_id, slug);
  }

  const combos = new Set<string>();
  for (const id of ids) {
    for (const e of specByPhysio.get(id) ?? []) {
      for (const c of concByPhysio.get(id) ?? []) {
        combos.add(`${e}/${c}`);
      }
    }
  }
  return [...combos].map((k) => {
    const [especialidade, concelho] = k.split("/");
    return { especialidade, concelho };
  });
}

/** Pedidos de contacto dirigidos a um fisioterapeuta (usado na área autenticada). */
export async function getContactRequestsFor(
  physiotherapistId: string,
): Promise<ContactRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_requests")
    .select("*")
    .eq("physiotherapist_id", physiotherapistId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ContactRequest[];
}
