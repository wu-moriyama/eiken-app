-- 009_activity_streaks_policies.sql
-- daily_streaks / user_activity_log の RLS ポリシー

-- user_activity_log: 自分の活動ログのみ
create policy "自分の活動ログを参照可能"
  on public.user_activity_log
  for select
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

create policy "自分の活動ログを挿入可能"
  on public.user_activity_log
  for insert
  with check (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

-- daily_streaks: 自分の連続学習のみ
create policy "自分のストリークを参照可能"
  on public.daily_streaks
  for select
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

create policy "自分のストリークを挿入可能"
  on public.daily_streaks
  for insert
  with check (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );

create policy "自分のストリークを更新可能"
  on public.daily_streaks
  for update
  using (
    user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  );
