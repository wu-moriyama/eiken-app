-- 012_admin_role.sql
-- 管理者機能: role カラム、is_admin 関数

-- user_profiles に role を追加
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- 管理者判定関数（SECURITY DEFINER で auth.users 等を参照可能に）
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 管理者用: ユーザー一覧（メール含む）を取得
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  id uuid,
  auth_user_id uuid,
  email text,
  display_name text,
  target_level text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
  SELECT
    p.id,
    p.auth_user_id,
    u.email::text,
    p.display_name,
    p.target_level,
    COALESCE(p.role, 'user'),
    p.created_at
  FROM public.user_profiles p
  JOIN auth.users u ON u.id = p.auth_user_id
  ORDER BY p.created_at DESC;
END;
$$;
