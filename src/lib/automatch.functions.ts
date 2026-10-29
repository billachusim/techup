import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  roleId: z.string().uuid().optional(),
  talentId: z.string().uuid().optional(),
});

/**
 * Runs auto-matching after a role is published (staff) or a talent saves
 * their profile (the owner). Never throws to the caller.
 */
export const triggerAutoMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data, context }) => {
    if (!data.roleId && !data.talentId) return { ok: false, created: 0, promoted: 0 };
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (data.roleId && !staff) return { ok: false, created: 0, promoted: 0 };
    if (data.talentId && !staff) {
      const { data: own } = await context.supabase
        .from("talent_profiles")
        .select("id")
        .eq("id", data.talentId)
        .eq("user_id", context.userId)
        .maybeSingle();
      if (!own) return { ok: false, created: 0, promoted: 0 };
    }
    try {
      const { runAutoMatch } = await import("@/lib/matching.server");
      const res = await runAutoMatch({
        roleIds: data.roleId ? [data.roleId] : undefined,
        talentIds: data.talentId ? [data.talentId] : undefined,
      });
      return { ok: true, created: res.created, promoted: res.promoted };
    } catch (e) {
      console.error("auto-match trigger failed", (e as Error).message);
      return { ok: false, created: 0, promoted: 0 };
    }
  });
