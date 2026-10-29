//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/hr-api-rules-b4N1_q2Y.js
var HR_STATUSES = [
	"matched",
	"shortlisted",
	"interview_invited",
	"assessment_invited",
	"interviewed",
	"selected",
	"offer_sent",
	"hired",
	"onboarded",
	"declined",
	"unresponsive"
];
var MATCH_MAP = {
	matched: "approved",
	selected: "accepted",
	assessment_invited: "assessment",
	interview_invited: "interview"
};
var APPLICATION_MAP = {
	matched: "applied",
	assessment_invited: "assessment",
	interview_invited: "interviewing",
	declined: "rejected"
};
var toMatchStatus = (s) => MATCH_MAP[s] ?? s;
var toApplicationStatus = (s) => APPLICATION_MAP[s] ?? s;
var HR_EMAIL_DEFAULTS = {
	interview_invite: {
		label: "Interview invite",
		subject: "Interview invite: {{role}}",
		body: "Hi {{name}},\n\nThanks for your interest in {{role}}. We'd love to speak with you.\n\nPlease pick a time that suits you here: {{booking_link}}\n\nTech Faculty Talent",
		variables: [
			"name",
			"role",
			"booking_link"
		]
	},
	assessment_invite: {
		label: "Assessment invite",
		subject: "Your assessment for {{role}}",
		body: "Hi {{name}},\n\nThe next step for {{role}} is a short task:\n\n{{task}}\n\nPlease submit by {{deadline}} here: {{submission_link}}\n\nTech Faculty Talent",
		variables: [
			"name",
			"role",
			"task",
			"deadline",
			"submission_link"
		]
	},
	offer: {
		label: "Offer",
		subject: "Your offer for {{role}}",
		body: "Hi {{name}},\n\nCongratulations! We'd like to offer you {{role}}.\n\nRate: {{rate}}\nStart date: {{start_date}}\nManager: {{manager}}\nSlack channel: {{slack_channel}}\n\nReply to confirm and we'll get you set up.\n\nTech Faculty Talent",
		variables: [
			"name",
			"role",
			"rate",
			"start_date",
			"manager",
			"slack_channel"
		]
	},
	decline: {
		label: "Decline",
		subject: "Update on {{role}}",
		body: "Hi {{name}},\n\nThank you for your time on {{role}}. We've gone with another candidate this time.\n\n{{note}}\n\nYou stay in the Tech Faculty talent pool, and we'll reach out when a project fits your skills.\n\nTech Faculty Talent",
		variables: [
			"name",
			"role",
			"note"
		]
	},
	reminder: {
		label: "Reminder",
		subject: "Reminder: {{role}}",
		body: "Hi {{name}},\n\nA quick reminder about {{role}}:\n\n{{message}}\n\nTech Faculty Talent",
		variables: [
			"name",
			"role",
			"message"
		]
	}
};
var isHrEmailKey = (v) => typeof v === "string" && v in HR_EMAIL_DEFAULTS;
/** Fills {{placeholders}}; unknown ones become empty. */
function fillTemplate(text, vars) {
	return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
		const v = vars[k];
		return v == null ? "" : String(v);
	});
}
/** Constant-time compare so the key can't be guessed byte by byte. */
function sameKey(a, b) {
	const x = new TextEncoder().encode(a);
	const y = new TextEncoder().encode(b);
	let diff = x.length ^ y.length;
	for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
	return diff === 0 && a.length > 0;
}
//#endregion
export { sameKey as a, isHrEmailKey as i, HR_STATUSES as n, toApplicationStatus as o, fillTemplate as r, toMatchStatus as s, HR_EMAIL_DEFAULTS as t };
