-- 008_vocabulary_quiz_results_policies.sql
-- vocabulary_quiz_results の RLS ポリシー（履歴保存・参照用）

-- 自分の履歴のみ参照可能
create policy "自分のクイズ履歴を参照可能"
  on public.vocabulary_quiz_results
  for select
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

-- 自分の履歴のみ挿入可能
create policy "自分のクイズ履歴を挿入可能"
  on public.vocabulary_quiz_results
  for insert
  with check (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );
