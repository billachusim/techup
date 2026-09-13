# "Hub of Hubs" — Tech Hubs Directory + Two SEO Blog Posts

## Goal
Position Tech Faculty as the guide that connects Nigerians and Africans to tech training anywhere — not only at our own campuses. Two long-form blog posts plus a permanent, searchable hubs directory with a page per hub, every CTA funnelling to WhatsApp with a preloaded course + city + hub message.

## Important accuracy guardrail
We will **not** claim "partnership with 1,000+ tech hubs" — an unverifiable partnership claim risks Google trust penalties and pushback from the hubs named. Instead everything is framed as a curated editorial directory: real, publicly known hubs and the course areas they are known for, with Tech Faculty as the free advisory and placement desk that helps a student choose and enrol. Same conversion path, zero fabrication, stronger authority signal.

## 1. Hubs data layer
New `src/data/techHubs.ts` — single source of truth, same pattern as `campuses.ts`:
- Fields: `slug`, `name`, `city`, `state/region`, `country`, `type` (innovation hub, incubator, training institute, university hub, coworking + training), `courseAreas[]` (AI & machine learning, software engineering, data analytics, cybersecurity, design/UI-UX, digital marketing, cloud, robotics/IoT), `formats[]` (in-person, hybrid, online), `focus` one-liner, 2–3 sentence editorial `intro`, `website` where public.
- ~40 hubs across Nigerian cities (Lagos, Abuja, Enugu, Nsukka, Nnewi, Onitsha, Aba, Owerri, Port Harcourt, Ibadan, Kano, Kaduna, Uyo, Benin City, Jos) and African cities (Nairobi, Accra, Kigali, Cape Town, Johannesburg, Cairo, Kampala, Dar es Salaam, Dakar, Addis Ababa) — plus our own Technology Incubation Centre campuses cross-linked to `/locations/:slug`.

## 2. `/hubs` directory page
- Search box plus filters by country, city and course area (client-side, mirrors the `/locations` filter UX).
- Hub cards: name, city/country, type badge, course-area chips, "View hub" link and a direct WhatsApp CTA.
- SEO: H1, title <60 chars, meta description 150–160 chars, canonical, og tags, `ItemList` + `BreadcrumbList` JSON-LD.
- Explanatory intro on the "hub of hubs" mission: study near you, we advise and place.

## 3. `/hubs/:slug` per-hub pages
- Unique H1, title, meta description, canonical, og tags.
- Content: intro, course areas offered, formats, city context, how Tech Faculty helps (advisory, curriculum, certification, SIWES, remote-job routing), FAQ block, links to related hubs in the same city and to `/departments`, `/locations`, `/careers`, `/virtual-siwes`.
- JSON-LD: `EducationalOrganization` (or `Organization`) + `BreadcrumbList` + `FAQPage`.
- **Primary CTA:** WhatsApp `https://wa.me/2348068597140?text=...` with preloaded payload naming hub + city + selected course area, e.g. "Hello, I want to study Data Analytics in Enugu — I saw Genesys Tech Hub on your hubs directory. What are my options?" A small course-area selector on the page changes the payload before the tap.
- Where a public website exists it is linked with `rel="nofollow noopener"`; no claim of affiliation.

## 4. Blog post A — Nigeria edition (category: Tech Careers)
- Slug `best-tech-hubs-and-training-institutes-in-nigeria-by-city-2026`, ~1,600 words, dated 2026-09-13, author Bill Achusim.
- Intro on the mission (getting Nigerians into the AI future wherever they live) → how to choose a hub → city-by-city sections, each with a markdown table (hub, city, course areas, format) → FAQ (4 Q&As).
- Internal links to `/hubs`, `/departments`, `/locations`, `/virtual-siwes`, `/careers`; WhatsApp CTA with preloaded payload after each city block.

## 5. Blog post B — Africa edition (category: Tech Careers)
- Slug `top-tech-hubs-in-africa-where-to-learn-tech-2026`, ~1,400 words, same date/author.
- Country sections (Nigeria, Kenya, Ghana, Rwanda, South Africa, Egypt) with hub tables, plus studying online with Tech Faculty from any African country, FAQ, same CTA pattern.

## 6. Wiring and SEO
- Routes `/hubs` and `/hubs/:slug` in `src/App.tsx`.
- Footer link to the directory (no header/homepage layout changes).
- `public/sitemap.xml`: `/hubs`, every `/hubs/:slug`, both blog URLs. No `lastmod` values added (we have no authoritative per-page timestamps; existing entries carry none).
- `public/llms.txt`: directory plus hub pages described.
- Verify: build passes, `/hubs`, a sample hub page and both posts render with correct H1, head tags and working WhatsApp payloads.

## Not in this round
No backend tables, no scraping, no pricing or enrolment logic changes. Hub data stays static and editable in one file.
