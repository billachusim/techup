import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth } from "../_shared/supabaseForUser";

export default defineTool({
  name: "list_my_courses",
  title: "List my courses",
  description: "List the signed-in user's course enrollments with course name and progress percentage.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const auth = requireAuth(ctx);
    if (auth.error) return auth.error;
    const supabase = supabaseForUser(ctx);
    const { data: enrolls, error } = await supabase
      .from("course_enrollments")
      .select("course_id,status,enrollment_date,courses(name,department,duration)")
      .order("enrollment_date", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const courseIds = (enrolls ?? []).map((e: { course_id: string }) => e.course_id);
    const progressMap: Record<string, number> = {};
    if (courseIds.length) {
      const { data: prog } = await supabase
        .from("course_progress")
        .select("course_id,progress_percentage")
        .in("course_id", courseIds);
      for (const p of (prog ?? []) as Array<{ course_id: string; progress_percentage: number }>) {
        progressMap[p.course_id] = p.progress_percentage;
      }
    }
    const items = (enrolls ?? []).map((e: { course_id: string; status: string; enrollment_date: string; courses: { name: string; department: string | null; duration: string | null } | null }) => ({
      courseId: e.course_id,
      name: e.courses?.name ?? null,
      department: e.courses?.department ?? null,
      duration: e.courses?.duration ?? null,
      status: e.status,
      enrolledAt: e.enrollment_date,
      progressPercentage: progressMap[e.course_id] ?? 0,
    }));
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { courses: items } };
  },
});