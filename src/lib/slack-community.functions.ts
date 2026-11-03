import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Admin-only: preview what the Slack assistant would reply, without posting. */
export const previewSlackAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { question: string }) => ({ question: String(input.question ?? "").slice(0, 1200) }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Admins only");
    const { draftAnswer } = await import("@/lib/slack-community.server");
    return { reply: await draftAnswer(data.question) };
  });

/** Admin-only: post this week's community update to #general now. */
export const postCommunityUpdateNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Admins only");
    const { runWeeklyCommunityUpdate } = await import("@/lib/slack-community.server");
    return runWeeklyCommunityUpdate();
  });
