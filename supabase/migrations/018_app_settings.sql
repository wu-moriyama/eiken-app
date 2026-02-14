-- 018_app_settings.sql
-- 基本設定（管理者メール、英検試験日）

-- アプリ基本設定（1行のみ）
create table if not exists public.app_settings (
  id int primary key default 1 check (id = 1),
  admin_email text,
  updated_at timestamptz not null default now()
);

-- 既存レコードがなければ挿入
insert into public.app_settings (id, admin_email)
values (1, null)
on conflict (id) do nothing;

-- 英検試験日（年度・回ごとに一次・二次）
-- exam_year: 年度（2025 = 2025年度）
-- round: 回（1, 2, 3）
-- primary_date: 一次試験日（本会場）
-- secondary_date: 二次試験日（A日程）
create table if not exists public.eiken_exam_dates (
  id uuid primary key default gen_random_uuid(),
  exam_year int not null,
  round int not null check (round in (1, 2, 3)),
  primary_date date not null,
  secondary_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_year, round)
);

-- RLS: app_settings は全員閲覧可、更新は管理者のみ
alter table public.app_settings enable row level security;

create policy "app_settings 全員閲覧"
  on public.app_settings for select
  using (true);

create policy "app_settings 管理者のみ更新"
  on public.app_settings for update
  using (public.is_admin());

-- RLS: eiken_exam_dates は全員閲覧可、更新は管理者のみ
alter table public.eiken_exam_dates enable row level security;

create policy "eiken_exam_dates 全員閲覧"
  on public.eiken_exam_dates for select
  using (true);

create policy "eiken_exam_dates 管理者のみ更新削除"
  on public.eiken_exam_dates for update
  using (public.is_admin());

create policy "eiken_exam_dates 管理者のみ削除"
  on public.eiken_exam_dates for delete
  using (public.is_admin());

create policy "eiken_exam_dates 管理者のみ挿入"
  on public.eiken_exam_dates for insert
  with check (public.is_admin());
