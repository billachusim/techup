CREATE OR REPLACE FUNCTION public.enqueue_whatsapp_lead_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_phone text;
BEGIN
  IF NEW.whatsapp_opt_in IS TRUE
     AND NEW.channel = 'whatsapp'
     AND NEW.interest IN ('community_join', 'whatsapp_chat', 'free_checklist', 'siwes_placement', 'virtual_siwes') THEN
    normalized_phone := public.normalize_whatsapp_lead_phone(NEW.contact);
    IF length(normalized_phone) BETWEEN 8 AND 15 THEN
      INSERT INTO public.whatsapp_lead_followups (
        lead_id, stage, recipient_phone, template_name, template_language,
        due_at, next_attempt_at, expires_at
      ) VALUES (
        NEW.id, 'confirmation', normalized_phone, 'tf_admissions_confirmation', 'en_US',
        now(), now(), now() + interval '7 days'
      ) ON CONFLICT (lead_id, stage) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_ineligible_whatsapp_lead_followups()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status <> 'new'
     OR NEW.whatsapp_opt_in IS NOT TRUE
     OR NEW.whatsapp_opt_out_at IS NOT NULL
     OR (NEW.whatsapp_last_inbound_at IS NOT NULL AND NEW.whatsapp_last_inbound_at >= NEW.created_at) THEN
    UPDATE public.whatsapp_lead_followups
    SET status = 'cancelled', updated_at = now(),
        last_error = CASE WHEN NEW.whatsapp_opt_out_at IS NOT NULL THEN 'Lead opted out' ELSE 'Lead is no longer eligible' END
    WHERE lead_id = NEW.id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.cancel_ineligible_whatsapp_lead_followups() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER cancel_ineligible_whatsapp_lead_followups_after_update
  AFTER UPDATE OF status, whatsapp_opt_in, whatsapp_opt_out_at, whatsapp_last_inbound_at ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.cancel_ineligible_whatsapp_lead_followups();

CREATE OR REPLACE FUNCTION public.claim_whatsapp_lead_followups(
  p_limit integer,
  p_approved_template_names text[]
)
RETURNS TABLE (
  id uuid,
  lead_id uuid,
  stage text,
  recipient_phone text,
  template_name text,
  template_language text,
  attempt_count integer,
  lead_name text,
  lead_interest text,
  lead_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT q.id
    FROM public.whatsapp_lead_followups AS q
    JOIN public.leads AS l ON l.id = q.lead_id
    LEFT JOIN public.whatsapp_lead_followups AS confirmation
      ON confirmation.lead_id = q.lead_id AND confirmation.stage = 'confirmation'
    WHERE q.status = 'pending'
      AND q.due_at <= now()
      AND q.next_attempt_at <= now()
      AND q.expires_at > now()
      AND q.template_name = ANY(coalesce(p_approved_template_names, ARRAY[]::text[]))
      AND l.channel = 'whatsapp'
      AND l.status = 'new'
      AND l.whatsapp_opt_in IS TRUE
      AND l.whatsapp_opt_out_at IS NULL
      AND (
        (q.stage = 'confirmation' AND (l.whatsapp_last_inbound_at IS NULL OR l.whatsapp_last_inbound_at < l.created_at))
        OR
        (q.stage = 'follow_up'
          AND confirmation.status = 'sent'
          AND confirmation.sent_at IS NOT NULL
          AND confirmation.sent_at <= now() - interval '48 hours'
          AND (l.whatsapp_last_inbound_at IS NULL OR l.whatsapp_last_inbound_at < confirmation.sent_at))
      )
    ORDER BY q.due_at, q.created_at
    FOR UPDATE OF q SKIP LOCKED
    LIMIT least(greatest(coalesce(p_limit, 1), 1), 25)
  ), claimed AS (
    UPDATE public.whatsapp_lead_followups AS q
    SET status = 'sending', claimed_at = now(), attempt_count = q.attempt_count + 1, updated_at = now()
    FROM candidates AS c
    WHERE q.id = c.id
    RETURNING q.id, q.lead_id, q.stage, q.recipient_phone, q.template_name,
      q.template_language, q.attempt_count
  )
  SELECT c.id, c.lead_id, c.stage, c.recipient_phone, c.template_name,
    c.template_language, c.attempt_count, l.name, l.interest, l.created_at
  FROM claimed AS c
  JOIN public.leads AS l ON l.id = c.lead_id;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_whatsapp_lead_followups(integer, text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_whatsapp_lead_followups(integer, text[]) TO service_role;