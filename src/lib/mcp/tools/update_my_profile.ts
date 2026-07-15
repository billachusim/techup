import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "update_my_profile",
  title: "Update my profile",
  description: "Update the signed-in user's own name and/or phone. Faculty ID and email cannot be changed.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).optional(),
    phone: z.string().trim().min(3).max(20).optional(),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ name, phone }, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const patch: Record<string, string> = {};
    if (name) patch.name = name;
    if (phone) patch.phone = phone;
    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "Nothing to update. Provide name or phone." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", ctx.getUserId()!)
      .select("faculty_id,name,email,phone")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: { profile: data } };
  },
});