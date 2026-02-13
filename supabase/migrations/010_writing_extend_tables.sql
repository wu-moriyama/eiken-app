-- 010_writing_extend_tables.sql
-- ライティング機能のテーブル拡張（設計書 WRITING_DESIGN.md に基づく）

-- writing_prompts にカラム追加
ALTER TABLE public.writing_prompts
  ADD COLUMN IF NOT EXISTS prompt_type text NOT NULL DEFAULT 'essay';

ALTER TABLE public.writing_prompts
  ADD COLUMN IF NOT EXISTS word_count_min integer,
  ADD COLUMN IF NOT EXISTS word_count_max integer,
  ADD COLUMN IF NOT EXISTS time_limit_min_seconds integer,
  ADD COLUMN IF NOT EXISTS time_limit_max_seconds integer;

-- writing_submissions にカラム追加
ALTER TABLE public.writing_submissions
  ADD COLUMN IF NOT EXISTS time_seconds integer,
  ADD COLUMN IF NOT EXISTS time_score integer;

-- writing_prompts の RLS ポリシー（問題は全員が参照可能）
ALTER TABLE public.writing_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "writing_prompts は全員参照可能" ON public.writing_prompts;
CREATE POLICY "writing_prompts は全員参照可能"
  ON public.writing_prompts
  FOR SELECT
  USING (true);

-- writing_submissions の RLS ポリシー（自分の提出のみ）
DROP POLICY IF EXISTS "自分のライティング提出を参照可能" ON public.writing_submissions;
CREATE POLICY "自分のライティング提出を参照可能"
  ON public.writing_submissions
  FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.user_profiles WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "自分のライティング提出を挿入可能" ON public.writing_submissions;
CREATE POLICY "自分のライティング提出を挿入可能"
  ON public.writing_submissions
  FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM public.user_profiles WHERE auth_user_id = auth.uid())
  );
