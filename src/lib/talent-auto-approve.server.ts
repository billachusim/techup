// Server-only: approves strong talent profiles without waiting for staff.
// Rule (Bill, 2026-10-29): profile strength 70% or more. Approval issues the
// Faculty ID and sends the usual "talent approved" email.

export const AUTO_APPROVE_MIN_STRENGTH = 70;

/**
 * Approves unapproved profiles at or above the bar. Profiles a staff member
 * un-vetted (they keep their Faculty ID or vetted date) are left for staff.
 */
export async function autoApproveStrongProfiles(talentIds?: string[]): Promise<{ approved: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
  let q = supabaseAdmin
    .from("talent_profiles")
    .select("id, full_name, email")
    .eq("is_vetted", false)
    .is("vetted_at", null)
    .is("faculty_id", null)
    .gte("profile_strength", AUTO_APPROVE_MIN_STRENGTH)
    .limit(100);
  if (talentIds?.length) q = q.in("id", talentIds);
  const { data: profiles } = await q;

  let approved = 0;
  for (const t of profiles ?? []) {
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
      details: { rule: `profile strength ${AUTO_APPROVE_MIN_STRENGTH}%+` },
    });
    if (t.email) {
      await sendTemplateEmail("talent-approved", t.email, {
        templateData: { name: t.full_name, facultyId },
        idempotencyKey: `talent-approved-${t.id}`,
      }).catch((e) => console.error("talent-approved email failed", (e as Error).message));
    }
  }
  return { approved };
}
