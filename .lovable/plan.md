# Leaner job check: twice a month, software roles open to Africans

## Recommendation
Run the job check **twice a month (1st and 15th)** instead of weekly. That cuts scraper credits by about half. Platform jobs usually stay open 2-6 weeks, so pages still look fresh, which matters for your Micro1/Outlier search traffic. Running it once a month would save more, but listings would often be stale or closed by the time people click.

## Changes
1. **Schedule:** move from every Monday to 05:00 UTC on the 1st and 15th of each month.
2. **Software and tech roles only:** keep software engineering, data, AI/ML, DevOps/cloud, QA, cybersecurity and mobile roles. Drop sales, generic writing, non-tech tutoring and similar. AI-training roles that need coding (for example "Python expert" or "coding evaluator") stay, so the Mercor and Outlier pages don't go empty.
3. **Open to Africans only:** keep a role only if it is open worldwide, open to Africa, or open to Nigeria or another African country. Drop roles limited to the US, UK, EU, India and so on. If a listing doesn't say where it's open, keep it only when it's fully remote.
4. **Smaller limits:** up to 6 roles per platform and about 50 in total per run, so each run costs less.
5. **Cleanup:** existing jobs that don't meet the new rules are marked expired, so they leave the pages straight away.
6. **Expiry window:** a job comes down about 3 weeks after it disappears from the platform (up from 2), to match the new schedule.

## Technical details
- `supabase/functions/scrape-jobs/index.ts`: tighten the title filter (TECH_HINTS becomes an engineering-focused list plus an exclusion list), add an eligibility check to the extract prompt and normalize (a new `eligible_regions` field; Mercor uses eligibleLocation), set MAX_PER_PLATFORM to 6 and TARGET_TOTAL to 50.
- Cron: reschedule the job to `0 5 1,15 * *`.
- `archive_stale_listings`: change the last_seen threshold to 21 days.
- Run one SQL update to expire existing rows that fail the new filter, then trigger one run to refill.
