REVOKE EXECUTE ON FUNCTION public.get_project_workspace(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_project_workspace(uuid) TO authenticated, service_role;