---
name: Weekly SEO automation
description: Lean weekly cron automations for jobs scraping, events scraping, blog generation, dynamic sitemap, and stale-listing archiving with strict AI-credit caps
type: feature
---
Three weekly crons (Mondays, UTC), all cost-capped:
- `weekly-scrape-jobs` 05:00 — `scrape-jobs`: 8 sources max, 6 jobs/platform, target 60 total, only jobs posted in last 14 days, wave size 4 with early stop.
- `weekly-scrape-events` 05:30 — `scrape-events`: 6 sources max, 5 events/source, target 30 total, only future events within 120 days, wave size 3 with early stop.
- `weekly-generate-blog` 06:00 — `generate-weekly-blog`: rotates 2 of the 8 blog categories per week, gemini-2.5-flash, auto-publishes to `blog_posts`.

Housekeeping: `archive_stale_listings()` (security definer) is invoked by both scrapers — expires jobs older than 14 days and events past their end date, hard-deletes very old rows.

Dynamic SEO: `sitemap` edge function serves DB-driven URLs (/blog/:slug, /careers/:slug, /events/:slug); listed as a second Sitemap line in `public/robots.txt`.

Frontend: `useAllBlogPosts()` (src/hooks/useBlogPostsData.ts) merges static `blogPosts.ts` with published `blog_posts` rows (static wins on slug conflicts) and strips the duplicate leading H1. Careers and Events lists paginate 12 at a time with a "See more" button.

Never raise per-source caps or scrape more than once a week — AI/Firecrawl credit conservation is a hard requirement.
