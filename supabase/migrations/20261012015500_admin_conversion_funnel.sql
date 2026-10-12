-- Conversion funnel for /admin: leads -> checkouts started -> paid, per source page.
-- A lead is matched to a student by email (lower-cased) or by the last 10 digits
-- of a phone number, and only counts as converting if the student started a paid
-- checkout after leaving the lead. Admins only, like admin_dashboard_metrics.

CREATE OR REPLACE FUNCTION public.admin_conversion_funnel(_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  since timestamptz;
  free_plans text[] := ARRAY['Bootcamp Starter', 'Free Bootcamp'];
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;

  since := now() - make_interval(days => GREATEST(1, LEAST(COALESCE(_days, 30), 3650)));

  WITH raw_leads AS (
    SELECT l.id, l.created_at, l.contact,
           NULLIF(btrim(split_part(COALESCE(l.source, ''), '#', 1)), '') AS src
    FROM public.leads l
    WHERE l.created_at >= since
  ),
  period_leads AS (
    -- Source strings come from several forms; fold them into the page the lead came from.
    SELECT r.id, r.created_at,
      CASE
        WHEN r.src IS NULL THEN 'Not recorded'
        WHEN r.src LIKE 'blog:%' THEN '/blog/' || substr(r.src, 6)
        WHEN r.src LIKE 'join-whatsapp:%' THEN COALESCE(NULLIF(substr(r.src, 15), ''), '/')
        WHEN r.src LIKE 'page:%' THEN '/' || regexp_replace(substr(r.src, 6), '-offer$', '')
        WHEN r.src LIKE 'home-%' THEN '/'
        ELSE r.src
      END AS page,
      CASE WHEN position('@' IN r.contact) > 0 THEN lower(btrim(r.contact)) END AS email_key,
      CASE WHEN position('@' IN r.contact) = 0 AND length(regexp_replace(r.contact, '\D', '', 'g')) >= 10
           THEN right(regexp_replace(r.contact, '\D', '', 'g'), 10) END AS phone_key
    FROM raw_leads r
  ),
  students AS (
    SELECT p.faculty_id,
      lower(btrim(p.email)) AS email_key,
      CASE WHEN length(regexp_replace(COALESCE(p.phone, ''), '\D', '', 'g')) >= 10
           THEN right(regexp_replace(p.phone, '\D', '', 'g'), 10) END AS phone_key
    FROM public.profiles p
    WHERE p.faculty_id IS NOT NULL
  ),
  checkouts AS (
    -- Every paid-plan enrolment begins as a checkout; active/confirmed means it was paid.
    SELECT e.faculty_id, e.created_at, e.status IN ('active', 'confirmed') AS paid
    FROM public.enrollments e
    WHERE NOT (e.plan_name = ANY (free_plans))
  ),
  lead_outcomes AS (
    SELECT pl.page,
      bool_or(c.faculty_id IS NOT NULL) AS checked_out,
      bool_or(COALESCE(c.paid, false)) AS paid
    FROM period_leads pl
    LEFT JOIN students s
      ON s.email_key = pl.email_key OR s.phone_key = pl.phone_key
    LEFT JOIN checkouts c
      ON c.faculty_id = s.faculty_id AND c.created_at >= pl.created_at
    GROUP BY pl.id, pl.page
  ),
  by_page AS (
    SELECT page, count(*) AS leads,
      count(*) FILTER (WHERE checked_out) AS checked_out,
      count(*) FILTER (WHERE paid) AS paid
    FROM lead_outcomes
    GROUP BY page
  )
  SELECT jsonb_build_object(
    'generated_at', now(),
    'period_days', EXTRACT(day FROM now() - since)::int,
    'leads', (SELECT count(*) FROM lead_outcomes),
    'checked_out', (SELECT count(*) FROM lead_outcomes WHERE checked_out),
    'paid', (SELECT count(*) FROM lead_outcomes WHERE paid),
    'by_source', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('page', page, 'leads', leads, 'checked_out', checked_out, 'paid', paid)
                       ORDER BY leads DESC, paid DESC, page)
      FROM by_page
    ), '[]'::jsonb),
    -- All checkouts in the period, lead or not, so the lead funnel can be read in context.
    'all_checkouts', jsonb_build_object(
      'started', (SELECT count(*) FROM checkouts WHERE created_at >= since),
      'paid', (SELECT count(*) FROM checkouts WHERE created_at >= since AND paid)
    )
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_conversion_funnel(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_conversion_funnel(integer) TO authenticated;
