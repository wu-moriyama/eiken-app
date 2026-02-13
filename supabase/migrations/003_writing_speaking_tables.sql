-- 003_writing_speaking_tables.sql

create table if not exists public.writing_prompts (
  id bigserial primary key,
  level text not null,
  title text not null,
  prompt text not null
);

create table if not exists public.writing_submissions (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  prompt_id bigint not null references public.writing_prompts (id),
  content text not null,
  overall_score integer,
  grammar_score integer,
  vocabulary_score integer,
  organization_score integer,
  content_score integer,
  ai_feedback jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.speaking_scenarios (
  id bigserial primary key,
  level text not null,
  category text not null,
  title text not null,
  description text,
  script jsonb
);

create table if not exists public.speaking_sessions (
  id bigserial primary key,
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  scenario_id bigint not null references public.speaking_scenarios (id),
  transcript text,
  overall_score integer,
  pronunciation_score integer,
  grammar_score integer,
  fluency_score integer,
  vocabulary_score integer,
  content_score integer,
  ai_feedback jsonb,
  created_at timestamptz not null default now()
);

alter table public.writing_submissions enable row level security;
alter table public.speaking_sessions enable row level security;

