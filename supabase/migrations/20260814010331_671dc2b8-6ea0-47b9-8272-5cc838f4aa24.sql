CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'CONFERENCE',
  format text NOT NULL DEFAULT 'IN_PERSON',
  organizer text NOT NULL,
  venue_name text,
  address text,
  city text,
  state text,
  country text,
  lat numeric,
  lng numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  date_text text,
  timezone text,
  is_free boolean NOT NULL DEFAULT false,
  price_text text,
  currency text,
  source_platform text NOT NULL,
  source_url text NOT NULL UNIQUE,
  image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_expired boolean NOT NULL DEFAULT false,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

CREATE INDEX events_upcoming_idx ON public.events (is_expired, starts_at);
CREATE INDEX events_featured_idx ON public.events (is_featured, starts_at);
CREATE INDEX events_city_idx ON public.events (city);

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.events (slug, title, description, category, format, organizer, venue_name, address, city, state, country, lat, lng, starts_at, date_text, timezone, is_free, price_text, source_platform, source_url, tags, is_featured)
VALUES
(
  'nnewi-tech-meetup',
  'Nnewi Tech Meetup',
  'A monthly gathering of the Nnewi technology community hosted by Tech Faculty at the Technology Incubation Centre, Nnewi. Expect product demos, lightning talks, hiring conversations and open networking for developers, designers, data people, founders and students across Anambra State. Attendance is free and open to beginners.',
  'MEETUP', 'IN_PERSON', 'Tech Faculty NG',
  'Technology Incubation Centre, Nnewi', 'Technology Incubation Centre, NBTI South-East Zonal Office, Nnewi', 'Nnewi', 'Anambra', 'NG',
  6.0109, 6.9107, now() + interval '14 days', 'Monthly — next session announced in the community', 'Africa/Lagos',
  true, 'Free', 'Tech Faculty', 'https://techfaculty.ng/events/nnewi-tech-meetup',
  ARRAY['meetup','networking','nnewi','community'], true
),
(
  'ai-tools-for-business-workshop',
  'AI Tools for Business — Practical Workshop',
  'A hands-on Tech Faculty workshop showing business owners, marketers and administrators how to use AI tools for real work: writing and content, customer replies on WhatsApp, spreadsheets and reporting, image and design generation, and simple automation. Participants leave with working set-ups on their own laptops or phones, not slides.',
  'WORKSHOP', 'HYBRID', 'Tech Faculty NG',
  'Technology Incubation Centre, Nnewi', 'Technology Incubation Centre, NBTI South-East Zonal Office, Nnewi', 'Nnewi', 'Anambra', 'NG',
  6.0109, 6.9107, now() + interval '30 days', 'Rolling cohorts — dates announced in the community', 'Africa/Lagos',
  false, 'Fee announced per cohort', 'Tech Faculty', 'https://techfaculty.ng/events/ai-tools-for-business-workshop',
  ARRAY['ai','workshop','business','productivity'], true
),
(
  'holiday-tech-bootcamp-for-teenagers',
  'Holiday Tech Bootcamp for Kids and Teenagers',
  'Tech Faculty runs supervised holiday tracks for JSS and SSS students in Digital Creation, Coding, Artificial Intelligence and Cybersecurity, delivered across our campuses in Nnewi, Onitsha, Enugu, Owerri, Aba and other cities. Every student builds and presents a project, and parents receive a progress summary at the end of the session.',
  'BOOTCAMP', 'IN_PERSON', 'Tech Faculty NG',
  'Tech Faculty campuses nationwide', 'Technology Incubation Centres across Nigeria', 'Nnewi', 'Anambra', 'NG',
  6.0109, 6.9107, now() + interval '45 days', 'Every school holiday', 'Africa/Lagos',
  false, 'Fee announced per holiday session', 'Tech Faculty', 'https://techfaculty.ng/events/holiday-tech-bootcamp-for-teenagers',
  ARRAY['teens','holiday bootcamp','coding','cybersecurity'], true
);

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('weekly-scrape-events') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-scrape-events');

SELECT cron.schedule(
  'weekly-scrape-events',
  '30 5 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-events',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);