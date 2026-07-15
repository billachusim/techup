import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "list_my_certificates",
  title: "List my certificates",
  description: "List certificates issued to the signed-in Tech Faculty user.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("certificates")
      .select("certificate_number,course_name,certificate_type,issued_by,date_issued,issued_at")
      .order("issued_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((c: { certificate_number: string }) => ({
      ...c,
      verifyUrl: `https://techfaculty.ng/verify/${c.certificate_number}`,
    }));
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { certificates: items } };
  },
});