/**
 * Configuração do site, lida de variáveis de ambiente.
 * Centraliza nome/URL para facilitar o rebranding (ver CLAUDE.md §6).
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "FisioPerto",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Encontre fisioterapeutas verificados pela Ordem dos Fisioterapeutas para fisioterapia ao domicílio em Portugal. Pesquise por especialidade clínica e concelho.",
  tagline: "Fisioterapia ao domicílio, com confiança.",
} as const;

/** Indica se as variáveis do Supabase estão configuradas com valores reais (não placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder") &&
      !key.includes("placeholder"),
  );
}

/** Indica se o Resend está configurado (chave presente). */
export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
