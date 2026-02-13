-- 002_vocabulary_tables.sql
-- 単語学習関連テーブル

create table if not exists public.vocabulary (
  id bigserial primary key,
  level text not null, -- EIKEN_5 ... EIKEN_1
  word text not null,
  meaning_ja text not null,
  example_en text,
  example_ja text
);

create table if not exists public.user_vocabulary_progress (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  vocabulary_id bigint not null references public.vocabulary (id) on delete cascade,
  proficiency smallint not null default 0,
  interval integer not null default 0,
  repetitions integer not null default 0,
  ease_factor real not null default 2.5,
  next_review_at timestamptz,
  last_reviewed_at timestamptz
);

create table if not exists public.vocabulary_quiz_results (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  vocabulary_id bigint not null references public.vocabulary (id) on delete cascade,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

alter table public.user_vocabulary_progress enable row level security;
alter table public.vocabulary_quiz_results enable row level security;

