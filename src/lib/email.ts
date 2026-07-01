import "server-only";

import { Resend } from "resend";
import { isResendConfigured } from "@/lib/config";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export type SendEmailResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

/**
 * Envia um email via Resend. Se a chave não estiver configurada, NÃO falha em
 * silêncio: regista um log claro no servidor e devolve { ok, skipped } para a
 * UI poder informar o utilizador de forma honesta.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const from = process.env.RESEND_FROM_EMAIL ?? "FisioPerto <onboarding@resend.dev>";

  if (!isResendConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY não configurada — email NÃO enviado. ` +
        `Para: ${input.to} | Assunto: ${input.subject}`,
    );
    return { ok: true, skipped: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    if (error) {
      console.error("[email] Resend devolveu erro:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[email] Falha ao enviar email:", message);
    return { ok: false, error: message };
  }
}
