-- ============================================================
-- FisioPerto — Seed de dados de referência
-- Especialidades clínicas (do plano de negócio) + concelhos
-- Aplicar DEPOIS de schema.sql
-- ============================================================

-- ---------- ESPECIALIDADES ----------
insert into public.specialties (name, slug, description, sort_order) values
  ('Fisioterapia Ortopédica e Traumatológica', 'ortopedica', 'Fraturas, próteses, lesões musculares, dores articulares', 1),
  ('Fisioterapia Neurológica',                 'neurologica', 'AVC, Parkinson, esclerose múltipla, paralisia cerebral', 2),
  ('Fisioterapia Geriátrica',                  'geriatrica', 'Quedas, mobilidade reduzida, demência, pós-hospitalização', 3),
  ('Fisioterapia Respiratória',                'respiratoria', 'DPOC, asma, pós-COVID, fibrose cística', 4),
  ('Fisioterapia Pós-cirúrgica',               'pos-cirurgica', 'Recuperação após intervenção cirúrgica', 5),
  ('Fisioterapia Pediátrica',                  'pediatrica', 'Crianças e adolescentes, atrasos de desenvolvimento', 6),
  ('Fisioterapia Oncológica',                  'oncologica', 'Reabilitação durante e após tratamentos de cancro', 7),
  ('Fisioterapia Desportiva',                  'desportiva', 'Lesões desportivas, retorno ao treino', 8)
on conflict (slug) do nothing;

-- ---------- CONCELHOS (amostra: Algarve + principais cidades) ----------
-- Lista completa dos 308 concelhos pode ser importada depois.
insert into public.concelhos (name, distrito, slug) values
  ('Olhão',            'Faro',    'olhao'),
  ('Faro',             'Faro',    'faro'),
  ('Loulé',            'Faro',    'loule'),
  ('Tavira',           'Faro',    'tavira'),
  ('Portimão',         'Faro',    'portimao'),
  ('Lagos',            'Faro',    'lagos'),
  ('Albufeira',        'Faro',    'albufeira'),
  ('Silves',           'Faro',    'silves'),
  ('Lisboa',           'Lisboa',  'lisboa'),
  ('Sintra',           'Lisboa',  'sintra'),
  ('Cascais',          'Lisboa',  'cascais'),
  ('Oeiras',           'Lisboa',  'oeiras'),
  ('Porto',            'Porto',   'porto'),
  ('Vila Nova de Gaia','Porto',   'vila-nova-de-gaia'),
  ('Matosinhos',       'Porto',   'matosinhos'),
  ('Braga',            'Braga',   'braga'),
  ('Coimbra',          'Coimbra', 'coimbra'),
  ('Aveiro',           'Aveiro',  'aveiro'),
  ('Setúbal',          'Setúbal', 'setubal'),
  ('Funchal',          'Madeira', 'funchal')
on conflict (slug) do nothing;
