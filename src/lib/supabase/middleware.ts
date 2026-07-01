import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { supabaseAnonKey, isSupabaseConfigured } from "@/lib/config";

/**
 * Refresca a sessão Supabase (cookies) em cada pedido e protege as rotas /conta.
 * Padrão recomendado por @supabase/ssr para Next.js App Router.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Sem Supabase configurado, não há sessão a refrescar.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteger a área autenticada
  const path = request.nextUrl.pathname;
  if (!user && path.startsWith("/conta")) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return response;
}
