-- The free Bootcamp Starter programme is "Everyday AI & Digital Productivity",
-- but its four courses still carried web-dev names ("Web Development Basics"
-- and so on), so every class was titled "Web Development Basics" and came with
-- freeCodeCamp web-dev videos. Beginners thought they were in the wrong class.
--
-- This gives the free programme's courses (plan_required = 'bootcamp_starter',
-- taken in sort order) Everyday AI names, one distinct title per class, and
-- beginner AI videos. Course ids stay the same, so enrolments, progress, the
-- Slack "next class" post and the Drive access sharing keep working.
-- Courses beyond the fourth are left as they are.

CREATE TEMP TABLE everyday_ai_plan (
  rank integer PRIMARY KEY,
  course_name text NOT NULL,
  course_description text NOT NULL,
  class_titles text[] NOT NULL
) ON COMMIT DROP;

INSERT INTO everyday_ai_plan VALUES
(1, 'Everyday AI Basics',
 'What AI is, how to talk to ChatGPT and Gemini, and how to use them safely for everyday tasks.',
 ARRAY['What AI is and how ChatGPT works', 'Writing good prompts', 'AI for writing, emails and documents', 'Using AI safely and checking its answers']),
(2, 'AI for Digital Productivity',
 'Use AI inside the tools you already work with: Google Docs, Sheets and Gmail, Canva and your daily planning.',
 ARRAY['Google Docs, Gmail and Drive with Gemini', 'Spreadsheets made easy with AI', 'Designing with Canva AI', 'Planning your day and projects with AI']),
(3, 'AI for Work and Business',
 'Put AI to work for a business or side hustle: social media content, images, customer chats and a simple website.',
 ARRAY['AI for social media content', 'Creating images with AI', 'AI for customer chats and small business', 'Building a simple website with AI (no code)']),
(4, 'Your Tech Career with AI',
 'Find the tech path that fits you, learn faster with AI, and get your CV and portfolio ready for your next Tech Faculty course.',
 ARRAY['Tech careers and which path fits you', 'Learning any skill faster with AI', 'Your CV and LinkedIn with AI', 'Next steps: choosing your Tech Faculty course']);

CREATE TEMP TABLE everyday_ai_courses ON COMMIT DROP AS
SELECT c.id, p.rank, p.course_name, p.course_description, p.class_titles
FROM (
  SELECT id, row_number() OVER (ORDER BY sort_order, name, id) AS rank
  FROM public.courses
  WHERE plan_required = 'bootcamp_starter'
) c
JOIN everyday_ai_plan p ON p.rank = c.rank;

-- Course names and descriptions
UPDATE public.courses c
SET name = e.course_name, description = e.course_description
FROM everyday_ai_courses e
WHERE c.id = e.id;

-- One title per class (lectures are taken in date order, as the dashboard does)
UPDATE public.lectures l
SET title = e.class_titles[r.n],
    description = 'Class ' || r.n || ' of ' || e.course_name || ': ' || e.class_titles[r.n] || '.'
FROM (
  SELECT id, course_id, row_number() OVER (PARTITION BY course_id ORDER BY scheduled_at, id) AS n
  FROM public.lectures
) r
JOIN everyday_ai_courses e ON e.id = r.course_id
WHERE l.id = r.id AND r.n <= 4;

-- Cached handouts were written for the old web-dev titles; they regenerate on
-- the next dashboard visit.
DELETE FROM public.ai_class_content a
USING everyday_ai_courses e
WHERE a.course_id = e.id;

-- Beginner AI videos in place of the web-dev ones
DELETE FROM public.class_videos v
USING everyday_ai_courses e
WHERE v.course_id = e.id;

