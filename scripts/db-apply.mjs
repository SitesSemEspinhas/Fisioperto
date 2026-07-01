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
  : ["supabase/schema.sql", "supabase/seed.sql", "supabase/seed-demo.sql"];

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("✖ DATABASE_URL em falta no .env");
  process.exit(1);
}

// Para migrações/DDL, o session pooler (porta 5432) é mais fiável que o
// transaction pooler (6543). Trocamos a porta, com fallback para a original.
const sessionUrl = raw.replace(":6543/", ":5432/");
const candidates = sessionUrl === raw ? [raw] : [sessionUrl, raw];

async function connect() {
  let lastErr;
  for (const url of candidates) {
    const port = url.includes(":5432/") ? "5432 (session)" : "6543 (transaction)";
    const client = new Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      console.log(`✓ Ligado à BD via porta ${port}`);
      return client;
    } catch (err) {
      console.warn(`… falhou porta ${port}: ${err.message}`);
      lastErr = err;
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
