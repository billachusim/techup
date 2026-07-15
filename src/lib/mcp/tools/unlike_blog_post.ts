import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "unlike_blog_post",
  title: "Unlike blog post",
  description: "Remove the signed-in user's like from a Tech Faculty blog post.",
  inputSchema: { slug: z.string().min(1).describe("Post slug.") },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase
      .from("blog_post_likes")
      .delete()
      .eq("post_slug", slug)
      .eq("user_id", ctx.getUserId()!);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Unliked ${slug}` }], structuredContent: { slug, liked: false } };
  },
});