# AI Partner Platforms + Two-Step Apply Flow

Add an AI platform partner row at the top of the Careers page, and make every job application pass through one friendly "create your account" step before the listing opens.

## 1. Partner platforms row (top of /careers)

A new row of minimal cards sits above the live job feed, titled "Our AI work platform partners".

Launch set (links provided):
- Ask Ethos — https://agent.askethos.com/refer/copbdvcud51e
- Atlas Capture / Atlas Audit — https://audit.atlascapture.io/?ref_id=6a7e58a8de1a75582251a347
- Micro1 — https://refer.micro1.ai/referral/jobs?referralCode=5df297a6-4ec0-45fa-b144-1ace3ec277ef&utm_source=referral&utm_medium=share&utm_campaign=job_referral

Mercor and any others get added later — the list lives in one file so new platforms are a one-line addition.

Each card shows:
- Platform name and a one-line description of the kind of work it offers
- Primary button: "Get Started with {Platform}" — opens the signup link in a new tab
- Secondary link: "View live {Platform} roles" — filters the job board below to that platform

## 2. Two-step apply flow (both placements)

Applies to the live job feed and the job detail page.

```text
Step 1  Create your free {Platform} account   [Get Started with {Platform} →]
        (opens in a new tab; skip if you already have one)
Step 2  Open the job listing                  [Open job listing →]
```

- **Job detail page** — the apply box shows both steps stacked inline.
- **Job cards / partner row** — clicking "Apply" opens a small card with the same two steps, then the listing link.
- Wording stays neutral and helpful: "Create your free account with {Platform} to apply" — no mention of referrals.
- Step 2 is always available (never blocked), so nobody gets stuck if they already have an account.
- Jobs from platforms with no partner link (e.g. Jobberman) keep the current single "Apply on {Platform}" button.

## Technical notes

- New `src/data/jobPlatforms.ts`: one entry per platform with `name`, matching `source_platform` values, `signupUrl`, blurb. Single source of truth for the row and the apply steps.
- New `src/components/jobs/PlatformPartners.tsx` (row) and `src/components/jobs/ApplySteps.tsx` (shared two-step UI, used inline on the detail page and inside the dialog from cards).
- `src/pages/Careers.tsx`: render the partner row above filters; "View live roles" sets the existing platform filter state.
- `src/pages/JobDetail.tsx`: replace the single external button with `ApplySteps` when the job's platform has a partner link.
- All outbound links use `target="_blank" rel="noopener noreferrer nofollow"`.
- No schema/database changes; `JobPosting` structured data stays as is (`directApply: false`).
