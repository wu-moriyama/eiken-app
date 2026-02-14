-- 024_avatar_presets.sql
-- 管理者が登録するアバター（ユーザーがプロフィールで選択可能）

-- avatars/presets/ への管理者アップロード用ポリシー（avatars バケットは既存）
drop policy if exists "avatars presets 管理者アップロード" on storage.objects;
create policy "avatars presets 管理者アップロード"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and (name like 'presets/%') and public.is_admin()
  );

drop policy if exists "avatars presets 管理者削除" on storage.objects;
create policy "avatars presets 管理者削除"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and (name like 'presets/%') and public.is_admin()
  );

create table if not exists public.avatar_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 全員閲覧可
alter table public.avatar_presets enable row level security;

create policy "avatar_presets 全員閲覧"
  on public.avatar_presets for select
  using (true);

-- 管理者のみ挿入・更新・削除
create policy "avatar_presets 管理者のみ挿入"
  on public.avatar_presets for insert
  with check (public.is_admin());

create policy "avatar_presets 管理者のみ更新"
  on public.avatar_presets for update
  using (public.is_admin());

create policy "avatar_presets 管理者のみ削除"
  on public.avatar_presets for delete
  using (public.is_admin());
