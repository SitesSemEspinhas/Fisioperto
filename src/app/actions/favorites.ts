"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export interface FavoriteResult {
  ok: boolean;
  favorited: boolean;
  needAuth?: boolean;
}

/** Alterna o estado de favorito do fisioterapeuta para o paciente autenticado. */
export async function toggleFavoriteAction(
  physiotherapistId: string,
): Promise<FavoriteResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, favorited: false, needAuth: true };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("favorites")
    .select("physiotherapist_id")
    .eq("user_id", user.id)
    .eq("physiotherapist_id", physiotherapistId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("physiotherapist_id", physiotherapistId);
    if (error) return { ok: false, favorited: true };
    revalidatePath("/conta/favoritos");
    return { ok: true, favorited: false };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, physiotherapist_id: physiotherapistId });
  if (error) {
    console.error("[favoritos] Falha ao adicionar:", error);
    return { ok: false, favorited: false };
  }
  revalidatePath("/conta/favoritos");
  return { ok: true, favorited: true };
}
