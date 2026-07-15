import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "like_blog_post",
  title: "Like blog post",
  description: "Like a Tech Faculty blog post as the signed-in user. Idempotent: safe to call if already liked.",
  inputSchema: {
    slug: z.string().min(1).describe("Post slug from list_blog_posts."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;
    const { data: existing } = await supabase
      .from("blog_post_likes")
      .select("id")
      .eq("post_slug", slug)
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) {
      return { content: [{ type: "text", text: `Already liked ${slug}` }], structuredContent: { slug, liked: true, alreadyLiked: true } };
    }
    const { error } = await supabase.from("blog_post_likes").insert({
      post_slug: slug,
      user_id: userId,
      visitor_id: userId,
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Liked ${slug}` }], structuredContent: { slug, liked: true, alreadyLiked: false } };
  },
});