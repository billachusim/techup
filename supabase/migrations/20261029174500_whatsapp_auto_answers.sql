-- Automatic answers in the WhatsApp inbox (/admin/whatsapp).
-- Common questions (prices, locations, SIWES) get an instant reply from
-- src/lib/whatsapp-auto-answers.ts. Everything else is handed to staff and
-- shows as "Needs a reply" until a staff member sends a message to that chat.

-- On/off switch, shown to admins in the inbox.
ALTER TABLE public.whatsapp_account_state
  ADD COLUMN IF NOT EXISTS auto_answer_enabled boolean NOT NULL DEFAULT true;

-- One row per inbound message the automation looked at. The unique inbound id
-- is the claim that stops webhook retries from replying twice.
CREATE TABLE IF NOT EXISTS public.whatsapp_auto_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  inbound_wa_message_id text NOT NULL UNIQUE,
  contact_phone text NOT NULL,
  contact_name text,
  inbound_text text,
  -- Comma-separated: prices, location, siwes, virtual_siwes, other
  intent text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('answered', 'handed_off')),
  reason text,
  -- True when a handoff got the "someone will reply shortly" note.
  acknowledged boolean NOT NULL DEFAULT false,
  -- whatsapp_messages.id of the automatic reply, if one was sent.
  reply_message_id uuid,
  -- Set when staff reply to the chat after a handoff.
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS whatsapp_auto_replies_contact_idx ON public.whatsapp_auto_replies (contact_phone, created_at DESC);
CREATE INDEX IF NOT EXISTS whatsapp_auto_replies_waiting_idx ON public.whatsapp_auto_replies (contact_phone)
  WHERE outcome = 'handed_off' AND resolved_at IS NULL;

ALTER TABLE public.whatsapp_auto_replies ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.whatsapp_auto_replies TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.whatsapp_auto_replies FROM anon, authenticated;

DROP POLICY IF EXISTS "Staff can read WhatsApp auto replies" ON public.whatsapp_auto_replies;
CREATE POLICY "Staff can read WhatsApp auto replies" ON public.whatsapp_auto_replies
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

-- A staff reply (an outbound message with sent_by set) closes that chat's handoffs.
-- Automatic replies have no sent_by, so they never close one.
CREATE OR REPLACE FUNCTION public.resolve_whatsapp_handoffs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.whatsapp_auto_replies
     SET resolved_at = now()
   WHERE contact_phone = NEW.contact_phone
     AND outcome = 'handed_off'
     AND resolved_at IS NULL;
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

-- Admins switch auto-answers on or off from the inbox.
CREATE OR REPLACE FUNCTION public.set_whatsapp_auto_answer(_enabled boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only';
  END IF;
  UPDATE public.whatsapp_account_state SET auto_answer_enabled = _enabled, updated_at = now() WHERE id = 1;
  PERFORM public.log_admin_action(
    CASE WHEN _enabled THEN 'whatsapp.auto_answer_on' ELSE 'whatsapp.auto_answer_off' END,
    'whatsapp_account_state', '1', NULL, 'WhatsApp auto-answers', '{}'::jsonb
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_whatsapp_auto_answer(boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_whatsapp_auto_answer(boolean) TO authenticated;

-- Chats waiting for a staff reply, for the "Needs you today" strip and reports.
CREATE OR REPLACE FUNCTION public.whatsapp_chats_waiting()
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Staff in the browser, or server code with the service key (no auth.uid()).
  IF auth.uid() IS NOT NULL AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Staff only';
  END IF;
  RETURN (
    SELECT count(DISTINCT contact_phone)::integer
      FROM public.whatsapp_auto_replies
     WHERE outcome = 'handed_off' AND resolved_at IS NULL
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.whatsapp_chats_waiting() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.whatsapp_chats_waiting() TO authenticated, service_role;
