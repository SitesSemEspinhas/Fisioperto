-- ============================================================
-- FisioPerto — SEED DE DEMONSTRAÇÃO (dados fictícios)
-- Aplicar DEPOIS de schema.sql e seed.sql.
-- ------------------------------------------------------------
-- 14 fisioterapeutas FICTÍCIOS, já verificados e publicados,
-- distribuídos pelas 8 especialidades e por vários concelhos
-- (foco: Olhão, Faro, Loulé, Lisboa, Porto).
--
-- ⚠️  DADOS DE DEMONSTRAÇÃO — remover antes de produção:
--     delete from auth.users where email like '%@demo.fisioperto.pt';
--     (o ON DELETE CASCADE remove perfis, especialidades, concelhos e contactos associados)
--
-- Nomes, nº de cédula (FT-XXXXX), telefones e emails são inventados.
-- Avatares: UI-Avatars (iniciais) — não são fotos de pessoas reais.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Utilizadores de autenticação (necessários pela FK user_id)
--    O trigger handle_new_user cria automaticamente a linha em profiles.
-- ------------------------------------------------------------
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, email_change, email_change_token_new, recovery_token)
values
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000001','authenticated','authenticated','ana.marques@demo.fisioperto.pt',    crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Ana Sofia Marques"}',    now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000002','authenticated','authenticated','tiago.fernandes@demo.fisioperto.pt', crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Tiago Fernandes"}',      now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000003','authenticated','authenticated','mariana.lopes@demo.fisioperto.pt',   crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Mariana Costa Lopes"}',  now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000004','authenticated','authenticated','joao.almeida@demo.fisioperto.pt',    crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"João Pedro Almeida"}',   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000005','authenticated','authenticated','beatriz.nunes@demo.fisioperto.pt',   crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Beatriz Nunes"}',        now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000006','authenticated','authenticated','rui.dias@demo.fisioperto.pt',        crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Rui Carvalho Dias"}',    now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000007','authenticated','authenticated','catarina.sousa@demo.fisioperto.pt',  crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Catarina Sousa"}',       now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000008','authenticated','authenticated','pedro.henriques@demo.fisioperto.pt', crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Pedro Henriques"}',      now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000009','authenticated','authenticated','ines.tavares@demo.fisioperto.pt',    crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Inês Ribeiro Tavares"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000010','authenticated','authenticated','miguel.santos@demo.fisioperto.pt',   crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Miguel Ângelo Santos"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000011','authenticated','authenticated','sofia.maia@demo.fisioperto.pt',      crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Sofia Maia"}',           now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000012','authenticated','authenticated','andre.figueiredo@demo.fisioperto.pt',crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"André Figueiredo"}',    now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000013','authenticated','authenticated','helena.rocha@demo.fisioperto.pt',    crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Helena Pinto Rocha"}',   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000014','authenticated','authenticated','carlos.moreira@demo.fisioperto.pt',  crypt('FisioDemo!2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}','{"role":"physiotherapist","full_name":"Carlos Moreira"}',       now(), now(), '', '', '', '')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2) Perfis profissionais (todos verified + published + beta)
-- ------------------------------------------------------------
insert into public.physiotherapists
  (id, user_id, display_name, ofp_number, verification, verified_at, bio, years_experience,
   photo_url, contact_phone, contact_whatsapp, contact_email, plan, is_published, slug, created_at, updated_at)
