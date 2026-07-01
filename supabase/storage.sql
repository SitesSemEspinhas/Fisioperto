-- ============================================================
-- FisioPerto — Storage: bucket "avatars" (fotos de perfil)
-- Aplicar depois de schema.sql. Leitura pública; escrita só pelo dono.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Leitura pública das fotos
drop policy if exists "avatars: leitura pública" on storage.objects;
create policy "avatars: leitura pública" on storage.objects
  for select using (bucket_id = 'avatars');

-- O utilizador autenticado só pode carregar/gerir ficheiros na sua própria pasta
-- (o caminho tem de começar por <user_id>/...).
drop policy if exists "avatars: dono carrega" on storage.objects;
create policy "avatars: dono carrega" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: dono atualiza" on storage.objects;
create policy "avatars: dono atualiza" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: dono apaga" on storage.objects;
create policy "avatars: dono apaga" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
