# Spec 03 — Diretório e Pesquisa (público / SEO)

## Histórias de utilizador
- Enquanto **visitante**, quero pesquisar fisioterapeutas por especialidade e concelho para encontrar ajuda perto de mim.
- Enquanto **visitante**, quero ver um perfil completo e fiável antes de contactar.
- Enquanto **motor de busca (Google)**, quero páginas indexáveis por "fisioterapia [especialidade] ao domicílio em [concelho]".

## Detalhe (SEO é o motor)
- **Páginas a gerar:**
  - `/` — home com pesquisa.
  - `/diretorio` — listagem com filtros (especialidade, concelho).
  - `/[especialidade]/[concelho]` — landing SEO (ex.: `/neurologica/loule`). SSG/SSR + `generateMetadata` + JSON-LD.
  - `/fisioterapeuta/[slug]` — perfil público.
- Só listar perfis com `is_published = true` e `verification = 'verified'`.
- Registar uma `profile_views` a cada visita ao perfil (hash anónimo do visitante; nunca IP em claro).
- Dados estruturados JSON-LD (`MedicalBusiness` / `Person`) no perfil.
- Conteúdo educativo por especialidade (texto + interligações) para tráfego orgânico.

## Critérios de aceitação
- [ ] Filtrar por especialidade + concelho devolve os perfis corretos.
- [ ] As páginas `/[especialidade]/[concelho]` renderizam no servidor com `<title>`, meta description e JSON-LD.
- [ ] URLs limpas e estáveis; sitemap.xml gerado.
- [ ] Perfis não publicados/não verificados nunca aparecem nos resultados públicos.
- [ ] Cada visita a um perfil regista uma linha em `profile_views`.

## Fase 2 (NÃO implementar agora)
- Pesquisa por linguagem natural: o paciente descreve ("o meu pai teve um derrame e não mexe o braço") e a IA mapeia para especialidade (neurológica) + área (geriátrica) antes de filtrar.
