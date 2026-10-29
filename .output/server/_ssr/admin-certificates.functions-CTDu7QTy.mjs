import { t as recordAdminAction } from "./admin-audit-D1orYR3x.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, n as booleanType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin-certificates.functions-CTDu7QTy.js
var COLUMNS = "id, certificate_number, student_name, course_name, certificate_type, issued_by, date_issued, faculty_id, issued_at, revoked_at, revoked_reason";
async function requireAdmin(context) {
	const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin");
	if (!roles?.length) throw new Error("Admins only");
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	return supabaseAdmin;
}
var SearchInput = objectType({ query: stringType().trim().max(100).default("") });
/** Admin: the latest certificates, or those matching a number, name, course or faculty ID. */
var searchCertificates_createServerFn_handler = createServerRpc({
	id: "e3290f8bb4ca058ae4a6a36fd10aaabd51e31054ab80d18c88678f75200edae8",
	name: "searchCertificates",
	filename: "src/lib/admin-certificates.functions.ts"
}, (opts) => searchCertificates.__executeServer(opts));
var searchCertificates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SearchInput.parse(d)).handler(searchCertificates_createServerFn_handler, async ({ data, context }) => {
	let q = (await requireAdmin(context)).from("certificates").select(COLUMNS).order("issued_at", { ascending: false }).limit(50);
	const term = data.query.replace(/[,()*%\\:"']/g, " ").trim();
	if (term) {
		const like = `%${term}%`;
		q = q.or(`certificate_number.ilike.${like},student_name.ilike.${like},course_name.ilike.${like},faculty_id.ilike.${like}`);
	}
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var UpdateInput = objectType({
	id: stringType().uuid(),
	studentName: stringType().trim().min(1).max(200),
	courseName: stringType().trim().min(1).max(200),
	certificateType: stringType().trim().max(200),
	issuedBy: stringType().trim().max(200),
	dateIssued: stringType().trim().min(1).max(100)
});
/** Admin: correct a certificate's details. The number stays fixed; no email is sent. */
var updateCertificate_createServerFn_handler = createServerRpc({
	id: "a71f96f37ad38888b313f8040a08adf04ed2874045563a5c69c6df60c081aa5a",
	name: "updateCertificate",
	filename: "src/lib/admin-certificates.functions.ts"
}, (opts) => updateCertificate.__executeServer(opts));
var updateCertificate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => UpdateInput.parse(d)).handler(updateCertificate_createServerFn_handler, async ({ data, context }) => {
	const admin = await requireAdmin(context);
	const { data: row, error } = await admin.from("certificates").update({
		student_name: data.studentName,
		course_name: data.courseName,
		certificate_type: data.certificateType || "Certificate of Achievement",
		issued_by: data.issuedBy || "Tech Faculty NG",
		date_issued: data.dateIssued,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id).select(COLUMNS).single();
	if (error) throw new Error(error.message);
	await recordAdminAction(admin, context.userId, {
		action: "certificate.edited",
		target_table: "certificates",
		target_id: row.id,
		faculty_id: row.faculty_id,
		subject: row.student_name,
		details: {
			certificate_number: row.certificate_number,
			course: row.course_name
		}
	});
	return row;
});
var RevokeInput = objectType({
	id: stringType().uuid(),
	revoke: booleanType(),
	reason: stringType().trim().max(500).optional()
});
/** Admin: revoke a certificate (it stops verifying on /verify), or reinstate it. */
var setCertificateRevoked_createServerFn_handler = createServerRpc({
	id: "056973a04b7534a293cc3779ad940e6553937116d76f91580cec6601d390ecc6",
	name: "setCertificateRevoked",
	filename: "src/lib/admin-certificates.functions.ts"
}, (opts) => setCertificateRevoked.__executeServer(opts));
var setCertificateRevoked = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RevokeInput.parse(d)).handler(setCertificateRevoked_createServerFn_handler, async ({ data, context }) => {
	const admin = await requireAdmin(context);
	if (data.revoke && !data.reason) throw new Error("Give a reason for revoking");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const { data: row, error } = await admin.from("certificates").update(data.revoke ? {
		revoked_at: now,
		revoked_reason: data.reason,
		revoked_by: context.userId,
		updated_at: now
	} : {
		revoked_at: null,
		revoked_reason: null,
		revoked_by: null,
		updated_at: now
	}).eq("id", data.id).select(COLUMNS).single();
	if (error) throw new Error(error.message);
	await recordAdminAction(admin, context.userId, {
		action: data.revoke ? "certificate.revoked" : "certificate.reinstated",
		target_table: "certificates",
		target_id: row.id,
		faculty_id: row.faculty_id,
		subject: row.student_name,
		details: {
			certificate_number: row.certificate_number,
			course: row.course_name,
			reason: data.reason ?? null
		}
	});
	return row;
});
//#endregion
export { searchCertificates_createServerFn_handler, setCertificateRevoked_createServerFn_handler, updateCertificate_createServerFn_handler };
