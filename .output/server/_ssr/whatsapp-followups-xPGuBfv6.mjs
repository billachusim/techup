//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/whatsapp-followups-xPGuBfv6.js
var WHATSAPP_ADMISSIONS_TEMPLATES = {
	confirmation: "tf_admissions_confirmation",
	follow_up: "tf_admissions_follow_up"
};
var ADMISSIONS_INTERESTS = /* @__PURE__ */ new Set([
	"community_join",
	"whatsapp_chat",
	"free_checklist",
	"siwes_placement",
	"virtual_siwes",
	"free_bootcamp"
]);
var INTEREST_COPY = {
	community_join: "joining the Tech Faculty community",
	whatsapp_chat: "your WhatsApp enquiry",
	free_checklist: "the free SIWES checklist",
	siwes_placement: "a SIWES placement",
	virtual_siwes: "Virtual SIWES",
	free_bootcamp: "the Free Tech Bootcamp"
};
function isEligibleForWhatsAppFollowup(lead) {
	return lead.channel === "whatsapp" && lead.status === "new" && lead.whatsapp_opt_in && !lead.whatsapp_opt_out_at && !(lead.whatsapp_last_inbound_at && new Date(lead.whatsapp_last_inbound_at).getTime() >= new Date(lead.created_at).getTime()) && ADMISSIONS_INTERESTS.has(lead.interest);
}
function hasRepliedSince(lead, sentAt) {
	return !!lead.whatsapp_last_inbound_at && !!sentAt && new Date(lead.whatsapp_last_inbound_at).getTime() >= new Date(sentAt).getTime();
}
function isApprovedUtilityTemplate(templates, name, language = "en_US") {
	return templates.some((template) => template.name === name && template.language === language && template.status === "APPROVED" && template.category?.toUpperCase() === "UTILITY");
}
function isWhatsAppOptOutMessage(text) {
	return /^\s*(stop|unsubscribe|cancel|end|quit)[\s.!]*$/i.test(text);
}
function whatsAppInterestCopy(interest) {
	return INTEREST_COPY[interest] ?? "your enquiry";
}
//#endregion
export { isWhatsAppOptOutMessage as a, isEligibleForWhatsAppFollowup as i, hasRepliedSince as n, whatsAppInterestCopy as o, isApprovedUtilityTemplate as r, WHATSAPP_ADMISSIONS_TEMPLATES as t };
