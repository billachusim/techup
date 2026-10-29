//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/faculty-talent.server-B-YSam5u.js
async function loadFacultyTalent(talents) {
	const out = /* @__PURE__ */ new Map();
	if (!talents.length) return out;
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const userIds = [...new Set(talents.map((t) => t.user_id).filter((x) => !!x))];
	const { data: profiles } = userIds.length ? await supabaseAdmin.from("profiles").select("id, faculty_id, department").in("id", userIds) : { data: [] };
	const byUser = new Map((profiles ?? []).map((p) => [p.id, p]));
	const idFor = (t) => t.faculty_id || (t.user_id ? byUser.get(t.user_id)?.faculty_id : null) || null;
	const ids = [...new Set(talents.map(idFor).filter((x) => !!x))];
	if (!ids.length) return out;
	const { data: rows } = await supabaseAdmin.from("faculty_ids").select("faculty_id, hear_about_us, department, course_interest").in("faculty_id", ids);
	const byId = new Map((rows ?? []).filter((r) => r.hear_about_us !== "talent_marketplace").map((r) => [r.faculty_id, r]));
	for (const t of talents) {
		const fid = idFor(t);
		const row = fid ? byId.get(fid) : void 0;
		if (!fid || !row) continue;
		const dept = t.user_id ? byUser.get(t.user_id)?.department : null;
		out.set(t.id, {
			facultyId: fid,
			field: dept || row.department || row.course_interest || null
		});
	}
	return out;
}
//#endregion
export { loadFacultyTalent };
