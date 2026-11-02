-- One WhatsApp follow-up per NEW lead, 54 hours after the lead is created. No confirmation message.
CREATE OR REPLACE FUNCTION public.enqueue_whatsapp_lead_confirmation()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE normalized_phone text;
BEGIN
  IF NEW.channel = 'whatsapp' AND NEW.status = 'new' AND NEW.whatsapp_opt_out_at IS NULL THEN
    normalized_phone := public.normalize_whatsapp_lead_phone(NEW.contact);
    IF length(normalized_phone) BETWEEN 8 AND 15 THEN
      INSERT INTO public.whatsapp_lead_followups (
        lead_id, stage, recipient_phone, template_name, template_language,
        due_at, next_attempt_at, expires_at
      ) VALUES (
        NEW.id, 'follow_up', normalized_phone, 'tf_admissions_follow_up', 'en_US',
        now() + interval '54 hours', now() + interval '54 hours', now() + interval '10 days'
      ) ON CONFLICT (lead_id, stage) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cancel_ineligible_whatsapp_lead_followups()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status <> 'new'
     OR NEW.whatsapp_opt_out_at IS NOT NULL
     OR (NEW.whatsapp_last_inbound_at IS NOT NULL AND NEW.whatsapp_last_inbound_at >= NEW.created_at) THEN
    UPDATE public.whatsapp_lead_followups
    SET status = 'cancelled', updated_at = now(),
        last_error = CASE WHEN NEW.whatsapp_opt_out_at IS NOT NULL THEN 'Lead opted out' ELSE 'Lead is no longer eligible' END
    WHERE lead_id = NEW.id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.claim_whatsapp_lead_followups(p_limit integer, p_approved_template_names text[])
 RETURNS TABLE(id uuid, lead_id uuid, stage text, recipient_phone text, template_name text, template_language text, attempt_count integer, lead_name text, lead_interest text, lead_created_at timestamp with time zone)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT q.id
    FROM public.whatsapp_lead_followups AS q
    JOIN public.leads AS l ON l.id = q.lead_id
    WHERE q.status = 'pending'
      AND q.stage = 'follow_up'
      AND q.due_at <= now()
      AND q.next_attempt_at <= now()
      AND q.expires_at > now()
      AND q.template_name = ANY(coalesce(p_approved_template_names, ARRAY[]::text[]))
      AND l.channel = 'whatsapp'
      AND l.status = 'new'
      AND l.whatsapp_opt_out_at IS NULL
      AND (l.whatsapp_last_inbound_at IS NULL OR l.whatsapp_last_inbound_at < l.created_at)
      AND NOT EXISTS (SELECT 1 FROM public.whatsapp_lead_followups s
                      WHERE s.lead_id = q.lead_id AND s.status = 'sent')
    ORDER BY q.due_at, q.created_at
    FOR UPDATE OF q SKIP LOCKED
    LIMIT least(greatest(coalesce(p_limit, 1), 1), 25)
  ), claimed AS (
    UPDATE public.whatsapp_lead_followups AS q
    SET status = 'sending', claimed_at = now(), attempt_count = q.attempt_count + 1, updated_at = now()
    FROM candidates AS c WHERE q.id = c.id
    RETURNING q.id, q.lead_id, q.stage, q.recipient_phone, q.template_name, q.template_language, q.attempt_count
  )
  SELECT c.id, c.lead_id, c.stage, c.recipient_phone, c.template_name,
    c.template_language, c.attempt_count, l.name, l.interest, l.created_at
  FROM claimed AS c JOIN public.leads AS l ON l.id = c.lead_id;
END;
$function$;

-- Existing leads are excluded: cancel everything already queued.
UPDATE public.whatsapp_lead_followups
SET status = 'cancelled', updated_at = now(), last_error = 'Existing lead excluded from automatic follow-up'
WHERE status = 'pending';