// Verificação rápida: contagens via BD direta + leitura pública via anon key (RLS).
// Uso: node --env-file=.env scripts/db-verify.mjs
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 1) Contagens definitivas via BD
const client = new Client({
  connectionString: process.env.DATABASE_URL.replace(":6543/", ":5432/"),
  ssl: { rejectUnauthorized: false },
});
await client.connect();
const q = async (sql) => (await client.query(sql)).rows[0].n;
console.log("— Contagens (BD direta) —");
console.log("physiotherapists:", await q("select count(*)::int n from physiotherapists"));
console.log("  publicados+verificados:", await q("select count(*)::int n from physiotherapists where is_published and verification='verified'"));
console.log("specialties:", await q("select count(*)::int n from specialties"));
console.log("concelhos:", await q("select count(*)::int n from concelhos"));
console.log("physiotherapist_specialties:", await q("select count(*)::int n from physiotherapist_specialties"));
console.log("physiotherapist_concelhos:", await q("select count(*)::int n from physiotherapist_concelhos"));
console.log("contact_requests:", await q("select count(*)::int n from contact_requests"));
console.log("profiles:", await q("select count(*)::int n from profiles"));
await client.end();

// 2) Leitura pública via anon key (testa RLS: só publicados devem aparecer)
const supabase = createClient(url, anon);
const { data, error } = await supabase
  .from("physiotherapists")
  .select("display_name, slug, verification, is_published")
  .order("display_name");
console.log("\n— Leitura pública via anon key (RLS) —");
if (error) {
  console.error("✖ erro anon:", error.message);
  process.exitCode = 1;
} else {
  console.log(`✓ anon vê ${data.length} perfis publicados`);
  console.log("  ex.:", data.slice(0, 3).map((d) => d.slug).join(", "));
}
