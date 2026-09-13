CREATE OR REPLACE FUNCTION public.get_project_group_url(_role_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.whatsapp_group_url
  FROM public.talent_roles r
  WHERE r.id = _role_id
    AND (
      public.is_staff(auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.role_matches m
        JOIN public.talent_profiles p ON p.id = m.talent_profile_id
        WHERE m.role_id = r.id
          AND p.user_id = auth.uid()
          AND m.status IN ('approved','accepted','assessment','interview','hired')
      )
    )
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_project_group_url(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_project_group_url(uuid) TO authenticated, service_role;