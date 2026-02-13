-- 005_profile_avatar.sql
-- user_profiles にアバター関連カラムを追加

alter table public.user_profiles
  add column if not exists avatar_url text,
  add column if not exists avatar_style text;

