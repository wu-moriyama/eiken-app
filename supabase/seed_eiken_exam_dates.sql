-- seed_eiken_exam_dates.sql
-- 英検試験日の初期データ（日本英語検定協会公式サイトより）
-- https://www.eiken.or.jp/eiken/schedule/2025-examinee.html
-- https://www.eiken.or.jp/eiken/schedule/2026-group.html

insert into public.eiken_exam_dates (exam_year, round, primary_date, secondary_date)
values
  -- 2025年度（個人申込・本会場）
  (2025, 1, '2025-06-01', '2025-07-06'),   -- 第1回 一次6/1(日) 二次A 7/6(日)
  (2025, 2, '2025-10-05', '2025-11-09'),   -- 第2回 一次10/5(日) 二次A 11/9(日)
  (2025, 3, '2026-01-25', '2026-03-01'),   -- 第3回 一次1/25(日) 二次A 3/1(日)
  -- 2026年度（本会場）
  (2026, 1, '2026-05-31', '2026-07-05'),   -- 第1回 一次5/31(日) 二次A 7/5(日)
  (2026, 2, '2026-10-04', '2026-11-08'),   -- 第2回 一次10/4(日) 二次A 11/8(日)
  (2026, 3, '2027-01-24', '2027-02-28')    -- 第3回 一次1/24(日) 二次A 2/28(日)
on conflict (exam_year, round) do update set
  primary_date = excluded.primary_date,
  secondary_date = excluded.secondary_date,
  updated_at = now();
