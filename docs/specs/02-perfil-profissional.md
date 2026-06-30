# Spec 02 — Perfil Profissional

## Histórias de utilizador
- Enquanto **fisioterapeuta**, quero preencher o meu perfil (foto, bio, anos de experiência, especialidades, concelhos, contactos) para ser encontrado por pacientes.
- Enquanto **fisioterapeuta**, quero submeter o meu nº de cédula OFP para obter o selo "Verificado".
- Enquanto **fisioterapeuta**, quero publicar/despublicar o meu perfil para controlar a minha visibilidade.

## Detalhe
- Formulário de edição na área autenticada (`/conta/perfil`).
- Especialidades: seleção múltipla a partir de `specialties` (tabela de referência).
- Concelhos: seleção a partir de `concelhos`. No beta, **sem limite** (a regra Básico=1 fica desativada).
- Foto: upload para Supabase Storage (bucket `avatars`, público para leitura).
- `slug` gerado a partir do nome (único). Usado em `/fisioterapeuta/[slug]`.
- Submeter cédula OFP → `verification = 'pending'` + email de notificação ao admin (Resend).
- Admin marca `verification = 'verified'` (no Supabase, no MVP) → badge aparece.

## Critérios de aceitação
- [ ] Fisioterapeuta edita e grava todos os campos.
- [ ] Upload de foto funciona e aparece no perfil.
- [ ] Selecionar especialidades e concelhos persiste nas tabelas M:N.
- [ ] Submeter cédula define estado 'pending' e notifica o admin.
- [ ] Perfil só aparece no diretório público quando `is_published = true` E `verification = 'verified'`.
- [ ] RLS impede um fisioterapeuta de editar o perfil de outro.

## Geração assistida de bio por IA (Fase 1 — opcional)
- Botão "Gerar descrição": a partir dos campos preenchidos, sugere uma bio profissional em PT-pt. Resolve a relutância dos profissionais em escrever sobre si. (Implementar só depois do core estar estável.)
