## Goal

Replace the "Nnewi, Anambra State" positioning in the search snippet with a nationwide + global message, so Google (and social previews) present Tech Faculty NG as a Nigerian institute serving learners across Nigeria and worldwide.

## Chosen snippet

> Get trained, certified, and employed in software, AI, data, and cybersecurity. Licensed Nigerian tech institute with nationwide in-person bootcamps and online programs worldwide.

(185 chars — Google will trim after ~160 but the important keywords lead.)

## Changes to `index.html`

Three tags reference the old location-specific copy. All three get updated so Google, social crawlers, and AI-search agents see one consistent message.

1. **`<meta name="description">`** — replace with the chosen snippet above.
2. **`<meta property="og:description">`** — mirror the same snippet (this is what LinkedIn / Slack / Facebook / WhatsApp show).
3. **JSON-LD `description`** (inside the Organization schema block) — swap to a slightly longer version that keeps the schema informative:
   > "Tech Faculty NG is a licensed Nigerian technology training institute delivering nationwide in-person bootcamps and online programs worldwide in Software Engineering, Data Science, Cybersecurity, AI, and more. We train, certify, and place graduates into tech careers."

No other files change. Title, og:title, og:image, canonical, and og:url stay as-is.

## After deploy

- Google typically re-crawls within a few days to a couple of weeks — the new snippet appears on its own schedule.
- Social previews (LinkedIn, WhatsApp, etc.) cache aggressively; I'll flag that you can force a refresh via each platform's link-preview debugger if you want them updated immediately.
