-- Leads that look after themselves:
-- 1. Auto-convert: when someone gets an enrolment that gives access (a paid plan
--    once payment is confirmed, or a free plan), every open lead with their email
--    address or phone number is marked "enrolled".
-- 2. Auto-archive: a "new" or "contacted" lead whose follow-ups have all ended and
--    who has stayed silent for 30 days is moved to "archived". Runs daily at 03:15 UTC.
-- Both write to the activity log with actor_email 'automation'. An admin can move
-- an archived lead back to new or contacted from /admin/leads.

-- New status.
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'enrolled', 'not_interested', 'archived'));

-- Same matching keys as the conversion funnel: lower-cased email, or the last 10
-- digits of a phone number (so 0803... and +234803... match).
CREATE OR REPLACE FUNCTION public.lead_email_key(_email text, _contact text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(lower(btrim(COALESCE(
    NULLIF(btrim(_email), ''),
    CASE WHEN position('@' IN COALESCE(_contact, '')) > 0 THEN _contact END
  ))), '')
$$;

CREATE OR REPLACE FUNCTION public.lead_phone_key(_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN position('@' IN COALESCE(_phone, '')) = 0
     AND length(regexp_replace(COALESCE(_phone, ''), '\D', '', 'g')) >= 10
    THEN right(regexp_replace(_phone, '\D', '', 'g'), 10)
  END
$$;

-- The status-change audit trigger logs the signed-in admin. When the change is
-- made by the automation below (even inside an admin's session, e.g. marking a
-- payment paid), the automation writes its own row instead.
CREATE OR REPLACE FUNCTION public.audit_lead_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.lead_automation', true) = 'on' THEN
    RETURN NEW;
  END IF;
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

-- Marks every open lead for this student as enrolled. Only leads created on or
-- before _before are touched, so an enquiry made after enrolling (say, a current
-- student asking about Virtual SIWES) stays in the inbox. Returns how many changed.
CREATE OR REPLACE FUNCTION public.auto_convert_student_leads(
  _faculty_id text,
  _plan_name text,
  _enrollment_id uuid,
  _before timestamptz DEFAULT now()
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_key text;
  phone_key text;
  n integer;
BEGIN
  SELECT lower(btrim(p.email)), public.lead_phone_key(p.phone)
    INTO email_key, phone_key
  FROM public.profiles p
  WHERE p.faculty_id = _faculty_id
  LIMIT 1;
  IF email_key IS NULL AND phone_key IS NULL THEN
    RETURN 0;
  END IF;

  PERFORM set_config('app.lead_automation', 'on', true);

  WITH converted AS (
    UPDATE public.leads l
    SET status = 'enrolled', status_updated_at = now()
    FROM public.leads old
    WHERE old.id = l.id
      AND old.status IN ('new', 'contacted', 'archived', 'not_interested')
      AND old.created_at <= _before
      AND (
        (email_key IS NOT NULL AND public.lead_email_key(old.email, old.contact) = email_key)
        OR (phone_key IS NOT NULL AND public.lead_phone_key(old.contact) = phone_key)
      )
    RETURNING l.id, l.name, l.contact, l.interest, old.status AS old_status
  )
  INSERT INTO public.admin_audit_log (actor_id, actor_email, action, target_table, target_id, faculty_id, subject, details)
  SELECT NULL, 'automation', 'lead.auto_converted', 'leads', c.id::text, _faculty_id,
    COALESCE(NULLIF(c.name, ''), c.contact),
    jsonb_build_object('from', c.old_status, 'to', 'enrolled', 'contact', c.contact,
                       'interest', c.interest, 'plan', _plan_name, 'enrollment_id', _enrollment_id)
  FROM converted c;
  GET DIAGNOSTICS n = ROW_COUNT;

  PERFORM set_config('app.lead_automation', 'off', true);
  RETURN n;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.auto_convert_student_leads(text, text, uuid, timestamptz) FROM PUBLIC, anon, authenticated;

-- Runs whenever an enrolment starts giving access. Same rule as grantsAccess()
-- in supabase/functions/_shared/enrollment-access.ts. Never blocks the enrolment.
CREATE OR REPLACE FUNCTION public.convert_leads_on_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  grants_now boolean := NEW.status <> 'cancelled'
    AND (NEW.plan_name IN ('Bootcamp Starter', 'Free Bootcamp') OR NEW.status IN ('active', 'confirmed'));
  granted_before boolean := TG_OP = 'UPDATE' AND OLD.status <> 'cancelled'
    AND (OLD.plan_name IN ('Bootcamp Starter', 'Free Bootcamp') OR OLD.status IN ('active', 'confirmed'));
BEGIN
  IF grants_now AND NOT granted_before THEN
    BEGIN
      PERFORM public.auto_convert_student_leads(NEW.faculty_id, NEW.plan_name, NEW.id, now());
    EXCEPTION WHEN others THEN
      RAISE WARNING 'lead auto-convert failed for %: %', NEW.faculty_id, SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS convert_leads_on_enrollment ON public.enrollments;
CREATE TRIGGER convert_leads_on_enrollment
  AFTER INSERT OR UPDATE OF status, plan_name ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.convert_leads_on_enrollment();

-- Archives silent leads. A lead qualifies when:
--  * it is "new" or "contacted" and not a business/partner enquiry,
--  * no follow-up is still running (email sequence not stopped, or a WhatsApp
--    follow-up still waiting to send), and
--  * its last activity is more than _days days ago. Activity is the enquiry
--    itself, an admin changing its status, the last follow-up sent, and the
--    last WhatsApp message they sent us.
-- Returns how many were archived.
CREATE OR REPLACE FUNCTION public.archive_silent_leads(_days integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cutoff timestamptz := now() - make_interval(days => GREATEST(_days, 7));
  n integer;
BEGIN
  PERFORM set_config('app.lead_automation', 'on', true);

  WITH activity AS (
    SELECT l.id, l.status AS old_status,
      GREATEST(
        l.created_at,
        l.status_updated_at,
        l.whatsapp_last_inbound_at,
        (SELECT max(GREATEST(f.last_sent_at, f.stopped_at))
           FROM public.lead_email_followups f
           WHERE f.lead_id = l.id
              OR f.email = public.lead_email_key(l.email, l.contact)),
        (SELECT max(COALESCE(w.sent_at, w.updated_at))
           FROM public.whatsapp_lead_followups w
           WHERE w.lead_id = l.id)
      ) AS last_activity_at
    FROM public.leads l
    WHERE l.status IN ('new', 'contacted')
      AND l.interest <> 'partner_enquiry'
      AND l.created_at < cutoff
      AND NOT EXISTS (
        SELECT 1 FROM public.lead_email_followups f
        WHERE (f.lead_id = l.id OR f.email = public.lead_email_key(l.email, l.contact))
          AND f.stopped_at IS NULL
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.whatsapp_lead_followups w
        WHERE w.lead_id = l.id
          AND w.sent_at IS NULL
          AND w.status IN ('pending', 'sending', 'claimed', 'processing')
          AND w.expires_at > now()
      )
  ),
  archived AS (
    UPDATE public.leads l
    SET status = 'archived', status_updated_at = now()
    FROM activity a
    WHERE l.id = a.id
      AND a.last_activity_at < cutoff
      AND l.status IN ('new', 'contacted')
    RETURNING l.id, l.name, l.contact, l.interest, a.last_activity_at, a.old_status
  )
  INSERT INTO public.admin_audit_log (actor_id, actor_email, action, target_table, target_id, faculty_id, subject, details)
  SELECT NULL, 'automation', 'lead.auto_archived', 'leads', a.id::text, NULL,
    COALESCE(NULLIF(a.name, ''), a.contact),
    jsonb_build_object('from', a.old_status, 'to', 'archived', 'contact', a.contact,
                       'interest', a.interest, 'last_activity_at', a.last_activity_at, 'silent_days', _days)
  FROM archived a;
  GET DIAGNOSTICS n = ROW_COUNT;

  PERFORM set_config('app.lead_automation', 'off', true);
  RETURN n;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.archive_silent_leads(integer) FROM PUBLIC, anon, authenticated;

-- One-off catch-up: leads whose person already has an enrolment with access
-- that started on or after the enquiry.
DO $$
DECLARE
  e record;
BEGIN
  FOR e IN
    SELECT DISTINCT ON (en.faculty_id) en.id, en.faculty_id, en.plan_name, en.created_at
    FROM public.enrollments en
    WHERE en.status <> 'cancelled'
      AND (en.plan_name IN ('Bootcamp Starter', 'Free Bootcamp') OR en.status IN ('active', 'confirmed'))
    ORDER BY en.faculty_id, en.created_at DESC
  LOOP
    PERFORM public.auto_convert_student_leads(e.faculty_id, e.plan_name, e.id, e.created_at);
  END LOOP;
END;
$$;

-- Daily at 03:15 UTC (04:15 Lagos). Shows on the /admin scheduled jobs card.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

SELECT cron.unschedule('archive-silent-leads') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'archive-silent-leads');

SELECT cron.schedule(
  'archive-silent-leads',
  '15 3 * * *',
  $$ SELECT public.archive_silent_leads(30); $$
);
