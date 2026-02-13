-- 004_listening_reading_tables.sql

create table if not exists public.reading_passages (
  id bigserial primary key,
  level text not null,
  title text not null,
  content text not null
);

create table if not exists public.reading_questions (
  id bigserial primary key,
  passage_id bigint not null references public.reading_passages (id) on delete cascade,
  question text not null,
  choices text[] not null,
  correct_index integer not null
);

create table if not exists public.reading_attempts (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  question_id bigint not null references public.reading_questions (id) on delete cascade,
  selected_index integer not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.listening_exercises (
  id bigserial primary key,
  level text not null,
  title text not null,
  audio_path text not null,
  transcript text
);

create table if not exists public.listening_questions (
  id bigserial primary key,
  exercise_id bigint not null references public.listening_exercises (id) on delete cascade,
  question text not null,
  choices text[] not null,
  correct_index integer not null
);

create table if not exists public.listening_attempts (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  question_id bigint not null references public.listening_questions (id) on delete cascade,
  selected_index integer not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

alter table public.reading_attempts enable row level security;
alter table public.listening_attempts enable row level security;

