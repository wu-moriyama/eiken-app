-- 007_vocabulary_add_category.sql
-- クイズ選択肢を似たカテゴリから選ぶための category 列を追加

ALTER TABLE public.vocabulary
  ADD COLUMN IF NOT EXISTS category text;
