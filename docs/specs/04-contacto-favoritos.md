# Spec 04 — Pedidos de Contacto e Favoritos

## Histórias de utilizador
- Enquanto **visitante ou paciente**, quero enviar um pedido de contacto a um fisioterapeuta para pedir ajuda.
- Enquanto **fisioterapeuta**, quero receber esses pedidos por email e vê-los na minha área.
- Enquanto **paciente autenticado**, quero guardar fisioterapeutas como favoritos e rever os contactos que enviei.

## Detalhe
- Formulário de contacto no perfil: nome, email, telefone (opcional), mensagem, (especialidade/concelho pré-preenchidos do contexto).
- Ao submeter: gravar em `contact_requests` + enviar email ao profissional via **Resend**.
  - Anónimo: `patient_user_id = null`.
  - Autenticado: associa `patient_user_id` para aparecer no histórico do paciente.
- Proteção contra spam: rate limiting básico + honeypot. (Sem captcha pesado no MVP.)
- Favoritos: tabela `favorites`, privados (RLS).
- Área do fisioterapeuta: lista de pedidos com estado (`new/read/replied/archived`).

## Critérios de aceitação
- [ ] Submeter o formulário grava em `contact_requests` e envia email ao profissional.
- [ ] Um visitante anónimo consegue contactar sem criar conta.
- [ ] Um paciente autenticado vê o histórico dos seus contactos.
- [ ] Adicionar/remover favorito persiste e é privado ao paciente (RLS).
- [ ] O fisioterapeuta vê e atualiza o estado dos pedidos dirigidos a si.
- [ ] Falha no envio de email mostra mensagem clara e regista log (não falha em silêncio).
