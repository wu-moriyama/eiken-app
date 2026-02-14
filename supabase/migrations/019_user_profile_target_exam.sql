-- 019_user_profile_target_exam.sql
-- user_profiles に目標の受験日（年度・回）を追加

alter table public.user_profiles
  add column if not exists target_exam_year int,
  add column if not exists target_exam_round int check (target_exam_round is null or target_exam_round in (1, 2, 3));
