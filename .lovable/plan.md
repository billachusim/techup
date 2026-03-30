

## Blog Posts Cleanup & Category Expansion

### Problem
The `src/data/blogPosts.ts` file has significant duplication and only 2 categories ("Career Guide" and "Business & Entrepreneurship").

**Duplicates found:**
- "Why Tech Faculty NG Helps Entrepreneurs" — appears 3 times (lines 49, 93, 268)
- "Tech Faculty NG Helps Entrepreneurs" — appears as a 4th near-duplicate (line 60)
- "Why Nigerian Entrepreneurs Need AI Implementation" — appears 3 times (lines 115, 257, 290)
- "Why Nigerian Businesses Need AI Innovation" — appears twice (lines 71, 82)
- "Tech Faculty NG Elite Entrepreneurs" — appears twice (lines 104, 279)
- "Skills Gap: Nigerian Businesses Need More Tech Training" — appears twice (lines 126, 301)
- "Skills Gap: Nigerian Business Elite Increasing Tech Focus" — appears twice (lines 137, 246)

After deduplication, roughly 9 unique posts remain from the original ~22 entries.

### Plan

**1. Remove all duplicate blog posts** — keep only one version of each (preferring the one with more complete content or the more recent date).

**2. Add new categories and posts:**
- **IT/SIWES** — Posts about SIWES program, industrial training tips, IT placement guides
- **Course Deep-Dive** — Posts exploring specific bootcamp courses (Data Analytics, Web Dev, Cyber Security, etc.)
- **AI & Innovation** — Reclassify relevant AI posts here instead of lumping them under Business

**3. New blog posts to add (with full markdown content):**
- *IT/SIWES*: "Everything You Need to Know About SIWES in Nigeria", "How to Get the Most Out of Your IT Placement"
- *Course Deep-Dive*: "Data Analytics Bootcamp: What You'll Learn in 16 Weeks", "Web Development vs Mobile Development: Which Path Is Right for You?"
- *Career Guide*: Keep existing posts in this category

**4. Ensure all posts have content** — currently most posts are missing the `content` field, which means clicking them shows a blank article. Add markdown content for all posts.

### Technical Details
- Single file change: `src/data/blogPosts.ts`
- Deduplicate by keeping unique slugs only
- Add 4 new posts across the missing categories
- Add `content` field to all existing posts that lack it
- Final result: ~13 unique, well-categorized posts with full content across 4-5 categories

