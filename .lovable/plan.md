# Rework Blog Categories for SEO + Add One Post Per Category

## Goals

1. Replace the current 6 weak category labels with 7 SEO-strong, search-intent-matched categories.
2. Make every category page **its own indexable URL** (`/blog/category/<slug>`) with proper `<title>`, meta description, canonical, OG tags, and `CollectionPage` + `ItemList` JSON-LD — so Google can rank the category page when people search the keyword.
3. Re-tag all 18 existing posts onto the new categories (no posts lost, only `tags[0]` swapped).
4. Add **one new blog post per new category (7 total)**, each SEO-optimized.

## Proposed new categories

Picked for real Nigerian + global tech search volume; each maps to a category-keyword users actually type:

| New category | Target search intent | URL |
|---|---|---|
| Artificial Intelligence | "AI Nigeria", "AI tools", "machine learning Nigeria" | `/blog/category/artificial-intelligence` |
| Web & Software Development | "learn web development Nigeria", "software developer Nigeria" | `/blog/category/web-software-development` |
| Data & Analytics | "data analytics Nigeria", "data science career" | `/blog/category/data-analytics` |
| Cybersecurity | "cybersecurity Nigeria", "cyber security jobs" | `/blog/category/cybersecurity` |
| Tech Careers | "tech jobs Nigeria", "how to start tech career" | `/blog/category/tech-careers` |
| SIWES & Internships | "SIWES Nigeria", "IT placement", "internship tech" | `/blog/category/siwes-internships` |
| Startups & Business | "tech startup Nigeria", "digital transformation SME" | `/blog/category/startups-business` |

These replace: *AI & Innovation, Business & Entrepreneurship, Career Guide, IT/SIWES, Course Deep-Dive, Python & Nigerian Tech*.

## Re-tagging existing 18 posts

Only the **first tag** (`tags[0]`, the category) is swapped. The remaining long-tail SEO tags are kept exactly as they are — no slug, title, content, or date changes.

| Existing post | New `tags[0]` |
|---|---|
| ai-and-computer-vision-transforming-entrepreneurs-nigeria-2026 | Artificial Intelligence |
| why-nigerian-business-need-ai-innovation-2026 | Artificial Intelligence |
| why-nigerian-entrepreneurs-need-ai-implementation-2026 | Artificial Intelligence |
| ai-computing-designing-2026 | Artificial Intelligence |
| dear-claires-love-ecosystem-building-connection-2026 | Artificial Intelligence |
| web-development-vs-mobile-development-which-path | Web & Software Development |
| python-nigerian-tech-ecosystem-2026 | Web & Software Development |
| data-analytics-bootcamp-what-youll-learn-16-weeks | Data & Analytics |
| how-to-start-tech-career-nigeria-2026 | Tech Careers |
| tut-5-in-design-tech-bootcamps-yabatech-2026 | Tech Careers |
| building-future-tech-faculty-yabatech-partnership-2026 | Tech Careers |
| everything-you-need-to-know-about-siwes-nigeria | SIWES & Internships |
| how-to-get-the-most-out-of-your-it-placement | SIWES & Internships |
| what-is-sves-nigeria-business-elite-explained | Startups & Business |
| why-tech-faculty-ng-helps-entrepreneurs | Startups & Business |
| tech-faculty-ng-elite-entrepreneurs | Startups & Business |
| skills-gap-nigerian-businesses-tech-training | Startups & Business |
| nigerian-business-digitization-roadmap-2026 | Startups & Business |

Coverage check: every new category has ≥1 existing post except **Cybersecurity** (which the new post fills).

## 7 new blog posts (one per category)

Slugs verified against the 18 existing slugs — no collisions.

| Category | Title | Slug |
|---|---|---|
| Artificial Intelligence | Generative AI for Nigerian SMEs: A Practical Playbook for 2026 | `generative-ai-nigerian-smes-playbook-2026` |
| Web & Software Development | Full-Stack Web Development in Nigeria: Roadmap from Zero to Hired | `full-stack-web-development-nigeria-roadmap-2026` |
| Data & Analytics | Power BI vs Tableau vs Looker: Which Should Nigerian Analysts Learn First? | `power-bi-vs-tableau-vs-looker-nigerian-analysts-2026` |
| Cybersecurity | Cyber Security Bootcamp Nigeria: What You'll Learn in 16 Weeks | `cyber-security-bootcamp-nigeria-16-weeks` |
| Tech Careers | Tech Salaries in Nigeria 2026: Junior, Mid, and Senior Pay Benchmarks | `tech-salaries-nigeria-2026-junior-mid-senior` |
| SIWES & Internships | SIWES Logbook Mistakes That Cost You Marks (And How to Fix Them) | `siwes-logbook-mistakes-nigeria-fix` |
| Startups & Business | How Nigerian Startups Can Win Government & Enterprise Contracts in 2026 | `nigerian-startups-win-government-enterprise-contracts-2026` |

Each post: ~900–1,400 words, H1 + scannable H2/H3, FAQ-style subheads (good for AI/Google AIO), `description` 150–160 chars, `tags[0]` = exact new category string + 4 long-tail keywords, recent April 2026 date, author Bill Achusim, compliant with `mem://brand/company-statistics` (5,000+ only), `mem://seo/geo-eeat-strategy`, and `mem://site/blog-content-strategy`.

## Category landing pages (the real SEO unlock)

New route: `/blog/category/:slug` rendered by a new `src/pages/BlogCategory.tsx`.

Each category page ships:

- `<h1>` = "{Category Name} Articles & Guides – Tech Faculty NG"
- Per-category `<title>` and `description` tuned to its search keyword (e.g. *"Artificial Intelligence in Nigeria — Tech Faculty NG Blog"*).
- Self-referencing `canonical` + `og:url` per `head-meta` rules.
- `BreadcrumbList` JSON-LD (Home → Blog → Category).
- `CollectionPage` + `ItemList` JSON-LD listing every post in that category — explicit signal to Google/AI search that this URL aggregates the topic.
- Intro paragraph (~80 words) describing the topic in natural language (helps both classic SEO and AI-search retrieval).
- Grid of posts in the category.

A small `src/data/blogCategories.ts` exports the 7 categories with `slug`, `name`, `title`, `description`, `intro`, and `keywords` — single source of truth used by `Blog.tsx`, `BlogCategory.tsx`, and the sitemap.

`Blog.tsx` updates:
- Categories sourced from `blogCategories.ts` (deterministic order, not alphabetical).
- Category badges become `<Link>`s to `/blog/category/<slug>` (still keeps the in-page filter UX as a fallback).

`BlogPost.tsx` updates:
- Category badge on a post links to its category page.

## Sitemap updates

`public/sitemap.xml` (hand-edited, per project convention):
- Add 7 new `/blog/category/<slug>` URLs.
- Add the 7 new `/blog/<slug>` post URLs.
- Existing entries untouched.

## Files changed

- `src/data/blogCategories.ts` — **new** (single source of truth for the 7 categories).
- `src/data/blogPosts.ts` — re-tag `tags[0]` on the 18 existing posts; append 7 new post objects.
- `src/pages/BlogCategory.tsx` — **new** (category landing page with Helmet + JSON-LD).
- `src/App.tsx` — register `/blog/category/:slug` route.
- `src/pages/Blog.tsx` — category list sourced from `blogCategories.ts`; badges link to category pages.
- `src/pages/BlogPost.tsx` — category badge links to its category page.
- `public/sitemap.xml` — add 14 new entries (7 category pages + 7 new posts).

No DB changes, no edits to existing post slugs/content/dates, no removal of any post or tag beyond the first-tag swap, no other routes touched.