values
  ('f0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','Ana Sofia Marques','FT-10234','verified', now(),
   'Fisioterapeuta dedicada à reabilitação neurológica e ao apoio a pessoas idosas. Acompanho a recuperação pós-AVC e doenças como Parkinson, no conforto do domicílio, com planos adaptados a cada pessoa.', 12,
   'https://ui-avatars.com/api/?name=Ana+Sofia+Marques&background=0e7490&color=fff&size=256&format=png','+351 912 000 001','+351 912 000 001','ana.marques@demo.fisioperto.pt','beta', true, 'ana-sofia-marques', now(), now()),
  ('f0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000002','Tiago Fernandes','FT-11876','verified', now(),
   'Especializado em lesões musculoesqueléticas e reabilitação desportiva. Ajudo a recuperar de fraturas, entorses e cirurgias, e a regressar em segurança à atividade física.', 8,
   'https://ui-avatars.com/api/?name=Tiago+Fernandes&background=0f766e&color=fff&size=256&format=png','+351 912 000 002','+351 912 000 002','tiago.fernandes@demo.fisioperto.pt','beta', true, 'tiago-fernandes', now(), now()),
  ('f0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0000-000000000003','Mariana Costa Lopes','FT-09562','verified', now(),
   '15 anos a cuidar de doentes idosos e respiratórios. Trabalho a mobilidade, o equilíbrio e a função respiratória em casa, com objetivos realistas e muito acompanhamento à família.', 15,
   'https://ui-avatars.com/api/?name=Mariana+Lopes&background=155e75&color=fff&size=256&format=png','+351 912 000 003','+351 912 000 003','mariana.lopes@demo.fisioperto.pt','beta', true, 'mariana-costa-lopes', now(), now()),
  ('f0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0000-000000000004','João Pedro Almeida','FT-13401','verified', now(),
   'Foco na recuperação funcional após cirurgia ortopédica. Desenho programas progressivos para readquirir força e mobilidade sem sair de casa, em articulação com a equipa médica.', 6,
   'https://ui-avatars.com/api/?name=Joao+Almeida&background=0369a1&color=fff&size=256&format=png','+351 912 000 004','+351 912 000 004','joao.almeida@demo.fisioperto.pt','beta', true, 'joao-pedro-almeida', now(), now()),
  ('f0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0000-000000000005','Beatriz Nunes','FT-14820','verified', now(),
   'Fisioterapia pediátrica e do neurodesenvolvimento. Acompanho crianças com atrasos motores num ambiente familiar e tranquilo, envolvendo sempre os cuidadores.', 10,
   'https://ui-avatars.com/api/?name=Beatriz+Nunes&background=047857&color=fff&size=256&format=png','+351 912 000 005','+351 912 000 005','beatriz.nunes@demo.fisioperto.pt','beta', true, 'beatriz-nunes', now(), now()),
  ('f0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0000-000000000006','Rui Carvalho Dias','FT-07219','verified', now(),
   '20 anos de experiência em fisioterapia respiratória. Apoio doentes com DPOC, pós-COVID e outras limitações respiratórias, com reabilitação estruturada ao domicílio.', 20,
   'https://ui-avatars.com/api/?name=Rui+Dias&background=1e6091&color=fff&size=256&format=png','+351 912 000 006','+351 912 000 006','rui.dias@demo.fisioperto.pt','beta', true, 'rui-carvalho-dias', now(), now()),
  ('f0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0000-000000000007','Catarina Sousa','FT-12055','verified', now(),
   'Reabilitação oncológica e geriátrica. Ajudo a recuperar energia, mobilidade e qualidade de vida durante e após tratamentos de cancro, com uma abordagem próxima e humana.', 14,
   'https://ui-avatars.com/api/?name=Catarina+Sousa&background=0e7490&color=fff&size=256&format=png','+351 912 000 007','+351 912 000 007','catarina.sousa@demo.fisioperto.pt','beta', true, 'catarina-sousa', now(), now()),
  ('f0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0000-000000000008','Pedro Henriques','FT-15693','verified', now(),
   'Fisioterapeuta desportivo. Trato lesões de treino e competição e preparo o regresso à atividade com segurança, em casa ou no local de treino.', 9,
   'https://ui-avatars.com/api/?name=Pedro+Henriques&background=0f766e&color=fff&size=256&format=png','+351 912 000 008','+351 912 000 008','pedro.henriques@demo.fisioperto.pt','beta', true, 'pedro-henriques', now(), now()),
  ('f0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0000-000000000009','Inês Ribeiro Tavares','FT-10788','verified', now(),
   'Especialista em reabilitação neurológica e pós-cirúrgica. Acompanho de perto cada fase da recuperação, com objetivos claros e reavaliações regulares.', 11,
   'https://ui-avatars.com/api/?name=Ines+Tavares&background=155e75&color=fff&size=256&format=png','+351 912 000 009','+351 912 000 009','ines.tavares@demo.fisioperto.pt','beta', true, 'ines-ribeiro-tavares', now(), now()),
  ('f0000000-0000-0000-0000-000000000010','d0000000-0000-0000-0000-000000000010','Miguel Ângelo Santos','FT-16340','verified', now(),
   'Ajudo a resolver dores de coluna, articulares e lesões desportivas com terapia manual e exercício terapêutico, tudo no domicílio do utente.', 7,
   'https://ui-avatars.com/api/?name=Miguel+Santos&background=0369a1&color=fff&size=256&format=png','+351 912 000 010','+351 912 000 010','miguel.santos@demo.fisioperto.pt','beta', true, 'miguel-angelo-santos', now(), now()),
  ('f0000000-0000-0000-0000-000000000011','d0000000-0000-0000-0000-000000000011','Sofia Maia','FT-08471','verified', now(),
   'Dedicada ao cuidado de pessoas idosas e à reabilitação neurológica. Trabalho a autonomia e a prevenção de quedas junto de cada família, com muita paciência.', 18,
   'https://ui-avatars.com/api/?name=Sofia+Maia&background=047857&color=fff&size=256&format=png','+351 912 000 011','+351 912 000 011','sofia.maia@demo.fisioperto.pt','beta', true, 'sofia-maia', now(), now()),
  ('f0000000-0000-0000-0000-000000000012','d0000000-0000-0000-0000-000000000012','André Figueiredo','FT-17205','verified', now(),
   'Fisioterapia respiratória e recuperação pós-operatória. Planos simples e eficazes para respirar e mover-se melhor em casa, passo a passo.', 5,
   'https://ui-avatars.com/api/?name=Andre+Figueiredo&background=1e6091&color=fff&size=256&format=png','+351 912 000 012','+351 912 000 012','andre.figueiredo@demo.fisioperto.pt','beta', true, 'andre-figueiredo', now(), now()),
  ('f0000000-0000-0000-0000-000000000013','d0000000-0000-0000-0000-000000000013','Helena Pinto Rocha','FT-11347','verified', now(),
   'Do bebé ao idoso: acompanho o desenvolvimento motor infantil e a manutenção da mobilidade na terceira idade, sempre ao domicílio.', 13,
   'https://ui-avatars.com/api/?name=Helena+Rocha&background=0e7490&color=fff&size=256&format=png','+351 912 000 013','+351 912 000 013','helena.rocha@demo.fisioperto.pt','beta', true, 'helena-pinto-rocha', now(), now()),
  ('f0000000-0000-0000-0000-000000000014','d0000000-0000-0000-0000-000000000014','Carlos Moreira','FT-06018','verified', now(),
   '22 anos de prática clínica. Foco em reabilitação oncológica e respiratória, com uma abordagem humana e centrada no bem-estar do doente.', 22,
   'https://ui-avatars.com/api/?name=Carlos+Moreira&background=0f766e&color=fff&size=256&format=png','+351 912 000 014','+351 912 000 014','carlos.moreira@demo.fisioperto.pt','beta', true, 'carlos-moreira', now(), now())
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3) Especialidades por fisioterapeuta (M:N)
-- ------------------------------------------------------------
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000001', id from public.specialties where slug in ('neurologica','geriatrica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000002', id from public.specialties where slug in ('ortopedica','desportiva') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000003', id from public.specialties where slug in ('geriatrica','respiratoria') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000004', id from public.specialties where slug in ('pos-cirurgica','ortopedica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000005', id from public.specialties where slug in ('pediatrica','neurologica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000006', id from public.specialties where slug in ('respiratoria','geriatrica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000007', id from public.specialties where slug in ('oncologica','geriatrica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000008', id from public.specialties where slug in ('desportiva','ortopedica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000009', id from public.specialties where slug in ('neurologica','pos-cirurgica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000010', id from public.specialties where slug in ('ortopedica','desportiva') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000011', id from public.specialties where slug in ('geriatrica','neurologica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000012', id from public.specialties where slug in ('respiratoria','pos-cirurgica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000013', id from public.specialties where slug in ('pediatrica','geriatrica') on conflict do nothing;
insert into public.physiotherapist_specialties (physiotherapist_id, specialty_id)
select 'f0000000-0000-0000-0000-000000000014', id from public.specialties where slug in ('oncologica','respiratoria') on conflict do nothing;

-- ------------------------------------------------------------
-- 4) Concelhos de atuação por fisioterapeuta (M:N)
-- ------------------------------------------------------------
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000001', id from public.concelhos where slug in ('loule','faro','olhao') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000002', id from public.concelhos where slug in ('faro','olhao') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000003', id from public.concelhos where slug in ('olhao','tavira') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000004', id from public.concelhos where slug in ('lisboa','oeiras') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000005', id from public.concelhos where slug in ('lisboa','sintra') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000006', id from public.concelhos where slug in ('porto','matosinhos') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000007', id from public.concelhos where slug in ('porto','vila-nova-de-gaia') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000008', id from public.concelhos where slug in ('loule','albufeira') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000009', id from public.concelhos where slug in ('faro','loule') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000010', id from public.concelhos where slug in ('lisboa','cascais') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000011', id from public.concelhos where slug in ('olhao','faro') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000012', id from public.concelhos where slug in ('coimbra') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000013', id from public.concelhos where slug in ('braga') on conflict do nothing;
insert into public.physiotherapist_concelhos (physiotherapist_id, concelho_id)
select 'f0000000-0000-0000-0000-000000000014', id from public.concelhos where slug in ('lisboa') on conflict do nothing;

-- ------------------------------------------------------------
-- 5) Pedidos de contacto de exemplo (para a área do profissional não estar vazia)
-- ------------------------------------------------------------
insert into public.contact_requests
  (id, physiotherapist_id, patient_user_id, sender_name, sender_email, sender_phone, concelho_id, specialty_id, message, status, created_at)
