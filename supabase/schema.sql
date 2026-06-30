-- ============================================================
-- FisioPerto — Schema inicial (MVP / Beta gratuito)
-- Postgres / Supabase
-- ------------------------------------------------------------
-- Aplicar no SQL Editor do Supabase ou via `supabase db push`.
-- Os planos (basico/premium) estão modelados mas INATIVOS nesta fase.
-- Todas as tabelas com dados de utilizador têm RLS ativo.
-- ============================================================

-- Extensões úteis
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin
  create type user_role as enum ('patient', 'physiotherapist', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_tier as enum ('beta', 'basico', 'premium'); -- 'beta' = atual
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contact_status as enum ('new', 'read', 'replied', 'archived');
exception when duplicate_object then null; end $$;

-- ============================================================
-- PROFILES (1:1 com auth.users) — diferencia paciente / profissional / admin
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'patient',
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- ESPECIALIDADES CLÍNICAS (dados de referência — geridos por admin)
-- ============================================================
create table if not exists public.specialties (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  description text,           -- "AVC, Parkinson, esclerose múltipla..."
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- CONCELHOS (dados de referência — municípios de Portugal)
-- ============================================================
create table if not exists public.concelhos (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  distrito    text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- FISIOTERAPEUTAS (perfil profissional)
-- ============================================================
create table if not exists public.physiotherapists (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  display_name        text not null,
  ofp_number          text,                                   -- nº de cédula profissional OFP
  verification        verification_status not null default 'pending',
  verified_at         timestamptz,
  bio                 text,                                   -- descrição (pode ser gerada por IA na Fase 1)
  years_experience    int,
  photo_url           text,
  video_url           text,                                   -- (funcionalidade Premium — guardar desde já)
  contact_phone       text,
  contact_whatsapp    text,
  contact_email       text,
  clinic_lat          double precision,                       -- localização da clínica base (Premium)
  clinic_lng          double precision,
  plan                plan_tier not null default 'beta',
  is_published        boolean not null default false,         -- só perfis publicados aparecem no diretório
  slug                text unique,                            -- para URL pública /fisioterapeuta/[slug]
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- M:N — Fisioterapeuta <-> Especialidades
-- ============================================================
create table if not exists public.physiotherapist_specialties (
  physiotherapist_id  uuid not null references public.physiotherapists(id) on delete cascade,
  specialty_id        uuid not null references public.specialties(id) on delete cascade,
  primary key (physiotherapist_id, specialty_id)
);

-- ============================================================
-- M:N — Fisioterapeuta <-> Concelhos de atuação
-- (regra de plano: Básico = 1 concelho, Premium = ilimitado — NÃO aplicada no beta)
-- ============================================================
create table if not exists public.physiotherapist_concelhos (
  physiotherapist_id  uuid not null references public.physiotherapists(id) on delete cascade,
  concelho_id         uuid not null references public.concelhos(id) on delete cascade,
  primary key (physiotherapist_id, concelho_id)
);

-- ============================================================
-- FAVORITOS (paciente guarda fisioterapeutas)
-- ============================================================
create table if not exists public.favorites (
  user_id             uuid not null references auth.users(id) on delete cascade,
  physiotherapist_id  uuid not null references public.physiotherapists(id) on delete cascade,
  created_at          timestamptz not null default now(),
  primary key (user_id, physiotherapist_id)
);

-- ============================================================
-- PEDIDOS DE CONTACTO (formulário interno)
-- ============================================================
create table if not exists public.contact_requests (
  id                  uuid primary key default uuid_generate_v4(),
  physiotherapist_id  uuid not null references public.physiotherapists(id) on delete cascade,
  patient_user_id     uuid references auth.users(id) on delete set null, -- null se enviado por anónimo
  sender_name         text not null,
  sender_email        text not null,
  sender_phone        text,
  concelho_id         uuid references public.concelhos(id) on delete set null,
  specialty_id        uuid references public.specialties(id) on delete set null,
  message             text not null,
  status              contact_status not null default 'new',
  created_at          timestamptz not null default now()
);

-- ============================================================
-- VISTAS DE PERFIL (analytics — funcionalidade Premium; recolher desde já)
-- ============================================================
create table if not exists public.profile_views (
  id                  uuid primary key default uuid_generate_v4(),
  physiotherapist_id  uuid not null references public.physiotherapists(id) on delete cascade,
  concelho_id         uuid references public.concelhos(id) on delete set null,
  viewer_hash         text,        -- hash anónimo (não guardar IP em claro)
  created_at          timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
create index if not exists idx_physio_published   on public.physiotherapists(is_published);
create index if not exists idx_physio_verification on public.physiotherapists(verification);
create index if not exists idx_pspec_specialty     on public.physiotherapist_specialties(specialty_id);
create index if not exists idx_pconc_concelho      on public.physiotherapist_concelhos(concelho_id);
create index if not exists idx_contact_physio      on public.contact_requests(physiotherapist_id);
create index if not exists idx_views_physio        on public.profile_views(physiotherapist_id);

-- ============================================================
-- TRIGGER: criar profile automaticamente quando nasce um auth.user
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'patient'),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles                    enable row level security;
alter table public.physiotherapists             enable row level security;
alter table public.physiotherapist_specialties  enable row level security;
alter table public.physiotherapist_concelhos    enable row level security;
alter table public.favorites                     enable row level security;
alter table public.contact_requests              enable row level security;
alter table public.profile_views                 enable row level security;
alter table public.specialties                   enable row level security;
alter table public.concelhos                     enable row level security;

-- Helper: é admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- profiles ----------
create policy "profiles: o próprio lê" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles: o próprio atualiza" on public.profiles
  for update using (auth.uid() = id);

-- ---------- specialties / concelhos (referência: leitura pública) ----------
create policy "specialties: leitura pública" on public.specialties
  for select using (true);
create policy "specialties: admin escreve" on public.specialties
  for all using (public.is_admin()) with check (public.is_admin());

create policy "concelhos: leitura pública" on public.concelhos
  for select using (true);
create policy "concelhos: admin escreve" on public.concelhos
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- physiotherapists ----------
-- Leitura pública APENAS de perfis publicados (o diretório é público).
create policy "physio: público vê publicados" on public.physiotherapists
  for select using (is_published = true or auth.uid() = user_id or public.is_admin());
-- O próprio cria/edita o seu perfil.
create policy "physio: o próprio insere" on public.physiotherapists
  for insert with check (auth.uid() = user_id);
create policy "physio: o próprio atualiza" on public.physiotherapists
  for update using (auth.uid() = user_id or public.is_admin());

-- ---------- tabelas M:N (geridas pelo dono do perfil) ----------
create policy "pspec: leitura pública" on public.physiotherapist_specialties
  for select using (true);
create policy "pspec: dono gere" on public.physiotherapist_specialties
  for all using (
    exists (select 1 from public.physiotherapists p
            where p.id = physiotherapist_id and p.user_id = auth.uid())
    or public.is_admin()
  );

create policy "pconc: leitura pública" on public.physiotherapist_concelhos
  for select using (true);
create policy "pconc: dono gere" on public.physiotherapist_concelhos
  for all using (
    exists (select 1 from public.physiotherapists p
            where p.id = physiotherapist_id and p.user_id = auth.uid())
    or public.is_admin()
  );

-- ---------- favorites (privados do paciente) ----------
create policy "favorites: o próprio gere" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- contact_requests ----------
-- Qualquer pessoa (anónima incluída) pode criar um pedido de contacto.
create policy "contacts: qualquer um cria" on public.contact_requests
  for insert with check (true);
-- O fisioterapeuta dono vê os pedidos dirigidos a si; o paciente vê os que enviou.
create policy "contacts: dono ou remetente lê" on public.contact_requests
  for select using (
    auth.uid() = patient_user_id
    or exists (select 1 from public.physiotherapists p
               where p.id = physiotherapist_id and p.user_id = auth.uid())
    or public.is_admin()
  );
create policy "contacts: dono atualiza estado" on public.contact_requests
  for update using (
    exists (select 1 from public.physiotherapists p
            where p.id = physiotherapist_id and p.user_id = auth.uid())
    or public.is_admin()
  );

-- ---------- profile_views (escrita pública anónima; leitura só dono/admin) ----------
create policy "views: qualquer um regista" on public.profile_views
  for insert with check (true);
create policy "views: dono ou admin lê" on public.profile_views
  for select using (
    exists (select 1 from public.physiotherapists p
            where p.id = physiotherapist_id and p.user_id = auth.uid())
    or public.is_admin()
  );

-- ============================================================
-- FIM
-- ============================================================
