-- 011_badges.sql
-- バッヂ獲得履歴

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz not null default now(),
  popup_shown boolean not null default false,
  unique (user_id, badge_key)
);

create index if not exists idx_user_badges_user_id on public.user_badges (user_id);

alter table public.user_badges enable row level security;

create policy "自分のバッヂのみ参照可能"
  on public.user_badges
  for select
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

create policy "自分のバッヂのみ挿入可能"
  on public.user_badges
  for insert
  with check (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

create policy "自分のバッヂのみ更新可能"
  on public.user_badges
  for update
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );
