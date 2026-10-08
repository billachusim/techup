# Roadmap

## Hub of hubs (complete)
- [x] `src/data/techHubs.ts` — editorial hubs directory data
- [x] `/hubs` searchable directory page
- [x] `/hubs/:slug` per-hub SEO pages with WhatsApp apply CTA
- [x] Routes + footer link
- [x] Blog post A — Nigeria hubs by city
- [x] Blog post B — Africa hubs by country
- [x] sitemap.xml + llms.txt entries
- [x] Build + render verification

## Notes
- No fabricated partnership claims: directory is editorial/advisory.

## Nigerian city tech guides
- [x] Publish one distinct local tech-scene guide for each of the 14 Nigerian cities in the hubs directory
- [x] Link every guide to its local hub pages, relevant training routes, and a city-specific WhatsApp enquiry
- [x] Add all city guide URLs to the static sitemap
- [x] Verify article rendering, metadata, internal links, and WhatsApp messages

## Navigation cleanup
- [x] Group desktop navigation into Programmes, Explore, and Resources
- [x] Make Locations one direct menu link
- [x] Organize the mobile menu into clear labelled sections
- [x] Verify desktop and mobile navigation

## Talent marketplace
- [x] Database: talent_profiles, talent_roles, role_matches, talent_applications, business_briefs, user_roles + is_staff
- [x] Private talent-cvs storage bucket with per-user access
- [x] /talent landing, profile builder, dashboard, role detail with 1-click apply
- [x] /hire business brief form
- [x] /admin/talent staff area (roles, talent vetting, match approval, applications, briefs)
- [x] match-talent edge function (keyword pre-rank + Gemini scoring, admin approval required)
- [x] Careers page openings block + talent/hire CTAs, sitemap and footer entries
- [x] Google Form CSV import on /admin/talent (preview, duplicate check by email/phone, imports hidden until reviewed)
- [ ] Seed early talents from the Google Form export (import tool ready; run it once the CSV is downloaded)

## Careers marketplace consolidation
- [x] Make Tech Faculty Talent the main `/careers` experience
- [x] Search and filter published talent roles
- [x] Remove expired partner-role claims and scraped-job feed from Careers
- [x] Add dedicated Micro1, Ask Ethos and Atlas Capture listing pages
- [x] Update homepage, Talent copy, sitemap and public site description
- [x] Verify desktop, mobile, metadata and external application flows

## Mobile header & overflow polish
- [x] Show the Tech Faculty wordmark and "Train, Certify and Employ" tagline on mobile (was logo-only)
- [x] Verify both lines render at 320, 360 and 390 px widths
- [x] Stop the homepage dragging sideways on phones (long department name forced the list wider than the screen)
- [x] Confirm no page overflows horizontally at 390 px

## Hiring requests, stage emails & Slack automation
- [x] Hiring request form on /careers (business brief + instant confirmation email)
- [x] Confirmation + staff alert emails for introduction requests; approval email when an intro is approved
- [x] Talent email at every stage: profile submitted, application received, matched/selected/assessment/interview/hired, work log reviewed, profile approved
- [x] Slack: matched talent auto-added to #general; talent selected for a project auto-added to that project's Slack channel
- [x] Admin Slack channel picker per project + manual "Slack access" button
- [x] "Send test email" button on /admin/talent shows whether delivery works and the provider's error if not
- [x] alerts.techfaculty.ng verified; transactional emails are delivering

## Student onboarding automation (Slack + email)
- [x] Programmes renamed AI-first (AI for Full-Stack Web Development, AI for Data Analytics & BI, AI & Autonomous Agents Engineering, etc.); departments unchanged
- [x] Rolling Slack cohort channels per programme (#course-ai-web-dev, #course-general-tech, ...) created by the bot when missing
- [x] Enrolment auto-adds the student to #general and their course channel, posts a welcome, and sends the student welcome email (Faculty ID, programme, channel, dashboard)
- [x] Dashboard: "Your class group" card (connect/re-check) + weekly work submission with status, score and tutor feedback; submissions post to the course channel
- [x] Slack one-click invite link wired into welcome email and dashboard
- [x] Admin review page at /admin/students (score, feedback, email + Slack notice, running average)
- [x] Once-per-class Slack briefing + "next class ready" email from the dashboard
