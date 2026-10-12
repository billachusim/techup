-- Real schedules for Tech Faculty's own events (from Bill, 2026-10-12):
-- the Nnewi Tech Meetup is on the last Saturday of every month, and the holiday
-- bootcamp runs every school holiday. The meetup's date now rolls forward on its own.

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

-- Moves the meetup to its next date, keeping its time of day (default 17:00 WAT) and length.
CREATE OR REPLACE FUNCTION public.roll_recurring_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today date := (now() AT TIME ZONE 'Africa/Lagos')::date;
  next_day date := public.next_last_saturday(today);
BEGIN
  UPDATE public.events
  SET starts_at = (next_day + COALESCE((starts_at AT TIME ZONE 'Africa/Lagos')::time, time '17:00')) AT TIME ZONE 'Africa/Lagos',
      ends_at = (next_day + COALESCE((starts_at AT TIME ZONE 'Africa/Lagos')::time, time '17:00')) AT TIME ZONE 'Africa/Lagos'
                + COALESCE(ends_at - starts_at, interval '2 hours'),
      date_text = 'Last Saturday of every month',
      is_expired = false
  WHERE slug = 'nnewi-tech-meetup'
    AND (starts_at IS NULL OR (starts_at AT TIME ZONE 'Africa/Lagos')::date <> next_day);
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

SELECT public.roll_recurring_events();

-- Daily, just after midnight WAT. Pure SQL: no API calls, no credits used.
SELECT cron.unschedule('roll-recurring-events') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'roll-recurring-events');
SELECT cron.schedule('roll-recurring-events', '5 23 * * *', $$ SELECT public.roll_recurring_events(); $$);
