//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent-auto-approve.server-C4a4URl_.js
/**
* Approves unapproved profiles at or above the bar, once per profile: if staff
* later un-vet someone, the automation doesn't approve them again.
*/
async function autoApproveStrongProfiles(talentIds) {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { sendTemplateEmail } = await import("../_libs/_9.mjs");
	let q = supabaseAdmin.from("talent_profiles").select("id, full_name, email, profile_strength, user_id, faculty_id").eq("is_vetted", false).or(`profile_strength.gte.70,user_id.not.is.null,faculty_id.not.is.null`).limit(300);
	if (talentIds?.length) q = q.in("id", talentIds);
	const { data: candidates } = await q;
	const { loadFacultyTalent } = await import("./faculty-talent.server-B-YSam5u.mjs");
	const students = await loadFacultyTalent(candidates ?? []);
	const profiles = (candidates ?? []).filter((t) => t.profile_strength >= 70 || students.has(t.id));
	if (!profiles.length) return { approved: 0 };
	const { data: done } = await supabaseAdmin.from("admin_audit_log").select("target_id").eq("action", "talent.auto_approved").in("target_id", profiles.map((t) => t.id));
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
			details: { rule: students.has(t.id) ? "Tech Faculty student or alumnus" : `profile strength 70%+` }
		});
		if (t.email) await sendTemplateEmail("talent-approved", t.email, {
			templateData: {
				name: t.full_name,
				facultyId: facultyId ?? void 0
			},
			idempotencyKey: `talent-approved-${t.id}`
		}).catch((e) => console.error("talent-approved email failed", e.message));
	}
	return { approved };
}
//#endregion
export { autoApproveStrongProfiles };
