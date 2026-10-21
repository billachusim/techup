CREATE OR REPLACE FUNCTION public.complete_whatsapp_lead_followup(
  p_id uuid,
  p_provider_message_id text,
  p_sent_at timestamptz DEFAULT now()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sent_row public.whatsapp_lead_followups%ROWTYPE;
BEGIN
  IF p_provider_message_id IS NULL OR length(p_provider_message_id) = 0 THEN
    RETURN false;
  END IF;

  UPDATE public.whatsapp_lead_followups
  SET status = 'sent', provider_message_id = p_provider_message_id,
      sent_at = coalesce(p_sent_at, now()), claimed_at = NULL,
      last_error = NULL, updated_at = now()
  WHERE id = p_id AND status = 'sending'
  RETURNING * INTO sent_row;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF sent_row.stage = 'confirmation' THEN
    INSERT INTO public.whatsapp_lead_followups (
      lead_id, stage, recipient_phone, template_name, template_language,
      due_at, next_attempt_at, expires_at
    ) VALUES (
      sent_row.lead_id, 'follow_up', sent_row.recipient_phone,
      'tf_admissions_follow_up', sent_row.template_language,
      sent_row.sent_at + interval '48 hours', sent_row.sent_at + interval '48 hours',
      sent_row.sent_at + interval '7 days'
    ) ON CONFLICT (lead_id, stage) DO NOTHING;
  END IF;

  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.complete_whatsapp_lead_followup(uuid, text, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_whatsapp_lead_followup(uuid, text, timestamptz) TO service_role;

CREATE OR REPLACE FUNCTION public.resolve_whatsapp_lead_followup(
  p_id uuid,
  p_status text,
  p_error text DEFAULT NULL,
  p_retry_after_seconds integer DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_status NOT IN ('pending', 'failed', 'unresolved', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid follow-up resolution status';
  END IF;

  UPDATE public.whatsapp_lead_followups
  SET status = p_status,
      next_attempt_at = CASE WHEN p_status = 'pending' AND p_retry_after_seconds IS NOT NULL
        THEN now() + make_interval(secs => least(greatest(p_retry_after_seconds, 30), 86400))
        ELSE next_attempt_at END,
      claimed_at = NULL,
      last_error = left(p_error, 1000),
      updated_at = now()
  WHERE id = p_id AND status = 'sending';
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.resolve_whatsapp_lead_followup(uuid, text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_whatsapp_lead_followup(uuid, text, text, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.mark_stale_whatsapp_lead_followups_unresolved()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE public.whatsapp_lead_followups
  SET status = 'unresolved', claimed_at = NULL,
      last_error = 'A previous send attempt has an ambiguous outcome; manual review required before retry.',
      updated_at = now()
  WHERE status = 'sending' AND claimed_at < now() - interval '5 minutes';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_stale_whatsapp_lead_followups_unresolved() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_stale_whatsapp_lead_followups_unresolved() TO service_role;