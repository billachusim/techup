import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/public-requests.functions-9rJt4WWz.js
var RECENT_MS = 6e5;
var isEmail = (v) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
async function sendSafely(template, to, templateData, key) {
	if (!to) return;
	try {
		const { sendTemplateEmail } = await import("../_libs/_9.mjs");
		await sendTemplateEmail(template, to, {
			templateData,
			idempotencyKey: `${template}-${key}`
		});
	} catch (e) {
		console.error("public request email failed", template, e.message);
	}
}
/** Confirms a client's "introduce me to this talent" request and alerts staff. */
var notifyIntroRequest_createServerFn_handler = createServerRpc({
	id: "9f108984c97f03abfcd9dc74908c9e0097c9b8810cee92fed3d983e6b2e1696a",
	name: "notifyIntroRequest",
	filename: "src/lib/public-requests.functions.ts"
}, (opts) => notifyIntroRequest.__executeServer(opts));
var notifyIntroRequest = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	talentId: stringType().uuid(),
	contact: stringType().min(5).max(160)
}).parse(d)).handler(notifyIntroRequest_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: req } = await supabaseAdmin.from("talent_interest_requests").select("id, created_at, requester_name, requester_org, requester_contact, message, talent_profiles(full_name)").eq("talent_profile_id", data.talentId).eq("requester_contact", data.contact.trim()).order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (!req || Date.now() - new Date(req.created_at).getTime() > RECENT_MS) return { ok: false };
	const talentName = req.talent_profiles?.full_name;
	if (isEmail(req.requester_contact)) await sendSafely("intro-request-received", req.requester_contact, {
		requesterName: req.requester_name,
		talentName
	}, req.id);
	await sendSafely("intro-request-admin", "staff", {
		requesterName: req.requester_name,
		requesterOrg: req.requester_org,
		requesterContact: req.requester_contact,
		talentName,
		message: req.message
	}, req.id);
	return { ok: true };
});
var notifyHiringRequest_createServerFn_handler = createServerRpc({
	id: "c835ab5c71cf756397042d3a0656f280ee5374020cb5591a1c71ee1ed25b7371",
	name: "notifyHiringRequest",
	filename: "src/lib/public-requests.functions.ts"
}, (opts) => notifyHiringRequest.__executeServer(opts));
var notifyHiringRequest = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ briefId: stringType().uuid() }).parse(d)).handler(notifyHiringRequest_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: brief } = await supabaseAdmin.from("business_briefs").select("id, created_at, company, contact_name, email, phone, project_title").eq("id", data.briefId).maybeSingle();
	if (!brief || Date.now() - new Date(brief.created_at).getTime() > RECENT_MS) return { ok: false };
	if (isEmail(brief.email)) await sendSafely("hiring-request-received", brief.email, {
		contactName: brief.contact_name,
		company: brief.company,
		projectTitle: brief.project_title
	}, brief.id);
	await sendSafely("hiring-request-admin", "staff", {
		contactName: brief.contact_name,
		company: brief.company,
		projectTitle: brief.project_title,
		phone: brief.phone,
		email: brief.email
	}, brief.id);
	return { ok: true };
});
//#endregion
export { notifyHiringRequest_createServerFn_handler, notifyIntroRequest_createServerFn_handler };
