-- 001_initial_schema.sql
-- ユーザー管理（profiles / streaks / activity log）

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  display_name text,
  target_level text, -- e.g. 'EIKEN_2'
  created_at timestamptz not null default now()
);

create table if not exists public.daily_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.user_activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  activity_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.user_profiles enable row level security;
alter table public.daily_streaks enable row level security;
alter table public.user_activity_log enable row level security;

create policy "ユーザー自身のみ参照可能"
  on public.user_profiles
  for select using (auth.uid() = auth_user_id);

