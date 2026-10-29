import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { n as awaitingPayment, t as accessEnrollment } from "./enrollment-access-BaRzVf28.mjs";
import { r as findProgram, t as SLACK_JOIN_URL } from "./coursePrograms-ONlp_ggE.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-onboarding.functions-ClMJnWWS.js
/**
* Student onboarding automation: Slack cohort channel + welcome email.
* Safe to call repeatedly — every step is idempotent.
*/
var onboardStudent_createServerFn_handler = createServerRpc({
	id: "d54d4bdb3c1dc6276cc9b320ba1ff68f76e64c162dbc090ff9f2560fe2dbcd0a",
	name: "onboardStudent",
	filename: "src/lib/student-onboarding.functions.ts"
}, (opts) => onboardStudent.__executeServer(opts));
var onboardStudent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(onboardStudent_createServerFn_handler, async ({ context }) => {
	const notes = [];
	const { data: profile } = await context.supabase.from("profiles").select("id, name, email, faculty_id, department, learning_mode, slack_user_id, slack_channel_id, slack_channel_name, slack_joined_at, onboarding_email_sent_at").eq("id", context.userId).maybeSingle();
	if (!profile) return {
		ok: false,
		notes: ["Profile not found"],
		joinUrl: SLACK_JOIN_URL
	};
	const { data: enrollments } = profile.faculty_id ? await context.supabase.from("enrollments").select("plan_name, status").eq("faculty_id", profile.faculty_id).order("created_at", { ascending: false }) : { data: null };
	const access = accessEnrollment(enrollments);
	if (!access && awaitingPayment(enrollments)) return {
		ok: false,
		notes: ["Your payment hasn't been confirmed yet. Your class group opens once it is."],
		joinUrl: SLACK_JOIN_URL
	};
	const program = findProgram(access?.plan_name ?? "Bootcamp Starter");
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	let slackUserId = profile.slack_user_id ?? null;
	let channelId = profile.slack_channel_id ?? null;
	let channelName = profile.slack_channel_name ?? null;
	let joinedAt = profile.slack_joined_at ?? null;
	try {
		const { ensureChannel, findSlackUserByEmail, inviteToChannel, postChannelMessage, SLACK_GENERAL_CHANNEL_ID } = await import("./slack.server-BqTd8c5e.mjs");
		const channel = await ensureChannel(program.channel, program.channelTopic);
		channelId = channel.id;
		channelName = channel.name;
		if (!slackUserId) slackUserId = await findSlackUserByEmail(profile.email);
		if (slackUserId) {
			try {
				await inviteToChannel(SLACK_GENERAL_CHANNEL_ID, slackUserId);
			} catch (e) {
				notes.push(`General channel: ${e.message}`);
			}
			if (await inviteToChannel(channel.id, slackUserId) === "invited") {
				joinedAt = (/* @__PURE__ */ new Date()).toISOString();
				await postChannelMessage(channel.id, `Welcome <@${slackUserId}> to *${program.title}*${profile.faculty_id ? ` (Faculty ID ${profile.faculty_id})` : ""}. Your class topics, notes and weekly assignment are on your dashboard: https://techfaculty.ng/dashboard`);
				notes.push(`Added to #${channel.name}.`);
			} else notes.push(`Already in #${channel.name}.`);
		} else notes.push("No Slack account found on this email yet — join the workspace with the same email.");
	} catch (e) {
		notes.push(e.message);
	}
	await supabaseAdmin.from("profiles").update({
		slack_user_id: slackUserId,
		slack_channel_id: channelId,
		slack_channel_name: channelName,
		slack_joined_at: joinedAt
	}).eq("id", context.userId);
	if (!profile.onboarding_email_sent_at && profile.email) try {
		const { sendTemplateEmail } = await import("../_libs/_9.mjs");
		await sendTemplateEmail("student-welcome", profile.email, {
			templateData: {
				name: profile.name,
				facultyId: profile.faculty_id,
				programme: program.title,
				channel: channelName ?? program.channel,
				slackUrl: SLACK_JOIN_URL,
				learningMode: profile.learning_mode
			},
			idempotencyKey: `student-welcome-${profile.id}-${profile.faculty_id ?? "none"}`
		});
		await supabaseAdmin.from("profiles").update({ onboarding_email_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", context.userId);
		notes.push("Welcome email sent.");
	} catch (e) {
		console.error("student welcome email failed", e.message);
	}
	return {
		ok: true,
		programme: program.title,
		channelName: channelName ?? program.channel,
		channelId,
		slackLinked: !!slackUserId,
		joinUrl: SLACK_JOIN_URL,
		notes
	};
});
var WorkInput = objectType({ deliverableId: stringType().uuid() });
/** Posts a student's submitted assignment into their course cohort channel. */
var notifyStudentWork_createServerFn_handler = createServerRpc({
	id: "0ccb1254bda9ff2aaf6ae03163522886fabd20394c7ef5e98f149f27f7c43877",
	name: "notifyStudentWork",
	filename: "src/lib/student-onboarding.functions.ts"
}, (opts) => notifyStudentWork.__executeServer(opts));
var notifyStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => WorkInput.parse(d)).handler(notifyStudentWork_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("student_deliverables").select("id, user_id, title, proof_url, course_name, class_number").eq("id", data.deliverableId).maybeSingle();
	if (!row || row.user_id !== context.userId) return { ok: false };
	const { data: profile } = await context.supabase.from("profiles").select("name, slack_user_id, slack_channel_id, department").eq("id", context.userId).maybeSingle();
	if (!profile?.slack_channel_id) return { ok: false };
	try {
		const { postChannelMessage } = await import("./slack.server-BqTd8c5e.mjs");
		const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : profile.name ?? "A student";
		await postChannelMessage(profile.slack_channel_id, `${who} submitted ${row.class_number ? `class ${row.class_number} ` : ""}work: *${row.title}*${row.proof_url ? `\n${row.proof_url}` : ""}`);
		return { ok: true };
	} catch {
		return { ok: false };
	}
});
//#endregion
export { notifyStudentWork_createServerFn_handler, onboardStudent_createServerFn_handler };
