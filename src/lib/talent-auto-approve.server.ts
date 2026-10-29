// Server-only: approves strong talent profiles without waiting for staff.
// Rules (Bill, 2026-10-29): profile strength 70% or more, or a Tech Faculty student
// or alumnus (Faculty ID from a course) at any strength. Approval never mints a
// Faculty ID; a student's existing ID is linked.

export const AUTO_APPROVE_MIN_STRENGTH = 70;

/**
 * Approves unapproved profiles at or above the bar, once per profile: if staff
 * later un-vet someone, the automation doesn't approve them again.
 */
export async function autoApproveStrongProfiles(talentIds?: string[]): Promise<{ approved: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
  let q = supabaseAdmin
    .from("talent_profiles")
    .select("id, full_name, email, profile_strength, user_id, faculty_id")
    .eq("is_vetted", false)
    .or(`profile_strength.gte.${AUTO_APPROVE_MIN_STRENGTH},user_id.not.is.null,faculty_id.not.is.null`)
    .limit(300);
  if (talentIds?.length) q = q.in("id", talentIds);
  const { data: candidates } = await q;
  const { loadFacultyTalent } = await import("@/lib/faculty-talent.server");
  const students = await loadFacultyTalent(candidates ?? []);
  const profiles = (candidates ?? []).filter((t) => t.profile_strength >= AUTO_APPROVE_MIN_STRENGTH || students.has(t.id));
  if (!profiles.length) return { approved: 0 };

  const { data: done } = await supabaseAdmin
    .from("admin_audit_log")
    .select("target_id")
    .eq("action", "talent.auto_approved")
    .in("target_id", profiles.map((t) => t.id));
  const approvedBefore = new Set((done ?? []).map((r) => r.target_id));

  let approved = 0;
  for (const t of profiles.filter((p) => !approvedBefore.has(p.id))) {
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
      details: { rule: students.has(t.id) ? "Tech Faculty student or alumnus" : `profile strength ${AUTO_APPROVE_MIN_STRENGTH}%+` },
    });
    if (t.email) {
      await sendTemplateEmail("talent-approved", t.email, {
        templateData: { name: t.full_name, facultyId: facultyId ?? undefined },
        idempotencyKey: `talent-approved-${t.id}`,
      }).catch((e) => console.error("talent-approved email failed", (e as Error).message));
    }
  }
  return { approved };
}
