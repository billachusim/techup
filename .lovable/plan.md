# Virtual SIWES + Logbook Waybill Service

Add a fully online industrial training option (Virtual IT) and a paid logbook review, filling, signing and stamping service handled by delivery ("waybill") to our Nnewi headquarters — both SEO-optimised, plus a new blog post targeting the pain point.

## What students will see

**New page: `/virtual-siwes`**

- Hero: "Virtual SIWES in Nigeria — Do Your IT Online, Logbook Signed and Waybilled Back to You"
- Who it's for: students whose school allows remote IT, students far from any of our 21 centres, students already working or in another city.
- Both tracks available virtually: **Learn & Pay** and **Tutor & Earn** — same curriculum, mentors and placement letter as on-site.
- **Virtual IT placement — ₦45,000**, paid before onboarding. Lists exactly what's included: acceptance/placement letter, weekly live sessions, mentor, real project work, attendance records, completion certificate.
- **Logbook & documents service — ₦15,000**, which covers: we arrange courier pickup of the logbook/ITF forms, review of entries, filling where needed, official signing and stamping, and the return delivery back to the student. Both legs of the waybill and our review are in the one price.
- Step-by-step "How it works" (apply → pay → onboarding → weekly work → logbook pickup near the end of IT → signed and stamped → waybilled back before your school deadline).
- Trust/compliance block: NBTI licence, ITF/SIWES form types accepted, HQ address (Technology Incubation Centre, Nnewi, Anambra State), turnaround expectation.
- FAQ (10+ questions) written for real searches: "can I do SIWES online in Nigeria", "who can sign my SIWES logbook", "how do I send my logbook for signing", "is virtual IT accepted by my school", "how long does signing take", "what if my school rejects remote IT".
- Two forms, both saving to the existing leads table and offering WhatsApp or email follow-up:
  1. **Reserve Virtual IT slot** — name, school, department, IT duration, start date, track (Learn & Pay / Tutor & Earn), contact.
  2. **Book logbook service** — name, school, pickup city/address, logbook type, deadline date, contact.
  On success: clear confirmation explaining that our team sends payment details on WhatsApp/email, payment is required before onboarding or pickup, and a "Continue on WhatsApp" button with the request pre-filled.

**Updated `/siwes` page**

- New "Can't attend in person? Do it virtually" section with the two prices and a link to `/virtual-siwes`.
- The logbook signing service also called out, since on-site students ask for it too.
- "How to Apply" gains a virtual route.

**Navigation and discovery**

- Header "Internships" menu and Footer get "Virtual SIWES".
- Homepage SIWES/featured card copy mentions the virtual option.
- Added to `public/sitemap.xml` and `public/llms.txt`.

## New blog post

Title direction: **"Virtual SIWES in Nigeria (2026): How to Do Your IT Online and Get Your Logbook Signed and Delivered"** — dated today, filed under the existing internships/SIWES category, no new categories.

Covers: whether remote IT is allowed and how to get school approval, what supervisors actually check, how logbook entries should be written (with sample weekly entries), the deadline trap of unsigned logbooks, how the waybill review-and-return process works, and the two fees. Internal links to `/virtual-siwes`, `/siwes` and the SIWES Success Kit. Article + FAQ + Breadcrumb structured data as with our other posts.

## SEO details

- `react-helmet-async` head on `/virtual-siwes`: title under 60 chars, description 150–160 chars, self-referencing canonical and og:url, og/twitter tags.
- JSON-LD: `Service` (with `offers` for both ₦45,000 and ₦15,000 in NGN), `FAQPage`, `BreadcrumbList`, and `Organization` reference for the HQ address.
- Single H1, semantic section headings, descriptive internal link text, keyword-grounded copy around "virtual SIWES", "online industrial training Nigeria", "SIWES logbook signing", "IT logbook stamp".

## Technical notes

- New `src/pages/VirtualSIWES.tsx`, route registered in `src/App.tsx`.
- Pricing and inclusions centralised in a small `src/data/virtualSiwes.ts` so figures are edited in one place.
- Reuses `LeadCaptureForm` / the `leads` table with a distinct `interest` value per form (`virtual-siwes`, `logbook-service`) so enquiries can be told apart; no schema change needed unless the extra fields (school, deadline, pickup city) need their own columns — those will be stored in the existing notes/details field.
- No live payment integration in this pass: reserve-then-confirm on WhatsApp/email, matching the plan you chose. Flutterwave card checkout can be layered on later.
- Blog post appended to `src/data/blogPosts.ts` with today's date; sitemap updated.
- Mobile layout checked in the preview after build.
