CREATE TABLE IF NOT EXISTS public.referral_codes (
  code text PRIMARY KEY CHECK (code ~ '^[A-Z0-9-]{4,24}$'),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL REFERENCES public.referral_codes(code) ON UPDATE CASCADE,
  referrer_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tx_ref text NOT NULL UNIQUE REFERENCES public.enrollments(tx_ref) ON DELETE CASCADE,
  currency text NOT NULL,
  discount_amount numeric NOT NULL CHECK (discount_amount >= 0),
  reward_amount numeric NOT NULL CHECK (reward_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'earned', 'paid_out', 'cancelled')),
  earned_at timestamptz,
  paid_out_at timestamptz,
  paid_out_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (referrer_user_id <> referred_user_id)
);
CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON public.referrals (referrer_user_id);
CREATE INDEX IF NOT EXISTS referrals_referred_idx ON public.referrals (referred_user_id);
GRANT SELECT ON public.referral_codes TO authenticated;
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read referral codes" ON public.referral_codes;
CREATE POLICY "Admins read referral codes" ON public.referral_codes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins read referrals" ON public.referrals;
CREATE POLICY "Admins read referrals" ON public.referrals
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.is_referral_eligible(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = _user_id AND p.faculty_id IS NOT NULL
      AND (
        EXISTS (
          SELECT 1 FROM public.certificates c
          WHERE c.faculty_id = p.faculty_id
             OR c.faculty_id IN (SELECT f.faculty_id FROM public.faculty_ids f
                                 WHERE p.email IS NOT NULL AND lower(f.email) = lower(p.email))
        )
        OR EXISTS (
          SELECT 1 FROM public.enrollments e
          WHERE e.faculty_id = p.faculty_id
            AND e.status IN ('active', 'confirmed')
            AND e.plan_name NOT IN ('Bootcamp Starter', 'Free Bootcamp')
        )
      )
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_referral_eligible(uuid) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.get_my_referral()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  my_code text;
  base text;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  suffix text;
  i int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Please sign in first' USING ERRCODE = '42501'; END IF;
  SELECT code INTO my_code FROM public.referral_codes WHERE user_id = uid;
  IF my_code IS NULL THEN
    IF NOT public.is_referral_eligible(uid) THEN
      RETURN jsonb_build_object('eligible', false);
    END IF;
    SELECT left(upper(regexp_replace(split_part(coalesce(name, ''), ' ', 1), '[^A-Za-z]', '', 'g')), 10)
      INTO base FROM public.profiles WHERE id = uid;
    IF coalesce(base, '') = '' THEN base := 'TF'; END IF;
    LOOP
      suffix := '';
      FOR i IN 1..4 LOOP
        suffix := suffix || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      END LOOP;
      BEGIN
        INSERT INTO public.referral_codes (code, user_id) VALUES (base || '-' || suffix, uid)
        RETURNING code INTO my_code;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        SELECT code INTO my_code FROM public.referral_codes WHERE user_id = uid;
        EXIT WHEN my_code IS NOT NULL;
      END;
    END LOOP;
  END IF;
  RETURN jsonb_build_object(
    'eligible', true,
    'code', my_code,
    'joined', (SELECT count(*) FROM public.referrals WHERE referrer_user_id = uid AND status IN ('earned', 'paid_out')),
    'rewards', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('currency', currency, 'earned', earned, 'paid_out', paid_out))
      FROM (
        SELECT currency,
               COALESCE(sum(reward_amount) FILTER (WHERE status = 'earned'), 0) AS earned,
               COALESCE(sum(reward_amount) FILTER (WHERE status = 'paid_out'), 0) AS paid_out
        FROM public.referrals
        WHERE referrer_user_id = uid AND status IN ('earned', 'paid_out')
        GROUP BY currency
      ) r
    ), '[]'::jsonb)
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_referral() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_referral() TO authenticated;

