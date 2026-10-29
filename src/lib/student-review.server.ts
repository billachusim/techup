import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Emails the student their review and, when accepted, posts in their class group. Never throws. */
export async function notifyStudentReviewed(review: {
  id: string;
  user_id: string;
  title: string;
  status: "reviewed" | "needs_changes";
  score: number | null;
  note: string | null;
  byAi?: boolean;
}) {
  const { data: profile } = await supabaseAdmin
    .from("profiles").select("name, email, slack_user_id, slack_channel_id").eq("id", review.user_id).maybeSingle();

  if (profile?.email) {
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("student-work-reviewed", profile.email, {
        templateData: {
          name: profile.name,
          title: review.title,
          status: review.status,
          note: review.note,
          score: review.score ?? undefined,
          byAi: review.byAi ?? false,
        },
        idempotencyKey: `student-work-reviewed-${review.id}-${review.status}-${review.score ?? "x"}${review.byAi ? "-ai" : ""}`,
      });
    } catch (e) { console.error("review email failed", (e as Error).message); }
  }
  if (profile?.slack_channel_id && review.status === "reviewed") {
    try {
      const { postChannelMessage } = await import("@/lib/slack.server");
      const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : (profile.name ?? "A student");
      await postChannelMessage(profile.slack_channel_id, `:white_check_mark: ${who}'s work *${review.title}* was reviewed${review.score != null ? ` — ${review.score}%` : ""}. Keep going!`);
    } catch (e) { console.error("review Slack post failed", (e as Error).message); }
  }
}
