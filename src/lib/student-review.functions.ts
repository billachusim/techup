import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findProgram } from "@/data/coursePrograms";

async function assertStaff(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("recruiter")) throw new Error("Staff only");
}

/** Staff: list student submissions with student names. */
export const listStudentWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ status: z.enum(["submitted", "reviewed", "needs_changes", "all"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    let q = context.supabase
      .from("student_deliverables")
      .select("id, user_id, faculty_id, course_name, class_number, title, proof_url, summary, status, score, reviewer_note, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const ids = [...new Set((rows ?? []).map((r: any) => r.user_id))];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, name, email").in("id", ids)
      : { data: [] as any[] };
    const byId = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    // Running average per student across reviewed work.
    const { data: scored } = ids.length
      ? await supabaseAdmin.from("student_deliverables").select("user_id, score").in("user_id", ids).not("score", "is", null)
      : { data: [] as any[] };
    const avg = new Map<string, { sum: number; n: number }>();
    for (const s of scored ?? []) {
      const a = avg.get(s.user_id) ?? { sum: 0, n: 0 };
      a.sum += s.score; a.n += 1; avg.set(s.user_id, a);
    }
    return (rows ?? []).map((r: any) => {
      const a = avg.get(r.user_id);
      return {
        ...r,
        student_name: byId.get(r.user_id)?.name || "Student",
        student_email: byId.get(r.user_id)?.email || null,
        average_score: a ? Math.round(a.sum / a.n) : null,
        reviewed_count: a?.n ?? 0,
      };
    });
  });

const ReviewInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["reviewed", "needs_changes"]),
  score: z.number().int().min(0).max(100).nullable(),
  note: z.string().max(1000).optional(),
});

/** Staff: score a submission, then email the student and post in their class group. */
export const reviewStudentWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ReviewInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const note = data.note?.trim() || null;
    const { data: row, error } = await context.supabase
      .from("student_deliverables")
      .update({ status: data.status, score: data.score, reviewer_note: note, reviewed_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("id, user_id, title")
      .single();
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles").select("name, email, slack_user_id, slack_channel_id").eq("id", row.user_id).maybeSingle();

    if (profile?.email) {
      try {
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        await sendTemplateEmail("student-work-reviewed", profile.email, {
          templateData: { name: profile.name, title: row.title, status: data.status, note, score: data.score ?? undefined },
          idempotencyKey: `student-work-reviewed-${row.id}-${data.status}-${data.score ?? "x"}`,
        });
      } catch (e) { console.error("review email failed", (e as Error).message); }
    }
    if (profile?.slack_channel_id && data.status === "reviewed") {
      const { postChannelMessage } = await import("@/lib/slack.server");
      const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : (profile.name ?? "A student");
      await postChannelMessage(profile.slack_channel_id, `:white_check_mark: ${who}'s work *${row.title}* was reviewed${data.score != null ? ` — ${data.score}%` : ""}. Keep going!`);
    }
    return { ok: true as const };
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
