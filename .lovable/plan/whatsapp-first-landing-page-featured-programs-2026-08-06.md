# WhatsApp-First Landing Page + Featured Programs

## Goal
Make joining the WhatsApp community the primary action on the landing page, and surface three flagship offerings (SIWES, AI for Everything, Nnewi Tech Meetup) in a new "Featured Programs" section right under the stats bar.

## 1. Hero: dual CTA
- Keep "Tech Up Now" (scrolls to Get Started / signup) as the secondary button.
- Add a new primary CTA: **"Join Our WhatsApp Community"** linking to the main community group (`https://chat.whatsapp.com/D8kuxWVZRTKKeAx6ERjSqc`), opens in a new tab, WhatsApp icon, gradient styling so it reads as the dominant action.
- Add a small trust line under the buttons, e.g. "Free to join — get program updates, events and job alerts first".

## 2. New "Featured Programs" section
Placed on the homepage directly after the stats bar (5,000+ / 87%) and before How It Works.

Three cards, each with a cover image, title, short description, a meta badge ("Hot", "Monthly", "Cohort forming"), and one CTA:

| Card | Description focus | CTA |
|---|---|---|
| SIWES / Industrial Training | IT placements for university students — Learn & Pay or Tutor & Earn tracks. Listed first, badged "Hot". | "Explore SIWES" -> `/siwes` |
| AI for Everything | AI Agents & Data Training Fellowship — use AI agents for real tasks, train AI/robotics models, certificate on completion. | "Join the AI Fellowship" -> `https://chat.whatsapp.com/FWxf8PpzZcDG9czk455VI6` (new tab) |
| Nnewi Tech Meetup | Monthly community meetup — demos, lightning talks, networking at Tech Faculty HQ. | "See Event Details" -> `/events#nnewi-tech-meetup` |

Cover images: use the two artworks you just uploaded (AI for Everything banner, Nnewi Tech Meetup poster) as card covers via Lovable Assets; generate a matching SIWES cover in the same green/white brand style.

Built from a data array inside the component so new featured programs can be added later by appending one object.

## 3. Events page tie-in
- Rename the existing "Tech Faculty Community Meetup" entry to **Nnewi Tech Meetup**, give its card an `id="nnewi-tech-meetup"` anchor, and add a WhatsApp CTA on that card ("Reserve my seat") pre-filled with a message asking to be added to the next meetup.

## 4. Consistency
- Header and footer untouched.
- New section gets a proper `h2` ("Featured Programs"); existing homepage metadata and JSON-LD stay as they are.

## Technical notes
- New component `src/components/FeaturedPrograms.tsx`, rendered in `src/pages/Index.tsx` between `<StatsBar />` and `<HowItWorks />`.
- Hero CTA change in `src/components/Hero.tsx`; WhatsApp link as an `<a>` inside `Button asChild` with `target="_blank" rel="noopener noreferrer"`.
- Uploaded images registered as CDN asset pointers in `src/assets/` (no binaries committed); SIWES cover generated.
- Colors via existing semantic tokens / brand gradient — no hardcoded hex.
- Events change is presentational only, in `src/pages/Events.tsx`.

## Assumptions (say the word to change)
- SIWES card first since it currently drives the most search traffic.
- Meetup card links to the events page anchor rather than straight to WhatsApp, per your description.