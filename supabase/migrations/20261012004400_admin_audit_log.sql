-- Activity log on /admin/activity: one row per admin action, saying who did
-- what to which student or record, and when.
--
-- Actions an admin makes with their own session (lead status, referral
-- payouts) are caught by triggers below. Actions that go through the service
-- key (marking payments paid or cancelling them in decidePendingEnrollment,
-- issuing certificates in the admin-add-certificate function) have no
-- auth.uid() inside Postgres, so that code writes its own row with the
-- acting admin's id. Automatic changes (Flutterwave confirming a payment, a
-- student's own actions) are not admin actions and are not logged.

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  actor_email text,
  -- e.g. payment.marked_paid, enrollment.cancelled, certificate.issued,
  -- lead.status_changed, referral.reward_paid
  action text NOT NULL,
  target_table text NOT NULL,
  target_id text,
  faculty_id text,
  -- Who or what the action was about, as it read at the time (student name, lead contact).
  subject text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_faculty_id_idx ON public.admin_audit_log (faculty_id);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read the log. Nobody can edit or delete it through the API:
-- rows are written by the triggers below and by service-key server code.
GRANT SELECT ON public.admin_audit_log TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.admin_audit_log FROM anon, authenticated;

DROP POLICY IF EXISTS "Admins can read the audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can read the audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Writes one row for the signed-in admin. Does nothing for service-key
-- writes and non-admins, so triggers never log automatic or student changes.
CREATE OR REPLACE FUNCTION public.log_admin_action(
  _action text,
  _target_table text,
  _target_id text,
  _faculty_id text,
  _subject text,
  _details jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'admin') THEN
    RETURN;
  END IF;
  INSERT INTO public.admin_audit_log (actor_id, actor_email, action, target_table, target_id, faculty_id, subject, details)
  VALUES (uid, (SELECT email FROM auth.users WHERE id = uid), _action, _target_table, _target_id, _faculty_id, _subject, COALESCE(_details, '{}'::jsonb));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;

-- Enrolments: marking paid and cancelling, if an admin ever does it with their own session.
CREATE OR REPLACE FUNCTION public.audit_enrollment_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_admin_action(
    CASE
      WHEN NEW.status = 'cancelled' THEN 'enrollment.cancelled'
      WHEN OLD.status = 'pending' AND NEW.status IN ('active', 'confirmed') THEN 'payment.marked_paid'
      ELSE 'enrollment.status_changed'
    END,
    'enrollments',
    NEW.id::text,
    NEW.faculty_id,
    (SELECT name FROM public.profiles WHERE faculty_id = NEW.faculty_id LIMIT 1),
    jsonb_build_object('from', OLD.status, 'to', NEW.status, 'plan', NEW.plan_name,
                       'amount', NEW.amount_due, 'currency', NEW.currency)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_enrollment_status ON public.enrollments;
CREATE TRIGGER audit_enrollment_status
  AFTER UPDATE OF status ON public.enrollments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.audit_enrollment_status();

-- Certificates: issued or removed by an admin with their own session.
CREATE OR REPLACE FUNCTION public.audit_certificate_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.certificates;
BEGIN
  IF TG_OP = 'DELETE' THEN r := OLD; ELSE r := NEW; END IF;
  PERFORM public.log_admin_action(
    CASE WHEN TG_OP = 'DELETE' THEN 'certificate.deleted' ELSE 'certificate.issued' END,
    'certificates',
    r.id::text,
    r.faculty_id,
    r.student_name,
    jsonb_build_object('certificate_number', r.certificate_number, 'course', r.course_name)
  );
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS audit_certificate_change ON public.certificates;
CREATE TRIGGER audit_certificate_change
  AFTER INSERT OR DELETE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_certificate_change();

-- Leads: status changes from the /admin/leads inbox.
CREATE OR REPLACE FUNCTION public.audit_lead_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_admin_action(
    'lead.status_changed',
    'leads',
    NEW.id::text,
    NULL,
    COALESCE(NULLIF(NEW.name, ''), NEW.contact),
    jsonb_build_object('from', OLD.status, 'to', NEW.status, 'contact', NEW.contact, 'interest', NEW.interest)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_lead_status ON public.leads;
CREATE TRIGGER audit_lead_status
  AFTER UPDATE OF status ON public.leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.audit_lead_status();

-- Referral rewards: admin_mark_referral_paid runs with the admin's session.
-- The referrals table comes from the alumni referral migration; if it isn't
-- there yet, run this file again after it to add the trigger.
CREATE OR REPLACE FUNCTION public.audit_referral_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec jsonb := to_jsonb(NEW);
  old_rec jsonb := to_jsonb(OLD);
BEGIN
  PERFORM public.log_admin_action(
    CASE WHEN rec->>'status' = 'paid_out' THEN 'referral.reward_paid' ELSE 'referral.status_changed' END,
    'referrals',
    rec->>'id',
    NULL,
    (SELECT name FROM public.profiles WHERE id = (rec->>'referrer_user_id')::uuid),
    jsonb_build_object('from', old_rec->>'status', 'to', rec->>'status', 'code', rec->>'code',
                       'amount', rec->'reward_amount', 'currency', rec->>'currency')
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.referrals') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS audit_referral_status ON public.referrals;
    CREATE TRIGGER audit_referral_status
      AFTER UPDATE OF status ON public.referrals
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status)
      EXECUTE FUNCTION public.audit_referral_status();
  END IF;
END;
$$;
