CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Callers may only ask about themselves; staff and the system may ask about anyone.
  SELECT CASE
    WHEN _user_id IS NOT DISTINCT FROM auth.uid()
      OR coalesce(auth.role(), '') NOT IN ('anon', 'authenticated')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','recruiter'))
    THEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','recruiter'))
    ELSE false
  END
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Callers may only ask about themselves; staff and the system may ask about anyone.
  SELECT CASE
    WHEN _user_id IS NOT DISTINCT FROM auth.uid()
      OR coalesce(auth.role(), '') NOT IN ('anon', 'authenticated')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','recruiter'))
    THEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
    ELSE false
  END
$function$;

CREATE OR REPLACE FUNCTION public.request_talent_intro(_profile_id uuid, _requester_name text, _requester_contact text, _requester_org text DEFAULT NULL::text, _message text DEFAULT NULL::text, _source text DEFAULT 'talent_pool'::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  clean_name text := btrim(coalesce(_requester_name, ''));
  clean_contact text := btrim(coalesce(_requester_contact, ''));
BEGIN
  IF length(clean_name) < 2 OR length(clean_contact) < 5 THEN
    RAISE EXCEPTION 'Please provide your name and a contact we can reply to';
  END IF;

  -- Only talent listed in the public pool can be requested.
  IF NOT EXISTS (SELECT 1 FROM public.talent_profiles WHERE id = _profile_id AND is_public = true) THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;

  -- The request goes to staff; staff decide whether to mark the talent "Client interested".
  INSERT INTO public.talent_interest_requests (
    talent_profile_id, requester_name, requester_org, requester_contact, message, source
  ) VALUES (
    _profile_id,
    left(clean_name, 120),
    nullif(left(btrim(coalesce(_requester_org, '')), 160), ''),
    left(clean_contact, 160),
    nullif(left(btrim(coalesce(_message, '')), 1000), ''),
    left(coalesce(_source, 'talent_pool'), 40)
  );
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.ensure_course_lectures(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.seed_all_course_lectures() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_course_lectures(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.seed_all_course_lectures() TO service_role;