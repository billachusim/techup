ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS auto_issued boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS issued_email_sent_at timestamptz;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('certificate-auto-issue') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'certificate-auto-issue');
SELECT cron.schedule('certificate-auto-issue','40 * * * *',
  $$ SELECT net.http_post(url := 'https://techfaculty.ng/api/certificate-auto-issue', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{"trigger": "cron"}'::jsonb, timeout_milliseconds := 60000) as request_id; $$);

CREATE TABLE IF NOT EXISTS public.class_reminder_sends (
  lecture_id uuid NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  faculty_id text NOT NULL,
  email text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lecture_id, faculty_id)
);
ALTER TABLE public.class_reminder_sends ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.class_reminder_sends FROM anon, authenticated;
GRANT ALL ON public.class_reminder_sends TO service_role;
GRANT SELECT ON public.class_reminder_sends TO authenticated;
DROP POLICY IF EXISTS "Admins can read class reminder sends" ON public.class_reminder_sends;
CREATE POLICY "Admins can read class reminder sends" ON public.class_reminder_sends
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.cron_secrets (job, secret)
VALUES ('class-reminders', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'class-reminders' OR command ILIKE '%send-class-reminders%';
SELECT cron.schedule('class-reminders','30 6 * * *',
  $$ SELECT net.http_post(url := 'https://techfaculty.ng/api/class-reminders', headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'class-reminders')), body := '{"trigger": "cron"}'::jsonb, timeout_milliseconds := 60000) as request_id; $$);

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'enrolled', 'not_interested', 'archived'));

CREATE OR REPLACE FUNCTION public.lead_email_key(_email text, _contact text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT NULLIF(lower(btrim(COALESCE(
    NULLIF(btrim(_email), ''),
    CASE WHEN position('@' IN COALESCE(_contact, '')) > 0 THEN _contact END
  ))), '')
$$;

CREATE OR REPLACE FUNCTION public.lead_phone_key(_phone text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN position('@' IN COALESCE(_phone, '')) = 0
     AND length(regexp_replace(COALESCE(_phone, ''), '\D', '', 'g')) >= 10
    THEN right(regexp_replace(_phone, '\D', '', 'g'), 10)
  END
$$;

CREATE OR REPLACE FUNCTION public.audit_lead_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF current_setting('app.lead_automation', true) = 'on' THEN
    RETURN NEW;
  END IF;
  PERFORM public.log_admin_action('lead.status_changed','leads',NEW.id::text,NULL,
    COALESCE(NULLIF(NEW.name, ''), NEW.contact),
    jsonb_build_object('from', OLD.status, 'to', NEW.status, 'contact', NEW.contact, 'interest', NEW.interest));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_convert_student_leads(
  _faculty_id text, _plan_name text, _enrollment_id uuid, _before timestamptz DEFAULT now()
) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  email_key text;
  phone_key text;
  n integer;
BEGIN
  SELECT lower(btrim(p.email)), public.lead_phone_key(p.phone)
    INTO email_key, phone_key
  FROM public.profiles p WHERE p.faculty_id = _faculty_id LIMIT 1;
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

CREATE OR REPLACE FUNCTION public.convert_leads_on_enrollment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  FOR EACH ROW EXECUTE FUNCTION public.convert_leads_on_enrollment();

CREATE OR REPLACE FUNCTION public.archive_silent_leads(_days integer DEFAULT 30)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

SELECT cron.unschedule('archive-silent-leads') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'archive-silent-leads');
SELECT cron.schedule('archive-silent-leads','15 3 * * *', $$ SELECT public.archive_silent_leads(30); $$);

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS requested_selection jsonb,
  ADD COLUMN IF NOT EXISTS pay_link_url text,
  ADD COLUMN IF NOT EXISTS pay_link_created_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_disabled_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_skipped_reason text,
  ADD COLUMN IF NOT EXISTS auto_cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_email_sent_at timestamptz;

DROP POLICY IF EXISTS "Students request own enrollments" ON public.enrollments;
CREATE POLICY "Students request own enrollments" ON public.enrollments
FOR INSERT TO authenticated
WITH CHECK (
  faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid())
  AND tx_ref IS NULL AND amount_due IS NULL AND paid_at IS NULL AND payment_reference IS NULL
  AND recovered_at IS NULL AND recovered_email_sent_at IS NULL AND payment_reminder_sent_at IS NULL
  AND instalment_total IS NULL AND balance_due IS NULL AND balance_due_by IS NULL AND balance_paid_at IS NULL
  AND pay_link_url IS NULL AND pay_link_created_at IS NULL AND pay_link_sent_at IS NULL
  AND pay_link_reminder_sent_at IS NULL AND pay_link_disabled_at IS NULL AND pay_link_skipped_reason IS NULL
  AND auto_cancelled_at IS NULL AND cancel_email_sent_at IS NULL
  AND (status = 'pending' OR (status = 'active' AND plan_name IN ('Bootcamp Starter', 'Free Bootcamp')))
);

