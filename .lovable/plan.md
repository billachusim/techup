

## Problem

Google Search Console reports two issues caused by **old WordPress URLs** that no longer exist in the current SPA:

**Excluded by 'noindex' tag** (3 pages):
- `/category/tech/`
- `/tech/`
- `/why-90-of-tech-learners-quit-but-you-dont-have-to/`

**Soft 404** (2 pages):
- `/tag/education/`
- `/tag/tech-skill/`

These are legacy WordPress paths (categories, tags, blog posts). When Googlebot hits them, the SPA serves the `NotFound` component with a 200 status code, which Google interprets as either a soft 404 or noindex page. This confuses the crawler and wastes crawl budget.

## Solution

Since this is a client-side SPA and we can't return true HTTP 404 status codes, we'll:

1. **Add redirect routes in `App.tsx`** for the old WordPress URLs — redirect legacy paths to their closest equivalents on the new site:
   - `/category/*` and `/tag/*` → `/blog`
   - `/tech/` → `/`
   - `/why-90-of-tech-learners-quit-*` → `/blog` (old blog post)

2. **Add a `noindex` meta tag to the NotFound page** using `react-helmet-async` so any remaining unknown URLs explicitly tell Google not to index them, preventing future "soft 404" issues.

3. **Request removal of old URLs** — after deploying, you'll use the "Removals" tool in Search Console to clear these cached URLs faster.

## Technical Details

### File changes

**`src/App.tsx`**
- Import `Navigate` from react-router-dom
- Add redirect routes before the catch-all:
  - `<Route path="/category/*" element={<Navigate to="/blog" replace />} />`
  - `<Route path="/tag/*" element={<Navigate to="/blog" replace />} />`
  - `<Route path="/tech" element={<Navigate to="/" replace />} />`
  - `<Route path="/why-90-of-tech-learners-quit-but-you-dont-have-to" element={<Navigate to="/blog" replace />} />`

**`src/pages/NotFound.tsx`**
- Import `Helmet` from `react-helmet-async`
- Add `<Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>` so any unhandled routes explicitly tell crawlers not to index

