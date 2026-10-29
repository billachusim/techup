import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/marketplace-emails.functions-CRcvXEZh.js
var Input = objectType({
	event: enumType([
		"application_submitted",
		"match_updated",
		"deliverable_reviewed",
		"talent_approved",
		"profile_submitted",
		"intro_approved",
		"slack_link"
	]),
	id: stringType().uuid()
});
var MATCH_EMAIL_STATUSES = [
	"approved",
	"accepted",
	"assessment",
	"interview",
	"hired"
];
/**
* Sends the marketplace email for one event. The recipient is always looked up
* server-side from the record — callers only pass the event and record id.
*/
var notifyMarketplaceEvent_createServerFn_handler = createServerRpc({
	id: "270e17d756963778b4df9826f19b475394808832d5870aeff0fbbc118e9179b4",
	name: "notifyMarketplaceEvent",
	filename: "src/lib/marketplace-emails.functions.ts"
}, (opts) => notifyMarketplaceEvent.__executeServer(opts));
var notifyMarketplaceEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(notifyMarketplaceEvent_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { sendTemplateEmail } = await import("../_libs/_9.mjs");
	const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	const send = async (template, to, templateData, key) => {
		if (!to) return;
		try {
			await sendTemplateEmail(template, to, {
				templateData,
				idempotencyKey: `${template}-${key}`
			});
		} catch (e) {
			console.error("marketplace email failed", template, e.message);
		}
	};
	if (data.event === "application_submitted") {
		const { data: app } = await supabaseAdmin.from("talent_applications").select("id, talent_profiles(user_id, full_name, email), talent_roles(title, company)").eq("id", data.id).maybeSingle();
		const p = app?.talent_profiles, r = app?.talent_roles;
		if (!app || p?.user_id !== context.userId) return { ok: false };
		await send("application-received", p.email, {
			name: p.full_name,
			roleTitle: r?.title,
			company: r?.company
		}, app.id);
		await send("new-application-admin", "staff", {
			talentName: p.full_name,
			roleTitle: r?.title,
			company: r?.company
		}, app.id);
		return { ok: true };
	}
	if (data.event === "profile_submitted") {
		const { data: p } = await supabaseAdmin.from("talent_profiles").select("id, user_id, full_name, email, faculty_id, profile_strength").eq("id", data.id).maybeSingle();
		if (!p || p.user_id !== context.userId && !staff) return { ok: false };
		await send("profile-submitted", p.email, {
			name: p.full_name,
			strength: p.profile_strength,
			facultyId: p.faculty_id
		}, `${p.id}-${p.profile_strength}`);
		return { ok: true };
	}
	if (!staff) return { ok: false };
	if (data.event === "intro_approved") {
		const { data: req } = await supabaseAdmin.from("talent_interest_requests").select("id, requester_name, requester_contact, status, talent_profiles(full_name)").eq("id", data.id).maybeSingle();
		if (!req || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(req.requester_contact ?? "")) return { ok: false };
		await send("intro-approved", req.requester_contact, {
			requesterName: req.requester_name,
			talentName: req.talent_profiles?.full_name
		}, req.id);
		return { ok: true };
	}
	if (data.event === "slack_link") {
		if (!staff) return { ok: false };
		const { data: m } = await supabaseAdmin.from("role_matches").select("id, talent_profiles(full_name, email), talent_roles(title, company, slack_channel_url)").eq("id", data.id).maybeSingle();
		const p = m?.talent_profiles, r = m?.talent_roles;
		if (!m || !r?.slack_channel_url || !p?.email) return {
			ok: false,
			reason: !r?.slack_channel_url ? "No project Slack link is saved for this role." : "This talent has no email."
		};
		await send("match-update", p.email, {
			name: p.full_name,
			roleTitle: r.title,
			company: r.company,
			status: "slack_link",
			slackUrl: r.slack_channel_url
		}, `${m.id}-slack-${Date.now()}`);
		return { ok: true };
	}
	if (data.event === "match_updated") {
		const { data: m } = await supabaseAdmin.from("role_matches").select("id, status, talent_profiles(full_name, email), talent_roles(title, company, assessment_url, interview_url, interview_channel)").eq("id", data.id).maybeSingle();
		if (!m || !MATCH_EMAIL_STATUSES.includes(m.status)) return { ok: false };
		const p = m.talent_profiles, r = m.talent_roles;
		await send("match-update", p?.email, {
			name: p?.full_name,
			roleTitle: r?.title,
			company: r?.company,
			status: m.status,
			assessmentUrl: r?.assessment_url,
			interviewUrl: r?.interview_url,
			interviewChannel: r?.interview_channel
		}, `${m.id}-${m.status}`);
		return { ok: true };
	}
	if (data.event === "deliverable_reviewed") {
		const { data: d } = await supabaseAdmin.from("talent_deliverables").select("id, title, status, reviewer_note, updated_at, talent_profiles(full_name, email), talent_roles(title)").eq("id", data.id).maybeSingle();
		if (!d || d.status === "submitted") return { ok: false };
		const p = d.talent_profiles, r = d.talent_roles;
		await send("deliverable-reviewed", p?.email, {
			name: p?.full_name,
			title: d.title,
			roleTitle: r?.title,
			status: d.status,
			note: d.reviewer_note
		}, `${d.id}-${d.updated_at}`);
		return { ok: true };
	}
	const { data: t } = await supabaseAdmin.from("talent_profiles").select("id, full_name, email, faculty_id, is_vetted").eq("id", data.id).maybeSingle();
	if (!t?.is_vetted) return { ok: false };
	await send("talent-approved", t.email, {
		name: t.full_name,
		facultyId: t.faculty_id
	}, t.id);
	return { ok: true };
});
//#endregion
export { notifyMarketplaceEvent_createServerFn_handler };
