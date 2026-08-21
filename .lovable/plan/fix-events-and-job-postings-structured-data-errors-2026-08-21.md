# Fix Events and Job Postings structured data errors

Search Console is reporting invalid rich-result markup on the site. Verified cause: 9 of the 17 live events in the database have no start date stored (only free-text dates), so their `Event` markup ships without `startDate`. Scraped job markup only includes city and country in the address, so region, street and postal code are missing.

## What gets fixed

### Events
- Only publish `Event` markup for events that have a real start date. If a date can be recovered from the event's free-text date, use it; if nothing usable exists, that event is left out of the structured data (it still shows on the page) so Google never sees an invalid Event again.
- Add the recommended fields Google listed: end date (falls back to start + 3 hours), a `performer` (the organiser, as a performing organisation), the organiser's website URL, and ticket `offers` with an explicit price, currency and `validFrom` date.
- Free events get `price: "0"`; paid events with no known price use the organiser page for offers and a stated price only when we actually have one.

### Job postings
- Extend the scraped-job markup so `jobLocation.address` always carries `streetAddress`, `addressRegion`, `postalCode` and country. Remote/global roles use the Tech Faculty HQ address (Technology Incubation Center, Nnewi, Anambra) together with the existing `TELECOMMUTE` + applicant-location signals, which is Google's recommended pattern for remote roles.
- Locally-known cities map to their state and postal code; anything unknown falls back to the HQ values so no field is ever empty.

## Technical notes

- `src/lib/events.ts`: add a date-recovery helper for `date_text`, an `eventSchema` that returns `null` when no start date can be established, and the extra fields (`endDate`, `performer`, `organizer.url`, `offers.price/priceCurrency/validFrom`).
- `src/pages/Events.tsx`, `src/pages/EventDetail.tsx`: filter out null schemas before emitting `ItemList` / page-level JSON-LD; the detail page skips the Event block when no date is known (breadcrumbs and meta stay).
- `src/lib/jobs.ts`: add a city→region/postcode lookup plus HQ fallback used by `jobPostingSchema`.
- No database or scraper changes, and no visible UI changes.

## After the fix

Publish, then request validation for the Events and Job Postings reports in Search Console; Google re-crawls and clears the issues over the following days.
