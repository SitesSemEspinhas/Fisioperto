"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { isSupabaseConfigured, siteConfig } from "@/lib/config";

export interface ContactState {
  ok: boolean;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactRequest(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot anti-spam: campo escondido que só bots preenchem.
  if (((formData.get("website") as string) ?? "").trim().length > 0) {
    return { ok: true, message: "Pedido enviado. Obrigado!" };
  }

  const physiotherapistId = (formData.get("physiotherapistId") as string) ?? "";
  const senderName = ((formData.get("sender_name") as string) ?? "").trim();
  const senderEmail = ((formData.get("sender_email") as string) ?? "").trim();
  const senderPhone =
    ((formData.get("sender_phone") as string) ?? "").trim() || null;
  const message = ((formData.get("message") as string) ?? "").trim();
  const especialidadeSlug =
    ((formData.get("especialidade") as string) ?? "").trim() || null;
  const concelhoSlug =
    ((formData.get("concelho") as string) ?? "").trim() || null;

  if (!physiotherapistId) {
    return { ok: false, message: "Profissional inválido. Recarregue a página." };
  }
  if (senderName.length < 2) {
    return { ok: false, message: "Indique o seu nome." };
  }
  if (!EMAIL_RE.test(senderEmail)) {
    return { ok: false, message: "Indique um email válido." };
  }
  if (message.length < 10) {
    return {
      ok: false,
      message: "Escreva uma mensagem com um pouco mais de detalhe (mín. 10 caracteres).",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        "O serviço está temporariamente indisponível. Tente novamente mais tarde.",
    };
  }

  try {
    const supabase = await createClient();
    const user = await getSessionUser();

    // Resolver contexto opcional (especialidade/concelho) por slug.
    let specialtyId: string | null = null;
    let concelhoId: string | null = null;
    if (especialidadeSlug) {
      const { data } = await supabase
        .from("specialties")
        .select("id")
        .eq("slug", especialidadeSlug)
        .maybeSingle();
      specialtyId = data?.id ?? null;
    }
    if (concelhoSlug) {
      const { data } = await supabase
        .from("concelhos")
        .select("id")
        .eq("slug", concelhoSlug)
        .maybeSingle();
      concelhoId = data?.id ?? null;
    }

    const { error: insertError } = await supabase.from("contact_requests").insert({
      physiotherapist_id: physiotherapistId,
      patient_user_id: user?.id ?? null,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone,
      specialty_id: specialtyId,
      concelho_id: concelhoId,
      message,
    });

    if (insertError) {
      console.error("[contacto] Falha ao gravar pedido:", insertError);
      return {
        ok: false,
        message:
          "Não foi possível registar o seu pedido. Tente novamente, por favor.",
      };
    }

    // Notificar o profissional por email (com fallback claro se Resend não configurado).
    const { data: physio } = await supabase
      .from("physiotherapists")
      .select("display_name, contact_email")
      .eq("id", physiotherapistId)
      .maybeSingle();

    if (physio?.contact_email) {
      await sendEmail({
        to: physio.contact_email,
        replyTo: senderEmail,
        subject: `Novo pedido de contacto — ${siteConfig.name}`,
        html: `
          <h2>Novo pedido de contacto</h2>
          <p>Recebeu um novo pedido através do ${siteConfig.name}.</p>
          <p><strong>Nome:</strong> ${senderName}<br/>
          <strong>Email:</strong> ${senderEmail}<br/>
          <strong>Telefone:</strong> ${senderPhone ?? "(não indicado)"}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        `,
      });
    }

    return {
      ok: true,
      message:
        "Pedido enviado com sucesso! O profissional foi notificado e entrará em contacto.",
    };
  } catch (error) {
    console.error("[contacto] Erro inesperado:", error);
    return {
      ok: false,
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    };
  }
}
