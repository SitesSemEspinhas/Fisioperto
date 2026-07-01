// ============================================================
// FisioPerto — Aplicar schema + seeds à base de dados Supabase
// Uso: node --env-file=.env scripts/db-apply.mjs [--demo-only]
// Requer DATABASE_URL no .env (ligação Postgres direta/pooler).
// ============================================================
import { readFile } from "node:fs/promises";
import { Client } from "pg";

const demoOnly = process.argv.includes("--demo-only");
const files = demoOnly
  ? ["supabase/seed-demo.sql"]
  : [
      "supabase/schema.sql",
      "supabase/seed.sql",
      "supabase/seed-demo.sql",
      "supabase/storage.sql",
    ];

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("✖ DATABASE_URL em falta no .env");
  process.exit(1);
}

// Constrói a lista de ligações a tentar. Lê o segredo APENAS do .env.
// Se o DATABASE_URL for a ligação direta (db.<ref>.supabase.co, só IPv6 nos
// projetos novos), deriva as variantes do pooler (IPv4) para as regiões UE
// mais comuns — o utilizador não tem de copiar outra string.
function buildCandidates(connStr) {
  const list = [];
  // Preferir sempre a porta 5432 (session) para DDL.
  list.push(connStr.replace(":6543/", ":5432/"));
  if (connStr.includes(":6543/")) list.push(connStr);

  try {
    const u = new URL(connStr);
    const m = u.hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
    if (m) {
      const ref = m[1];
      const pw = decodeURIComponent(u.password);
      const regioes = [
        "eu-west-1",
        "eu-west-2",
        "eu-west-3",
        "eu-central-1",
        "eu-central-2",
        "us-east-1",
      ];
      for (const r of regioes) {
        const user = encodeURIComponent(`postgres.${ref}`);
        const pass = encodeURIComponent(pw);
        list.push(
          `postgresql://${user}:${pass}@aws-0-${r}.pooler.supabase.com:5432/postgres`,
        );
      }
    }
  } catch {
    // string não parseável como URL — segue só com a original
  }
  return list;
}

const candidates = buildCandidates(raw);

async function connect() {
  let lastErr;
  for (const url of candidates) {
    let host = "?";
    try {
      host = new URL(url).host;
    } catch {}
    const client = new Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      await client.connect();
      console.log(`✓ Ligado à BD via ${host}`);
      return client;
    } catch (err) {
      console.warn(`… falhou ${host}: ${err.message.slice(0, 70)}`);
      lastErr = err;
      try {
        await client.end();
      } catch {}
    }
  }
  throw lastErr;
}

const client = await connect();
try {
  for (const f of files) {
    const sql = await readFile(f, "utf8");
    process.stdout.write(`→ A aplicar ${f} … `);
    await client.query(sql);
    console.log("OK");
  }
  console.log("\n✓ Base de dados atualizada com sucesso.");
} catch (err) {
  console.error(`\n✖ ERRO ao aplicar SQL: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
