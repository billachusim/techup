import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "list_my_enrollments",
  title: "List my plan enrollments",
  description: "List the signed-in user's Tech Faculty plan enrollments (Starter/Pro/Enterprise) with status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("enrollments")
      .select("plan_name,status,learning_mode,coupon_code,enrollment_date")
      .order("enrollment_date", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }], structuredContent: { enrollments: data ?? [] } };
  },
});