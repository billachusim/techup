-- Alumni referrals. A graduate shares their code; a new student who pays
-- with it gets a discount, and the graduate earns a reward an admin pays out.
-- The discount and reward rates live in supabase/functions/_shared/pricing.ts;
-- create-checkout applies them and records the amounts here.
--
-- Codes and referrals belong to the student's account (profiles.id), not the
-- Faculty ID, because a student gets a new Faculty ID with each enrolment.

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
  -- The checkout this referral was used on. A checkout that never reaches
  -- Flutterwave is deleted by create-checkout, and its referral with it.
  tx_ref text NOT NULL UNIQUE REFERENCES public.enrollments(tx_ref) ON DELETE CASCADE,
  currency text NOT NULL,
  discount_amount numeric NOT NULL CHECK (discount_amount >= 0),
  reward_amount numeric NOT NULL CHECK (reward_amount >= 0),
  -- pending: checkout started; earned: the new student's payment was
  -- confirmed; paid_out: an admin paid the graduate; cancelled: never paid.
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'earned', 'paid_out', 'cancelled')),
  earned_at timestamptz,
  paid_out_at timestamptz,
  paid_out_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (referrer_user_id <> referred_user_id)
);
CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON public.referrals (referrer_user_id);
CREATE INDEX IF NOT EXISTS referrals_referred_idx ON public.referrals (referred_user_id);

-- Only admins read these tables directly. Students go through the functions
-- below, which never reveal who else holds a code or who was referred.
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read referral codes" ON public.referral_codes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read referrals" ON public.referrals
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Who may refer: a graduate (holds a certificate under any Faculty ID on
-- their email) or a student whose paid plan was confirmed. Change this one
-- function to widen or narrow the programme.
CREATE OR REPLACE FUNCTION public.is_referral_eligible(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
REVOKE EXECUTE ON FUNCTION public.is_referral_eligible(uuid) FROM PUBLIC, anon, authenticated;

-- The signed-in student's code (created on first ask) and how it is doing.
CREATE OR REPLACE FUNCTION public.get_my_referral()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    -- First name plus four random characters, e.g. CHIDI-7K3Q.
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
        -- Another tab created this student's code first: use it.
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

-- Whether a code can be used by this student. create-checkout calls it with
-- the service role before charging; the result decides the price.
CREATE OR REPLACE FUNCTION public.check_referral_code(_code text, _user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
  -- Referral discounts are for new students only.
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
REVOKE EXECUTE ON FUNCTION public.check_referral_code(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_referral_code(text, uuid) TO service_role;

-- Lets the pricing page show "referral discount" before checkout. Reveals
-- nothing about whose code it is.
CREATE OR REPLACE FUNCTION public.referral_code_exists(_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.referral_codes WHERE code = upper(trim(_code)));
$$;
GRANT EXECUTE ON FUNCTION public.referral_code_exists(text) TO anon, authenticated;

-- A referral is earned once the new student's payment is confirmed, however
-- that happens (Flutterwave verify, webhook, or an admin marking it paid).
CREATE OR REPLACE FUNCTION public.sync_referral_with_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Admin: every referral with both students' names, newest first.
CREATE OR REPLACE FUNCTION public.admin_list_referrals()
RETURNS TABLE (
  id uuid,
  code text,
  status text,
  currency text,
  discount_amount numeric,
  reward_amount numeric,
  created_at timestamptz,
  earned_at timestamptz,
  paid_out_at timestamptz,
  referrer_name text,
  referrer_faculty_id text,
  referrer_email text,
  referrer_phone text,
  referred_name text,
  referred_faculty_id text,
  plan_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Admin: record that a graduate's reward has been paid.
CREATE OR REPLACE FUNCTION public.admin_mark_referral_paid(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Activity log: record reward payouts, using the trigger function from
-- 20261012004400_admin_audit_log.sql (it couldn't attach this one before the
-- referrals table existed).
DROP TRIGGER IF EXISTS audit_referral_status ON public.referrals;
CREATE TRIGGER audit_referral_status
  AFTER UPDATE OF status ON public.referrals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.audit_referral_status();
