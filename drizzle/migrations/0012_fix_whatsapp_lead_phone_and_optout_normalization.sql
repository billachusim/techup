CREATE OR REPLACE FUNCTION public.normalize_whatsapp_lead_phone(raw_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN length(regexp_replace(coalesce(raw_phone, ''), '[^0-9]', '', 'g')) = 11
      AND left(regexp_replace(coalesce(raw_phone, ''), '[^0-9]', '', 'g'), 1) = '0'
    THEN '234' || substr(regexp_replace(coalesce(raw_phone, ''), '[^0-9]', '', 'g'), 2)
    ELSE regexp_replace(coalesce(raw_phone, ''), '[^0-9]', '', 'g')
  END;
$$;

CREATE OR REPLACE FUNCTION public.process_whatsapp_lead_inbound(
  inbound_phone text,
  inbound_message text,
  provider_received_at timestamptz DEFAULT now()
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_phone text := public.normalize_whatsapp_lead_phone(inbound_phone);
  received_at_safe timestamptz := coalesce(provider_received_at, now());
  is_opt_out boolean := coalesce(inbound_message, '') ~* '^[[:space:]]*(stop|unsubscribe|cancel|end|quit)[[:space:].!]*$';
  affected integer := 0;
BEGIN
  UPDATE public.leads
  SET whatsapp_last_inbound_at = greatest(coalesce(whatsapp_last_inbound_at, received_at_safe), received_at_safe),
      whatsapp_opt_out_at = CASE WHEN is_opt_out THEN coalesce(whatsapp_opt_out_at, received_at_safe) ELSE whatsapp_opt_out_at END
  WHERE channel = 'whatsapp'
    AND public.normalize_whatsapp_lead_phone(contact) = normalized_phone;
  GET DIAGNOSTICS affected = ROW_COUNT;

  UPDATE public.whatsapp_lead_followups AS q
  SET status = 'cancelled', updated_at = now(), last_error = CASE WHEN is_opt_out THEN 'Lead opted out' ELSE 'Lead replied' END
  FROM public.leads AS l
  WHERE q.lead_id = l.id
    AND l.channel = 'whatsapp'
    AND public.normalize_whatsapp_lead_phone(l.contact) = normalized_phone
    AND q.status = 'pending';

  RETURN affected;
END;
$$;

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
     AND NEW.interest IN ('community_join', 'whatsapp_chat', 'free_checklist', 'success_kit', 'siwes_placement', 'virtual_siwes', 'logbook_service', 'partner_enquiry') THEN
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