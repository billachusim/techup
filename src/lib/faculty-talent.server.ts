// Server-only: which talent are Tech Faculty students or alumni, and what they studied.
// A Faculty ID counts when it came from registering for a course, not from the old
// talent-board rule that minted IDs for complete profiles (hear_about_us 'talent_marketplace').

export type FacultyTalent = { facultyId: string; field: string | null };

export async function loadFacultyTalent(
  talents: { id: string; user_id?: string | null; faculty_id?: string | null }[],
): Promise<Map<string, FacultyTalent>> {
  const out = new Map<string, FacultyTalent>();
  if (!talents.length) return out;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const userIds = [...new Set(talents.map((t) => t.user_id).filter((x): x is string => !!x))];
  const { data: profiles } = userIds.length
    ? await supabaseAdmin.from("profiles").select("id, faculty_id, department").in("id", userIds)
    : { data: [] };
  const byUser = new Map((profiles ?? []).map((p) => [p.id, p]));

  const idFor = (t: (typeof talents)[number]) => t.faculty_id || (t.user_id ? byUser.get(t.user_id)?.faculty_id : null) || null;
  const ids = [...new Set(talents.map(idFor).filter((x): x is string => !!x))];
  if (!ids.length) return out;
  const { data: rows } = await supabaseAdmin
    .from("faculty_ids")
    .select("faculty_id, hear_about_us, department, course_interest")
    .in("faculty_id", ids);
  const byId = new Map((rows ?? []).filter((r) => r.hear_about_us !== "talent_marketplace").map((r) => [r.faculty_id, r]));

  for (const t of talents) {
    const fid = idFor(t);
    const row = fid ? byId.get(fid) : undefined;
    if (!fid || !row) continue;
    const dept = t.user_id ? byUser.get(t.user_id)?.department : null;
    out.set(t.id, { facultyId: fid, field: dept || row.department || row.course_interest || null });
  }
  return out;
}
