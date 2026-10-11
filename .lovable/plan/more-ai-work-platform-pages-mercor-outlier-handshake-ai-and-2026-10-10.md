# More AI work platform pages (Mercor, Outlier, Handshake AI and others)

## What we found
- Search Console shows strong impressions for "micro1 jobs" (1,216), "outlier ai jobs" (1,564), "outlier jobs" (249) and "handshake ai jobs" (791).
- Only Micro1, Ask Ethos and Atlas Capture have their own platform page today. Outlier, Handshake AI and Mercor do not.
- Outlier and Handshake impressions come from old single-job pages that have now expired. That traffic will fade unless each platform gets a permanent page.
- The weekly job scraper already collects Mercor, Outlier, Handshake AI, Alignerr, Toloka and Turing. None of them has live listings right now.

## What we'll build
1. Add six platforms to the "External work platforms" section on /careers: Mercor, Outlier, Handshake AI, Alignerr, Toloka and Turing.
2. Give each one its own page at /careers/platforms/{name}, built the same way as the Micro1 page:
   - A title aimed at the searches people make, for example "Outlier AI Jobs for African Talent".
   - A short write-up of the kind of work offered, how pay works, and who it suits.
   - A "Create an account" button.
   - Any live listings from our weekly scrape. When there are none, the page shows a note that new roles appear weekly, so it never looks empty or broken.
3. Use each platform's official sign-up page for now. Your referral links can replace them later with a one-line change.
4. Add a short FAQ to each platform page, such as "Is Outlier legit?", "How much does Outlier pay?" and "Can Nigerians apply?". This helps the pages rank for related searches.
5. Add all the new pages to the sitemap so Google finds them quickly.

## Technical details
- Add entries to `src/data/jobPlatforms.ts` with slug, name, matching scraper names (for example "Handshake AI"), the official sign-up URL, a description and FAQ items.
- `ExternalPlatformJobs.tsx` renders the FAQ, plus FAQPage structured data. When a platform has no live jobs, the page stays indexable and shows the description and FAQ.
- Improve route metadata in `careers.platforms.$platformSlug.tsx` with keyword-led titles and descriptions.
- Add the platform URLs to `scripts/generate-sitemap.ts` and `public/sitemap.xml`.
- No database changes.
