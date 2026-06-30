# Spec 00 — Âmbito do MVP

## Objetivo
Validar a hipótese central com baixo investimento: **fisioterapeutas inscrevem-se e publicam perfil; pacientes encontram-nos por especialidade e concelho e enviam pedidos de contacto.** Tudo gratuito (beta).

## Dentro do âmbito (MVP)
- Registo/login de **fisioterapeutas** e **pacientes** (Supabase Auth, email/password).
- **Perfil profissional**: foto, nome, bio, anos de experiência, especialidades, concelho(s), contactos, nº de cédula OFP.
- **Verificação OFP manual** (admin marca como verificado) + badge "Verificado OFP".
- **Diretório público** com pesquisa/filtro por especialidade + concelho.
- **Páginas SEO** `/[especialidade]/[concelho]` e perfil público `/fisioterapeuta/[slug]`.
- **Formulário de contacto interno** (anónimo ou autenticado) → email ao profissional via Resend.
- **Favoritos** e **histórico de contactos** para pacientes autenticados.
- **Recolha de vistas de perfil** (dados guardados; dashboard de analytics fica para depois).

## Fora do âmbito (MVP) — modelado mas inativo
- Pagamentos / Stripe / subscrições. Limites de plano (1 vs ∞ concelhos) **não aplicados**.
- Pesquisa por linguagem natural (IA) — Fase 2.
- Vídeo de apresentação, mapa da clínica, destaque nos resultados — Premium, Fase posterior.
- Avaliações de pacientes, painel de insights IA, app móvel — Fase 2/3.

## Direção visual
- **Tom:** confiança clínica, limpo, calmo. Não "startup berrante".
- **Acessibilidade primeiro** (público sénior): contraste AA, tipografia ≥16px, alvos de toque ≥44px, foco visível.
- Tailwind + shadcn/ui. Paleta a definir; evitar UI genérica.

## Critérios de aceitação globais
- [ ] Um fisioterapeuta consegue, do zero, registar-se, preencher perfil, escolher especialidades + 1 concelho e publicar.
- [ ] Um visitante anónimo consegue filtrar por especialidade + concelho e ver perfis publicados e verificados.
- [ ] Um visitante consegue enviar um pedido de contacto que chega ao email do profissional.
- [ ] Um paciente autenticado consegue guardar favoritos e rever os contactos que enviou.
- [ ] `npm run lint` e `npx tsc --noEmit` passam sem erros.
- [ ] Todas as tabelas com dados pessoais têm RLS ativo.