CREATE OR REPLACE FUNCTION public.check_referral_code(_code text, _user_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  rc record;
  fid text;
BEGIN
  SELECT * INTO rc FROM public.referral_codes WHERE code = upper(trim(_code));
  IF rc IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'That discount code isn''t valid. Check it, or remove it to pay the full price.');
  END IF;
  IF rc.user_id = _user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'You can''t use your own referral code.');
  END IF;
  SELECT faculty_id INTO fid FROM public.profiles WHERE id = _user_id;
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = _user_id AND status IN ('earned', 'paid_out'))
     OR EXISTS (SELECT 1 FROM public.enrollments e
                WHERE e.faculty_id = fid AND e.status IN ('active', 'confirmed')
                  AND e.plan_name NOT IN ('Bootcamp Starter', 'Free Bootcamp')) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Referral codes are for new students. Remove the code to continue.');
  END IF;
  RETURN jsonb_build_object('ok', true, 'code', rc.code, 'referrer_user_id', rc.user_id);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_referral_code(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_referral_code(text, uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.referral_code_exists(_code text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.referral_codes WHERE code = upper(trim(_code)));
$$;
GRANT EXECUTE ON FUNCTION public.referral_code_exists(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.sync_referral_with_enrollment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.tx_ref IS NULL OR NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;
  IF NEW.status IN ('active', 'confirmed') THEN
    UPDATE public.referrals SET status = 'earned', earned_at = now()
    WHERE tx_ref = NEW.tx_ref AND status IN ('pending', 'cancelled');
  ELSIF NEW.status = 'cancelled' THEN
    UPDATE public.referrals SET status = 'cancelled'
    WHERE tx_ref = NEW.tx_ref AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_referral_with_enrollment ON public.enrollments;
CREATE TRIGGER sync_referral_with_enrollment
  AFTER UPDATE OF status ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.sync_referral_with_enrollment();

CREATE OR REPLACE FUNCTION public.admin_list_referrals()
RETURNS TABLE (
  id uuid, code text, status text, currency text, discount_amount numeric, reward_amount numeric,
  created_at timestamptz, earned_at timestamptz, paid_out_at timestamptz,
  referrer_name text, referrer_faculty_id text, referrer_email text, referrer_phone text,
  referred_name text, referred_faculty_id text, plan_name text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT r.id, r.code, r.status, r.currency, r.discount_amount, r.reward_amount,
         r.created_at, r.earned_at, r.paid_out_at,
         rp.name, rp.faculty_id, rp.email, rp.phone,
         np.name, np.faculty_id, e.plan_name
  FROM public.referrals r
  LEFT JOIN public.profiles rp ON rp.id = r.referrer_user_id
  LEFT JOIN public.profiles np ON np.id = r.referred_user_id
  LEFT JOIN public.enrollments e ON e.tx_ref = r.tx_ref
  ORDER BY r.created_at DESC
  LIMIT 500;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_list_referrals() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_referrals() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_mark_referral_paid(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;
  UPDATE public.referrals
  SET status = 'paid_out', paid_out_at = now(), paid_out_by = auth.uid()
  WHERE id = _id AND status = 'earned';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Only an earned reward can be marked paid';
  END IF;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_mark_referral_paid(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_mark_referral_paid(uuid) TO authenticated;

DROP TRIGGER IF EXISTS audit_referral_status ON public.referrals;
CREATE TRIGGER audit_referral_status
  AFTER UPDATE OF status ON public.referrals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.audit_referral_status();

CREATE OR REPLACE FUNCTION public.needs_you_today_counts()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE referral_rewards integer;
BEGIN
  IF to_regclass('public.referrals') IS NOT NULL THEN
    EXECUTE 'SELECT count(*) FROM public.referrals WHERE status = ''earned''' INTO referral_rewards;
  END IF;
  RETURN jsonb_build_object(
    'new_leads', (SELECT count(*) FROM public.leads WHERE status = 'new'),
    'payments_to_confirm', (SELECT count(*) FROM public.enrollments WHERE status = 'pending'),
    'work_to_review', (SELECT count(*) FROM public.student_deliverables WHERE status = 'submitted'),
    'talent_requests',
      (SELECT count(*) FROM public.business_briefs WHERE status = 'new')
      + (SELECT count(*) FROM public.talent_interest_requests WHERE status = 'new'),
    'referral_rewards', referral_rewards
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.needs_you_today_counts() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.needs_you_today_counts() TO service_role;

CREATE OR REPLACE FUNCTION public.admin_needs_you_today()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;
  RETURN public.needs_you_today_counts();
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_needs_you_today() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_needs_you_today() TO authenticated;

CREATE TABLE IF NOT EXISTS public.admin_digest_sends (
  sent_on date PRIMARY KEY,
  sent_at timestamptz NOT NULL DEFAULT now(),
  counts jsonb NOT NULL DEFAULT '{}'::jsonb
);
REVOKE ALL ON public.admin_digest_sends FROM anon, authenticated;
GRANT ALL ON public.admin_digest_sends TO service_role;
ALTER TABLE public.admin_digest_sends ENABLE ROW LEVEL SECURITY;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
SELECT cron.unschedule('admin-morning-digest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-morning-digest');
SELECT cron.schedule(
  'admin-morning-digest',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/admin-digest',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);

SELECT cron.unschedule('recover-checkouts') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'recover-checkouts');
SELECT cron.schedule(
  'recover-checkouts',
  '30 5 * * *',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/recover-checkouts',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);