CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id text,
  faculty_id text,
  subject text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_faculty_id_idx ON public.admin_audit_log (faculty_id);
GRANT SELECT ON public.admin_audit_log TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.admin_audit_log FROM anon, authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read the audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can read the audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.log_admin_action(_action text, _target_table text, _target_id text, _faculty_id text, _subject text, _details jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'admin') THEN RETURN; END IF;
  INSERT INTO public.admin_audit_log (actor_id, actor_email, action, target_table, target_id, faculty_id, subject, details)
  VALUES (uid, (SELECT email FROM auth.users WHERE id = uid), _action, _target_table, _target_id, _faculty_id, _subject, COALESCE(_details, '{}'::jsonb));
END;
$$;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.audit_enrollment_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.log_admin_action(
    CASE WHEN NEW.status = 'cancelled' THEN 'enrollment.cancelled'
         WHEN OLD.status = 'pending' AND NEW.status IN ('active', 'confirmed') THEN 'payment.marked_paid'
         ELSE 'enrollment.status_changed' END,
    'enrollments', NEW.id::text, NEW.faculty_id,
    (SELECT name FROM public.profiles WHERE faculty_id = NEW.faculty_id LIMIT 1),
    jsonb_build_object('from', OLD.status, 'to', NEW.status, 'plan', NEW.plan_name, 'amount', NEW.amount_due, 'currency', NEW.currency));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS audit_enrollment_status ON public.enrollments;
CREATE TRIGGER audit_enrollment_status AFTER UPDATE OF status ON public.enrollments
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public.audit_enrollment_status();

CREATE OR REPLACE FUNCTION public.audit_certificate_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.certificates;
BEGIN
  IF TG_OP = 'DELETE' THEN r := OLD; ELSE r := NEW; END IF;
  PERFORM public.log_admin_action(
    CASE WHEN TG_OP = 'DELETE' THEN 'certificate.deleted' ELSE 'certificate.issued' END,
    'certificates', r.id::text, r.faculty_id, r.student_name,
    jsonb_build_object('certificate_number', r.certificate_number, 'course', r.course_name));
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS audit_certificate_change ON public.certificates;
CREATE TRIGGER audit_certificate_change AFTER INSERT OR DELETE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.audit_certificate_change();

CREATE OR REPLACE FUNCTION public.audit_lead_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.log_admin_action('lead.status_changed', 'leads', NEW.id::text, NULL,
    COALESCE(NULLIF(NEW.name, ''), NEW.contact),
    jsonb_build_object('from', OLD.status, 'to', NEW.status, 'contact', NEW.contact, 'interest', NEW.interest));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS audit_lead_status ON public.leads;
CREATE TRIGGER audit_lead_status AFTER UPDATE OF status ON public.leads
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public.audit_lead_status();

CREATE OR REPLACE FUNCTION public.audit_referral_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE rec jsonb := to_jsonb(NEW); old_rec jsonb := to_jsonb(OLD);
BEGIN
  PERFORM public.log_admin_action(
    CASE WHEN rec->>'status' = 'paid_out' THEN 'referral.reward_paid' ELSE 'referral.status_changed' END,
    'referrals', rec->>'id', NULL,
    (SELECT name FROM public.profiles WHERE id = (rec->>'referrer_user_id')::uuid),
    jsonb_build_object('from', old_rec->>'status', 'to', rec->>'status', 'code', rec->>'code', 'amount', rec->'reward_amount', 'currency', rec->>'currency'));
  RETURN NEW;
END;
$$;

ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_reason text,
  ADD COLUMN IF NOT EXISTS revoked_by uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;
GRANT UPDATE ON public.certificates TO service_role;
DROP FUNCTION IF EXISTS public.verify_certificate(text);
CREATE FUNCTION public.verify_certificate(cert_number text)
RETURNS TABLE (certificate_number text, student_name text, course_name text, certificate_type text, issued_by text, date_issued text, issued_at timestamptz, revoked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.certificate_number,
         CASE WHEN c.revoked_at IS NULL THEN c.student_name END,
         CASE WHEN c.revoked_at IS NULL THEN c.course_name END,
         CASE WHEN c.revoked_at IS NULL THEN c.certificate_type END,
         CASE WHEN c.revoked_at IS NULL THEN c.issued_by END,
         CASE WHEN c.revoked_at IS NULL THEN c.date_issued END,
         CASE WHEN c.revoked_at IS NULL THEN c.issued_at END,
         c.revoked_at IS NOT NULL
  FROM public.certificates c
  WHERE c.certificate_number = upper(trim(cert_number))
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;