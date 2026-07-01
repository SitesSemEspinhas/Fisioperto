"use client";

import { useEffect, useRef } from "react";

/**
 * Regista uma vista de perfil (uma vez por montagem) através de um Route Handler.
 * Mantém a página do perfil cacheável para SEO — a vista é registada no cliente.
 */
export function ProfileViewTracker({
  physiotherapistId,
}: {
  physiotherapistId: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch("/api/perfil-visto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ physiotherapistId }),
      keepalive: true,
    }).catch(() => {
      // Falha ao registar a vista não deve afetar a experiência do visitante.
    });
  }, [physiotherapistId]);

  return null;
}
