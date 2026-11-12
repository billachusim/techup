-- Counts free (not signed-in) Faculty AI chat replies per network per day, so
-- visitors can try one message before signing in without opening the AI budget.
CREATE TABLE public.ai_chat_anon_usage (
  ip_hash text NOT NULL,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'Africa/Lagos')::date,
  uses integer NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, day)
);

GRANT ALL ON public.ai_chat_anon_usage TO service_role;

ALTER TABLE public.ai_chat_anon_usage ENABLE ROW LEVEL SECURITY;
-- No policies: only the server (service role) reads or writes this table.

-- Atomically claims one free reply. Returns false when this network or the
-- whole site has used up today's free replies.
CREATE OR REPLACE FUNCTION public.claim_anon_ai_chat(_ip_hash text, _per_network integer, _site_daily integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _today date := (now() AT TIME ZONE 'Africa/Lagos')::date;
  _site_total integer;
  _mine integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('claim_anon_ai_chat'));
  SELECT COALESCE(SUM(uses), 0) INTO _site_total FROM ai_chat_anon_usage WHERE day = _today;
  IF _site_total >= _site_daily THEN
    RETURN false;
  END IF;
  SELECT uses INTO _mine FROM ai_chat_anon_usage WHERE ip_hash = _ip_hash AND day = _today;
  IF COALESCE(_mine, 0) >= _per_network THEN
    RETURN false;
  END IF;
  INSERT INTO ai_chat_anon_usage (ip_hash, day, uses) VALUES (_ip_hash, _today, 1)
  ON CONFLICT (ip_hash, day) DO UPDATE SET uses = ai_chat_anon_usage.uses + 1;
  DELETE FROM ai_chat_anon_usage WHERE day < _today - 7;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_anon_ai_chat(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_anon_ai_chat(text, integer, integer) TO service_role;