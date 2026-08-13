# Live AI & Remote Jobs Board for SEO

Turn the single static careers page into an auto-updating job board that refreshes weekly, with one indexable page per job.

## What visitors get

- **/careers** — revamped hub: search + filters (role type, remote/onsite, country, platform), a curated "Partner roles" strip (the current 8 Flutterwave/Paystack/Andela/etc. cards, kept as-is), then the live feed of scraped jobs with "Updated weekly" and last-refresh date.
- **/careers/jobs/:slug** — one page per job: full description from the source platform, company, location, pay (when published), how to apply, JobPosting JSON-LD, canonical, and internal links back to related programs. This is the SEO engine — each job can rank on its own.
- **Apply** — graduates signed in with a Faculty ID get our internal application form first, then the source link; visitors go straight to the source listing in a new tab. Every job clearly credits and links its source platform.
- **Homepage** — the "Where Our Graduates Work" section becomes a live "Latest AI & Remote Tech Jobs" block: 6 freshest listings, count of open roles, and a link to /careers. The company logo row stays as a trust strip beneath it.

## Feed scope

Remote AI/tech roles plus roles open to Nigeria/Africa applicants, prioritised in that order. Target sources: Mercor, Turing, Micro1, Handshake, Mindrift, Alignerr/Ask-style AI training platforms, Outlier, Scale AI, Toloka, RemoteOK and Wellfound as broad backfill.

## How the automation works

1. A scraping edge function pulls listing pages from each source, then uses AI to normalise each posting into a structured record (title, company, source platform, source URL, description, employment type, remote flag, locations, pay range, posted date).
2. Records are upserted into a `jobs` table keyed by source URL, so re-runs update rather than duplicate. Jobs missing from a fresh crawl for 30 days get marked expired and their pages return noindex.
3. A weekly scheduled job (cron) re-runs the crawl; sitemap.xml gains a dynamic jobs section so new pages get discovered.
4. Public read access via RLS; only the function writes.

## Technical notes

- Scraping needs the **Firecrawl connector** — I'll open the connect card when we build. Some platforms block bots or require login; those get skipped gracefully and the run still succeeds with whatever sources returned data. I'll report which sources actually yield jobs after the first run.
- Normalisation uses the Lovable AI gateway (Gemini Flash) with a strict JSON schema, retries and fallbacks, matching our existing AI-resilience pattern.
- New: `jobs` table + grants/RLS, `scrape-jobs` edge function (cron weekly), `src/pages/Careers.tsx` rewrite, `src/pages/JobDetail.tsx`, a `LatestJobs` homepage component replacing the Companies section body, and a sitemap route for job URLs.
- We republish descriptions from source platforms with attribution and a link to the original — standard aggregator practice, but if you'd rather show only a short excerpt, say so and I'll truncate instead.
