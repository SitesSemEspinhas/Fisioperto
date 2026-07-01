"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { slugify } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import type { ContactStatus } from "@/lib/database.types";

export interface ProfileState {
  ok: boolean;
  message: string;
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  ownUserId: string,
): Promise<string> {
  const root = slugify(base) || `fisio-${ownUserId.slice(0, 8)}`;
  let candidate = root;
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase
      .from("physiotherapists")
      .select("user_id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data || data.user_id === ownUserId) return candidate;
    candidate = `${root}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${root}-${ownUserId.slice(0, 6)}`;
}

export async function saveProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "Sessão expirada. Entre novamente." };
  if (user.profile?.role !== "physiotherapist") {
    return { ok: false, message: "Apenas fisioterapeutas podem editar um perfil profissional." };
  }

  const displayName = ((formData.get("display_name") as string) ?? "").trim();
  if (displayName.length < 2) {
    return { ok: false, message: "Indique o nome a apresentar no perfil." };
  }

  const bio = ((formData.get("bio") as string) ?? "").trim() || null;
  const yearsRaw = ((formData.get("years_experience") as string) ?? "").trim();
  const years = yearsRaw ? Number.parseInt(yearsRaw, 10) : NaN;
  const yearsExperience = Number.isFinite(years) && years >= 0 ? years : null;
  const contactPhone = ((formData.get("contact_phone") as string) ?? "").trim() || null;
  const contactWhatsapp = ((formData.get("contact_whatsapp") as string) ?? "").trim() || null;
  const contactEmail = ((formData.get("contact_email") as string) ?? "").trim() || null;
  const ofpNumber = ((formData.get("ofp_number") as string) ?? "").trim() || null;
  const photoUrl = ((formData.get("photo_url") as string) ?? "").trim() || null;
  const isPublished = formData.get("is_published") === "on";
  const specialtyIds = formData.getAll("specialties").map(String).filter(Boolean);
  const concelhoIds = formData.getAll("concelhos").map(String).filter(Boolean);

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("physiotherapists")
    .select("id, slug, verification, ofp_number")
    .eq("user_id", user.id)
    .maybeSingle();

  const slug = existing?.slug ?? (await uniqueSlug(supabase, displayName, user.id));

  // Verificação: nunca definida como 'verified' pela UI (só admin).
  // Submeter/alterar a cédula coloca em 'pending' (se ainda não verificado).
  const ofpChanged = ofpNumber && ofpNumber !== existing?.ofp_number;
  let verification = existing?.verification ?? "pending";
  if (ofpChanged && verification !== "verified") verification = "pending";

  const { data: saved, error: saveError } = await supabase
    .from("physiotherapists")
    .upsert(
      {
        user_id: user.id,
        display_name: displayName,
        bio,
        years_experience: yearsExperience,
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        contact_email: contactEmail,
        ofp_number: ofpNumber,
        photo_url: photoUrl,
        is_published: isPublished,
        verification,
        slug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("id, slug")
    .single();

  if (saveError || !saved) {
    console.error("[perfil] Falha ao gravar:", saveError);
    return {
      ok: false,
      message: "Não foi possível gravar o perfil. Tente novamente.",
    };
  }

  // Especialidades (M:N): substituir seleção
  await supabase
    .from("physiotherapist_specialties")
    .delete()
    .eq("physiotherapist_id", saved.id);
  if (specialtyIds.length > 0) {
    await supabase.from("physiotherapist_specialties").insert(
      specialtyIds.map((specialty_id) => ({
        physiotherapist_id: saved.id,
        specialty_id,
      })),
    );
  }

  // Concelhos (M:N): substituir seleção
  await supabase
    .from("physiotherapist_concelhos")
    .delete()
    .eq("physiotherapist_id", saved.id);
  if (concelhoIds.length > 0) {
    await supabase.from("physiotherapist_concelhos").insert(
      concelhoIds.map((concelho_id) => ({
        physiotherapist_id: saved.id,
        concelho_id,
      })),
    );
  }

  // Notificar o admin quando é submetida (ou alterada) a cédula OFP.
  if (ofpChanged) {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `Nova cédula OFP para validar — ${displayName}`,
        html: `
          <h2>Pedido de verificação OFP</h2>
          <p><strong>${displayName}</strong> submeteu a cédula <strong>${ofpNumber}</strong>.</p>
          <p>Validar em: ${siteConfig.url}/fisioterapeuta/${saved.slug}</p>
          <p>No Supabase, defina <code>physiotherapists.verification = 'verified'</code> após confirmar.</p>
        `,
      });
    }
  }

  revalidatePath("/conta/perfil");
  revalidatePath("/diretorio");
  if (saved.slug) revalidatePath(`/fisioterapeuta/${saved.slug}`);

  const nota = ofpChanged
    ? " A cédula ficou pendente de validação pela equipa."
    : "";
  const pub =
    isPublished && verification !== "verified"
      ? " O perfil só aparece no diretório após a verificação OFP."
      : "";
  return { ok: true, message: `Perfil guardado com sucesso.${nota}${pub}` };
}

const VALID_STATUS: ContactStatus[] = ["new", "read", "replied", "archived"];

export async function updateContactStatusAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.profile?.role !== "physiotherapist") return;

  const id = (formData.get("id") as string) ?? "";
  const status = (formData.get("status") as string) ?? "";
  if (!id || !VALID_STATUS.includes(status as ContactStatus)) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_requests")
    .update({ status: status as ContactStatus })
    .eq("id", id);
  if (error) console.error("[pedidos] Falha ao atualizar estado:", error);

  revalidatePath("/conta/pedidos");
}