ALTER TABLE public.whatsapp_account_state
  ADD COLUMN IF NOT EXISTS auto_answer_enabled boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.whatsapp_auto_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  inbound_wa_message_id text NOT NULL UNIQUE,
  contact_phone text NOT NULL,
  contact_name text,
  inbound_text text,
  intent text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('answered', 'handed_off')),
  reason text,
  acknowledged boolean NOT NULL DEFAULT false,
  reply_message_id uuid,
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS whatsapp_auto_replies_contact_idx ON public.whatsapp_auto_replies (contact_phone, created_at DESC);
CREATE INDEX IF NOT EXISTS whatsapp_auto_replies_waiting_idx ON public.whatsapp_auto_replies (contact_phone)
  WHERE outcome = 'handed_off' AND resolved_at IS NULL;
GRANT SELECT ON public.whatsapp_auto_replies TO authenticated;
GRANT ALL ON public.whatsapp_auto_replies TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.whatsapp_auto_replies FROM anon, authenticated;
ALTER TABLE public.whatsapp_auto_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff can read WhatsApp auto replies" ON public.whatsapp_auto_replies;
CREATE POLICY "Staff can read WhatsApp auto replies" ON public.whatsapp_auto_replies
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.resolve_whatsapp_handoffs()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.whatsapp_auto_replies SET resolved_at = now()
   WHERE contact_phone = NEW.contact_phone AND outcome = 'handed_off' AND resolved_at IS NULL;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.resolve_whatsapp_handoffs() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS resolve_whatsapp_handoffs ON public.whatsapp_messages;
CREATE TRIGGER resolve_whatsapp_handoffs
  AFTER INSERT ON public.whatsapp_messages
  FOR EACH ROW
  WHEN (NEW.direction = 'outbound' AND NEW.sent_by IS NOT NULL AND NEW.status <> 'failed')
  EXECUTE FUNCTION public.resolve_whatsapp_handoffs();

CREATE OR REPLACE FUNCTION public.set_whatsapp_auto_answer(_enabled boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only';
  END IF;
  UPDATE public.whatsapp_account_state SET auto_answer_enabled = _enabled, updated_at = now() WHERE id = 1;
  PERFORM public.log_admin_action(
    CASE WHEN _enabled THEN 'whatsapp.auto_answer_on' ELSE 'whatsapp.auto_answer_off' END,
    'whatsapp_account_state', '1', NULL, 'WhatsApp auto-answers', '{}'::jsonb);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.set_whatsapp_auto_answer(boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_whatsapp_auto_answer(boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.whatsapp_chats_waiting()
RETURNS integer LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Staff only';
  END IF;
  RETURN (SELECT count(DISTINCT contact_phone)::integer FROM public.whatsapp_auto_replies
     WHERE outcome = 'handed_off' AND resolved_at IS NULL);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.whatsapp_chats_waiting() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.whatsapp_chats_waiting() TO authenticated, service_role;