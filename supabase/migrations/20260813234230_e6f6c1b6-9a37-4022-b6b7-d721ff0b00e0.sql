CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  company text NOT NULL,
  source_platform text NOT NULL,
  source_url text NOT NULL UNIQUE,
  description text NOT NULL,
  employment_type text NOT NULL DEFAULT 'FULL_TIME',
  is_remote boolean NOT NULL DEFAULT true,
  location text,
  country text,
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  salary_unit text,
  tags text[] NOT NULL DEFAULT '{}',
  posted_at date,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  is_expired boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.jobs TO anon;
GRANT SELECT ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view job listings" ON public.jobs FOR SELECT USING (true);

CREATE INDEX jobs_last_seen_idx ON public.jobs (is_expired, last_seen_at DESC);
CREATE INDEX jobs_platform_idx ON public.jobs (source_platform);

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();