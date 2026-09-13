# Careers as the Tech Faculty Talent Marketplace

Make `/careers` the main public entry for Tech Faculty’s own talent pipeline. The page will serve both people seeking work and businesses seeking talent, while external work platforms become a small, clearly separate resource at the bottom.

## Careers page

- Replace the current remote-jobs headline with Tech Faculty Talent positioning: one profile, real roles and projects across Nigeria and Africa.
- Lead with two clear paths:
  - **Join as talent** → profile creation/sign-in flow.
  - **Hire talent** → the existing business brief form.
- Show the profile → reviewed match → application process near the top.
- Make the searchable openings list the main content, using only published roles in the Tech Faculty talent system.
- Search across role title, company, skills, description and location; retain useful role type and workplace filters.
- Label the section simply **Open roles**. Each card’s company name communicates whether Tech Faculty or another business is hiring.
- Keep the existing role detail and one-click profile application flow.
- Add an empty-search state that encourages talent to complete a profile for future matching.

## Remove outdated opportunity sections

- Remove the existing weekly scraped “Live opportunities” feed from the main Careers experience.
- Remove the hardcoded “Partner roles for our graduates,” its application dialog, and all claims about hiring partnerships.
- Remove SEO copy and structured data describing Careers as a partner or scraped AI-jobs board.
- Do not republish former partner-company roles as current openings without a current hiring brief. The already-published Tech Faculty and client roles remain; future businesses enter through `/hire` and staff publish approved openings.

## External work platforms

- Add a compact **External work platforms** section at the bottom of Careers for Micro1, Ask Ethos and Atlas Capture.
- Each small card explains that it is an independent platform, includes the existing referral signup button, and links to a dedicated platform page.
- Add `/careers/platforms/:slug` pages that show only scraped external listings belonging to that platform, with search/filtering and the existing two-step signup/apply flow.
- Clearly state that these are third-party opportunities and not Tech Faculty roles or hiring partnerships.
- Give each page its own canonical metadata while avoiding unsupported partnership language.

## Existing talent pages

- Keep `/talent` as the focused “join as talent” introduction.
- Keep `/talent/profile`, `/talent/dashboard`, and `/talent/roles/:slug` for profiles, matches, applications and role details.
- Update `/talent` wording to remove “partner openings” and links suggesting Careers is an external jobs board.
- Keep `/hire` as the business entry point and `/admin/talent` as the staff management area.

## Supporting updates

- Update homepage Careers messaging and links where they still describe a weekly external jobs board.
- Update navigation/footer wording only where needed so Careers, Join as Talent and Hire Talent have distinct purposes.
- Update sitemap and public AI-readable site information for the new platform pages and Careers positioning.
- Preserve the existing database, matching engine, role administration and external jobs data; this reorganization does not require a schema change.

## Verification

- Verify Careers search, filters, talent/hire links and published-role cards on desktop and mobile.
- Verify each external platform page only shows its own jobs and that referral/application links open correctly.
- Confirm removed partnership claims no longer appear in public Careers/Talent content.
- Validate metadata, structured data, sitemap entries, accessibility and browser console output.
