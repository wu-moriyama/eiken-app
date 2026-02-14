-- seed_admin_user.sql
-- 初回のみ実行: 指定メールのユーザーを管理者にする
-- 012, 013 マイグレーション実行後に実行すること
--
-- 以下のメールアドレスを管理者に昇格させます。必要に応じて変更してください。
UPDATE public.user_profiles
SET role = 'admin'
WHERE auth_user_id IN (
  SELECT id FROM auth.users WHERE email = 's_moriyama@writeup.co.jp'
);
