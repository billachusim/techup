import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type AuditEntry = Omit<Database["public"]["Tables"]["admin_audit_log"]["Insert"], "actor_id" | "actor_email">;

/**
 * Writes a row to the admin activity log for an action done with the service key.
 * The audit triggers can't see who did these (auth.uid() is empty), so the server
 * code records the acting admin itself. Never fails the action it describes.
 */
export async function recordAdminAction(admin: SupabaseClient<Database>, actorId: string, entry: AuditEntry) {
  try {
    const { data: actor } = await admin.auth.admin.getUserById(actorId);
    const { error } = await admin
      .from("admin_audit_log")
      .insert({ ...entry, actor_id: actorId, actor_email: actor?.user?.email ?? null });
    if (error) console.error("Couldn't write admin audit log", error.message);
  } catch (err) {
    console.error("Couldn't write admin audit log", err);
  }
}
