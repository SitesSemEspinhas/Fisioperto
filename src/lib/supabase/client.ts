"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { supabaseAnonKey } from "@/lib/config";

/**
 * Cliente Supabase para o browser (Client Components).
 * Usa apenas a chave anónima/publishable pública — nunca a service_role.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey()!,
  );
}
