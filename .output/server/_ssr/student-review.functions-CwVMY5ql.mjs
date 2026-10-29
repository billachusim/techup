import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, s as numberType, u as stringType } from "../_libs/zod.mjs";
import { r as findProgram } from "./coursePrograms-ONlp_ggE.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-review.functions-CwVMY5ql.js
async function assertStaff(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
	const roles = (data ?? []).map((r) => r.role);
	if (!roles.includes("admin") && !roles.includes("recruiter")) throw new Error("Staff only");
}
/** Staff: list student submissions with student names. */
var listStudentWork_createServerFn_handler = createServerRpc({
	id: "b37db7992b88c6f1d1e3bbab6257ededfb12ec7fd2357772b6987538338abca0",
	name: "listStudentWork",
	filename: "src/lib/student-review.functions.ts"
}, (opts) => listStudentWork.__executeServer(opts));
var listStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ status: enumType([
	"submitted",
	"reviewed",
	"needs_changes",
	"ai",
	"all"
]) }).parse(d)).handler(listStudentWork_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	let q = context.supabase.from("student_deliverables").select("id, user_id, faculty_id, course_name, class_number, title, proof_url, summary, status, score, reviewer_note, reviewed_by, ai_status, ai_score, ai_verdict, ai_feedback, ai_confidence, created_at").order("created_at", { ascending: false }).limit(200);
	if (data.status === "ai") q = q.eq("reviewed_by", "ai");
	else if (data.status !== "all") q = q.eq("status", data.status);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const ids = [...new Set((rows ?? []).map((r) => r.user_id))];
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: profiles } = ids.length ? await supabaseAdmin.from("profiles").select("id, name, email, location").in("id", ids) : { data: [] };
	const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
	const { data: scored } = ids.length ? await supabaseAdmin.from("student_deliverables").select("user_id, score").in("user_id", ids).not("score", "is", null) : { data: [] };
	const avg = /* @__PURE__ */ new Map();
	for (const s of scored ?? []) {
		const a = avg.get(s.user_id) ?? {
			sum: 0,
			n: 0
		};
		a.sum += s.score;
		a.n += 1;
		avg.set(s.user_id, a);
	}
	return (rows ?? []).map((r) => {
		const a = avg.get(r.user_id);
		return {
			...r,
			student_name: byId.get(r.user_id)?.name || "Student",
			student_email: byId.get(r.user_id)?.email || null,
			student_location: byId.get(r.user_id)?.location || null,
			average_score: a ? Math.round(a.sum / a.n) : null,
			reviewed_count: a?.n ?? 0
		};
	});
});
var reviewLabel = (status, score) => `${status === "reviewed" ? "accepted" : status === "needs_changes" ? "needs changes" : status}${score != null ? ` ${score}%` : ""}`;
var ReviewInput = objectType({
	id: stringType().uuid(),
	status: enumType(["reviewed", "needs_changes"]),
	score: numberType().int().min(0).max(100).nullable(),
	note: stringType().max(1e3).optional()
});
/** Staff: score a submission (or change the AI's review), then email the student and post in their class group. */
var reviewStudentWork_createServerFn_handler = createServerRpc({
	id: "9fce9923f3fb492726bfdd2afebdb99cbfd0766d2d6b84eeff81f205eace2889",
	name: "reviewStudentWork",
	filename: "src/lib/student-review.functions.ts"
}, (opts) => reviewStudentWork.__executeServer(opts));
var reviewStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ReviewInput.parse(d)).handler(reviewStudentWork_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	const note = data.note?.trim() || null;
	const { data: before } = await context.supabase.from("student_deliverables").select("status, score, reviewer_note, reviewed_by").eq("id", data.id).maybeSingle();
	const { data: row, error } = await context.supabase.from("student_deliverables").update({
		status: data.status,
		score: data.score,
		reviewer_note: note,
		reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
		reviewed_by: "staff"
	}).eq("id", data.id).select("id, user_id, title, faculty_id").single();
	if (error) throw new Error(error.message);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	if (before?.reviewed_by === "ai" && (before.status !== data.status || before.score !== data.score)) {
		const { recordAdminAction } = await import("../_libs/_4.mjs");
		const { data: student } = await supabaseAdmin.from("profiles").select("name").eq("id", row.user_id).maybeSingle();
		await recordAdminAction(supabaseAdmin, context.userId, {
			action: "work.ai_review_overridden",
			target_table: "student_deliverables",
			target_id: row.id,
			faculty_id: row.faculty_id,
			subject: student?.name ?? null,
			details: {
				title: row.title,
				from: reviewLabel(before.status, before.score),
				to: reviewLabel(data.status, data.score)
			}
		});
	}
	if (before?.status === data.status && before?.score === data.score && (before?.reviewer_note ?? null) === note) return { ok: true };
	const { notifyStudentReviewed } = await import("./student-review.server-B3_LJSOv.mjs");
	await notifyStudentReviewed({
		id: row.id,
		user_id: row.user_id,
		title: row.title,
		status: data.status,
		score: data.score,
		note
	});
	return { ok: true };
});
var requestAiWorkReview_createServerFn_handler = createServerRpc({
	id: "6b67f32684f0349b0295bda47cb55eb1e9d859879ad738094a1f296760e63222",
	name: "requestAiWorkReview",
	filename: "src/lib/student-review.functions.ts"
}, (opts) => requestAiWorkReview.__executeServer(opts));
var requestAiWorkReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ deliverableId: stringType().uuid() }).parse(d)).handler(requestAiWorkReview_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("student_deliverables").select("id, user_id").eq("id", data.deliverableId).maybeSingle();
	if (!row || row.user_id !== context.userId) return { outcome: "not_claimed" };
	const { aiReviewSubmission } = await import("./ai-work-review.server-CbkA5jCh.mjs");
	return { outcome: await aiReviewSubmission(row.id) };
});
var BriefInput = objectType({
	classKey: stringType().min(1).max(200),
	classTitle: stringType().min(1).max(200),
	classNumber: numberType().int().min(1).max(100).optional(),
	date: stringType().max(60).optional()
});
/** Student: once per class, brief their Slack class group and email them. */
var briefNextClass_createServerFn_handler = createServerRpc({
	id: "0038bad0a42c3001072d156d8b34605486645a5f6c5556d4a363f1247d1bf031",
	name: "briefNextClass",
	filename: "src/lib/student-review.functions.ts"
}, (opts) => briefNextClass.__executeServer(opts));
var briefNextClass = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BriefInput.parse(d)).handler(briefNextClass_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { error: dup } = await supabaseAdmin.from("student_class_briefings").insert({
		user_id: context.userId,
		class_key: data.classKey
	});
	if (dup) return {
		ok: true,
		alreadySent: true
	};
	const { data: profile } = await supabaseAdmin.from("profiles").select("name, email, department, slack_user_id, slack_channel_id").eq("id", context.userId).maybeSingle();
	const program = findProgram(profile?.department);
	if (profile?.slack_channel_id) {
		const { postChannelMessage } = await import("./slack.server-BqTd8c5e.mjs");
		const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : profile.name ?? "a student";
		await postChannelMessage(profile.slack_channel_id, `:books: Next class for ${who}: *${data.classNumber ? `Class ${data.classNumber} — ` : ""}${data.classTitle}*${data.date ? ` (${data.date})` : ""}.\nNotes and this week's assignment: https://techfaculty.ng/dashboard`);
	}
	if (profile?.email) try {
		const { sendTemplateEmail } = await import("../_libs/_9.mjs");
		await sendTemplateEmail("class-unlocked", profile.email, {
			templateData: {
				name: profile.name,
				classTitle: data.classTitle,
				programme: program.title,
				classNumber: data.classNumber,
				date: data.date
			},
			idempotencyKey: `class-unlocked-${context.userId}-${data.classKey}`
		});
	} catch (e) {
		console.error("class email failed", e.message);
	}
	return {
		ok: true,
		alreadySent: false
	};
});
//#endregion
export { briefNextClass_createServerFn_handler, listStudentWork_createServerFn_handler, requestAiWorkReview_createServerFn_handler, reviewStudentWork_createServerFn_handler };
