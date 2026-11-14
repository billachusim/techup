import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

async function assertStaff(supabase: SupabaseClient<Database>, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("admin") && !roles.includes("recruiter")) throw new Error("Staff only");
}

/** Staff: list student submissions with student names. */
export const listStudentWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ status: z.enum(["submitted", "reviewed", "needs_changes", "ai", "all"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    let q = context.supabase
      .from("student_deliverables")
      .select("id, user_id, faculty_id, course_name, class_number, title, proof_url, summary, status, score, reviewer_note, reviewed_by, ai_status, ai_score, ai_verdict, ai_feedback, ai_confidence, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status === "ai") q = q.eq("reviewed_by", "ai");
    else if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const ids = [...new Set((rows ?? []).map((r) => r.user_id))];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, name, email, location").in("id", ids)
      : { data: [] };
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
    // Running average per student across reviewed work.
    const { data: scored } = ids.length
      ? await supabaseAdmin.from("student_deliverables").select("user_id, score").in("user_id", ids).not("score", "is", null)
      : { data: [] };
    const avg = new Map<string, { sum: number; n: number }>();
    for (const s of scored ?? []) {
      const a = avg.get(s.user_id) ?? { sum: 0, n: 0 };
      a.sum += s.score; a.n += 1; avg.set(s.user_id, a);
    }
    return (rows ?? []).map((r) => {
      const a = avg.get(r.user_id);
      return {
        ...r,
        student_name: byId.get(r.user_id)?.name || "Student",
        student_email: byId.get(r.user_id)?.email || null,
        student_location: byId.get(r.user_id)?.location || null,
        average_score: a ? Math.round(a.sum / a.n) : null,
        reviewed_count: a?.n ?? 0,
      };
    });
  });

const reviewLabel = (status: string, score: number | null) =>
  `${status === "reviewed" ? "accepted" : status === "needs_changes" ? "needs changes" : status}${score != null ? ` ${score}%` : ""}`;

const ReviewInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["reviewed", "needs_changes"]),
  score: z.number().int().min(0).max(100).nullable(),
  note: z.string().max(1000).optional(),
});

/** Staff: score a submission (or change the AI's review), then email the student and post in their class group. */
export const reviewStudentWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ReviewInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const note = data.note?.trim() || null;
    const { data: before } = await context.supabase
      .from("student_deliverables").select("status, score, reviewer_note, reviewed_by").eq("id", data.id).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("student_deliverables")
      .update({ status: data.status, score: data.score, reviewer_note: note, reviewed_at: new Date().toISOString(), reviewed_by: "staff" })
      .eq("id", data.id)
      .select("id, user_id, title, faculty_id")
      .single();
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (before?.reviewed_by === "ai" && (before.status !== data.status || before.score !== data.score)) {
      const { recordAdminAction } = await import("@/lib/admin-audit");
      const { data: student } = await supabaseAdmin.from("profiles").select("name").eq("id", row.user_id).maybeSingle();
      await recordAdminAction(supabaseAdmin, context.userId, {
        action: "work.ai_review_overridden",
        target_table: "student_deliverables",
        target_id: row.id,
        faculty_id: row.faculty_id,
        subject: student?.name ?? null,
        details: { title: row.title, from: reviewLabel(before.status, before.score), to: reviewLabel(data.status, data.score) },
      });
    }

    // Re-saving a review unchanged (e.g. staff confirming the AI's) doesn't email the student again.
    const unchanged = before?.status === data.status && before?.score === data.score && (before?.reviewer_note ?? null) === note;
    if (unchanged) return { ok: true as const };
    const { notifyStudentReviewed } = await import("@/lib/student-review.server");
    await notifyStudentReviewed({ id: row.id, user_id: row.user_id, title: row.title, status: data.status, score: data.score, note });
    if (data.status === "reviewed") {
      const { advanceAfterAcceptedWork } = await import("@/lib/class-progress.server");
      await advanceAfterAcceptedWork(row.id);
    }
    return { ok: true as const };
  });

/** Student: ask the AI to score the work they just submitted. Returns once it is scored (or left for staff). */
export const requestAiWorkReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ deliverableId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("student_deliverables").select("id, user_id").eq("id", data.deliverableId).maybeSingle();
    if (!row || row.user_id !== context.userId) return { outcome: "not_claimed" as const };
    const { aiReviewSubmission } = await import("@/lib/ai-work-review.server");
    return { outcome: await aiReviewSubmission(row.id) };
  });

const BriefInput = z.object({
  classKey: z.string().min(1).max(200),
  classTitle: z.string().min(1).max(200),
  classNumber: z.number().int().min(1).max(100).optional(),
  date: z.string().max(60).optional(),
  courseId: z.string().uuid().optional(),
  courseName: z.string().max(200).optional(),
});

/** Student: once per class, brief their Slack class group and email them. */
export const briefNextClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => BriefInput.parse(d))
  .handler(async ({ data, context }) => {
    const { sendClassBriefing } = await import("@/lib/class-progress.server");
    const { alreadySent } = await sendClassBriefing(context.userId, data);
    return { ok: true as const, alreadySent };
  });

