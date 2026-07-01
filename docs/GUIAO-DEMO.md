# 🎬 Guião de Demonstração — FisioPerto

Um percurso de ~10 minutos para mostrar o MVP a um cliente de forma convincente.

> **Credenciais e acessos:** ver `acessos.md` (na raiz de `fisioperto/`, fora do Git).

---

## 0. Preparação (antes da reunião)

1. Na pasta `fisioperto/`, arrancar a aplicação:
   ```bash
   npm run dev
   ```
   Abrir **http://localhost:3888**.
2. Confirmar que o diretório está cheio (deve mostrar 14 profissionais em `/diretorio`).
   - Se estiver vazio, correr: `node --env-file=.env scripts/db-apply.mjs`
3. *(Opcional, para demo de registo sem fricção)* No Supabase, em
   **Authentication → Sign In / Providers → Email**, desligar **"Confirm email"**.
   Assim um registo novo entra logo, sem confirmar email.

---

## 1. A porta de entrada (home) — *"o problema e a promessa"*

- Abrir **`/`**.
- Apontar: título claro (*"Fisioterapia ao domicílio, com confiança"*), o selo
  **Verificado pela OFP**, e a **barra de pesquisa** (especialidade + concelho).
- Mensagem: *"o paciente não precisa de saber o termo clínico — escolhe a área e a sua zona."*

## 2. Pesquisa → resultados — *"encontrar depressa"*

- Na barra, escolher **Neurológica** + **Loulé** → **Pesquisar**.
- Cai na landing **`/neurologica/loule`** (página otimizada para SEO).
- Apontar: título próprio, texto introdutório, e os profissionais filtrados.
- Alternativa: ir a **`/diretorio`** e brincar com os filtros (ex.: só *Geriátrica*).

## 3. O perfil — *"confiança"*

- Abrir um perfil, ex. **Ana Sofia Marques**.
- Apontar: **badge Verificado OFP**, especialidades, concelhos, bio, e o
  **formulário de contacto** à direita.
- *(Opcional)* Clicar **Guardar** → pede login (favoritos são para pacientes).

## 4. Enviar um pedido de contacto — *"a ação"*

- No perfil, preencher o formulário (nome, email, mensagem) e **Enviar**.
- Aparece confirmação. O pedido fica registado e o profissional é notificado.
  - *Nota honesta:* o envio de email real depende do Resend (ver `acessos.md`).
    Sem ele, o pedido **é gravado na mesma** e fica visível na área do profissional.

## 5. A área do profissional — *"o valor para o fisioterapeuta"*

- **Entrar** (`/entrar`) com um login de demo, ex.:
  `ana.marques@demo.fisioperto.pt` / `FisioDemo!2025`.
- Em **O meu perfil**: mostrar a edição (bio, especialidades, concelhos, foto,
  publicar/despublicar, número de cédula OFP).
- Em **Pedidos de contacto**: mostrar o pedido que acabou de ser enviado e
  **mudar o estado** (Novo → Lido → Respondido).

## 6. O paciente — *"favoritos e histórico"*

- Terminar sessão e **criar uma conta de paciente** (ou usar uma já criada).
- Guardar 1–2 fisioterapeutas como **favoritos** e mostrá-los em
  **A minha conta → Favoritos**.
- Mostrar **Os meus contactos** (histórico dos pedidos enviados).

## 7. SEO — *"o motor de aquisição"* (para um cliente mais técnico)

- Em `/neurologica/loule`, **ver código-fonte** (Ctrl+U): mostrar que o
  conteúdo vem já renderizado no servidor, com `<title>`, `meta description` e
  **JSON-LD** (`MedicalBusiness` / `CollectionPage`).
- Abrir **`/sitemap.xml`** e **`/robots.txt`**.

---

## Fluxo de confiança (o diferencial nº1)

- Um fisioterapeuta **novo** entra como `pending` e **não aparece** no diretório
  até um admin validar a cédula. Para simular a validação (SQL Editor do Supabase):
  ```sql
  update public.physiotherapists
  set verification = 'verified', verified_at = now()
  where slug = 'slug-do-fisioterapeuta';
  ```
- É este passo manual que sustenta a promessa "Verificado OFP".

## O que é real vs. simulado (honestidade)

| Real | Simulado / manual no MVP |
|---|---|
| Pesquisa, filtros, perfis, SEO, auth, favoritos, contactos, RLS | Validação OFP (manual pelo admin) |
| Gravação de pedidos e vistas de perfil | Envio de email (precisa de Resend configurado) |
| Dados de 14 fisioterapeutas | São **fictícios** (nomes/cédulas inventados, avatares de iniciais) |
