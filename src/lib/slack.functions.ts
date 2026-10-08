import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Channels the admin can pick from when wiring a project workspace. */
export const listSlackChannels = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Staff only");
    try {
      const { listChannels } = await import("@/lib/slack.server");
      return { ok: true as const, channels: await listChannels() };
    } catch (e) {
      return { ok: false as const, channels: [], error: (e as Error).message };
    }
  });

const SyncInput = z.object({ matchId: z.string().uuid() });

/**
 * Slack side of the hiring flow.
 * Matched (approved) -> general talent channel.
 * Selected for the project (accepted / hired) -> that project's own channel too.
 */
export const syncSlackForMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SyncInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) return { ok: false as const, notes: ["Staff only"] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { SLACK_GENERAL_CHANNEL_ID, findSlackUserByEmail, inviteToChannel, postChannelMessage } = await import(
      "@/lib/slack.server"
    );

    const { data: match } = await supabaseAdmin
      .from("role_matches")
      .select("id, status, talent_profile_id, role_id, talent_profiles(id, full_name, email, slack_user_id), talent_roles(title, company, slack_channel_id)")
      .eq("id", data.matchId)
      .maybeSingle();
    if (!match) return { ok: false as const, notes: ["Match not found"] };

    const profile = match.talent_profiles;
    const role = match.talent_roles;
    const notes: string[] = [];

    let slackUserId: string | null = profile?.slack_user_id ?? null;
    try {
      if (!slackUserId) {
        slackUserId = await findSlackUserByEmail(profile?.email);
        if (slackUserId) {
          await supabaseAdmin.from("talent_profiles").update({ slack_user_id: slackUserId }).eq("id", profile.id);
        }
      }
    } catch (e) {
      return { ok: false as const, notes: [(e as Error).message] };
    }

    if (!slackUserId) {
      return {
        ok: false as const,
        notes: [`${profile?.full_name ?? "This talent"} has no Slack account on ${profile?.email ?? "their email"} yet. Invite them to the workspace first.`],
      };
    }

    const wantsGeneral = ["approved", "accepted", "assessment", "interview", "hired"].includes(match.status);
    const wantsProject = ["accepted", "hired"].includes(match.status);

    if (wantsGeneral) {
      try {
        const outcome = await inviteToChannel(SLACK_GENERAL_CHANNEL_ID, slackUserId);
        notes.push(outcome === "invited" ? "Added to the general talent channel." : "Already in the general talent channel.");
        if (outcome === "invited") {
          await supabaseAdmin
            .from("talent_profiles")
            .update({ slack_general_joined_at: new Date().toISOString() })
            .eq("id", profile.id);
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
          await supabaseAdmin
            .from("role_matches")
            .update({ slack_invited_at: new Date().toISOString() })
            .eq("id", match.id);
        } catch (e) {
          notes.push(`Project channel: ${(e as Error).message}`);
        }
      }
    }

    if (!wantsGeneral) notes.push("This status does not trigger Slack access.");
    return { ok: true as const, notes };
  });
