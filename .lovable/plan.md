## Add a Locations page + header entry with Google Maps campus locator

Government bodies will be written in full everywhere in copy, headings, alt text, and JSON-LD — no acronyms on first (or subsequent) mention. Specifically:

- **National Board for Technology Incubation** (never "NBTI")
- **Federal Ministry of Science, Technology and Innovation** (never "FMSTI" — and note the existing partnership is with this ministry, not the Federal Ministry of Education; I'll use the correct one)
- **Technology Incubation Centre, [City]** (never "TIC")

### 1. Header nav
Add "Locations" to `src/components/Header.tsx` (desktop nav + mobile Sheet), routing to `/locations`.

### 2. New route `/locations` → `src/pages/Locations.tsx`
Wire into `src/App.tsx` above the catch-all.

Page structure (site design system, Header/Footer, react-helmet-async):

1. **Hero / Intro** — "Nationwide, in every state that matters." Explains that through our partnership with the **National Board for Technology Incubation**, under the **Federal Ministry of Science, Technology and Innovation**, Tech Faculty operates physically inside Technology Incubation Centres across Nigeria — giving students in-person labs, mentors, and exam venues in their own city.
2. **Headquarters callout card** — Main Campus / Headquarters: **Nnewi Campus, Onitsha operations at Anene Close, Off Ezeiweka Road, Awada, Onitsha, Anambra State.**
3. **Campus locator** — search input + geopolitical-zone filter chips (South-East, South-South, South-West, North-Central, North-East, North-West) + results grid of campus cards (city, full address, "Get directions" link opening Google Maps).
4. **Interactive map** — Google Maps JavaScript API centred on Nigeria with a pin per campus; clicking a pin opens an InfoWindow with the address and a directions button. Clicking a card pans/zooms the map to that pin.
5. **Partnership strip** — reuse `CredibilityBanner` styling, expanded copy: how the partnership with the National Board for Technology Incubation makes physical, nationwide presence possible.

### 3. Campus data — `src/data/campuses.ts`
Typed array (no database — static marketing content). Each entry: `{ id, city, state, zone, name, address, isHeadquarters?, lat, lng }`.

Seed list:

- **Headquarters — Nnewi / Onitsha Operations:** Anene Close, Off Ezeiweka Road, Awada, Onitsha, Anambra State
- Technology Incubation Centre, Owerri — Imo State
- Technology Incubation Centre, Aba — Abia State
- Technology Incubation Centre, Enugu — Enugu State
- Technology Incubation Centre, Abakaliki — Ebonyi State
- Technology Incubation Centre, Abuja — 10 Zambezi Crescent, WAEC Building Complex, Maitama, Federal Capital Territory
- Plus additional major-city centres: Lagos, Ibadan, Port Harcourt, Benin City, Kaduna, Kano, Jos, Bauchi, Makurdi, Uyo, Calabar, Sokoto, Ilorin, Akure

For each non-headquarters centre we'll use "Technology Incubation Centre, <City>, <State>, Nigeria" as the human-readable line where an exact street isn't publicly listed, and hard-code lat/lng resolved once via the Google Maps connector's Geocoding API (server-side, through the gateway) so the page has no runtime geocoding cost.

### 4. Google Maps integration
- Use the existing **Google Maps Platform connector** (managed).
- Load Maps JS in the browser with the referrer-restricted browser key `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`, `loading=async`, `callback=initMap`, tracking-ID channel param.
- Classic `google.maps.Marker` (no `mapId`, no AdvancedMarkerElement).
- Geocoding for seeding coordinates goes through the connector gateway `/maps/api/geocode/json` — not the browser.
- If the connector isn't linked, the list/filter/directions still work without the JS map.

### 5. SEO
- `<title>` "Tech Faculty Campuses in Nigeria — Find a Campus Near You"
- `<meta name="description">` ~155 chars, mentioning nationwide Technology Incubation Centre presence via the National Board for Technology Incubation.
- JSON-LD `ItemList` of `EducationalOrganization` entries with `address` (`PostalAddress`) and `geo` per campus.
- Canonical `/locations`.
- Add `/locations` line to `public/llms.txt`.

### Technical notes
- No database, no RLS, no edge functions.
- Files added: `src/pages/Locations.tsx`, `src/data/campuses.ts`, `src/components/locations/CampusMap.tsx`, `src/components/locations/CampusCard.tsx`, `src/components/locations/CampusFilters.tsx`.
- Files edited: `src/components/Header.tsx`, `src/App.tsx`, `public/llms.txt`.
- Uses existing design tokens; no hardcoded colors.

### Open items to confirm
1. OK to use the existing managed Google Maps Platform connection?
2. Show the map on mobile too, or list-only on mobile with map on tablet/desktop?
3. Any cities on the seed list to drop, or extras to add?
