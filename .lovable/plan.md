## Overview

Create a new youth-focused blog category and publish a holiday-bootcamp post that parents of JSS3/SS3 students will find when searching Google. The post must drive enrollments by clearly presenting what students learn, where classes run, and how to register.

----

## Step 1 — Create the "Tech Training for Teens" category

Add a new `BlogCategory` to `src/data/blogCategories.ts`:

```text
Name:     Tech Training for Teens
Slug:     tech-training-for-teens
Title:    Tech Training for Teens Nigeria — Coding & Digital Skills | Tech Faculty NG
Description (155 chars):
  Holiday tech bootcamps and coding classes for teenagers in Nigeria. JSS3 & SS3 vacation programs in Nnewi, Onitsha, Enugu, Aba, and Owerri.
Intro (~80 words):
  The best time to learn tech is during the long holiday. This category covers holiday coding bootcamps,
  digital-skills programs, and vacation tech classes for Nigerian teenagers — from JSS3 students who just
  finished Junior WAEC to SS3 graduates waiting for university. We publish schedules, parent guides,
  course outlines, and registration details for our centres in Nnewi, Onitsha/Awada, Enugu, Aba, and Owerri.
Keywords:
  - coding classes for teenagers Nigeria
  - holiday tech bootcamp Nigeria
  - JSS3 SS3 vacation program
  - tech summer camp Nigeria
  - youth coding Nigeria
```

No changes to `Blog.tsx` or `BlogCategory.tsx` are required — they already render categories dynamically from `blogCategories.ts`.

----

## Step 2 — Write and add the holiday bootcamp blog post

Append a new `BlogPost` object to `src/data/blogPosts.ts`.

### Post metadata

```text
slug:    jss3-ss3-holiday-tech-bootcamp-2026
author:  Bill Achusim
date:    2026-06-27
tags[0]: Tech Training for Teens
readTime: 7
```

### SEO title (≤ 60 chars)
`JSS3 & SS3 Holiday Tech Bootcamp 2026 — Tech Faculty NG`

### SEO description (≤ 160 chars)
`2.5-month holiday tech bootcamp for JSS3 & SS3 students in Nigeria. Learn coding, design & AI at our centres in Nnewi, Onitsha, Enugu, Aba & Owerri. Enrol now.`

### Content outline

1. **Opening hook (parent-focused)**  
   "Your child has just finished WAEC. Two and a half months of holiday lie ahead. While rest is important, so is staying mentally engaged. Tech Faculty's Holiday Tech Bootcamp turns this break into a career head-start."

2. **Why tech during the holidays?**  
   - Prevents the "holiday brain drain"  
   - Builds skills university STEM courses will demand  
   - Gives SS3 graduates an income skill before JAMB / university  
   - Keeps JSS3 students productively occupied before senior secondary

3. **Who is this for?**  
   - JSS3 students (just finished Junior WAEC)  
   - SS3 students (just finished Senior WAEC / NECO)  
   - Age 13 – 18, no prior coding experience needed

4. **What students will learn** — propose 4 age-appropriate tracks (user said "come up with the courses"):
   - **Digital Creator Track** — Canva, content creation, social-media branding, basic video editing  
   - **Junior Coder Track** — HTML/CSS, building a personal website, Scratch logic  
   - **Data & AI Explorer** — Excel for analysis, Python basics, using AI tools (ChatGPT, image generators) responsibly  
   - **Cyber Smart Teen** — Digital safety, password hygiene, recognising online scams, intro to networking

5. **Program structure**
   - Duration: 6 weeks (fits inside the ~2.5-month holiday)
   - Format: 3 days per week, 2 hours per day (weekday mornings)
   - Class size: Max 15 students per track
   - Certificate of completion awarded

6. **Where classes run** — mention every centre:
   - **Nnewi** — Technology Incubation Centre, NBTI South-East Zonal Office
   - **Onitsha / Awada** — Technology Incubation Centre
   - **Enugu** — Technology Incubation Centre
   - **Aba** — Technology Incubation Centre
   - **Owerri** — Technology Incubation Centre
   (Add a note that each centre runs the full bootcamp calendar.)

7. **How parents found us**  
   Briefly acknowledge the Google Map discovery pattern the user mentioned — "Parents across the South-East have been calling us after finding Tech Faculty on Google Maps. This guide answers the most common questions in one place."

8. **Pricing & registration**
   - Propose ₦20,000 per student (or a bundled sibling discount)
   - Clear CTA: "Click below to register your child" (link to `/products` or a direct WhatsApp link)
   - Include phone number and WhatsApp contact

9. **Closing**
   - Reassurance: "Every parent who has enrolled a child in our holiday program says the same thing — they came back confident, focused, and curious."
   - Final CTA to share the post with other parents

### Markdown formatting rules
- Use `##` for section headings and `###` for sub-headings.
- Use `**bold**` for emphasis.
- Keep paragraphs short (3-4 sentences) for mobile readability.
- No unescaped backticks inside the content string — escape with `\\`` or rephrase.

----

## Step 3 — Generate a hero / thumbnail image

Generate one image for the blog post:

```text
Prompt:  A bright, modern classroom scene in a Nigerian tech hub. Teenage students (both boys and girls,
         ages 14-17) sitting at laptops, smiling and collaborating. A mentor stands behind them guiding.
         Clean, well-lit space with white walls and green plants. Warm, hopeful atmosphere. Professional
         photography style, shallow depth of field.
Path:    src/assets/blog-holiday-bootcamp-2026.jpg
Size:    1024 x 512 (2:1 ratio for blog hero)
```

Add the image import into `src/data/blogPosts.ts` if the schema supports an `image` field; otherwise leave it in assets for future use.

----

## Step 4 — Update `public/sitemap.xml`

Add two new `<url>` entries:

1. The new category landing page:  
   `https://techfaculty.ng/blog/category/tech-training-for-teens`  
   changefreq=weekly, priority=0.8

2. The new blog post:  
   `https://techfaculty.ng/blog/jss3-ss3-holiday-tech-bootcamp-2026`  
   lastmod=2026-06-27, changefreq=monthly, priority=0.7

----

## Step 5 — Verify & trigger SEO rescan

1. Run `bun run build` (or `vite build`) to confirm TypeScript compiles cleanly.
2. If the build passes, mark any new or stale SEO findings as fixed and trigger a rescan so the new pages are evaluated.

----

## Notes

- Do **not** create any additional blog posts — only one post for this category in this batch.
- Do **not** modify the existing 7 categories.
- The post should be appended to the end of the `blogPosts` array so it appears as the newest article.
- Ensure no duplicate slugs exist before appending.