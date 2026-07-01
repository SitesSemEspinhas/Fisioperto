import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Physiotherapist } from "@/lib/database.types";
import type { SpecialtyTag, ConcelhoTag } from "@/lib/data";

/** Perfil profissional do utilizador autenticado (ou null se ainda não existir). */
export async function getPhysioForUser(
  userId: string,
): Promise<Physiotherapist | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("physiotherapists")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Physiotherapist | null) ?? null;
}

/** Ids das especialidades e concelhos já associados ao perfil. */
export async function getSelectedTagIds(physioId: string): Promise<{
  specialtyIds: string[];
  concelhoIds: string[];
}> {
  const supabase = await createClient();
  const [{ data: s }, { data: c }] = await Promise.all([
    supabase
      .from("physiotherapist_specialties")
      .select("specialty_id")
      .eq("physiotherapist_id", physioId),
    supabase
      .from("physiotherapist_concelhos")
      .select("concelho_id")
      .eq("physiotherapist_id", physioId),
  ]);
  return {
    specialtyIds: (s ?? []).map((x) => x.specialty_id),
    concelhoIds: (c ?? []).map((x) => x.concelho_id),
  };
}

/** Listas de referência (id + nome + slug) para os seletores do formulário. */
export async function getReferenceForForms(): Promise<{
  specialties: SpecialtyTag[];
  concelhos: ConcelhoTag[];
}> {
  const supabase = await createClient();
  const [{ data: specs }, { data: concs }] = await Promise.all([
    supabase.from("specialties").select("id, name, slug").order("sort_order"),
    supabase.from("concelhos").select("id, name, slug, distrito").order("name"),
  ]);
  return {
    specialties: (specs ?? []) as SpecialtyTag[],
    concelhos: (concs ?? []) as ConcelhoTag[],
  };
}
