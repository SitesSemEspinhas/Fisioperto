# PRD — FisioPerto (resumo)

## Problema
Em Portugal, ~16.000 fisioterapeutas registados na OFP; estima-se que ~25% prestem serviço ao domicílio. Têm fraca presença digital estruturada. Do lado dos pacientes (sobretudo idosos e famílias em reabilitação pós-cirúrgica/neurológica), há lacunas do SNS e dificuldade em encontrar um profissional **de confiança**, com a **especialidade certa**, na **sua zona**. Os concorrentes (Doctoralia, Top Doctors) focam-se em consulta em clínica, não no domicílio.

## Solução
Diretório nacional focado **exclusivamente** em fisioterapia domiciliária, com três pilares de confiança e relevância:
1. **Verificação OFP** — selo de cédula validada (manual no MVP).
2. **Pesquisa por especialidade clínica** — 8 especialidades base + campo livre.
3. **Pesquisa por concelho** — proximidade geográfica.

## Perfis
- **Visitante** (anónimo): pesquisa, vê perfis, envia contacto.
- **Paciente** (conta): + favoritos e histórico de contactos.
- **Fisioterapeuta** (conta): cria/gere perfil, especialidades, concelhos; recebe contactos.
- **Admin**: valida OFP, gere referência, vê métricas.

## Monetização (FORA do MVP)
Beta gratuito agora. Futuro: Básico €5/mês (1 concelho) · Premium €25/mês (concelhos ilimitados, contacto direto, vídeo, destaque, analytics). Mais tarde Pro €49–59 com IA. O argumento de venda: *1 sessão cobre o custo do mês*.

## Métricas de sucesso (Beta)
- 50–100 fisioterapeutas inscritos e publicados.
- Nº de pedidos de contacto enviados via plataforma.
- Tráfego orgânico em páginas `/[especialidade]/[concelho]`.

## Princípios
- **SEO é o motor.** Páginas públicas renderizadas no servidor, com dados estruturados.
- **Acessibilidade** para público sénior.
- **Honestidade sobre IA**: funcionalidades que dependem de dados históricos só entram quando houver massa crítica.
