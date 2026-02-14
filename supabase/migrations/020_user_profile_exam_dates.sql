-- 020_user_profile_exam_dates.sql
-- user_profiles に一次・二次試験日を追加（会員が修正可能）

alter table public.user_profiles
  add column if not exists target_exam_primary_date date,
  add column if not exists target_exam_secondary_date date;
