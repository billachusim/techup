-- Numbers for the admin dashboard, computed in the database so the browser
-- never reads other people's rows. Only admins may call it: the check below
-- runs inside the function, and signed-out visitors can't execute it at all.

CREATE OR REPLACE FUNCTION public.admin_dashboard_metrics(_days integer DEFAULT 30)
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

  WITH paid AS (
    -- A paid plan whose payment was confirmed (online or marked by an admin).
    SELECT e.*, COALESCE(NULLIF(upper(e.currency), ''), 'NGN') AS cur
    FROM public.enrollments e
    WHERE e.status IN ('active', 'confirmed')
      AND NOT (e.plan_name = ANY (free_plans))
  ),
  paid_at_or_created AS (
    SELECT p.*, COALESCE(p.paid_at, p.enrollment_date, p.created_at) AS paid_on FROM paid p
  )
  SELECT jsonb_build_object(
    'generated_at', now(),
    'period_days', EXTRACT(day FROM now() - since)::int,

    'students', jsonb_build_object(
      'total', (SELECT count(*) FROM public.profiles WHERE faculty_id IS NOT NULL),
      'new_in_period', (SELECT count(*) FROM public.profiles WHERE faculty_id IS NOT NULL AND created_at >= since),
      'with_access', (
        SELECT count(DISTINCT e.faculty_id) FROM public.enrollments e
        WHERE e.status <> 'cancelled'
          AND (e.plan_name = ANY (free_plans) OR e.status IN ('active', 'confirmed'))
      ),
      'paying', (SELECT count(DISTINCT faculty_id) FROM paid),
      'by_learning_mode', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('label', label, 'count', n) ORDER BY n DESC)
        FROM (SELECT COALESCE(NULLIF(learning_mode, ''), 'Not set') AS label, count(*) AS n
              FROM public.profiles WHERE faculty_id IS NOT NULL GROUP BY 1) s
      ), '[]'::jsonb),
      'by_department', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('label', label, 'count', n) ORDER BY n DESC)
        FROM (SELECT COALESCE(NULLIF(department, ''), 'Not set') AS label, count(*) AS n
              FROM public.profiles WHERE faculty_id IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 8) s
      ), '[]'::jsonb),
      'signups_by_month', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('month', to_char(m, 'YYYY-MM'), 'count', COALESCE(n, 0)) ORDER BY m)
        FROM generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') m
        LEFT JOIN (SELECT date_trunc('month', created_at) AS mo, count(*) AS n
                   FROM public.profiles WHERE faculty_id IS NOT NULL GROUP BY 1) s ON s.mo = m
      ), '[]'::jsonb)
    ),

    'payments', jsonb_build_object(
      'confirmed', (SELECT count(*) FROM paid),
      'confirmed_in_period', (SELECT count(*) FROM paid_at_or_created WHERE paid_on >= since),
      'online', (SELECT count(*) FROM paid WHERE tx_ref IS NOT NULL AND COALESCE(payment_reference, '') NOT LIKE 'manual:%'),
      'manual', (SELECT count(*) FROM paid WHERE payment_reference LIKE 'manual:%'),
      'without_amount', (SELECT count(*) FROM paid WHERE amount_due IS NULL),
      'pending', (SELECT count(*) FROM public.enrollments WHERE status = 'pending' AND NOT (plan_name = ANY (free_plans))),
      'cancelled', (SELECT count(*) FROM public.enrollments WHERE status = 'cancelled'),
      'pending_value', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('currency', cur, 'amount', amt) ORDER BY amt DESC)
        FROM (SELECT COALESCE(NULLIF(upper(currency), ''), 'NGN') AS cur, sum(amount_due) AS amt
              FROM public.enrollments
              WHERE status = 'pending' AND amount_due IS NOT NULL GROUP BY 1) s
      ), '[]'::jsonb)
    ),

    'revenue', jsonb_build_object(
      'total', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('currency', cur, 'amount', amt) ORDER BY amt DESC)
        FROM (SELECT cur, sum(amount_due) AS amt FROM paid WHERE amount_due IS NOT NULL GROUP BY 1) s
      ), '[]'::jsonb),
      'in_period', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('currency', cur, 'amount', amt) ORDER BY amt DESC)
        FROM (SELECT cur, sum(amount_due) AS amt FROM paid_at_or_created
              WHERE amount_due IS NOT NULL AND paid_on >= since GROUP BY 1) s
      ), '[]'::jsonb),
      'by_month', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('month', to_char(mo, 'YYYY-MM'), 'currency', cur, 'amount', amt) ORDER BY mo, cur)
        FROM (SELECT date_trunc('month', paid_on) AS mo, cur, sum(amount_due) AS amt
              FROM paid_at_or_created
              WHERE amount_due IS NOT NULL AND paid_on >= date_trunc('month', now()) - interval '11 months'
              GROUP BY 1, 2) s
      ), '[]'::jsonb),
      'top_plans', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('plan', plan_name, 'count', n, 'amount', amt) ORDER BY n DESC)
        FROM (SELECT plan_name, count(*) AS n, sum(amount_due) AS amt FROM paid
              GROUP BY 1 ORDER BY 2 DESC LIMIT 6) s
      ), '[]'::jsonb)
    ),

    'learning', jsonb_build_object(
      'awaiting_review', (SELECT count(*) FROM public.student_deliverables WHERE status = 'submitted'),
      'needs_changes', (SELECT count(*) FROM public.student_deliverables WHERE status = 'needs_changes'),
      'accepted', (SELECT count(*) FROM public.student_deliverables WHERE status = 'reviewed'),
      'submitted_in_period', (SELECT count(*) FROM public.student_deliverables WHERE created_at >= since),
      'average_score', (SELECT round(avg(score))::int FROM public.student_deliverables WHERE score IS NOT NULL),
      'certificates', (SELECT count(*) FROM public.certificates),
      'certificates_in_period', (SELECT count(*) FROM public.certificates WHERE COALESCE(issued_at, created_at) >= since)
    ),

    'talent', jsonb_build_object(
      'profiles', (SELECT count(*) FROM public.talent_profiles),
      'vetted', (SELECT count(*) FROM public.talent_profiles WHERE is_vetted),
      'public', (SELECT count(*) FROM public.talent_profiles WHERE is_public),
      'new_profiles_in_period', (SELECT count(*) FROM public.talent_profiles WHERE created_at >= since),
      'published_roles', (SELECT count(*) FROM public.talent_roles WHERE status = 'published'),
      'applications', (SELECT count(*) FROM public.talent_applications),
      'applications_in_period', (SELECT count(*) FROM public.talent_applications WHERE created_at >= since),
      'active_engagements', (SELECT count(*) FROM public.talent_engagements WHERE status = 'active'),
      'weekly_payroll', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('currency', cur, 'amount', amt) ORDER BY amt DESC)
        FROM (SELECT COALESCE(NULLIF(upper(currency), ''), 'NGN') AS cur, sum(weekly_amount) AS amt
              FROM public.talent_engagements
              WHERE status = 'active' AND weekly_amount IS NOT NULL GROUP BY 1) s
      ), '[]'::jsonb),
      'new_interest_requests', (SELECT count(*) FROM public.talent_interest_requests WHERE status = 'new'),
      'new_business_briefs', (SELECT count(*) FROM public.business_briefs WHERE status = 'new')
    ),

    'leads', jsonb_build_object(
      'total', (SELECT count(*) FROM public.leads),
      'in_period', (SELECT count(*) FROM public.leads WHERE created_at >= since),
      'by_interest', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('label', interest, 'count', n) ORDER BY n DESC)
        FROM (SELECT interest, count(*) AS n FROM public.leads
              WHERE created_at >= since GROUP BY 1 ORDER BY 2 DESC LIMIT 6) s
      ), '[]'::jsonb)
    )
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_dashboard_metrics(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_metrics(integer) TO authenticated;
