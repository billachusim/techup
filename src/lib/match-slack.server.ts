// Server-only: Slack + email side effects of a match changing stage.
// Shared by the admin buttons, auto-matching and the HR API.

const MATCH_EMAIL_STATUSES = ["approved", "accepted", "assessment", "interview", "hired"];

/**
 * Matched (approved) -> general talent channel.
 * Selected (accepted / hired / onboarded) -> that project's own channel too.
 */
export async function syncMatchSlack(matchId: string): Promise<{ ok: boolean; notes: string[] }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { SLACK_GENERAL_CHANNEL_ID, findSlackUserByEmail, inviteToChannel, postChannelMessage } = await import(
    "@/lib/slack.server"
  );

  const { data: match } = await supabaseAdmin
    .from("role_matches")
    .select("id, status, talent_profile_id, role_id, talent_profiles(id, full_name, email, slack_user_id), talent_roles(title, company, slack_channel_id)")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) return { ok: false, notes: ["Match not found"] };

  const profile = match.talent_profiles;
  const role = match.talent_roles;
  const notes: string[] = [];

  let slackUserId: string | null = profile?.slack_user_id ?? null;
  try {
    if (!slackUserId) {
      slackUserId = await findSlackUserByEmail(profile?.email);
      if (slackUserId && profile) {
        await supabaseAdmin.from("talent_profiles").update({ slack_user_id: slackUserId }).eq("id", profile.id);
      }
    }
  } catch (e) {
    return { ok: false, notes: [(e as Error).message] };
  }

  if (!slackUserId) {
    return {
      ok: false,
      notes: [`${profile?.full_name ?? "This talent"} has no Slack account on ${profile?.email ?? "their email"} yet. Invite them to the workspace first.`],
    };
  }

  const wantsGeneral = ["approved", "accepted", "assessment", "interview", "hired", "onboarded", "offer_sent", "shortlisted", "interviewed"].includes(match.status);
  const wantsProject = ["accepted", "hired", "onboarded"].includes(match.status);

  if (wantsGeneral) {
    try {
      const outcome = await inviteToChannel(SLACK_GENERAL_CHANNEL_ID, slackUserId);
      notes.push(outcome === "invited" ? "Added to the general talent channel." : "Already in the general talent channel.");
      if (outcome === "invited" && profile) {
        await supabaseAdmin.from("talent_profiles").update({ slack_general_joined_at: new Date().toISOString() }).eq("id", profile.id);
        await postChannelMessage(
          SLACK_GENERAL_CHANNEL_ID,
          `Welcome <@${slackUserId}> to the Tech Faculty talent pool. Matched to *${role?.title ?? "a project"}*.`,
        );
      }
    } catch (e) {
      notes.push(`General channel: ${(e as Error).message}`);
    }
  }

  if (wantsProject) {
    if (!role?.slack_channel_id) {
      notes.push("No Slack channel is set for this project yet — pick one in the project workspace fields.");
    } else {
      try {
        const outcome = await inviteToChannel(role.slack_channel_id, slackUserId);
        notes.push(outcome === "invited" ? "Added to the project Slack channel." : "Already in the project Slack channel.");
        if (outcome === "invited") {
          await postChannelMessage(
            role.slack_channel_id,
            `<@${slackUserId}> has been selected for *${role?.title ?? "this project"}*${role?.company ? ` (${role.company})` : ""}. Welcome aboard.`,
          );
        }
        await supabaseAdmin.from("role_matches").update({ slack_invited_at: new Date().toISOString() }).eq("id", match.id);
      } catch (e) {
        notes.push(`Project channel: ${(e as Error).message}`);
      }
    }
  }

  if (!wantsGeneral) notes.push("This status does not trigger Slack access.");
  return { ok: true, notes };
}

/** Sends the existing "match / selection update" email when the stage has one. */
export async function sendMatchEmail(matchId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
  const { data: m } = await supabaseAdmin
    .from("role_matches")
    .select("id, status, talent_profiles(full_name, email, slack_user_id), talent_roles(title, company, assessment_url, interview_url, interview_channel)")
    .eq("id", matchId)
    .maybeSingle();
  if (!m || !MATCH_EMAIL_STATUSES.includes(m.status) || !m.talent_profiles?.email) return;
  const r = m.talent_roles;
  const { SLACK_JOIN_URL } = await import("@/data/coursePrograms");
  // Talent not yet in the workspace can't be added to the pool, so the email carries the join link.
  const slackUrl = m.talent_profiles.slack_user_id ? null : SLACK_JOIN_URL;
  try {
    await sendTemplateEmail("match-update", m.talent_profiles.email, {
      templateData: { name: m.talent_profiles.full_name, roleTitle: r?.title, company: r?.company, status: m.status, assessmentUrl: r?.assessment_url, interviewUrl: r?.interview_url, interviewChannel: r?.interview_channel, slackUrl },
      idempotencyKey: `match-update-${m.id}-${m.status}`,
    });
  } catch (e) {
    console.error("match email failed", (e as Error).message);
  }
}

/** Email + Slack after a match moves stage, never throwing. */
export async function afterMatchStageChange(matchId: string): Promise<void> {
  await sendMatchEmail(matchId);
  try {
    await syncMatchSlack(matchId);
  } catch (e) {
    console.error("match slack failed", (e as Error).message);
  }
}

/**
 * Retries the talent-pool invite for matched talent who had no Slack account when they were matched.
 * Runs with each auto-match rescan, so joining the workspace later is enough.
 */
export async function retryPendingSlackPool(): Promise<{ checked: number; added: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("role_matches")
    .select("id, talent_profile_id, talent_profiles!inner(slack_general_joined_at)")
    .in("status", ["approved", "accepted", "assessment", "interview", "hired", "onboarded"])
    .is("talent_profiles.slack_general_joined_at", null)
    .limit(200);
  const seen = new Set<string>();
  let added = 0;
  for (const row of data ?? []) {
    if (seen.has(row.talent_profile_id)) continue;
    seen.add(row.talent_profile_id);
    try {
      const res = await syncMatchSlack(row.id);
      if (res.notes.includes("Added to the general talent channel.")) added++;
      // Joined before this column existed: stamp it so we stop rechecking them.
      if (res.notes.includes("Already in the general talent channel.")) {
        await supabaseAdmin.from("talent_profiles").update({ slack_general_joined_at: new Date().toISOString() }).eq("id", row.talent_profile_id);
      }
    } catch (e) {
      console.error("slack pool retry failed", (e as Error).message);
    }
  }
  return { checked: seen.size, added };
}
