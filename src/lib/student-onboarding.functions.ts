import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findProgram, SLACK_WORKSPACE_URL, SLACK_JOIN_URL } from "@/data/coursePrograms";

/**
 * Student onboarding automation: Slack cohort channel + welcome email.
 * Safe to call repeatedly — every step is idempotent.
 */
export const onboardStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const notes: string[] = [];
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id, name, email, faculty_id, department, learning_mode, slack_user_id, slack_channel_id, slack_channel_name, slack_joined_at, onboarding_email_sent_at")
      .eq("id", context.userId)
      .maybeSingle();

    if (!profile) return { ok: false as const, notes: ["Profile not found"], joinUrl: SLACK_JOIN_URL };

    const program = findProgram(profile.department);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let slackUserId = profile.slack_user_id ?? null;
    let channelId = profile.slack_channel_id ?? null;
    let channelName = profile.slack_channel_name ?? null;
    let joinedAt = profile.slack_joined_at ?? null;

    try {
      const { ensureChannel, findSlackUserByEmail, inviteToChannel, postChannelMessage, SLACK_GENERAL_CHANNEL_ID } =
        await import("@/lib/slack.server");

      const channel = await ensureChannel(program.channel, program.channelTopic);
      channelId = channel.id;
      channelName = channel.name;

      if (!slackUserId) slackUserId = await findSlackUserByEmail(profile.email);

      if (slackUserId) {
        try {
          await inviteToChannel(SLACK_GENERAL_CHANNEL_ID, slackUserId);
        } catch (e) {
          notes.push(`General channel: ${(e as Error).message}`);
        }
        const outcome = await inviteToChannel(channel.id, slackUserId);
        if (outcome === "invited") {
          joinedAt = new Date().toISOString();
          await postChannelMessage(
            channel.id,
            `Welcome <@${slackUserId}> to *${program.title}*${profile.faculty_id ? ` (Faculty ID ${profile.faculty_id})` : ""}. Your class topics, notes and weekly assignment are on your dashboard: https://techfaculty.ng/dashboard`,
          );
          notes.push(`Added to #${channel.name}.`);
        } else {
          notes.push(`Already in #${channel.name}.`);
        }
      } else {
        notes.push("No Slack account found on this email yet — join the workspace with the same email.");
      }
    } catch (e) {
      notes.push((e as Error).message);
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        slack_user_id: slackUserId,
        slack_channel_id: channelId,
        slack_channel_name: channelName,
        slack_joined_at: joinedAt,
      })
      .eq("id", context.userId);

    // Welcome email — once per student.
    if (!profile.onboarding_email_sent_at && profile.email) {
      try {
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        await sendTemplateEmail("student-welcome", profile.email, {
          templateData: {
            name: profile.name,
            facultyId: profile.faculty_id,
            programme: program.title,
            channel: channelName ?? program.channel,
            slackUrl: SLACK_JOIN_URL,
            learningMode: profile.learning_mode,
          },
          idempotencyKey: `student-welcome-${profile.id}-${profile.faculty_id ?? "none"}`,
        });
        await supabaseAdmin
          .from("profiles")
          .update({ onboarding_email_sent_at: new Date().toISOString() })
          .eq("id", context.userId);
        notes.push("Welcome email sent.");
      } catch (e) {
        console.error("student welcome email failed", (e as Error).message);
      }
    }

    return {
      ok: true as const,
      programme: program.title,
      channelName: channelName ?? program.channel,
      channelId,
      slackLinked: !!slackUserId,
      joinUrl: SLACK_JOIN_URL,
      notes,
    };
  });

const WorkInput = z.object({ deliverableId: z.string().uuid() });

/** Posts a student's submitted assignment into their course cohort channel. */
export const notifyStudentWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => WorkInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("student_deliverables")
      .select("id, user_id, title, proof_url, course_name, class_number")
      .eq("id", data.deliverableId)
      .maybeSingle();
    if (!row || row.user_id !== context.userId) return { ok: false as const };

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("name, slack_user_id, slack_channel_id, department")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.slack_channel_id) return { ok: false as const };

    try {
      const { postChannelMessage } = await import("@/lib/slack.server");
      const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : (profile.name ?? "A student");
      await postChannelMessage(
        profile.slack_channel_id,
        `${who} submitted ${row.class_number ? `class ${row.class_number} ` : ""}work: *${row.title}*${row.proof_url ? `\n${row.proof_url}` : ""}`,
      );
      return { ok: true as const };
    } catch {
      return { ok: false as const };
    }
  });
