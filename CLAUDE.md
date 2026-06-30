# 🤖 Projeto: FisioPerto

> Diretório digital nacional de **fisioterapia domiciliária** em Portugal.
> Liga pacientes a fisioterapeutas **verificados pela Ordem dos Fisioterapeutas (OFP)**,
> com pesquisa por **especialidade clínica** e **concelho**.
>
> **Nome de trabalho:** `FisioPerto` — facilmente substituível (ver secção 6).
> **Fase atual:** MVP / Beta gratuito (sem pagamentos).

---

## 1. Regras Rígidas (MUST / MUST NOT)

- **MUST** usar a stack definida: **Next.js (App Router) + TypeScript + Supabase (DB + Auth) + Tailwind CSS + shadcn/ui**, com deploy na **Vercel** e emails via **Resend**.
- **MUST** escrever as histórias de utilizador no formato `Enquanto [perfil], quero [objetivo] para [benefício]` **antes** de escrever código de uma funcionalidade nova.
- **MUST** correr `npm run lint` e `npx tsc --noEmit` no fim de cada tarefa. O trabalho não está concluído se algum falhar.
- **MUST** ativar e respeitar **Row Level Security (RLS)** em **todas** as tabelas do Supabase que contenham dados de utilizadores. Nenhuma tabela com dados pessoais fica sem políticas RLS.
- **MUST** tratar a **verificação da cédula profissional OFP** como funcionalidade de confiança central — nunca marcar um perfil como "Verificado" sem passo de validação explícito (manual no MVP).
- **MUST** escrever todo o texto visível ao utilizador em **Português Europeu (PT-pt)** — "ficheiro", "utilizador", "aceder", "gerir", "ecrã", "contacto", "definições". Nunca PT-br.
- **MUST NOT** incluir segredos, chaves de API ou `service_role` keys em commits, ficheiros de prompt ou código do cliente. Tudo via variáveis de ambiente (ver `.env.example`).
- **MUST NOT** usar a `SUPABASE_SERVICE_ROLE_KEY` em código que corra no browser/cliente. Apenas em Server Components, Route Handlers ou Server Actions.
- **MUST NOT** sobre-engenharia. Preferir a solução mais simples; preferir apagar a acrescentar. Sem dependências desnecessárias.
- **MUST NOT** introduzir pagamentos, Stripe ou lógica de subscrição nesta fase — o MVP é **beta gratuito**. Os planos (Básico €5 / Premium €25) ficam modelados no schema mas **inativos**.

---

## 2. Contexto e Autoridade do Projeto

- **Produto:** Diretório/marketplace que liga **pacientes** a **fisioterapeutas independentes** que prestam serviço **ao domicílio**, com confiança garantida pela validação OFP e pesquisa por especialidade clínica.
- **Público-alvo:**
  - **Profissionais** — fisioterapeutas independentes (~16.000 registados na OFP, ~25% com prática domiciliária) com fraca presença digital estruturada.
  - **Pacientes / famílias** — sobretudo cuidadores de idosos e pessoas em reabilitação pós-cirúrgica/neurológica que pesquisam online por ajuda ao domicílio.
- **Proposta de valor:**
  - *Para o paciente:* encontrar um fisioterapeuta **verificado**, com a **especialidade certa**, no **seu concelho**, sem saber o termo clínico técnico (pesquisa por linguagem natural na Fase 2).
  - *Para o profissional:* presença digital profissional + leads qualificados por **menos do que o custo de 1 sessão por mês**.
- **Diferenciais (não negociáveis no produto):** (1) Verificação OFP, (2) pesquisa por especialidade clínica, (3) foco exclusivo em domicílio, (4) ROI imediato para o profissional.
- **Monetização (futura, fora do MVP):** subscrição mensal Básico €5 / Premium €25; mais tarde plano Pro €49–59 com funcionalidades de IA.

---

## 3. Stack, Setup e Verificação

### Stack
| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Base de dados + Auth | Supabase (Postgres + Supabase Auth) |
| Emails transacionais | Resend |
| Deploy | Vercel |
| Repositório | GitHub |

