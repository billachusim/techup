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

    const { syncMatchSlack } = await import("@/lib/match-slack.server");
    const res = await syncMatchSlack(data.matchId);
    return { ok: res.ok, notes: res.notes } as { ok: boolean; notes: string[] };
  });
