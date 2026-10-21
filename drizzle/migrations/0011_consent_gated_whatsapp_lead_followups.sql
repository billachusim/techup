ALTER TABLE public.leads
  ADD COLUMN whatsapp_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN whatsapp_opt_in_at timestamptz,
  ADD COLUMN whatsapp_opt_in_version text,
  ADD COLUMN whatsapp_opt_out_at timestamptz,
  ADD COLUMN whatsapp_last_inbound_at timestamptz;

CREATE TABLE public.whatsapp_lead_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  stage text NOT NULL CHECK (stage IN ('confirmation', 'follow_up')),
  recipient_phone text NOT NULL,
  template_name text NOT NULL,
  template_language text NOT NULL DEFAULT 'en_US',
  due_at timestamptz NOT NULL DEFAULT now(),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'unresolved', 'cancelled')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  provider_message_id text,
  last_error text,
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, stage)
);

GRANT SELECT ON public.whatsapp_lead_followups TO authenticated;
GRANT ALL ON public.whatsapp_lead_followups TO service_role;
ALTER TABLE public.whatsapp_lead_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view WhatsApp lead follow-ups" ON public.whatsapp_lead_followups
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE INDEX whatsapp_lead_followups_due_idx ON public.whatsapp_lead_followups (next_attempt_at, due_at)
  WHERE status = 'pending';
CREATE INDEX whatsapp_lead_followups_lead_idx ON public.whatsapp_lead_followups (lead_id, stage);

CREATE OR REPLACE FUNCTION public.normalize_whatsapp_lead_phone(raw_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN length(regexp_replace(coalesce(raw_phone, ''), '\\D', '', 'g')) = 11
      AND left(regexp_replace(coalesce(raw_phone, ''), '\\D', '', 'g'), 1) = '0'
    THEN '234' || substr(regexp_replace(coalesce(raw_phone, ''), '\\D', '', 'g'), 2)
    ELSE regexp_replace(coalesce(raw_phone, ''), '\\D', '', 'g')
  END;
$$;

CREATE OR REPLACE FUNCTION public.capture_whatsapp_lead_opt_in()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.whatsapp_opt_in IS TRUE THEN
    NEW.whatsapp_opt_in_at := now();
    NEW.whatsapp_opt_in_version := 'admissions-follow-up-2026-10-21-v1';
  ELSE
    NEW.whatsapp_opt_in_at := NULL;
    NEW.whatsapp_opt_in_version := NULL;
  END IF;
  NEW.whatsapp_opt_out_at := NULL;
  NEW.whatsapp_last_inbound_at := NULL;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_whatsapp_lead_opt_in() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER capture_whatsapp_lead_opt_in_before_insert
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.capture_whatsapp_lead_opt_in();

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
     AND NEW.interest IN ('community_join', 'whatsapp_chat', 'free_checklist', 'siwes_placement') THEN
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
REVOKE ALL ON FUNCTION public.enqueue_whatsapp_lead_confirmation() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER enqueue_whatsapp_lead_confirmation_after_insert
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_whatsapp_lead_confirmation();

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
  is_opt_out boolean := coalesce(inbound_message, '') ~* '^\\s*(stop|unsubscribe|cancel|end|quit)[[:space:].!]*$';
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
REVOKE ALL ON FUNCTION public.process_whatsapp_lead_inbound(text, text, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_whatsapp_lead_inbound(text, text, timestamptz) TO service_role;

REVOKE INSERT ON public.leads FROM PUBLIC, anon, authenticated;
GRANT INSERT (name, channel, contact, email, school, location, interest, source, notes, whatsapp_opt_in)
  ON public.leads TO anon, authenticated;