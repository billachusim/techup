-- Duplicate pay requests: every time a student submitted the WhatsApp / email /
-- bank enrolment form again (double tap, page reload, coming back later) a new
-- pending enrolment row was saved, so the same request showed several times in
-- Admin > Payments to confirm and each copy was emailed its own pay link.
--
-- From now on:
--   1. A WhatsApp / email / bank request for a plan the student already has a
--      pending WhatsApp / email / bank request for is not saved again; the
--      existing request keeps its place and takes the newest selection if it
--      has no pay link yet.
--   2. When any request for a plan is paid, the student's other pending
--      requests for that plan are cancelled (their pay links are switched off
--      by the hourly payment chase).
-- Card checkouts still save one row per attempt, because each attempt has its
-- own Flutterwave payment reference; the admin list groups them.

CREATE OR REPLACE FUNCTION public.enrollments_one_pending_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM 'pending' OR NEW.tx_ref IS NOT NULL THEN
    RETURN NEW;
  END IF;
  -- Two taps at the same moment must not both get through.
  PERFORM pg_advisory_xact_lock(hashtext('pending-request:' || NEW.faculty_id || ':' || NEW.plan_name));
  SELECT id INTO existing_id
  FROM public.enrollments
  WHERE faculty_id = NEW.faculty_id
    AND plan_name = NEW.plan_name
    AND status = 'pending'
    AND (tx_ref IS NULL OR pay_link_url IS NOT NULL)
  ORDER BY created_at DESC
  LIMIT 1;
  IF existing_id IS NULL THEN
    RETURN NEW;
  END IF;
  UPDATE public.enrollments
  SET requested_selection = COALESCE(NEW.requested_selection, requested_selection),
      learning_mode = COALESCE(NEW.learning_mode, learning_mode),
      ref_code = COALESCE(ref_code, NEW.ref_code)
  WHERE id = existing_id
    AND tx_ref IS NULL; -- a request already priced into a pay link keeps its amount
  RETURN NULL; -- skip the duplicate
END;
$$;

DROP TRIGGER IF EXISTS enrollments_one_pending_request ON public.enrollments;
CREATE TRIGGER enrollments_one_pending_request
BEFORE INSERT ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.enrollments_one_pending_request();

CREATE OR REPLACE FUNCTION public.enrollments_cancel_sibling_requests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('active', 'confirmed') AND OLD.status = 'pending' THEN
    UPDATE public.enrollments
    SET status = 'cancelled'
    WHERE faculty_id = NEW.faculty_id
      AND plan_name = NEW.plan_name
      AND status = 'pending'
      AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enrollments_cancel_sibling_requests ON public.enrollments;
CREATE TRIGGER enrollments_cancel_sibling_requests
AFTER UPDATE OF status ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.enrollments_cancel_sibling_requests();

-- Clean up the duplicates already saved: keep each student's WhatsApp /
-- email / bank request per plan (the one with a pay link, else the newest) and cancel the older copies.
-- Card checkouts are left alone (an older checkout page could still be paid).
UPDATE public.enrollments e
SET status = 'cancelled'
FROM (
  SELECT id, row_number() OVER (PARTITION BY faculty_id, plan_name ORDER BY (pay_link_url IS NULL), created_at DESC, id) AS n
  FROM public.enrollments
  WHERE status = 'pending'
    AND (tx_ref IS NULL OR pay_link_url IS NOT NULL)
) d
WHERE e.id = d.id AND d.n > 1;
