import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/graduate-review.functions-Dy5BNdAq.js
var REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ5ZxSzmi9QxAR23OzR7YbAkM";
var Input = objectType({
	certificateNumber: stringType().trim().min(1).max(100),
	email: stringType().trim().email().max(320).optional()
});
var requestGraduateReview_createServerFn_handler = createServerRpc({
	id: "16850a24dd02bbc1875e87f9b496b85cad0d39bd271e191e8dfcf368f9d47def",
	name: "requestGraduateReview",
	filename: "src/lib/graduate-review.functions.ts"
}, (opts) => requestGraduateReview.__executeServer(opts));
var requestGraduateReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(requestGraduateReview_createServerFn_handler, async ({ data, context }) => {
	const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin");
	if (!roles?.length) throw new Error("Admins only");
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: cert } = await supabaseAdmin.from("certificates").select("certificate_number, student_name, course_name, faculty_id").eq("certificate_number", data.certificateNumber.toUpperCase()).maybeSingle();
	if (!cert) throw new Error("Certificate not found");
	let email = data.email;
	let name = cert.student_name;
	if (!email && cert.faculty_id) {
		const { data: profile } = await supabaseAdmin.from("profiles").select("name, email").eq("faculty_id", cert.faculty_id).maybeSingle();
		email = profile?.email ?? void 0;
		name = name || profile?.name || null;
	}
	if (!email) return { status: "no_email" };
	email = email.toLowerCase();
	const { error: dup } = await supabaseAdmin.from("graduate_review_requests").insert({
		email,
		certificate_number: cert.certificate_number
	});
	if (dup) return {
		status: "already_sent",
		email
	};
	try {
		const { sendTemplateEmail } = await import("../_libs/_9.mjs");
		return (await sendTemplateEmail("graduate-review-request", email, {
			templateData: {
				name,
				courseName: cert.course_name,
				reviewUrl: REVIEW_URL
			},
			idempotencyKey: `graduate-review-request-${email}`
		})).sent ? {
			status: "sent",
			email
		} : {
			status: "suppressed",
			email
		};
	} catch (e) {
		await supabaseAdmin.from("graduate_review_requests").delete().eq("email", email);
		console.error("graduate review email failed", e.message);
		return {
			status: "failed",
			error: e.message
		};
	}
});
//#endregion
export { requestGraduateReview_createServerFn_handler };
