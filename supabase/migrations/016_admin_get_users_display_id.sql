-- 016_admin_get_users_display_id.sql
-- admin_get_users に display_id を追加

DROP FUNCTION IF EXISTS public.admin_get_users();
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  id uuid,
  display_id bigint,
  auth_user_id uuid,
  email text,
  display_name text,
  target_level text,
  role text,
  avatar_url text,
  avatar_style text,
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
    p.display_id,
    p.auth_user_id,
    u.email::text,
    p.display_name,
    p.target_level,
    COALESCE(p.role, 'user'),
    p.avatar_url,
    p.avatar_style,
    p.created_at
  FROM public.user_profiles p
  JOIN auth.users u ON u.id = p.auth_user_id
  ORDER BY p.display_id ASC;
END;
$$;