INSERT INTO public.class_videos (course_id, class_number, title, url, source, position, created_by)
SELECT e.id, x.class_number, x.title, x.url, 'youtube', x.position, NULL
FROM everyday_ai_courses e
JOIN (VALUES
  (1, 1, 'ChatGPT for Beginners, 2026 Edition (Tony DeSimone)', 'https://www.youtube.com/watch?v=hOe0maWOhp8', 0),
  (1, 1, 'ChatGPT Tutorial: A Crash Course for Beginners', 'https://www.youtube.com/watch?v=JTxsNm9IdYU', 1),
  (1, 2, 'Master the Perfect ChatGPT Prompt Formula (in 8 minutes)', 'https://www.youtube.com/watch?v=jC4v5AS4RIM', 0),
  (1, 2, 'Learn Prompt Engineering in 30 Minutes (from the Google course)', 'https://www.youtube.com/watch?v=hDVNcfrV70k', 1),
  (1, 3, 'ChatGPT Tutorial for Beginners: How to Actually Get Work Done with AI', 'https://www.youtube.com/watch?v=poM2n8fBcag', 0),
  (1, 3, 'How to use Google Gemini with Google Docs', 'https://www.youtube.com/watch?v=9Bt3BJb-z10', 1),
  (1, 4, 'What is AI Safety? AI Tutorials for Beginners', 'https://www.youtube.com/watch?v=OEWdXuQMS6M', 0),
  (1, 4, 'How to Learn AI in 29 Minutes', 'https://www.youtube.com/watch?v=9c7zh2MkslY', 1),
  (2, 1, 'Gemini Tutorial for Google Workspace (Gmail, Docs, Sheets)', 'https://www.youtube.com/watch?v=4wppKdmQlD0', 0),
  (2, 1, 'How to Use Google Gemini AI (Full Tutorial)', 'https://www.youtube.com/watch?v=PDMcpthR88U', 1),
  (2, 2, 'Work Smarter with Google Sheets AI (Gemini in Sheets)', 'https://www.youtube.com/watch?v=QiRUQBwA4EA', 0),
  (2, 2, 'How to Use ChatGPT Inside Google Sheets and Excel', 'https://www.youtube.com/watch?v=a845FStdBlw', 1),
  (2, 3, 'How to Use Canva AI and Magic Studio', 'https://www.youtube.com/watch?v=6EIf2Hmia60', 0),
  (2, 3, 'New Canva AI Tools (Canva Magic Studio)', 'https://www.youtube.com/watch?v=Dr3n4uYsDp4', 1),
  (2, 4, 'These 5 Google AI Tools Save Me Hours Every Week', 'https://www.youtube.com/watch?v=Rr2lcKCH084', 0),
  (2, 4, 'The Only AI Tools You Need (12-Minute Guide)', 'https://www.youtube.com/watch?v=htZRCE2GgIs', 1),
  (3, 1, 'How to Create 30 Days of Content in under 60 Minutes', 'https://www.youtube.com/watch?v=eea_h19WF00', 0),
  (3, 1, 'How to Automate Social Media Content Creation', 'https://www.youtube.com/watch?v=wIoFvZsjcLg', 1),
  (3, 2, 'AI Images Made Easy (Beginner Tutorial)', 'https://www.youtube.com/watch?v=xA5tn6LbG8Y', 0),
  (3, 2, 'ChatGPT Image Generator Tutorial for Beginners', 'https://www.youtube.com/watch?v=FvweL4gmLPA', 1),
  (3, 3, 'How To Use AI to Start, Build and Grow Your Small Business (HubSpot)', 'https://www.youtube.com/watch?v=nkuPUJVzB_E', 0),
  (3, 4, 'The Easiest Way to Build Websites in 15 Minutes (AI + No Code)', 'https://www.youtube.com/watch?v=_1g3kw2MA7U', 0),
  (3, 4, 'How to Build the Perfect Website with AI', 'https://www.youtube.com/watch?v=BzQJgpjeQZ4', 1),
  (4, 1, 'How to Choose the Right Tech Career Track for You', 'https://www.youtube.com/watch?v=g1lTsOfOAGA', 0),
  (4, 1, 'How to Pick the Best Tech Career for You', 'https://www.youtube.com/watch?v=sLRJAgPsMLM', 1),
  (4, 2, 'How to Learn AI in 29 Minutes (Explorer, Power User, Builder)', 'https://www.youtube.com/watch?v=9c7zh2MkslY', 0),
  (4, 2, 'How I''d Break Into AI with No Technical Background', 'https://www.youtube.com/watch?v=7Q4VM67jwYc', 1),
  (4, 3, 'How To Create a CV in 6 Minutes Using ChatGPT', 'https://www.youtube.com/watch?v=JVlBHqd8KW0', 0),
  (4, 3, 'How To Use ChatGPT to Write a Resume', 'https://www.youtube.com/watch?v=_9-YU72F4Fk', 1),
  (4, 4, 'The 5 Best Tech Jobs in 2026', 'https://www.youtube.com/watch?v=l9wEIKJaLWI', 0)
) AS x(rank, class_number, title, url, position) ON x.rank = e.rank
ON CONFLICT (course_id, class_number, url) DO NOTHING;
