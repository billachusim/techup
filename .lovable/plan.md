# Locations SEO Overhaul — a ranking page for every campus

Turn the single `/locations` page into a full local-SEO cluster: 21 city pages, richer cards, and proper navigation between them all.

## What changes for visitors

**Locations page (`/locations`)**
- Each campus card gains real substance: city + state, zone badge, the programmes that run there, whether SIWES/IT placement is available, teen holiday bootcamp availability, and a short one-line description.
- Two clear actions per card: "Get directions" (as today) and "View campus page".
- Map, search and zone filters stay. Search extends to programme keywords.
- Added: zone sections, a "Browse all cities" A–Z link list (good for crawlers and users), and internal links to Departments and Careers.

**New page per campus (`/locations/nnewi`, `/locations/enugu`, `/locations/lagos`, …)**
Each of the 21 pages carries locally-worded, non-duplicated content:
- H1 like "Tech Faculty Enugu — Tech Training at the Technology Incubation Centre, Enugu"
- What we do in that city and how (in-person labs, hybrid, online), written per city rather than copy-pasted
- Courses and departments available there, linking to the department pages
- Free foundation bootcamp details
- SIWES and IT placement opportunities for students in that city and its nearby institutions
- Holiday tech bootcamps for kids and teens in that city
- Events and community meetups
- Address, directions button, embedded map centred on the campus
- 4 city-specific FAQs
- Breadcrumbs (Home / Locations / City) and links to nearby campuses in the same zone

## SEO attributes

- Per-page `<title>` (under 60 chars) and meta description (150–160 chars) via react-helmet-async, self-referencing canonical and og:url
- JSON-LD per campus page: `EducationalOrganization` with `PostalAddress` + `GeoCoordinates`, `BreadcrumbList`, `FAQPage`
- `/locations` keeps its `ItemList` schema, upgraded to link each item to its new page URL, plus `BreadcrumbList`
- All 22 URLs added to `public/sitemap.xml`, and the locations cluster added to `public/llms.txt`
- One H1 per page, semantic headings, descriptive link text

## Navigation

- Header "Locations" becomes a dropdown: "All campuses" plus the headquarters and the largest cities, with "View all" at the end
- Breadcrumbs on the locations page and every campus page
- Footer gains a short campus list (HQ + major cities) alongside the existing links
- Every campus page links to: other campuses in its zone, `/departments`, `/siwes`, `/events`, and the WhatsApp community CTA

## Technical notes

- `src/data/campuses.ts` extends the `Campus` interface with `slug`, `tagline`, `intro`, `programmes`, `siwes`, `teenBootcamp`, `nearbyInstitutions`, `metaTitle`, `metaDescription`, `keywords`, `faqs`. Existing `id`, coords and addresses are preserved; `slug` derives from the city so URLs stay clean (`/locations/port-harcourt`, `/locations/benin-city`, `/locations/abuja`).
- New `src/pages/LocationDetail.tsx` for `/locations/:slug`, following the pattern already used by the department pages (Helmet + JSON-LD + Header/Footer).
- Reuse `src/components/locations/CampusMap.tsx` in single-campus mode for the detail page.
- New route registered in `src/App.tsx`; unknown slugs redirect to `/locations`.
- `src/pages/Locations.tsx` card block rewritten; filtering logic reused.
- Content is written per city from what we can state truthfully (network membership, programmes offered, SIWES tracks, teen bootcamps). No invented enrolment numbers, testimonials, or dated claims for individual cities.

## Out of scope

- No changes to Google Maps keys or the map component's data source
- No backend or database changes
