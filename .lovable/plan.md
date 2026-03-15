

# Homepage Cleanup Plan

## Current State: 10 sections, too much scrolling

The homepage currently stacks **10 heavy sections** in sequence:

```text
1. Hero
2. HowItWorks (Train → Certify → Employ)
3. Departments (542-line component with all courses)
4. Companies (270 lines — full job board with apply flow)
5. ServicesSection (links to subpages)
6. Testimonials (carousel)
7. Clarity (AI chat + clarity call)
8. FacultyDiscount (tech store promo banner)
9. Pricing (plan selector + checkout)
10. GetStarted (1,011 lines — full login/signup + student dashboard)
```

Two sections are doing too much for a homepage: **Companies** (a mini job board) and **GetStarted** (an entire student dashboard). The homepage should sell and convert — not host full app features inline.

---

## Proposed Changes

### 1. Move Jobs to `/careers` page
- Create `src/pages/Careers.tsx` with the full `Companies` component content (job listings, apply flow, application form)
- Replace the homepage `Companies` section with a **slim "Hired By" logo strip** — just company names/emojis in a row with a "View Opportunities →" link to `/careers`
- Add "Careers" to the header nav and footer

### 2. Move Student Dashboard to `/dashboard` page
- Create `src/pages/Dashboard.tsx` that renders the logged-in dashboard portion of `GetStarted` (course progress, lectures, certificates, handouts)
- Simplify the homepage `GetStarted` to **just the login/signup form** with a "Go to Dashboard" button for logged-in users
- Add "Dashboard" link in the header (visible when context shows user is logged in)

### 3. Reorder remaining homepage sections for better conversion flow

```text
1. Hero (hook)
2. HowItWorks (value prop)
3. Departments (what you'll learn)
4. "Hired By" logo strip (social proof — slim)
5. Testimonials (social proof — stories)
6. ServicesSection (beyond training)
7. Pricing (convert)
8. Clarity (support hesitant visitors)
9. FacultyDiscount (bonus value)
10. GetStarted — login/signup only (final CTA)
```

This removes the tech store promo and clarity section from breaking up the conversion funnel, and clusters social proof together.

---

## Files

| File | Change |
|------|--------|
| `src/pages/Careers.tsx` | **New** — full job board page with SEO tags |
| `src/pages/Dashboard.tsx` | **New** — student dashboard extracted from GetStarted |
| `src/components/Companies.tsx` | Slim down to a logo/name strip with link to `/careers` |
| `src/components/GetStarted.tsx` | Remove dashboard logic; keep auth forms + "Go to Dashboard" CTA |
| `src/pages/Index.tsx` | Reorder sections per above |
| `src/components/Header.tsx` | Add "Careers" nav link; add conditional "Dashboard" link |
| `src/components/Footer.tsx` | Add "Careers" link |
| `src/App.tsx` | Add `/careers` and `/dashboard` routes |
| `public/sitemap.xml` | Add new URLs |

No database changes needed.

