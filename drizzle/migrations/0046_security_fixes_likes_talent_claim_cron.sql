-- 1) Blog likes: counts stay public, but who liked what no longer is.
CREATE OR REPLACE FUNCTION public.blog_like_counts(_slugs text[] DEFAULT NULL)
RETURNS TABLE(post_slug text, likes bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT l.post_slug, count(*)::bigint
  FROM public.blog_post_likes l
  WHERE _slugs IS NULL OR l.post_slug = ANY(_slugs)
  GROUP BY l.post_slug
$$;

CREATE OR REPLACE FUNCTION public.blog_visitor_liked(_slug text, _visitor_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blog_post_likes l
    WHERE l.post_slug = _slug AND l.visitor_id = _visitor_id
      AND length(coalesce(_visitor_id, '')) >= 8
  )
$$;

REVOKE ALL ON FUNCTION public.blog_like_counts(text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.blog_visitor_liked(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.blog_like_counts(text[]) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.blog_visitor_liked(text, text) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can view likes" ON public.blog_post_likes;
CREATE POLICY "Users can view their own likes" ON public.blog_post_likes
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 2) Pre-seeded talent profiles are only linked when the email is proven by a
--    sign-in provider (e.g. Google), not by an email/password signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing_faculty text;
  talent_faculty text;
  loc text;
  email_proven boolean;
BEGIN
  email_proven := coalesce(NEW.raw_app_meta_data ->> 'provider', 'email') NOT IN ('email', 'phone')
    AND coalesce(NEW.email, '') <> '';

  SELECT faculty_id INTO existing_faculty FROM public.faculty_ids
  WHERE lower(email) = lower(coalesce(NEW.email, '')) ORDER BY created_at LIMIT 1;

  IF email_proven THEN
    UPDATE public.talent_profiles SET user_id = NEW.id, updated_at = now()
    WHERE user_id IS NULL AND lower(coalesce(email, '')) = lower(NEW.email);

    SELECT faculty_id INTO talent_faculty FROM public.talent_profiles
    WHERE user_id = NEW.id AND faculty_id IS NOT NULL LIMIT 1;
  END IF;

  loc := nullif(left(btrim(coalesce(NEW.raw_user_meta_data ->> 'location', '')), 160), '');

  INSERT INTO public.profiles (id, name, email, phone, faculty_id, location)
  VALUES (NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    coalesce(NEW.email, ''), NEW.raw_user_meta_data ->> 'phone',
    coalesce(existing_faculty, talent_faculty), loc)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.claim_my_talent_profile()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  my_email text;
  claimed uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;

  SELECT id INTO claimed FROM public.talent_profiles
  WHERE user_id = auth.uid() LIMIT 1;
  IF claimed IS NOT NULL THEN
    RETURN claimed;
  END IF;

  -- Only an email verified by a sign-in provider (e.g. Google) can claim a profile.
  SELECT lower(i.email) INTO my_email
  FROM auth.identities i
  JOIN auth.users u ON u.id = i.user_id
  WHERE i.user_id = auth.uid()
    AND i.provider NOT IN ('email', 'phone')
    AND coalesce(i.email, '') <> ''
    AND lower(i.email) = lower(coalesce(u.email, ''))
    AND coalesce((i.identity_data ->> 'email_verified')::boolean, false)
  LIMIT 1;
  IF my_email IS NULL OR my_email = '' THEN
    RETURN NULL;
  END IF;

  UPDATE public.talent_profiles
  SET user_id = auth.uid(), updated_at = now()
  WHERE user_id IS NULL AND lower(coalesce(email, '')) = my_email
  RETURNING id INTO claimed;

  IF claimed IS NOT NULL THEN
    UPDATE public.profiles p
    SET faculty_id = t.faculty_id, updated_at = now()
    FROM public.talent_profiles t
    WHERE t.id = claimed AND p.id = auth.uid()
      AND p.faculty_id IS NULL AND t.faculty_id IS NOT NULL;
  END IF;

  RETURN claimed;
END;
$function$;

-- 3) recover-checkouts and the admin digest now require the schedule secret.
INSERT INTO public.cron_secrets (job, secret)
VALUES
  ('recover-checkouts', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')),
  ('admin-digest', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

SELECT cron.unschedule('recover-checkouts') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'recover-checkouts');
SELECT cron.schedule(
  'recover-checkouts',
  '30 5 * * 1,4',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/recover-checkouts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'recover-checkouts')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);

SELECT cron.unschedule('admin-morning-digest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-morning-digest');
SELECT cron.schedule(
  'admin-morning-digest',
  '0 6 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/admin-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'admin-digest')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);