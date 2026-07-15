import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import blogPosts from "../../../data/blogPosts";

async function fetchLikeCount(slug: string): Promise<number> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return 0;
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { count } = await supabase
    .from("blog_post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_slug", slug);
  return count ?? 0;
}

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description: "Fetch a full blog post (markdown content and metadata) by slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Post slug, e.g. from list_blog_posts."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
      return { content: [{ type: "text", text: `No post found for slug: ${slug}` }], isError: true };
    }
    const likes = await fetchLikeCount(slug);
    const payload = { ...post, likes, url: `https://techfaculty.ng/blog/${post.slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
