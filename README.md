# FisioPerto

Diretório digital nacional de **fisioterapia domiciliária** em Portugal. Liga pacientes a fisioterapeutas **verificados pela Ordem dos Fisioterapeutas (OFP)**, com pesquisa por **especialidade clínica** e **concelho**.

> **Fase atual:** MVP / Beta gratuito (sem pagamentos).
> O documento de regras e contexto para o Claude Code está em [`CLAUDE.md`](./CLAUDE.md).

---

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Supabase** (Postgres + Auth)
- **Tailwind CSS** + **shadcn/ui**
- **Resend** (emails transacionais)
- Deploy na **Vercel** · Repositório no **GitHub**

---

## Setup local

1. **Instalar dependências**
   ```bash
   npm install
   ```
   > As versões em `package.json` são um ponto de partida. Corre `npm install` e, se quiseres as mais recentes, `npx npm-check-updates -u && npm install`.

2. **Variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Preencher com as chaves do Supabase e do Resend.

3. **Base de dados (Supabase)**
   - Criar projeto em [supabase.com](https://supabase.com).
   - No **SQL Editor**, correr `supabase/schema.sql` e depois `supabase/seed.sql`.
   - (Em alternativa, com a CLI: `supabase db push`.)

4. **Arrancar**
   ```bash
   npm run dev
   ```
   Abre em `http://localhost:3000`.

---

## Estrutura do projeto

```
fisioperto/
├── CLAUDE.md                 # Documento-mãe: regras + contexto para o Claude Code
├── README.md
├── .env.example
├── package.json
├── docs/
│   ├── PRD.md                # Visão de produto resumida
│   └── specs/                # Especificações por funcionalidade (ler antes de implementar)
│       ├── 00-mvp-scope.md
│       ├── 01-auth.md
│       ├── 02-perfil-profissional.md
│       ├── 03-pesquisa-diretorio.md
│       └── 04-contacto-favoritos.md
└── supabase/
    ├── schema.sql            # Tabelas + RLS + triggers
    └── seed.sql              # Especialidades + concelhos
```

> A estrutura `src/` do Next.js (rotas, componentes) é criada pelo Claude Code à medida que as funcionalidades forem implementadas, seguindo as specs em `docs/specs/`.

---

## Naming (nome de marca / domínio)

`FisioPerto` é um **nome de trabalho**. O mercado de *prestadores* está saturado (fisiolar.pt, fisioterapiaemcasa.pt, fisyou.pt, etc.), mas estes são clínicas/equipas — não **diretórios**. A marca deve comunicar *diretório + confiança + busca*, não *"nós tratamos de si"*.

Candidatos (⚠️ **confirmar disponibilidade `.pt` no registrador** — esta lista não é verificação oficial):

| Nome | Ângulo |
|---|---|
| **FisioPerto** | Proximidade / busca geográfica (core: pesquisa por concelho) |
| **EncontraFisio** | Explícito como diretório |
| **FisioVerificado** | Comunica o diferencial #1 (validação OFP) |
| **RedeFisio** | Marketplace / rede (existe `.com.br`, `.pt` a confirmar) |
| **Fisora** | Marca curta e inventada (sem prestador PT relevante) |

Para trocar o nome, ver secção 6 do [`CLAUDE.md`](./CLAUDE.md).

---

## Roadmap (resumo)

- **Fase 0 — Beta:** recrutar 50–100 fisioterapeutas em modo gratuito (atual).
- **Fase 1 — Lançamento:** SEO local, perfis públicos, pesquisa por especialidade+concelho.
- **Fase 2 — IA + monetização:** pesquisa por linguagem natural, planos Básico/Premium, analytics.
- **Fase 3 — Escala:** app móvel, agenda/notas com IA, plano Pro.

Detalhe completo no plano de negócio e em `docs/PRD.md`.
