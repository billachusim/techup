import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent-CymeyHOO.js
var talent_exports = /* @__PURE__ */ __exportAll({
	APPLICATION_STATUS_LABEL: () => APPLICATION_STATUS_LABEL,
	DELIVERABLE_STATUS_LABEL: () => DELIVERABLE_STATUS_LABEL,
	EMPLOYMENT_LABEL: () => EMPLOYMENT_LABEL,
	ENGAGEMENT_STATUS_LABEL: () => ENGAGEMENT_STATUS_LABEL,
	INTERVIEW_CHANNEL_LABEL: () => INTERVIEW_CHANNEL_LABEL,
	MATCH_STATUS_LABEL: () => MATCH_STATUS_LABEL,
	ROLE_KIND_LABEL: () => ROLE_KIND_LABEL,
	SELECTION_PROCESS_LABEL: () => SELECTION_PROCESS_LABEL,
	SENIORITY_LABEL: () => SENIORITY_LABEL,
	SKILL_SUGGESTIONS: () => SKILL_SUGGESTIONS,
	TALENT_WHATSAPP_NUMBER: () => TALENT_WHATSAPP_NUMBER,
	WORK_MODE_LABEL: () => WORK_MODE_LABEL,
	contactUrl: () => contactUrl,
	fetchProjectGroupUrl: () => fetchProjectGroupUrl,
	fetchProjectWorkspace: () => fetchProjectWorkspace,
	fetchPublicTalent: () => fetchPublicTalent,
	fetchPublicTalentById: () => fetchPublicTalentById,
	fetchPublishedRoles: () => fetchPublishedRoles,
	fetchRoleBySlug: () => fetchRoleBySlug,
	formatBudget: () => formatBudget,
	formatMoney: () => formatMoney,
	hasWorkspaceLinks: () => hasWorkspaceLinks,
	hiringStepsText: () => hiringStepsText,
	introRequestUrl: () => introRequestUrl,
	openingsLabel: () => openingsLabel,
	parseList: () => parseList,
	profileStrength: () => profileStrength,
	projectManagerUrl: () => projectManagerUrl,
	roleBadges: () => roleBadges,
	roleLocationLabel: () => roleLocationLabel,
	slugify: () => slugify,
	startOfWeek: () => startOfWeek,
	talentWhatsAppUrl: () => talentWhatsAppUrl,
	weeksSince: () => weeksSince
});
var TALENT_WHATSAPP_NUMBER = "2348068597140";
var talentWhatsAppUrl = (message) => `https://wa.me/${TALENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
var ROLE_KIND_LABEL = {
	internal: "In-house team",
	partner: "Project role",
	client: "Client project"
};
/**
* Card badges describe the work, not who owns it: category first, then
* anything a candidate needs to notice at a glance.
*/
var roleBadges = (role) => {
	const badges = [];
	if (role.category) badges.push(role.category);
	if (role.is_paid_training) badges.push("Paid training");
	badges.push(EMPLOYMENT_LABEL[role.employment_type] ?? role.employment_type);
	if (role.is_remote) badges.push(role.city ? "Hybrid" : "Remote");
	if ((Date.now() - new Date(role.created_at).getTime()) / 864e5 <= 14) badges.push("New");
	return badges;
};
var openingsLabel = (openings) => openings === 1 ? "1 opening" : `${openings} openings`;
var EMPLOYMENT_LABEL = {
	full_time: "Full-time",
	part_time: "Part-time",
	contract: "Contract",
	internship: "Internship",
	freelance: "Freelance"
};
var SENIORITY_LABEL = {
	entry: "Entry level",
	mid: "Mid level",
	senior: "Senior",
	lead: "Lead"
};
var WORK_MODE_LABEL = {
	remote: "Remote",
	hybrid: "Hybrid",
	onsite: "On-site"
};
var UNIT_LABEL = {
	MONTH: "month",
	WEEK: "week",
	HOUR: "hour",
	DAY: "day",
	PROJECT: "project",
	YEAR: "year"
};
var currencySymbol = (code) => code === "USD" ? "$" : code === "NGN" ? "₦" : `${code} `;
var formatMoney = (amount, currency) => `${currencySymbol(currency)}${Math.round(amount).toLocaleString("en-NG")}`;
var formatBudget = (role) => {
	if (role.pay_text?.trim()) return role.pay_text.trim();
	const unit = UNIT_LABEL[role.budget_unit] ?? role.budget_unit.toLowerCase();
	if (role.budget_min && role.budget_max) return `${formatMoney(role.budget_min, role.budget_currency)} – ${formatMoney(role.budget_max, role.budget_currency)} / ${unit}`;
	if (role.budget_min) return `From ${formatMoney(role.budget_min, role.budget_currency)} / ${unit}`;
	if (role.budget_max) return `Up to ${formatMoney(role.budget_max, role.budget_currency)} / ${unit}`;
	return "Pay discussed on shortlist";
};
var roleLocationLabel = (role) => {
	if (role.is_remote && !role.city) return `Remote (${role.country})`;
	if (role.is_remote && role.city) return `${role.city}, ${role.country} · Remote friendly`;
	return [role.city, role.country].filter(Boolean).join(", ");
};
async function fetchPublishedRoles(kind) {
	let query = (await getSupabase()).from("talent_roles").select("*").eq("status", "published").order("is_featured", { ascending: false }).order("created_at", { ascending: false });
	if (kind) query = query.eq("role_kind", kind);
	const { data, error } = await query;
	if (error) throw error;
	return data ?? [];
}
async function fetchRoleBySlug(slug) {
	const { data, error } = await (await getSupabase()).from("talent_roles").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data;
}
var SKILL_SUGGESTIONS = [
	"JavaScript",
	"React",
	"TypeScript",
	"Node.js",
	"Python",
	"Data analysis",
	"Excel",
	"Power BI",
	"SQL",
	"UI/UX design",
	"Graphic design",
	"Figma",
	"Digital marketing",
	"Social media",
	"Sales",
	"Marketing",
	"Project management",
	"Copywriting",
	"Cyber security",
	"Networking",
	"Machine learning",
	"Prompt engineering",
	"Data annotation",
	"Customer support",
	"WordPress",
	"Mobile development",
	"Flutter",
	"Video editing",
	"Bookkeeping",
	"Virtual assistance"
];
function profileStrength(p) {
	let score = 0;
	if (p.full_name) score += 10;
	if (p.city) score += 5;
	if (p.phone) score += 10;
	if ((p.skills?.length ?? 0) >= 3) score += 15;
	else if ((p.skills?.length ?? 0) > 0) score += 7;
	if (p.cv_path) score += 15;
	if (p.headline) score += 10;
	if (p.bio && p.bio.length > 80) score += 10;
	if (p.linkedin_url) score += 5;
	if (p.github_url || p.portfolio_url) score += 5;
	if (p.years_experience != null) score += 5;
	if (p.hours_per_week != null) score += 5;
	if (p.rate_amount != null) score += 5;
	return Math.min(100, score);
}
var parseList = (value) => value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
var slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
var SELECTION_PROCESS_LABEL = {
	direct: "No assessment or interview",
	assessment: "Assessment",
	interview: "Interview",
	assessment_interview: "Assessment and interview"
};
var INTERVIEW_CHANNEL_LABEL = {
	whatsapp: "WhatsApp call",
	google_meet: "Google Meet"
};
var hiringStepsText = (role) => {
	const p = role.selection_process ?? "direct";
	const via = INTERVIEW_CHANNEL_LABEL[role.interview_channel ?? "whatsapp"] ?? "WhatsApp call";
	if (p === "assessment") return "Shortlisted talent will be emailed a short assessment link. Selected talent are then added to the project Slack.";
	if (p === "interview") return `Shortlisted talent will be emailed a link to book an interview (${via}). Selected talent are then added to the project Slack.`;
	if (p === "assessment_interview") return `Shortlisted talent will be emailed an assessment link, then a link to book an interview (${via}). Selected talent are then added to the project Slack.`;
	return "No assessment or interview. Selected talent are added straight to the project Slack.";
};
var MATCH_STATUS_LABEL = {
	suggested: "Awaiting review",
	approved: "Shared with talent",
	accepted: "Talent accepted",
	assessment: "In assessment",
	interview: "In interview",
	shortlisted: "Shortlisted",
	interviewed: "Interviewed",
	offer_sent: "Offer sent",
	hired: "Hired",
	onboarded: "Onboarded",
	unresponsive: "Unresponsive",
	declined: "Declined"
};
var APPLICATION_STATUS_LABEL = {
	applied: "Applied",
	shortlisted: "Shortlisted",
	assessment: "Assessment",
	interviewing: "Interviewing",
	interviewed: "Interviewed",
	selected: "Selected",
	offer_sent: "Offer sent",
	hired: "Hired",
	onboarded: "Onboarded",
	unresponsive: "Unresponsive",
	rejected: "Not selected"
};
var ENGAGEMENT_STATUS_LABEL = {
	active: "Active",
	paused: "Paused",
	ended: "Ended"
};
async function fetchPublicTalent() {
	const { data, error } = await (await getSupabase()).rpc("list_public_talent");
	if (error) throw error;
	return data ?? [];
}
async function fetchPublicTalentById(id) {
	const { data, error } = await (await getSupabase()).rpc("get_public_talent", { profile_id: id });
	if (error) throw error;
	return data?.[0] ?? null;
}
async function fetchProjectGroupUrl(roleId) {
	const { data, error } = await (await getSupabase()).rpc("get_project_group_url", { _role_id: roleId });
	if (error) return null;
	return data ?? null;
}
var DELIVERABLE_STATUS_LABEL = {
	submitted: "Submitted",
	reviewed: "Reviewed",
	needs_changes: "Needs changes"
};
/** Project links are only readable by matched talent and staff (database gated). */
async function fetchProjectWorkspace(roleId) {
	const { data, error } = await (await getSupabase()).rpc("get_project_workspace", { _role_id: roleId });
	if (error) return null;
	return data?.[0] ?? null;
}
var hasWorkspaceLinks = (w) => Boolean(w && (w.whatsapp_group_url || w.slack_channel_url || w.task_board_url || w.drive_url || w.project_brief));
var startOfWeek = (date = /* @__PURE__ */ new Date()) => {
	const d = new Date(date);
	const day = (d.getDay() + 6) % 7;
	d.setDate(d.getDate() - day);
	return d.toISOString().slice(0, 10);
};
var introRequestUrl = (name, skills) => talentWhatsAppUrl(`Hello Tech Faculty, I would like an introduction to ${name} from your talent pool` + (skills.length ? ` (${skills.slice(0, 4).join(", ")}).` : ".") + " Please tell me about availability and rates.");
var contactUrl = (phone, name) => {
	const digits = (phone ?? "").replace(/\D/g, "");
	const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
	const message = `Hello ${name.split(" ")[0]}, this is Tech Faculty about a role you were matched to.`;
	return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};
var projectManagerUrl = (roleTitle, talentName) => talentWhatsAppUrl(`Hello Tech Faculty, I am ${talentName ?? "a matched talent"} and I was matched to "${roleTitle}". I would like to speak with the project manager about the assessment and next steps.`);
var weeksSince = (isoDate) => {
	const start = new Date(isoDate).getTime();
	if (Number.isNaN(start)) return 0;
	return Math.max(1, Math.floor((Date.now() - start) / 6048e5) + 1);
};
//#endregion
export { startOfWeek as A, openingsLabel as C, roleBadges as D, projectManagerUrl as E, talent_exports as M, weeksSince as N, roleLocationLabel as O, introRequestUrl as S, profileStrength as T, fetchRoleBySlug as _, MATCH_STATUS_LABEL as a, hasWorkspaceLinks as b, SENIORITY_LABEL as c, contactUrl as d, fetchProjectGroupUrl as f, fetchPublishedRoles as g, fetchPublicTalentById as h, ENGAGEMENT_STATUS_LABEL as i, talentWhatsAppUrl as j, slugify as k, SKILL_SUGGESTIONS as l, fetchPublicTalent as m, DELIVERABLE_STATUS_LABEL as n, ROLE_KIND_LABEL as o, fetchProjectWorkspace as p, EMPLOYMENT_LABEL as r, SELECTION_PROCESS_LABEL as s, APPLICATION_STATUS_LABEL as t, WORK_MODE_LABEL as u, formatBudget as v, parseList as w, hiringStepsText as x, formatMoney as y };
