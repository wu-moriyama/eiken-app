-- 021_seed_eiken_exam_dates.sql
-- 英検試験日の初期データ（日本英語検定協会公式サイトより）
-- マイグレーションとして実行するため RLS の影響を受けない

insert into public.eiken_exam_dates (exam_year, round, primary_date, secondary_date)
values
  (2025, 1, '2025-06-01', '2025-07-06'),
  (2025, 2, '2025-10-05', '2025-11-09'),
  (2025, 3, '2026-01-25', '2026-03-01'),
  (2026, 1, '2026-05-31', '2026-07-05'),
  (2026, 2, '2026-10-04', '2026-11-08'),
  (2026, 3, '2027-01-24', '2027-02-28')
on conflict (exam_year, round) do update set
  primary_date = excluded.primary_date,
  secondary_date = excluded.secondary_date,
  updated_at = now();
