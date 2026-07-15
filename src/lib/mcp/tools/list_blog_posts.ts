import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import blogPosts from "../../../data/blogPosts";

async function fetchLikeCounts(slugs: string[]): Promise<Record<string, number>> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || slugs.length === 0) return {};
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from("blog_post_likes").select("post_slug").in("post_slug", slugs);
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as Array<{ post_slug: string }>) {
    counts[row.post_slug] = (counts[row.post_slug] ?? 0) + 1;
  }
  return counts;
}

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description: "List Tech Faculty blog posts, newest first. Optionally filter by category name and paginate.",
  inputSchema: {
    category: z.string().optional().describe("Category name (matches post's primary tag). Discover via list_blog_categories."),
    limit: z.number().int().min(1).max(50).optional().describe("Max posts to return (default 20)."),
    offset: z.number().int().min(0).optional().describe("Number of posts to skip (default 0)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit, offset }) => {
    const lim = limit ?? 20;
    const off = offset ?? 0;
    let posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (category) {
      const c = category.toLowerCase();
      posts = posts.filter((p) => p.tags[0]?.toLowerCase() === c);
    }
    const page = posts.slice(off, off + lim);
    const counts = await fetchLikeCounts(page.map((p) => p.slug));
    const items = page.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      author: p.author,
      tags: p.tags,
      readTime: p.readTime,
      likes: counts[p.slug] ?? 0,
      url: `https://techfaculty.ng/blog/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ total: posts.length, returned: items.length, posts: items }, null, 2) }],
      structuredContent: { total: posts.length, returned: items.length, posts: items },
    };
  },
});
