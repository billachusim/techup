import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { findProgram } from "@/data/coursePrograms";

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
});

/** Student: once per class, brief their Slack class group and email them. */
export const briefNextClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => BriefInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: dup } = await supabaseAdmin
      .from("student_class_briefings")
      .insert({ user_id: context.userId, class_key: data.classKey });
    if (dup) return { ok: true as const, alreadySent: true };

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("name, email, department, slack_user_id, slack_channel_id").eq("id", context.userId).maybeSingle();
    const program = findProgram(profile?.department);

    if (profile?.slack_channel_id) {
      const { postChannelMessage } = await import("@/lib/slack.server");
      const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : (profile.name ?? "a student");
      await postChannelMessage(
        profile.slack_channel_id,
        `:books: Next class for ${who}: *${data.classNumber ? `Class ${data.classNumber} — ` : ""}${data.classTitle}*${data.date ? ` (${data.date})` : ""}.\nNotes and this week's assignment: https://techfaculty.ng/dashboard`,
      );
    }
    if (profile?.email) {
      try {
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        await sendTemplateEmail("class-unlocked", profile.email, {
          templateData: { name: profile.name, classTitle: data.classTitle, programme: program.title, classNumber: data.classNumber, date: data.date },
          idempotencyKey: `class-unlocked-${context.userId}-${data.classKey}`,
        });
      } catch (e) { console.error("class email failed", (e as Error).message); }
    }
    return { ok: true as const, alreadySent: false };
  });
