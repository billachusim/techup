# Blog: author profiles + proper tables

## 1. Author linked to Bill's profiles (all posts, old and new)
- Show an author line on each post under the title: "By Bill Achusim, Founder, Tech Faculty NG", with small LinkedIn and X links.
- Add a short author box at the end of each article with the same links.
- In the structured data Google reads, set the author to a Person (Bill Achusim) with `sameAs` pointing to LinkedIn and X, and keep Tech Faculty NG as the publisher.
- Auto-generated posts that show "Tech Faculty Editorial" or a blank author will display Bill as the author. The article text itself stays the same.
- The RSS feed will also list Bill as the author.

## 2. Tables that display correctly, including on mobile
- Right now tables in posts show up as raw text with "|" characters. Switch on table support in the blog reader so they render as real tables.
- Style tables in black and white: borders, a bold header row, and padding. On phones, each table scrolls sideways inside its own box so it doesn't stretch the page.
- This fixes every existing post, including "Empowering Nigerian Teens" (Coding Pathways section), with no edits to the content.

## 3. Internal links going forward
- Keep "More Articles" as it is.
- Update the weekly blog writer so each new post links to 2–3 earlier relevant blog posts in its body, and credits Bill as the author.

## Technical details
- Add the `remark-gfm` package and pass it to `ReactMarkdown` in `src/pages/BlogPost.tsx`. Wrap tables in an `overflow-x-auto` element and use semantic-token classes.
- New `src/data/author.ts` holding the name, role, and profile URLs, used by the page, the JSON-LD, and `src/lib/rss.server.ts`.
- In `generate-weekly-blog`, pass recent slugs and titles into the prompt so it can add `/blog/<slug>` links, and change the byline line to Bill Achusim.
