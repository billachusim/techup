# Modernise the "From Learner to Earner" section

## What changes
1. **Clickable step cards (no new buttons)**
   - Get Trained → courses and pricing area on the homepage (smooth scroll to the pricing/course selection section)
   - Get Certified → certificate verification portal (/verify)
   - Get Employed → jobs and talent marketplace (/careers)
   - Each whole card is the link. Hints that it's clickable: a step number ("01 / 02 / 03"), a small arrow in the corner that slides on hover, the card lifts with a glowing border, and a short "Explore courses →" style line inside the card text (part of the card, not a button).

2. **Modern look**
   - Cards connected by a thin progress line (step 1 → 2 → 3) on desktop, stacked on mobile.
   - Icon tiles with a soft gradient, rounded corners and subtle depth; colours stay on the site's existing theme.
   - Headline "From Learner to Earner; 3 Steps in 3 Months." kept as is.

3. **Shorter intro text** (replaces the long paragraph):
   "Over 6,000 students trained. Learn, get certified, and start earning from month 3."
   ("6,000 students" still links to the outcomes page.)

4. **New button title** (replaces "Get Started Today"), still scrolling to the same sign-up area. Proposed:
   **"Start my 3-month glow-up"**
   Alternatives: "Claim my seat", "I'm ready to earn", "Show me my first step".

## Technical details
- Edit only `src/components/HowItWorks.tsx`; cards use `Link` for /verify and /careers, scroll to `#pricing` for Get Trained (fallback to `/#pricing` when off homepage).
- Replace hardcoded hsl colours with existing theme tokens; add accessible labels to each card link.
