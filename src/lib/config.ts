/**
 * Configuração do site, lida de variáveis de ambiente.
 * Centraliza nome/URL para facilitar o rebranding (ver CLAUDE.md §6).
 */
/**
 * Normaliza o URL do site para uma forma absoluta e válida.
 * Aceita valores sem protocolo (ex.: "fisioperto.vercel.app" → "https://...")
 * e nunca deixa `new URL(...)` rebentar (metadataBase).
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const fallback = "http://localhost:3000";
  const value = (raw ?? "").trim();
  if (!value) return fallback;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "FisioPerto",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    "Encontre fisioterapeutas verificados pela Ordem dos Fisioterapeutas para fisioterapia ao domicílio em Portugal. Pesquise por especialidade clínica e concelho.",
  tagline: "Fisioterapia ao domicílio, com confiança.",
} as const;

/**
 * Chave pública do Supabase (anon). Aceita o nome antigo (ANON_KEY) e o
 * novo esquema de chaves do Supabase (PUBLISHABLE_KEY, sb_publishable_...).
 */
export function supabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/** Indica se as variáveis do Supabase estão configuradas com valores reais (não placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseAnonKey();
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
