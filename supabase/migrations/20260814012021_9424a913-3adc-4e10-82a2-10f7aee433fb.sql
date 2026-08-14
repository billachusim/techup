CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  author text NOT NULL DEFAULT 'Tech Faculty Editorial',
  read_time text NOT NULL DEFAULT '8 min read',
  image_prompt text,
  is_published boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'auto',
  published_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts FOR SELECT
USING (is_published = true);

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX blog_posts_category_idx ON public.blog_posts (category);
CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at DESC);

-- Housekeeping: archive stale jobs and finished events, then purge very old rows.
CREATE OR REPLACE FUNCTION public.archive_stale_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.jobs
  SET is_expired = true
  WHERE is_expired = false
    AND last_seen_at < now() - interval '14 days';

  DELETE FROM public.jobs
  WHERE is_expired = true
    AND last_seen_at < now() - interval '60 days';

  UPDATE public.events
  SET is_expired = true
  WHERE is_expired = false
    AND is_featured = false
    AND COALESCE(ends_at, starts_at) IS NOT NULL
    AND COALESCE(ends_at, starts_at) < now();

  DELETE FROM public.events
  WHERE is_expired = true
    AND is_featured = false
    AND COALESCE(ends_at, starts_at) < now() - interval '90 days';
END;
$$;