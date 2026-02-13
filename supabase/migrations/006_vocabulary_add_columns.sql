-- 006_vocabulary_add_columns.sql
-- 品詞・発音記号カラムを追加

alter table public.vocabulary
  add column if not exists part_of_speech text,
  add column if not exists pronunciation text;
