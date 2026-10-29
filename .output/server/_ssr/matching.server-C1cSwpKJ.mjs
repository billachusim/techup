import processModule from "node:process";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/matching.server-C1cSwpKJ.js
/** Match stages that fill one of the role's openings. */
var FILLED_STATUSES = ["hired", "onboarded"];
/** Quick keyword score (5-99) used to shortlist before the AI scores. */
function keywordScore(role, c) {
	const have = [...c.skills ?? [], ...c.tools ?? []].map((s) => s.toLowerCase());
	const req = (role.required_skills ?? []).map((s) => s.toLowerCase());
	const nice = (role.nice_to_have ?? []).map((s) => s.toLowerCase());
	const hit = (list) => list.filter((s) => have.some((h) => h.includes(s) || s.includes(h))).length;
	let score = req.length ? hit(req) / req.length * 65 : 40;
	if (nice.length) score += hit(nice) / nice.length * 10;
	if (role.is_remote || role.city && c.city && role.city.toLowerCase() === c.city.toLowerCase()) score += 10;
	score += Math.min(c.profile_strength, 100) * .1;
	if (c.is_vetted) score += 5;
	return Math.max(5, Math.min(99, Math.round(score)));
}
/** Why a role can't take auto-matches right now, or null when it can. */
function autoMatchBlocker(role, filled, globallyPaused) {
	if (globallyPaused) return "Auto-matching is paused";
	if (!role.auto_match_enabled) return "Auto-matching is off for this role";
	if (role.status !== "published") return "Role is not open";
	if (role.applications_closed) return "Applications are closed";
	if (filled >= Math.max(1, role.openings)) return "All openings are filled";
	return null;
}
/** Scores that clear the role's threshold, minus pairs that already exist. */
function pickAutoMatches(scored, threshold, alreadyMatched) {
	const seen = /* @__PURE__ */ new Set();
	return scored.filter((s) => {
		if (s.score < threshold || alreadyMatched.has(s.id) || seen.has(s.id)) return false;
		seen.add(s.id);
		return true;
	});
}
var FIELD_KEYWORDS = {
	"web development": [
		"web",
		"frontend",
		"front-end",
		"backend",
		"back-end",
		"full-stack",
		"fullstack",
		"full stack",
		"react",
		"next.js",
		"javascript",
		"typescript",
		"node",
		"supabase",
		"html",
		"css",
		"wordpress"
	],
	"mobile development": [
		"mobile",
		"android",
		"ios",
		"flutter",
		"react native",
		"expo",
		"kotlin",
		"swift"
	],
	"data science": [
		"data",
		"analyst",
		"analytics",
		"sql",
		"power bi",
		"excel",
		"dashboard",
		"bi",
		"tableau"
	],
	"machine learning": [
		"machine learning",
		"ml",
		"ai",
		"llm",
		"agent",
		"agents",
		"automation",
		"nlp"
	],
	"cyber security": [
		"security",
		"cyber",
		"cybersecurity",
		"soc",
		"penetration",
		"pentest",
		"network"
	],
	"cloud computing": [
		"cloud",
		"aws",
		"azure",
		"gcp",
		"devops",
		"docker",
		"kubernetes"
	],
	"ui/ux design": [
		"ui",
		"ux",
		"figma",
		"product design",
		"designer",
		"user experience"
	],
	"digital marketing": [
		"marketing",
		"seo",
		"social media",
		"content",
		"ads",
		"copywriting"
	],
	"general tech": [
		"virtual assistant",
		"admin",
		"customer support",
		"productivity"
	]
};
var escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The department key for a student's department, plan or course name, if known. */
function fieldKey(field) {
	const f = (field ?? "").toLowerCase();
	if (!f) return null;
	if (FIELD_KEYWORDS[f]) return f;
	if (/web|full.?stack/.test(f)) return "web development";
	if (/mobile/.test(f)) return "mobile development";
	if (/data/.test(f)) return "data science";
	if (/machine|\bai\b|agent|innovator/.test(f)) return "machine learning";
	if (/cyber|security/.test(f)) return "cyber security";
	if (/cloud|devops/.test(f)) return "cloud computing";
	if (/ui|ux|design/.test(f)) return "ui/ux design";
	if (/marketing/.test(f)) return "digital marketing";
	return null;
}
/** FACULTY_FIELD_BOOST when the role is in the field the student studied, else 0. */
function facultyFieldBoost(role, field) {
	const key = fieldKey(field);
	if (!key) return 0;
	const text = [
		role.title ?? "",
		...role.required_skills ?? [],
		...role.nice_to_have ?? []
	].join(" ").toLowerCase();
	return FIELD_KEYWORDS[key].some((w) => new RegExp(`(^|[^a-z0-9])${escape(w)}([^a-z0-9]|$)`).test(text)) ? 10 : 0;
}
async function aiScore(role, shortlist) {
	const key = processModule.env["LOVABLE_API_KEY"];
	if (!key || !shortlist.length) return null;
	const prompt = `You are matching talent to a role for Tech Faculty, a Nigerian tech training and talent company.

ROLE
Title: ${role.title}
Company: ${role.company}
Location: ${role.city ?? "Anywhere"}${role.is_remote ? " (remote friendly)" : " (on-site)"}
Seniority: ${role.seniority}
Summary: ${role.summary}
Description: ${role.description.slice(0, 2e3)}
Required skills: ${(role.required_skills ?? []).join(", ") || "not specified"}
Nice to have: ${(role.nice_to_have ?? []).join(", ") || "none"}

CANDIDATES
${shortlist.map((c, i) => `${i + 1}. id=${c.id}
   location: ${[c.city, c.country].filter(Boolean).join(", ") || "unknown"}
   headline: ${c.headline ?? "-"}
   skills: ${(c.skills ?? []).join(", ") || "-"}
   tools: ${(c.tools ?? []).join(", ") || "-"}
   experience: ${c.years_experience ?? "unknown"} years
   availability: ${c.hours_per_week ?? "?"} hrs/week, ${c.work_mode ?? "?"}
   vetted: ${c.is_vetted ? "yes" : "no"}`).join("\n")}

Return ONLY JSON: {"matches":[{"id":"<candidate id>","score":<0-100>,"reason":"<one sentence, max 200 chars, plain English>"}]}
Score every candidate. Judge on skill fit, seniority fit, location/remote fit and availability. Never invent facts.`;
	try {
		const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "openai/gpt-6-astra",
				reasoning_effort: "low",
				messages: [{
					role: "user",
					content: prompt
				}],
				response_format: { type: "json_object" }
			})
		});
		if (!res.ok) {
			console.error("auto-match AI error", res.status);
			return null;
		}
		const raw = (await res.json())?.choices?.[0]?.message?.content ?? "";
		const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
		if (!Array.isArray(parsed?.matches)) return null;
		return parsed.matches.filter((m) => typeof m?.id === "string" && shortlist.some((c) => c.id === m.id)).map((m) => ({
			id: m.id,
			score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
			reason: String(m.reason ?? "").slice(0, 240) || "Strong fit for this role."
		}));
	} catch (e) {
		console.error("auto-match AI failed", e.message);
		return null;
	}
}
/**
* Scores open roles against open talent and creates matches above each role's threshold.
* Pass roleIds and/or talentIds to narrow the scan; omit both to rescan everything.
*/
async function runAutoMatch(opts = {}) {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { afterMatchStageChange, ensureProjectChannels } = await import("./match-slack.server-B6w5p9Lr.mjs");
	const result = {
		rolesChecked: 0,
		created: 0,
		promoted: 0,
		channelsCreated: 0,
		talentApproved: 0,
		skipped: {}
	};
	if (opts.talentIds?.length || !opts.roleIds?.length) try {
		const { autoApproveStrongProfiles } = await import("./talent-auto-approve.server-C4a4URl_.mjs");
		result.talentApproved = (await autoApproveStrongProfiles(opts.talentIds)).approved;
	} catch (e) {
		console.error("talent auto-approve failed", e.message);
	}
	if (opts.roleIds?.length || !opts.talentIds?.length) try {
		result.channelsCreated = (await ensureProjectChannels(opts.roleIds)).created;
	} catch (e) {
		console.error("project channels failed", e.message);
	}
	const { data: settings } = await supabaseAdmin.from("marketplace_settings").select("auto_match_paused").maybeSingle();
	const paused = !!settings?.auto_match_paused;
	if (paused) {
		result.skipped.all = "Auto-matching is paused";
		return result;
	}
	let rq = supabaseAdmin.from("talent_roles").select("*").eq("status", "published");
	if (opts.roleIds?.length) rq = rq.in("id", opts.roleIds);
	const { data: roles } = await rq;
	let tq = supabaseAdmin.from("talent_profiles").select("id, full_name, city, country, headline, skills, tools, years_experience, hours_per_week, work_mode, is_vetted, profile_strength, user_id, faculty_id").eq("availability", "open").order("profile_strength", { ascending: false }).limit(200);
	if (opts.talentIds?.length) tq = tq.in("id", opts.talentIds);
	const { data: talents } = await tq;
	const pool = talents ?? [];
	const { loadFacultyTalent } = await import("./faculty-talent.server-B-YSam5u.mjs");
	const students = await loadFacultyTalent(pool);
	const boostFor = (role, talentId) => facultyFieldBoost(role, students.get(talentId)?.field);
	for (const role of roles ?? []) {
		result.rolesChecked++;
		const { data: existing } = await supabaseAdmin.from("role_matches").select("id, talent_profile_id, status, score").eq("role_id", role.id);
		const filled = (existing ?? []).filter((m) => FILLED_STATUSES.includes(m.status)).length;
		const blocker = autoMatchBlocker(role, filled, paused);
		if (blocker) {
			result.skipped[role.id] = blocker;
			continue;
		}
		const threshold = role.auto_match_threshold ?? 75;
		const toPromote = (existing ?? []).filter((m) => m.status === "suggested" && m.score + boostFor(role, m.talent_profile_id) >= threshold).map((m) => m.id);
		if (toPromote.length) {
			const { data: promoted } = await supabaseAdmin.from("role_matches").update({ status: "approved" }).in("id", toPromote).eq("status", "suggested").select("id");
			for (const row of promoted ?? []) {
				result.promoted++;
				await afterMatchStageChange(row.id);
			}
		}
		const already = new Set((existing ?? []).map((m) => m.talent_profile_id));
		const fresh = pool.filter((c) => !already.has(c.id));
		if (!fresh.length) continue;
		const shortlist = fresh.map((c) => ({
			c,
			base: keywordScore(role, c) + boostFor(role, c.id)
		})).filter((x) => x.base >= threshold - 25).sort((a, b) => b.base - a.base).slice(0, 15);
		if (!shortlist.length) continue;
		const ai = await aiScore(role, shortlist.map((x) => x.c));
		const picks = pickAutoMatches((ai ?? shortlist.map(({ c, base }) => ({
			id: c.id,
			score: base,
			reason: `Skills overlap with the role requirements${c.city ? ` and based in ${c.city}` : ""}.`
		}))).map((s) => {
			const extra = boostFor(role, s.id);
			if (!extra) return s;
			return {
				id: s.id,
				score: Math.min(100, s.score + (ai ? extra : 0)),
				reason: `${s.reason} Tech Faculty trained in this field (+${extra}).`.slice(0, 280)
			};
		}), threshold, already);
		if (!picks.length) continue;
		const { data: inserted, error } = await supabaseAdmin.from("role_matches").upsert(picks.map((p) => ({
			role_id: role.id,
			talent_profile_id: p.id,
			score: p.score,
			reason: p.reason,
			status: "approved",
			source: "auto"
		})), {
			onConflict: "role_id,talent_profile_id",
			ignoreDuplicates: true
		}).select("id");
		if (error) {
			console.error("auto-match insert failed", error.message);
			continue;
		}
		for (const row of inserted ?? []) {
			result.created++;
			await afterMatchStageChange(row.id);
		}
	}
	return result;
}
//#endregion
export { runAutoMatch };