values
  ('c0000000-0000-0000-0000-000000000001','f0000000-0000-0000-0000-000000000001', null, 'Maria Fernanda Lopes','maria.lopes@example.com','+351 913 111 111',
   (select id from public.concelhos where slug='loule'), (select id from public.specialties where slug='neurologica'),
   'O meu pai teve um AVC há dois meses e precisa de reabilitação em casa, em Loulé. Tem disponibilidade nas próximas semanas?', 'new', now() - interval '2 days'),
  ('c0000000-0000-0000-0000-000000000002','f0000000-0000-0000-0000-000000000006', null, 'António Sousa','antonio.sousa@example.com','+351 913 222 222',
   (select id from public.concelhos where slug='porto'), (select id from public.specialties where slug='respiratoria'),
   'Tenho DPOC e o médico recomendou fisioterapia respiratória ao domicílio no Porto. Como funciona e qual o custo?', 'read', now() - interval '5 days'),
  ('c0000000-0000-0000-0000-000000000003','f0000000-0000-0000-0000-000000000003', null, 'Joana Martins','joana.martins@example.com','+351 913 333 333',
   (select id from public.concelhos where slug='olhao'), (select id from public.specialties where slug='geriatrica'),
   'A minha mãe tem 82 anos e perdeu mobilidade após um internamento. Procuro acompanhamento regular em Olhão.', 'replied', now() - interval '9 days'),
  ('c0000000-0000-0000-0000-000000000004','f0000000-0000-0000-0000-000000000009', null, 'Carlos Nogueira','carlos.nogueira@example.com', null,
   (select id from public.concelhos where slug='faro'), (select id from public.specialties where slug='neurologica'),
   'Recuperação após cirurgia à coluna. Gostava de saber se faz acompanhamento em Faro e com que frequência.', 'new', now() - interval '1 day'),
  ('c0000000-0000-0000-0000-000000000005','f0000000-0000-0000-0000-000000000011', null, 'Rita Camacho','rita.camacho@example.com','+351 913 555 555',
   (select id from public.concelhos where slug='olhao'), (select id from public.specialties where slug='geriatrica'),
   'A minha avó já caiu duas vezes este ano. Precisamos de um plano de prevenção de quedas e reforço de equilíbrio.', 'archived', now() - interval '14 days')
on conflict (id) do nothing;

-- ============================================================
-- FIM DO SEED DE DEMONSTRAÇÃO
-- ============================================================
