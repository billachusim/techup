# Events overhaul: auto-scraped tech events + SEO event pages

Turn `/events` from a small static page into a continuously updated directory of tech, AI and remote-work events across Nigeria and Africa — built to rank for the searches people actually make ("tech events in Lagos 2026", "AI conference Nigeria", "free tech webinars Africa") and to send visitors to the organiser's own registration page.

This mirrors the jobs board we already built, so it reuses proven plumbing: Firecrawl scraping in an edge function, a weekly cron, a database table, a filterable index page and one SEO page per item.

## What visitors get

- **`/events`** — searchable, filterable directory: upcoming events first, filters by country/city, format (in-person, virtual, hybrid), category (conference, hackathon, meetup, webinar, bootcamp, career fair) and free vs paid. Our own Tech Faculty events (Nnewi Tech Meetup, workshops, holiday bootcamps) stay pinned at the top as featured entries.
- **`/events/:slug`** — a page per event with the full description, date and time, venue or platform, organiser, price, who it suits, and a prominent "Register on the organiser's site" button that opens the external URL in a new tab. Includes related events and links back to relevant departments and locations.
- **City and category hubs** — `/events/nigeria/lagos`-style groupings come later; v1 handles this through filters plus internal links from the location pages ("Events in Enugu") so we do not thin out the SEO surface.
- **Homepage** — a compact "Upcoming tech events" strip, same treatment as the latest jobs section.

## Where the events come from

A `scrape-events` edge function pulls listings weekly from public event sources, extracting structured fields with Firecrawl's JSON extraction (same pattern as `scrape-jobs`):

- Nigeria and Africa focused: Eventbrite Nigeria tech, Meetup.com Lagos/Abuja/Nairobi/Accra tech groups, Nairaland/Techpoint Africa and TechCabal event listings, DevFest / GDG Africa, Google and AWS community pages, Nigeria Startup Week style aggregators.
- Remote-work and global-but-open-to-Africa: online summits and webinars on AI, data and remote work.

Rules baked into the scraper:
- Only keep events with a title, date, and a working external URL.
- Drop anything already past its end date; auto-expire stale rows.
- Deduplicate on the external URL and on title+date.
- Never invent dates, prices or venues — unknown fields stay empty.
- If a source fails, the run continues and reports it (graceful degradation, HTTP 200), matching the jobs scraper.

Volume stays deliberately moderate — a curated 40 to 80 live events, not thousands of low-quality rows, so every page earns its place.

## SEO work

- Per-event `Event` JSON-LD with `startDate`, `endDate`, `eventAttendanceMode`, `eventStatus`, `location` (Place with full address, or VirtualLocation), `organizer`, `offers` and `image` — the schema Google needs for event rich results.
- `/events` gets `CollectionPage` plus `ItemList` schema, `BreadcrumbList` on both levels, and rewritten metadata targeting event-intent keywords instead of the current Nnewi-only description.
- A real content block on `/events` written for search: what tech events happen in Nigeria, how to choose one, what to expect at a hackathon versus a conference, plus an FAQ with `FAQPage` schema.
- Internal linking: events ↔ locations ↔ departments ↔ blog, so the new pages inherit authority.
- All event URLs added to `sitemap.xml` and `llms.txt`, generated from the database so new events appear automatically.
- Existing stale schema on the page (the old "Digital Village, NBTI Zonal Office" location) gets corrected to the current Technology Incubation Centre wording.

## Technical details

- **Table `events`**: `id`, `slug`, `title`, `description`, `category`, `format`, `organizer`, `venue_name`, `address`, `city`, `state`, `country`, `lat/lng` (nullable), `starts_at`, `ends_at`, `timezone`, `is_free`, `price_text`, `currency`, `source_platform`, `source_url` (unique), `image_url`, `tags[]`, `is_featured`, `is_expired`, `last_seen_at`. Public `SELECT` for `anon` and `authenticated`, writes restricted to `service_role`, with explicit GRANTs.
- **`supabase/functions/scrape-events`**: Firecrawl v2 JSON extraction per source, `Promise.allSettled` across sources, normalisation and relevance filtering, upsert on `source_url`, expiry sweep for past events.
- **Cron**: weekly schedule (Mondays), same pattern as `weekly-scrape-jobs`, plus a manual re-run button for admins.
- **Frontend**: `src/lib/events.ts` (fetch + schema helpers), `src/pages/Events.tsx` rewritten, `src/pages/EventDetail.tsx` new, `src/components/events/EventCard.tsx`, `UpcomingEvents.tsx` for the homepage, route `/events/:slug` registered in `App.tsx`.
- Our own events live as `is_featured` rows seeded by migration, so they render through the same UI and get the same schema.

## Out of scope for this pass

Ticketing or registration inside our site (we always link out), paid event submissions, and per-city event landing pages — all easy follow-ups once the directory is live.
