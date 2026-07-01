"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

export interface AuthState {
  ok: boolean;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Registo de paciente ou fisioterapeuta (email/password). */
export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = ((formData.get("full_name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";
  const roleRaw = (formData.get("role") as string) ?? "patient";
  const role = roleRaw === "physiotherapist" ? "physiotherapist" : "patient";

  if (fullName.length < 2) return { ok: false, message: "Indique o seu nome." };
  if (!EMAIL_RE.test(email))
    return { ok: false, message: "Indique um email válido." };
  if (password.length < 8)
    return {
      ok: false,
      message: "A password deve ter pelo menos 8 caracteres.",
    };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName },
      emailRedirectTo: `${siteConfig.url}/auth/callback`,
    },
  });

  if (error) {
    console.error("[auth] signUp:", error.message);
    return { ok: false, message: traduzErroAuth(error.message) };
  }

  // Se a confirmação de email estiver ativa, não há sessão imediata.
  if (!data.session) {
    return {
      ok: true,
      message:
        "Conta criada! Verifique o seu email para confirmar o registo antes de entrar.",
    };
  }

  redirect(role === "physiotherapist" ? "/conta/perfil" : "/diretorio");
}

/** Início de sessão. */
export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = ((formData.get("email") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";
  const redirectTo = ((formData.get("redirect") as string) ?? "").trim();

  if (!EMAIL_RE.test(email) || password.length === 0) {
    return { ok: false, message: "Preencha o email e a password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[auth] signIn:", error.message);
    return { ok: false, message: traduzErroAuth(error.message) };
  }

  // Escolher destino conforme o perfil
  let destino = redirectTo && redirectTo.startsWith("/") ? redirectTo : "";
  if (!destino) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    destino = profile?.role === "physiotherapist" ? "/conta/perfil" : "/diretorio";
  }
  redirect(destino);
}

/** Terminar sessão. */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** Pedido de recuperação de password (envia email). */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = ((formData.get("email") as string) ?? "").trim();
  if (!EMAIL_RE.test(email))
    return { ok: false, message: "Indique um email válido." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.url}/auth/callback?next=/conta/redefinir-password`,
  });
  if (error) {
    console.error("[auth] resetPassword:", error.message);
  }
  // Não revelar se o email existe (privacidade).
  return {
    ok: true,
    message:
      "Se existir uma conta com esse email, enviámos instruções para redefinir a password.",
  };
}

/** Definir nova password (após clicar no link de recuperação). */
export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = (formData.get("password") as string) ?? "";
  if (password.length < 8)
    return {
      ok: false,
      message: "A password deve ter pelo menos 8 caracteres.",
    };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[auth] updatePassword:", error.message);
    return { ok: false, message: traduzErroAuth(error.message) };
  }
  redirect("/conta/perfil");
}

function traduzErroAuth(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email ou password incorretos.";
  if (m.includes("email not confirmed"))
    return "Confirme o seu email antes de entrar (verifique a sua caixa de correio).";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Já existe uma conta com este email. Tente entrar.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiadas tentativas. Aguarde um momento e tente novamente.";
  return "Ocorreu um erro. Tente novamente, por favor.";
}
