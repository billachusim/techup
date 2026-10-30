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
    const { data: u } = await supabase.auth.getUser();
    const { data: me } = await supabase.from("profiles").select("faculty_id").eq("id", u.user?.id ?? "").maybeSingle();
    if (!me?.faculty_id) return { content: [{ type: "text", text: "[]" }], structuredContent: { classes: [] } };
    // Each student's own timetable, counted from when they started
    const { data, error } = await supabase.rpc("student_timetable", { _faculty_id: me.faculty_id });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? [])
      .filter((l: { scheduled_at: string }) => l.scheduled_at >= nowIso)
      .slice(0, 50)
      .map((l: { lecture_id: string; title: string; description: string | null; scheduled_at: string; duration_minutes: number | null; course_id: string; course_name: string }) => ({
        id: l.lecture_id,
        title: l.title,
        description: l.description,
        scheduledAt: l.scheduled_at,
        durationMinutes: l.duration_minutes,
        status: "scheduled",
        courseId: l.course_id,
        courseName: l.course_name ?? null,
      }));
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { classes: items } };
  },
});