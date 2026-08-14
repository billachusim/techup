# SEO Expansion: New Blog Posts + Department Landing Pages

## 1. Eight new blog posts (one per category), dated Aug 14, 2026

One new long-form, high-intent post per existing category — no new categories, no duplicated topics (existing slugs checked first):

| Category | New post angle (target keyword) |
|---|---|
| Artificial Intelligence | AI agents for Nigerian businesses — "AI automation for Nigerian business" |
| Web & Software Development | Build and ship an app with AI tools — "learn to build apps with AI Nigeria" |
| Data & Analytics | Power BI vs Excel vs Python for Nigerian analysts — "data analyst tools Nigeria" |
| Cybersecurity | AI-powered cyber threats & defence — "AI cybersecurity Nigeria" |
| Tech Careers | Remote AI jobs on Mercor, Micro1, Turing — "remote AI jobs for Nigerians" (links to /careers) |
| SIWES & Internships | SIWES in the AI era — "AI SIWES placement Nigeria" |
| Startups & Business | AI adoption playbook for Nigerian SMEs — "AI for small business Nigeria" |
| Tech Training for Teens | AI skills for teenagers — "AI classes for teenagers Nigeria" |

Each post: 1,200–1,800 words, clean markdown spacing, H2/H3 structure, FAQ block, internal links (departments, /careers, /locations, community CTA), `date: "2026-08-14"`, correct `tags[0]` category name, realistic `readTime`. All 8 slugs appended to `public/sitemap.xml`.

## 2. Department revamp (homepage + new pages)

**Homepage accordion becomes compact:**
- Smaller cards: icon + department name + one-line keyword-rich blurb + metadata chips.
- Collapsed state shows only the **Join Community** button.
- Expanded state: short "What you'll learn" list + **Enter Department** button linking to the department page.
- **Remove the Download Curriculum button and the jsPDF generator** from this component (drops the `jspdf` import from the homepage bundle).

**New route `/departments/:slug`** — a full SEO landing page per department (10 pages):
Web Development, Mobile App Development, Data Science & Analytics, Cybersecurity, AI & Machine Learning, Basic Internet & AI Studies, Social Media & Digital Marketing, Design, Cloud Computing, Robotics & IoT.

Each page contains:
- Unique H1, keyword-optimized title (<60 chars) and meta description (150–160 chars) via react-helmet-async, self-referencing canonical + og:*.
- Intro answering search intent, full curriculum/modules, who it's for, tools taught, career outcomes & Nigerian salary bands, duration/format (online + in-person centres), campus list link, FAQ section.
- JSON-LD: `Course` + `BreadcrumbList` + `FAQPage`.
- CTAs: Join WhatsApp Community (primary), View Locations, Browse Jobs. No curriculum download.
- Also an index page at `/departments` listing all ten (hub for internal linking).

Department content moves into `src/data/departments.ts` as the single source of truth (slug, keywords, title, description, modules, outcomes, FAQs), consumed by both the homepage accordion and the pages.

## 3. Site-wide SEO pass

- **/careers**: confirm single H1, unique title/description, JobPosting + Breadcrumb JSON-LD validity, descriptive link text on partner/apply buttons, indexable per-job pages.
- **/blog and category pages**: heading hierarchy, category intros, pagination/canonical sanity, like-count markup not blocking crawlers.
- **Departments/courses**: covered by the new pages above; internal links added from homepage, blog posts, and footer.
- Sitemap: add `/departments` + 10 department URLs + 8 new blog URLs. Update `public/llms.txt` with the new department pages.
- Verify with a build + a Playwright pass on a sample of new routes to confirm head tags and content render.

## Technical notes
- New files: `src/data/departments.ts`, `src/pages/Departments.tsx` (hub), `src/pages/DepartmentDetail.tsx`.
- Edited: `src/components/Departments.tsx` (compact accordion, remove jsPDF), `src/data/blogPosts.ts`, `src/App.tsx` (routes), `public/sitemap.xml`, `public/llms.txt`, footer/header links.
- No backend or business-logic changes; existing categories, courses data model, and enrollment flows untouched.
