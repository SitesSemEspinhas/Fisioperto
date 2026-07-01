import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Callback de autenticação: troca o `code` (confirmação de email / recuperação
 * de password) por uma sessão e redireciona.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/conta/perfil";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
  }

  return NextResponse.redirect(`${origin}/entrar?erro=confirmacao`);
}
