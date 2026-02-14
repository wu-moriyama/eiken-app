-- 015_user_display_id.sql
-- ユーザーに連番の表示用IDを追加（1, 2, 3...）

-- 1. カラム追加（一旦 NULL 許容）
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS display_id BIGINT;

-- 2. 既存データに created_at 順で連番を付与
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM public.user_profiles
  WHERE display_id IS NULL
)
UPDATE public.user_profiles p
SET display_id = n.rn
FROM numbered n
WHERE p.id = n.id;

-- 3. シーケンス作成（既存の最大値+1から開始）
CREATE SEQUENCE IF NOT EXISTS public.user_profiles_display_id_seq;
SELECT setval(
  'public.user_profiles_display_id_seq',
  COALESCE((SELECT max(display_id) FROM public.user_profiles), 0)
);

-- 4. デフォルト設定（新規INSERT時は自動採番）
ALTER TABLE public.user_profiles
  ALTER COLUMN display_id SET DEFAULT nextval('public.user_profiles_display_id_seq');

-- 5. NULL 禁止
ALTER TABLE public.user_profiles
  ALTER COLUMN display_id SET NOT NULL;
