-- Class videos. Tutors' YouTube and Google Drive videos saved per class, so
-- every class a student is sent (dashboard handout and the Slack "next class"
-- post) carries its video links automatically. Staff manage them at
-- /admin/class-videos; students get them through the server (service role),
-- so there is no anon access.

CREATE TABLE IF NOT EXISTS public.class_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  class_number integer NOT NULL CHECK (class_number BETWEEN 1 AND 52),
  title text NOT NULL CHECK (length(trim(title)) > 0),
  url text NOT NULL CHECK (url ~* '^https?://'),
  source text NOT NULL DEFAULT 'youtube' CHECK (source IN ('youtube', 'drive', 'other')),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (course_id, class_number, url)
);
CREATE INDEX IF NOT EXISTS class_videos_class_idx ON public.class_videos (course_id, class_number, position);

ALTER TABLE public.class_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage class videos" ON public.class_videos
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_videos TO authenticated;
GRANT ALL ON public.class_videos TO service_role;
