# Spec 01 — Autenticação e Perfis

## Histórias de utilizador
- Enquanto **fisioterapeuta**, quero registar-me com email e password para criar e gerir o meu perfil profissional.
- Enquanto **paciente**, quero criar conta para guardar favoritos e ver o histórico dos contactos que enviei.
- Enquanto **utilizador**, quero recuperar a password se a esquecer.

## Detalhe
- Supabase Auth, email/password. Confirmação de email ativa.
- No registo, o utilizador escolhe o tipo: **paciente** ou **fisioterapeuta**. Esse valor vai em `raw_user_meta_data.role` e o trigger `handle_new_user` cria a linha em `profiles` com o `role` correto.
- O **admin** não se regista pela UI — é promovido manualmente no Supabase (`profiles.role = 'admin'`).
- Cliente Supabase via `@supabase/ssr` (cookies). Sessão lida em Server Components.

## Critérios de aceitação
- [ ] Registo como fisioterapeuta cria `profiles.role = 'physiotherapist'`.
- [ ] Registo como paciente cria `profiles.role = 'patient'`.
- [ ] Email de confirmação é enviado e o login só funciona após confirmação.
- [ ] Recuperação de password funciona ponta a ponta.
- [ ] Rotas autenticadas redirecionam para login quando não há sessão.

## Fora de âmbito
- Login social (Google) — adiar (o Rui pode pedir depois).
