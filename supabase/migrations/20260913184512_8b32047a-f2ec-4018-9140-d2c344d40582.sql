CREATE TABLE public.talent_interest_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id uuid NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  requester_name text NOT NULL,
  requester_org text,
  requester_contact text NOT NULL,
  message text,
  source text NOT NULL DEFAULT 'talent_pool',
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.talent_interest_requests TO authenticated;
GRANT ALL ON public.talent_interest_requests TO service_role;

ALTER TABLE public.talent_interest_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view interest requests"
ON public.talent_interest_requests FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update interest requests"
ON public.talent_interest_requests FOR UPDATE TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_talent_interest_requests_profile ON public.talent_interest_requests(talent_profile_id);

CREATE OR REPLACE FUNCTION public.request_talent_intro(
  _profile_id uuid,
  _requester_name text,
  _requester_contact text,
  _requester_org text DEFAULT NULL,
  _message text DEFAULT NULL,
  _source text DEFAULT 'talent_pool'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_name text := btrim(coalesce(_requester_name, ''));
  clean_contact text := btrim(coalesce(_requester_contact, ''));
BEGIN
  IF length(clean_name) < 2 OR length(clean_contact) < 5 THEN
    RAISE EXCEPTION 'Please provide your name and a contact we can reply to';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.talent_profiles WHERE id = _profile_id) THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;

  INSERT INTO public.talent_interest_requests (
    talent_profile_id, requester_name, requester_org, requester_contact, message, source
  ) VALUES (
    _profile_id,
    left(clean_name, 120),
    nullif(left(btrim(coalesce(_requester_org, '')), 160), ''),
    left(clean_contact, 160),
    nullif(left(btrim(coalesce(_message, '')), 1000), ''),
    left(coalesce(_source, 'talent_pool'), 40)
  );

  UPDATE public.talent_profiles
  SET is_client_interested = true,
      client_interest_note = 'A business asked us for an introduction on ' || to_char(now(), 'DD Mon YYYY'),
      updated_at = now()
  WHERE id = _profile_id;
END;
$$;

REVOKE ALL ON FUNCTION public.request_talent_intro(uuid, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_talent_intro(uuid, text, text, text, text, text) TO anon, authenticated, service_role;