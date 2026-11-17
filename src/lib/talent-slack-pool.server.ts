// Daily talent-pool sync (pg_cron -> /api/talent-slack-sync, 07:00 Lagos).
// Every talent who is open to work goes into the general Slack channel as soon as
// they have a Slack account with their profile email, whether or not they have a
// role match yet. Talent without a Slack account get a short "join Slack with this
// email" reminder: at most three, a week apart.

const REMINDER_GAP_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_REMINDERS = 3;

export type TalentPoolResult = {
  checked: number;
  added: number;
  reminded: number;
  failed: number;
};

export async function syncTalentPool(limit = 300): Promise<TalentPoolResult> {
  const { supabaseAdmin } =
    await import("@/integrations/supabase/client.server");
  const {
    SLACK_GENERAL_CHANNEL_ID,
    findSlackUserByEmail,
    inviteToChannel,
    postChannelMessage,
  } = await import("@/lib/slack.server");
  const { sendTemplateEmail } =
    await import("@/lib/email-templates/send-email");
  const { SLACK_JOIN_URL } = await import("@/data/coursePrograms");
  const { HR_REPLY_TO } = await import("@/lib/hr-api-rules");

  const { data, error } = await supabaseAdmin
    .from("talent_profiles")
    .select(
      "id, full_name, email, slack_user_id, slack_invite_sent_at, slack_invite_count",
    )
    .is("slack_general_joined_at", null)
    .neq("availability", "unavailable")
    .not("email", "is", null)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);

  const result: TalentPoolResult = {
    checked: 0,
    added: 0,
    reminded: 0,
    failed: 0,
  };
  const now = Date.now();

  for (const p of data ?? []) {
    result.checked++;
    try {
      let slackUserId = p.slack_user_id;
      if (!slackUserId) {
        slackUserId = await findSlackUserByEmail(p.email);
        if (slackUserId)
          await supabaseAdmin
            .from("talent_profiles")
            .update({ slack_user_id: slackUserId })
            .eq("id", p.id);
      }

      if (slackUserId) {
        const outcome = await inviteToChannel(
          SLACK_GENERAL_CHANNEL_ID,
          slackUserId,
        );
        await supabaseAdmin
          .from("talent_profiles")
          .update({ slack_general_joined_at: new Date().toISOString() })
          .eq("id", p.id);
        if (outcome === "invited") {
          result.added++;
          await postChannelMessage(
            SLACK_GENERAL_CHANNEL_ID,
            `Welcome <@${slackUserId}> to the Tech Faculty talent pool. Updates, assessments and new paid tasks are shared here.`,
          );
        }
        continue;
      }

      const count = p.slack_invite_count ?? 0;
      const last = p.slack_invite_sent_at
        ? new Date(p.slack_invite_sent_at).getTime()
        : 0;
      if (count >= MAX_REMINDERS || now - last < REMINDER_GAP_MS) continue;
      await sendTemplateEmail("talent-slack-invite", p.email!, {
        templateData: {
          name: p.full_name,
          email: p.email,
          slackUrl: SLACK_JOIN_URL,
          reminder: count > 0,
        },
        idempotencyKey: `talent-slack-invite-${p.id}-${count + 1}`,
        replyTo: HR_REPLY_TO,
      });
      await supabaseAdmin
        .from("talent_profiles")
        .update({
          slack_invite_sent_at: new Date().toISOString(),
          slack_invite_count: count + 1,
        })
        .eq("id", p.id);
      result.reminded++;
    } catch (e) {
      result.failed++;
      console.error("talent pool sync failed", p.id, (e as Error).message);
    }
  }
  return result;
}
