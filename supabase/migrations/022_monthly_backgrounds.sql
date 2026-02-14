-- 022_monthly_backgrounds.sql
-- 月別ダッシュボード背景設定（1〜12月）

create table if not exists public.monthly_backgrounds (
  month int primary key check (month >= 1 and month <= 12),
  image_url text,
  updated_at timestamptz not null default now()
);

-- 初期データ（空）
insert into public.monthly_backgrounds (month, image_url)
select m, null
from generate_series(1, 12) as m
on conflict (month) do nothing;

alter table public.monthly_backgrounds enable row level security;

-- 全員閲覧可
create policy "monthly_backgrounds 全員閲覧"
  on public.monthly_backgrounds for select
  using (true);

-- 管理者のみ更新
create policy "monthly_backgrounds 管理者のみ更新"
  on public.monthly_backgrounds for update
  using (public.is_admin());

-- 管理者のみ挿入（初期データ用）
create policy "monthly_backgrounds 管理者のみ挿入"
  on public.monthly_backgrounds for insert
  with check (public.is_admin());
