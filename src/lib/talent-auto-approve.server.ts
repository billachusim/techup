// Server-only: approves every new talent profile without waiting for staff.
// Rule in src/lib/talent-approval-rules.ts. Approval only approves and lists the
// talent: it never mints a Faculty ID and never gives the Vetted badge (that
// comes from passing an assessment/work trial). A student's existing ID is
// linked and students are vetted (rules in public.approve_talent).
// No "approved" email: the "profile received" email is the only one they get.

import { profilesToAutoApprove } from "@/lib/talent-approval-rules";

export async function autoApproveStrongProfiles(talentIds?: string[]): Promise<{ approved: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let q = supabaseAdmin
    .from("talent_profiles")
    .select("id, full_name, approved_at")
    .is("approved_at", null)
    .limit(300);
  if (talentIds?.length) q = q.in("id", talentIds);
  const { data: candidates } = await q;
  if (!candidates?.length) return { approved: 0 };

  const { data: done } = await supabaseAdmin
    .from("admin_audit_log")
    .select("target_id")
    .eq("action", "talent.auto_approved")
    .in("target_id", candidates.map((t) => t.id));
  const approvedBefore = new Set((done ?? []).map((r) => String(r.target_id)));

  let approved = 0;
  for (const t of profilesToAutoApprove(candidates, approvedBefore)) {
    const { data: facultyId, error } = await supabaseAdmin.rpc("approve_talent", { _talent_id: t.id });
    if (error) {
      console.error("auto-approve failed", t.id, error.message);
      continue;
    }
    approved++;
    await supabaseAdmin.from("admin_audit_log").insert({
      action: "talent.auto_approved",
      actor_email: "automation",
      target_table: "talent_profiles",
      target_id: t.id,
      faculty_id: facultyId ? String(facultyId) : null,
      subject: t.full_name,
      details: { rule: "every saved talent profile is approved" },
    });
  }
  return { approved };
}
