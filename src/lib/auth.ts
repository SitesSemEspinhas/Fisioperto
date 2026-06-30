import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import type { Profile } from "@/lib/database.types";

export interface SessionUser {
  id: string;
  email: string | null;
  profile: Profile | null;
}

/**
 * Devolve o utilizador autenticado (e o seu perfil) ou null.
 * Tolerante a Supabase não configurado — nunca rebenta no scaffolding/demo.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return { id: user.id, email: user.email ?? null, profile: profile ?? null };
  } catch (error) {
    console.error("[auth] Falha ao ler a sessão:", error);
    return null;
  }
}
