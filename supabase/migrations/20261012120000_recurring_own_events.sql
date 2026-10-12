-- Real schedules for Tech Faculty's own events (from Bill, 2026-10-12):
-- the Nnewi Tech Meetup is on the last Saturday of every month, the AI for Everything
-- Fellowship meets every Monday and Saturday from 11am to 2pm, and the holiday bootcamp
-- runs every school holiday. The meetup and fellowship dates now roll forward on their own.

-- Last Saturday of the month, on or after the given day (Lagos calendar).
CREATE OR REPLACE FUNCTION public.next_last_saturday(from_day date)
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT d
  FROM (
    SELECT (date_trunc('month', from_day + make_interval(months => m)) + interval '1 month - 1 day')::date AS last_day
    FROM generate_series(0, 2) AS m
  ) months,
  LATERAL (SELECT last_day - ((extract(dow FROM last_day)::int + 1) % 7) AS d) sat
  WHERE d >= from_day
  ORDER BY d
  LIMIT 1;
$$;

-- Moves each recurring event to its next session that has not finished yet.
-- Meetup: keeps its time of day (default 17:00 WAT) and length.
CREATE OR REPLACE FUNCTION public.roll_recurring_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today date := (now() AT TIME ZONE 'Africa/Lagos')::date;
  next_day date := public.next_last_saturday(today);
  fellowship_start timestamptz;
BEGIN
  UPDATE public.events
  SET starts_at = (next_day + COALESCE((starts_at AT TIME ZONE 'Africa/Lagos')::time, time '17:00')) AT TIME ZONE 'Africa/Lagos',
      ends_at = (next_day + COALESCE((starts_at AT TIME ZONE 'Africa/Lagos')::time, time '17:00')) AT TIME ZONE 'Africa/Lagos'
                + COALESCE(ends_at - starts_at, interval '2 hours'),
      date_text = 'Last Saturday of every month',
      is_expired = false
  WHERE slug = 'nnewi-tech-meetup'
    AND (starts_at IS NULL OR (starts_at AT TIME ZONE 'Africa/Lagos')::date <> next_day);

  -- Fellowship: next Monday or Saturday, 11:00 to 14:00 WAT, that has not ended yet.
  SELECT (day + time '11:00') AT TIME ZONE 'Africa/Lagos'
  INTO fellowship_start
  FROM generate_series(today, today + 7, interval '1 day') AS g(day_ts),
       LATERAL (SELECT day_ts::date AS day) d
  WHERE extract(dow FROM day) IN (1, 6)
    AND (day + time '14:00') AT TIME ZONE 'Africa/Lagos' > now()
  ORDER BY day
  LIMIT 1;

  UPDATE public.events
  SET starts_at = fellowship_start,
      ends_at = fellowship_start + interval '3 hours',
      is_expired = false
  WHERE slug = 'ai-for-everything-fellowship'
    AND starts_at IS DISTINCT FROM fellowship_start;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.roll_recurring_events() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.roll_recurring_events() TO service_role;

-- The bootcamp has no single date: show the recurring wording instead of a made-up day.
UPDATE public.events
SET starts_at = NULL,
    ends_at = NULL,
    date_text = 'Every school holiday: Christmas, Easter and the long vacation'
WHERE slug = 'holiday-tech-bootcamp-for-teenagers';

INSERT INTO public.events (
  slug, title, description, category, format, organizer, venue_name, address, city, state, country,
  lat, lng, date_text, timezone, is_free, source_platform, source_url, tags, is_featured
)
VALUES (
  'ai-for-everything-fellowship',
  'AI for Everything Fellowship',
  'Tech Faculty''s AI for Everything Fellowship meets every Monday and Saturday from 11am to 2pm. Each session is hands-on: participants learn to use AI tools for study, work and business, and practise on their own laptops or phones. Message us on WhatsApp to join the next session.',
  'WORKSHOP', 'IN_PERSON', 'Tech Faculty NG',
  'Technology Incubation Centre, Nnewi', 'Technology Incubation Centre (TIC), Umudim, Nnewi', 'Nnewi', 'Anambra', 'NG',
  6.0109, 6.9107, 'Every Monday and Saturday, 11am to 2pm', 'Africa/Lagos',
  false, 'Tech Faculty', 'https://techfaculty.ng/events/ai-for-everything-fellowship',
  ARRAY['ai','fellowship','workshop','nnewi'], true
)
ON CONFLICT (slug) DO NOTHING;

SELECT public.roll_recurring_events();

-- Hourly, so a session drops off as soon as it ends. Pure SQL: no API calls, no credits used.
SELECT cron.unschedule('roll-recurring-events') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'roll-recurring-events');
SELECT cron.schedule('roll-recurring-events', '5 * * * *', $$ SELECT public.roll_recurring_events(); $$);
