# Lean weekly SEO automation + cost controls

Goal: keep the three weekly automations (jobs, events, blogs) useful for SEO while cutting AI/scraping spend hard, and make the jobs page easier to browse.

## 1. Jobs scraper — cut volume and cost

- Cap at **6 jobs per platform per run** (hard slice after filtering), so ~72 rows max instead of unbounded.
- **Recency filter**: only keep listings posted within the last 14 days. Ask the extractor for a posted date and drop anything older or clearly stale; jobs with no date are kept only if they are new to us.
- **Trim the source list** from 12 platforms to the 8 that actually return good Nigeria/Africa-friendly roles, and stop scraping the rest (fewer Firecrawl credits per run).
- **Early stop**: once a run has collected enough fresh jobs (target ~60), remaining sources are skipped for that week.
- Cheaper extraction: `onlyMainContent` stays on, `waitFor` reduced, and the prompt tightened so less page text is sent to the model.
- Keep the weekly Monday schedule (already `0 5 * * 1`) — confirm no other trigger runs it.
- **Archiving**: mark jobs expired once `last_seen_at` is older than 14 days (down from 30), and hard-delete expired rows older than 60 days so the table stays small.

## 2. Events scraper — upcoming only

- Cap at **5 events per source**, and trim to the 6 best-performing sources.
- **Only future events**: drop anything whose start date is in the past or more than 120 days out; drop events with no resolvable date.
- Early stop once ~30 upcoming events are collected.
- Keep Monday 05:30 schedule.
- **Archiving**: auto-expire events after their end date passes; delete events that ended more than 90 days ago.

## 3. New: weekly SEO blog automation (rotating, auto-publish)

- New `blog_posts` table (slug, title, description, content, category, tags, hero prompt, published_at, source = 'auto'). Public read only; writes via service role.
- New `generate-weekly-blog` edge function, scheduled **Mondays 06:00 UTC**:
  - Picks the **2 categories** with the oldest most-recent post (rotation, so all 8 categories refresh roughly monthly).
  - For each, generates one long-form, SEO-heavy article via Lovable AI (`google/gemini-2.5-flash` — cheapest suitable model), with the existing house style: Nigerian context, H2/H3 structure, FAQ block, internal links to departments/locations/programs.
  - Checks existing slugs and titles first so nothing is duplicated.
  - **Auto-publishes** immediately.
- Blog pages (`/blog`, `/blog/category/:slug`, `/blog/:slug`) read the union of the existing static posts and the DB posts, sorted by date. Static posts stay untouched.
- Cost guard: exactly 2 generations/week, one attempt each, no retries beyond a single fallback; if generation fails the week is skipped silently (no half-posts).

## 4. Jobs page browsing — "See more jobs"

- Show **12 jobs** initially, with a **See more jobs** button loading 12 more at a time, plus a live "showing X of Y" count.
- Filters reset the visible count so results always start from the top.
- Same pattern applied to the events directory if the list grows past 12.

## 5. Extra weekly SEO automation (low cost, no AI)

- **Dynamic sitemap**: a `sitemap` edge function (or generated route) so new jobs, events and auto blog posts are always in `sitemap.xml` without manual edits — this is what actually converts the automations into indexed pages.
- **llms.txt refresh** in the same job, keeping AI-search discovery current.
- Both are pure database reads — zero AI cost.

## Technical notes

- Files touched: `supabase/functions/scrape-jobs/index.ts`, `supabase/functions/scrape-events/index.ts`, new `supabase/functions/generate-weekly-blog/index.ts`, new `supabase/functions/sitemap/index.ts`, `src/lib/jobs.ts`, `src/lib/events.ts`, `src/pages/Careers.tsx`, `src/pages/Events.tsx`, `src/pages/Blog.tsx`, `src/pages/BlogCategory.tsx`, `src/pages/BlogPost.tsx`, plus a migration for `blog_posts`, the archiving cleanup function and the new cron entry.
- Migration includes GRANTs and RLS (public SELECT on published rows, service_role full access).
- All three crons stay staggered on Monday morning: jobs 05:00, events 05:30, blog 06:00 UTC.
- Estimated steady-state spend: ~14 Firecrawl extractions/week (down from 22) and 2 AI article generations/week.
