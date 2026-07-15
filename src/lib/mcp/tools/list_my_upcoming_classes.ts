import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "list_my_upcoming_classes",
  title: "List my upcoming classes",
  description: "List upcoming scheduled lectures for courses the signed-in user is enrolled in.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("lectures")
      .select("id,title,description,scheduled_at,duration_minutes,status,course_id,courses(name)")
      .gte("scheduled_at", nowIso)
      .eq("status", "scheduled")
      .order("scheduled_at", { ascending: true })
      .limit(50);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((l: { id: string; title: string; description: string | null; scheduled_at: string; duration_minutes: number | null; status: string; course_id: string; courses: { name: string } | null }) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      scheduledAt: l.scheduled_at,
      durationMinutes: l.duration_minutes,
      status: l.status,
      courseId: l.course_id,
      courseName: l.courses?.name ?? null,
    }));
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { classes: items } };
  },
});