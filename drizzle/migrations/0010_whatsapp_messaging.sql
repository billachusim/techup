CREATE TABLE public.whatsapp_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  attempts int NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX whatsapp_webhook_events_pending ON public.whatsapp_webhook_events (next_attempt_at) WHERE processed_at IS NULL;
GRANT SELECT ON public.whatsapp_webhook_events TO authenticated;
GRANT ALL ON public.whatsapp_webhook_events TO service_role;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read webhook events" ON public.whatsapp_webhook_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_message_id text UNIQUE,
  direction text NOT NULL CHECK (direction IN ('inbound','outbound')),
  contact_phone text NOT NULL,
  contact_name text,
  type text NOT NULL DEFAULT 'text',
  body text,
  media_id text,
  media_mime text,
  template_name text,
  status text NOT NULL DEFAULT 'received',
  error jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  failed_at timestamptz,
  provider_timestamp timestamptz,
  sent_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX whatsapp_messages_contact ON public.whatsapp_messages (contact_phone, created_at DESC);
GRANT SELECT ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read whatsapp messages" ON public.whatsapp_messages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.whatsapp_status_pending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_message_id text NOT NULL,
  status text NOT NULL,
  provider_timestamp timestamptz,
  errors jsonb,
  delivery_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (delivery_id, wa_message_id, status)
);
CREATE INDEX whatsapp_status_pending_msg ON public.whatsapp_status_pending (wa_message_id);
GRANT ALL ON public.whatsapp_status_pending TO service_role;
ALTER TABLE public.whatsapp_status_pending ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.whatsapp_account_state (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  sending_paused boolean NOT NULL DEFAULT false,
  last_event text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.whatsapp_account_state (id) VALUES (1);
GRANT SELECT ON public.whatsapp_account_state TO authenticated;
GRANT ALL ON public.whatsapp_account_state TO service_role;
ALTER TABLE public.whatsapp_account_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read whatsapp state" ON public.whatsapp_account_state FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;