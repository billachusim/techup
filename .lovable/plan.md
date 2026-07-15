# Add one high-ranking SEO blog per category

Add **8 new blog posts** to `src/data/blogPosts.ts` — one for each of the 8 categories in `src/data/blogCategories.ts`. Each post targets a high-search-volume, Nigeria-specific long-tail keyword and follows the existing `BlogPost` schema (`slug`, `title`, `description`, `content`, `date`, `author`, `tags`, `readTime`).

## Planned posts (one per category)

| # | Category | Target keyword | Working title |
|---|---|---|---|
| 1 | Artificial Intelligence | "how to learn AI in Nigeria" | How to Learn AI in Nigeria (2026 Roadmap): From Zero to Job-Ready |
| 2 | Web & Software Development | "React developer salary Nigeria" | React Developer Salary in Nigeria 2026: Junior to Senior Benchmarks |
| 3 | Data & Analytics | "Power BI vs Tableau Nigeria" | Power BI vs Tableau in Nigeria 2026: Which One Gets You Hired Faster? |
| 4 | Cybersecurity | "cybersecurity salary Nigeria" | Cybersecurity Salary in Nigeria 2026: SOC, Pentest & GRC Pay Bands |
| 5 | Tech Careers | "how to get a remote tech job from Nigeria" | How to Get a Remote Tech Job from Nigeria in 2026 (Step-by-Step) |
| 6 | SIWES & Internships | "SIWES allowance 2026" | SIWES Allowance in Nigeria 2026: ITF Rates, Payment Timeline & Top-Ups |
| 7 | Startups & Business | "how to hire developers in Nigeria" | How to Hire Developers in Nigeria (2026): Rates, Vetting & Retention |
| 8 | Tech Training for Teens | "coding classes for teenagers in Nnewi" | Coding Classes for Teenagers in Nnewi & Awada (2026 Holiday Bootcamp) |

## Content rules per post

- **Length**: 900–1,400 words of real, non-fluff markdown (matches existing post depth).
- **Structure**: H1 → byline → intro → 4–7 H2 sections → clear CTA to the relevant Tech Faculty program.
- **SEO**:
  - `title` ≤ 60 chars where possible, contains the primary keyword.
  - `description` 150–160 chars, keyword + benefit + Nigeria context.
  - `tags[0]` MUST equal the category `name` exactly (required by `getCategoryByName`).
  - `tags[1..4]` = 3–4 long-tail supporting keywords.
- **E-E-A-T**: concrete Nigerian numbers (₦ salary bands, city names, ITF/NDPR references) — no generic global filler.
- **Date**: staggered recent 2026 dates so they sort naturally at the top of `/blog`.
- **Author**: `Bill Achusim` (matches existing voice).
- **Read time**: computed roughly at ~200 wpm.

## Files touched

- `src/data/blogPosts.ts` — append 8 new post objects at the top of the array (newest-first ordering is handled by `getAllBlogPosts` sort, but placing them first keeps the source readable).

No other files change. Category pages, `/blog`, JSON-LD schema, sitemap generation, and the MCP `list_blog_posts` / `get_blog_post` tools all pick these up automatically because they read from `blogPosts` + `blogCategories`.

## Out of scope

- No new categories.
- No image assets (existing posts are text-only).
- No changes to routing, SEO components, or the MCP server.
