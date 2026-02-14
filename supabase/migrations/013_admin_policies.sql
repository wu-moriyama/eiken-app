-- 013_admin_policies.sql
-- 管理者用 RLS ポリシー

-- user_profiles: 管理者は全件 SELECT / UPDATE
CREATE POLICY "管理者は user_profiles を全件参照可能"
  ON public.user_profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "管理者は user_profiles を全件更新可能"
  ON public.user_profiles
  FOR UPDATE
  USING (public.is_admin());

-- 一般ユーザー用: 自身のプロフィールを挿入・更新（既存 SELECT と併存）
CREATE POLICY "自身のプロフィールを挿入可能"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "自身のプロフィールを更新可能"
  ON public.user_profiles
  FOR UPDATE
  USING (auth_user_id = auth.uid());

-- user_activity_log: 管理者は全件 SELECT
CREATE POLICY "管理者は活動ログを全件参照可能"
  ON public.user_activity_log
  FOR SELECT
  USING (public.is_admin());

-- daily_streaks: 管理者は全件 SELECT
CREATE POLICY "管理者はストリークを全件参照可能"
  ON public.daily_streaks
  FOR SELECT
  USING (public.is_admin());

-- vocabulary_quiz_results: 管理者は全件 SELECT
CREATE POLICY "管理者はクイズ結果を全件参照可能"
  ON public.vocabulary_quiz_results
  FOR SELECT
  USING (public.is_admin());

-- writing_submissions: 管理者は全件 SELECT
CREATE POLICY "管理者はライティング提出を全件参照可能"
  ON public.writing_submissions
  FOR SELECT
  USING (public.is_admin());

-- vocabulary: 全員 SELECT は既存。管理者は INSERT / UPDATE / DELETE
-- vocabulary に RLS が有効か確認。002 では RLS を付けていない
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

-- 全員が vocabulary を参照可能（既存の公開性を維持）
DROP POLICY IF EXISTS "vocabulary は全員参照可能" ON public.vocabulary;
CREATE POLICY "vocabulary は全員参照可能"
  ON public.vocabulary
  FOR SELECT
  USING (true);

CREATE POLICY "管理者は vocabulary を挿入可能"
  ON public.vocabulary
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "管理者は vocabulary を更新可能"
  ON public.vocabulary
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "管理者は vocabulary を削除可能"
  ON public.vocabulary
  FOR DELETE
  USING (public.is_admin());

-- writing_prompts: 既に全員 SELECT。管理者は INSERT / UPDATE / DELETE
CREATE POLICY "管理者は writing_prompts を挿入可能"
  ON public.writing_prompts
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "管理者は writing_prompts を更新可能"
  ON public.writing_prompts
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "管理者は writing_prompts を削除可能"
  ON public.writing_prompts
  FOR DELETE
  USING (public.is_admin());