/**
 * Opens this student's Drive class videos: their email becomes a Viewer on the
 * Drive videos of the classes they have reached in a course (class 1 up to
 * their current class), and on nothing else. The current class comes from the
 * database (course_progress), not from the browser, so a student can't open a
 * later class early. Safe to call on every dashboard load: granting again
 * changes nothing, and a failed grant is simply retried next time.
 */
export const openClassVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles").select("email, faculty_id").eq("id", context.userId).maybeSingle();
    if (!profile?.email || !profile.faculty_id) return { granted: 0 };

    const [{ data: enrolment }, { data: progress }] = await Promise.all([
      supabaseAdmin.from("course_enrollments").select("id")
        .eq("faculty_id", profile.faculty_id).eq("course_id", data.courseId).limit(1).maybeSingle(),
      supabaseAdmin.from("course_progress").select("classes_completed")
        .eq("faculty_id", profile.faculty_id).eq("course_id", data.courseId).maybeSingle(),
    ]);
    if (!enrolment) return { granted: 0 };
    const currentClass = (progress?.classes_completed ?? 0) + 1;
    const { openDriveVideosUpTo } = await import("@/lib/class-progress.server");
    const granted = await openDriveVideosUpTo({ email: profile.email, courseId: data.courseId, currentClass });
    return { granted };
  });

/**
 * Student: everything for one class they have reached (past or current):
 * its saved videos, its task and the written handout. Later classes are
 * refused here, so their links never reach the browser. The current class
 * comes from course_progress in the database, not from the browser.
 */
export const getClassPack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid(), classNumber: z.number().int().min(1).max(52) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { canOpenClass } = await import("@/lib/class-access");
    const [{ data: profile }, { data: staff }] = await Promise.all([
      supabaseAdmin.from("profiles").select("faculty_id").eq("id", context.userId).maybeSingle(),
      supabaseAdmin.rpc("is_staff", { _user_id: context.userId }),
    ]);
    const facultyId = profile?.faculty_id;
    if (!facultyId && staff !== true) return { locked: true as const };
    if (staff !== true) {
      const [{ data: enrolment }, { data: progress }] = await Promise.all([
        supabaseAdmin.from("course_enrollments").select("id")
          .eq("faculty_id", facultyId!).eq("course_id", data.courseId).neq("status", "cancelled").limit(1).maybeSingle(),
        supabaseAdmin.from("course_progress").select("classes_completed")
          .eq("faculty_id", facultyId!).eq("course_id", data.courseId).maybeSingle(),
      ]);
      if (!enrolment || !canOpenClass(data.classNumber, progress?.classes_completed ?? 0)) return { locked: true as const };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as unknown as { from: (t: string) => any };
    const [{ data: course }, { data: lecture }, { data: cached }, { data: taskRow }] = await Promise.all([
      db.from("courses").select("name").eq("id", data.courseId).maybeSingle(),
      db.from("lectures").select("title, description, duration_minutes").eq("course_id", data.courseId)
        .order("scheduled_at", { ascending: true }).order("id", { ascending: true })
        .range(data.classNumber - 1, data.classNumber - 1).maybeSingle(),
      db.from("ai_class_content").select("title, summary, description, handout_content")
        .eq("course_id", data.courseId).eq("class_number", data.classNumber).maybeSingle(),
      db.from("class_tasks").select("task").eq("course_id", data.courseId).eq("class_number", data.classNumber).maybeSingle(),
    ]);
    const { data: work } = await supabaseAdmin.from("student_deliverables")
      .select("title, proof_url, status, score, reviewer_note, created_at")
      .eq("user_id", context.userId).eq("course_id", data.courseId).eq("class_number", data.classNumber)
      .order("created_at", { ascending: false }).limit(5);
    const classTitle = String(cached?.title || lecture?.title || `Class ${data.classNumber}`).replace(/\s*-?\s*(Session|Class)\s+\d+/gi, "");
    const { classResourcesFor } = await import("@/lib/class-videos.server");
    const resources = await classResourcesFor({ courseId: data.courseId, classNumber: data.classNumber, classTitle, courseName: course?.name });
    const isVideo = (t: string) => t === "youtube" || t === "drive" || t === "video";
    return {
      locked: false as const,
      classNumber: data.classNumber,
      courseName: (course?.name as string) ?? "",
      title: classTitle,
      summary: (cached?.summary as string) ?? null,
      description: (cached?.description as string) ?? (lecture?.description as string) ?? null,
      durationMinutes: (lecture?.duration_minutes as number) ?? 90,
      handoutContent: (cached?.handout_content as string) ?? null,
      task: (taskRow?.task as string) ?? null,
      videos: resources.filter((r) => isVideo(r.type)),
      reading: resources.filter((r) => !isVideo(r.type)),
      submissions: (work ?? []).map((w) => ({
        title: w.title as string, proofUrl: (w.proof_url as string | null) ?? null, status: w.status as string,
        score: (w.score as number | null) ?? null, note: (w.reviewer_note as string | null) ?? null, createdAt: w.created_at as string,
      })),
    };
  });