### Comandos
- **Servidor de desenvolvimento:** `npm run dev` (corre em `http://localhost:3000`)
- **Lint:** `npm run lint`
- **Type-check:** `npx tsc --noEmit`
- **Migração da BD (local):** aplicar `supabase/schema.sql` no projeto Supabase (via SQL Editor ou `supabase db push` se usares a CLI)
- **Seed de dados de referência:** aplicar `supabase/seed.sql` (especialidades + concelhos)
- **Build de produção:** `npm run build`

### Verificação antes de marcar uma tarefa como concluída
1. `npm run lint` passa sem erros.
2. `npx tsc --noEmit` passa sem erros.
3. A funcionalidade foi testada manualmente no fluxo descrito na spec respetiva.
4. Nenhuma tabela nova com dados de utilizador ficou sem RLS.

---

## 4. Fluxo de Trabalho (Workflow)

- **Ao abrir um ticket/tarefa**, produzir uma análise estruturada com: *Problema*, *2–3 Histórias de Utilizador*, *Critérios de Aceitação*, *Fora de âmbito*, *Questões em aberto*.
- **Specs vivem em** `docs/specs/`. Antes de implementar, ler a spec correspondente. Se não existir, criá-la primeiro.
- **Estilo/UI:** Tailwind + shadcn/ui. Evitar UI genérica "à Bootstrap"; ver `docs/specs/00-mvp-scope.md` para a direção visual (confiança clínica, limpo, acessível).
- **Especificações passo-a-passo** podem usar etiquetas XML (ex.: `<request>...</request>`) para delimitar instruções.
- **Acessibilidade (a11y):** o público inclui idosos e cuidadores — contraste adequado, tamanhos de toque generosos, navegação por teclado. Tratar como requisito, não como extra.
- **SEO é o motor de aquisição.** Páginas públicas (diretório, perfis, páginas de especialidade+concelho) **MUST** ser renderizadas no servidor (SSR/SSG) com metadados, `generateMetadata`, dados estruturados (JSON-LD `LocalBusiness`/`MedicalBusiness`) e URLs limpas do tipo `/[especialidade]/[concelho]`.

---

## 5. Condições de Paragem e Tratamento de Erros (STOP)

- **STOP** e pedir clarificação se uma alteração ao schema afetar tabelas com dados de utilizadores já existentes (perfis, pedidos de contacto, favoritos).
- **STOP** e recusar se for pedido para remover/contornar a validação OFP, a autenticação, ou as políticas RLS sem autorização explícita.
- **STOP** se uma tarefa exigir introduzir pagamentos/Stripe — isso está fora do âmbito do MVP; confirmar com o Rui antes.
- **STOP** e perguntar antes de adicionar uma dependência pesada nova (qualquer coisa além de Next/Supabase/Tailwind/shadcn/Resend/utilitários pequenos).
- **Tratamento de erros:** falhas de envio de email (Resend), de escrita no Supabase ou de autenticação **MUST** ter mensagem clara ao utilizador em PT-pt + log no servidor. Nunca falhar em silêncio.

---

## 6. Como Renomear o Projeto (1 minuto)

O nome `FisioPerto` é um nome de trabalho. Para o trocar, procurar e substituir em todo o projeto:
- `FisioPerto` → nome de marca novo (texto visível)
- `fisioperto` → slug novo (package.json, repo, etc.)
- Atualizar `NEXT_PUBLIC_SITE_NAME` e `NEXT_PUBLIC_SITE_URL` no `.env`

Candidatos de marca sugeridos (verificar disponibilidade `.pt` no registrador antes de comprar): ver `README.md` › "Naming".

---

## 7. Perfis de Utilizador (modelo mental)

- **Visitante (anónimo):** pesquisa o diretório, vê perfis públicos, envia formulário de contacto. Não precisa de conta.
- **Paciente (autenticado):** tudo o acima + guardar favoritos e ver histórico de pedidos de contacto.
- **Fisioterapeuta (autenticado):** cria/gere o seu perfil, escolhe especialidades e concelho(s), recebe pedidos de contacto. Estado de verificação OFP gerido por admin.
- **Admin (Rui):** valida cédulas OFP, gere especialidades/concelhos, vê métricas. (MVP: pode ser feito diretamente no Supabase.)

> Nota: no MVP os limites de plano (1 concelho no Básico vs. ilimitado no Premium) existem no schema mas **não são aplicados** — todos os profissionais em beta têm acesso completo gratuito.
