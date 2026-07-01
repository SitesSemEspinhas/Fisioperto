import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

/**
 * Regista uma vista de perfil. Escrita pública anónima permitida por RLS.
 * Guardamos apenas um hash anónimo do visitante (nunca o IP em claro).
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }

  try {
    const body = (await request.json()) as {
      physiotherapistId?: string;
      concelhoId?: string;
    };
    if (!body.physiotherapistId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "desconhecido";
    const ua = request.headers.get("user-agent") ?? "desconhecido";
    const day = new Date().toISOString().slice(0, 10);
    const viewerHash = createHash("sha256")
      .update(`${ip}|${ua}|${day}`)
      .digest("hex");

    const supabase = await createClient();
    const { error } = await supabase.from("profile_views").insert({
      physiotherapist_id: body.physiotherapistId,
      concelho_id: body.concelhoId ?? null,
      viewer_hash: viewerHash,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[perfil-visto] Falha ao registar vista:", error);
    // Nunca bloquear a UI por causa de analytics.
    return NextResponse.json({ ok: false });
  }
}
