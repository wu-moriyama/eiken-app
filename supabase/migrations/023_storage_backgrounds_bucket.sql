-- 023_storage_backgrounds_bucket.sql
-- 月別背景用ストレージバケット

insert into storage.buckets (id, name, public)
values ('backgrounds', 'backgrounds', true)
on conflict (id) do update set public = true;

-- 既存ポリシーがあれば削除（冪等性）
drop policy if exists "backgrounds 管理者のみアップロード" on storage.objects;
drop policy if exists "backgrounds 全員閲覧" on storage.objects;
drop policy if exists "backgrounds 管理者のみ更新" on storage.objects;
drop policy if exists "backgrounds 管理者のみ削除" on storage.objects;

-- 管理者のみアップロード可能
create policy "backgrounds 管理者のみアップロード"
  on storage.objects for insert
  with check (
    bucket_id = 'backgrounds' and public.is_admin()
  );

-- 全員閲覧可能（公開バケット）
create policy "backgrounds 全員閲覧"
  on storage.objects for select
  using (bucket_id = 'backgrounds');

-- 管理者のみ更新・削除
create policy "backgrounds 管理者のみ更新"
  on storage.objects for update
  using (
    bucket_id = 'backgrounds' and public.is_admin()
  );

create policy "backgrounds 管理者のみ削除"
  on storage.objects for delete
  using (
    bucket_id = 'backgrounds' and public.is_admin()
  );
