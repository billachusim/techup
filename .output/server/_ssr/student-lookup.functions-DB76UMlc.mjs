import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-lookup.functions-DB76UMlc.js
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
	if (!(data ?? []).some((r) => r.role === "admin")) throw new Error("Admins only");
}
/** Quotes, backslashes and wildcards would break the quoted or() values below. */
var clean = (s) => s.replace(/[,()%*\\"']/g, " ").replace(/\s+/g, " ").trim();
/**
* Admin: find students by name, email, phone or Faculty ID. Looks in both
* profiles (signed-up accounts) and faculty_ids (registrations), merged by
* Faculty ID so each student appears once.
*/
var searchStudents_createServerFn_handler = createServerRpc({
	id: "be9bb7d87bc6dd7c4035a7f9bedac9af355914c988cb39806861bbb42cd5583d",
	name: "searchStudents",
	filename: "src/lib/student-lookup.functions.ts"
}, (opts) => searchStudents.__executeServer(opts));
var searchStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ q: stringType().trim().min(2).max(100) }).parse(d)).handler(searchStudents_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const q = clean(data.q);
	if (q.length < 2) return [];
	const like = `%${q}%`;
	const digits = q.replace(/\D/g, "");
	const phoneLike = digits.length >= 6 ? `%${digits.slice(-10)}%` : null;
	const orFor = (cols) => [...cols.map((c) => `${c}.ilike."${like}"`), ...phoneLike ? [`phone.ilike."${phoneLike}"`] : []].join(",");
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const [profiles, registrations] = await Promise.all([supabaseAdmin.from("profiles").select("id, faculty_id, name, email, phone").or(orFor([
		"name",
		"email",
		"faculty_id",
		"phone"
	])).limit(25), supabaseAdmin.from("faculty_ids").select("faculty_id, name, email, phone").or(orFor([
		"name",
		"email",
		"faculty_id",
		"phone"
	])).limit(25)]);
	if (profiles.error) throw new Error(profiles.error.message);
	if (registrations.error) throw new Error(registrations.error.message);
	const out = /* @__PURE__ */ new Map();
	for (const p of profiles.data ?? []) out.set(p.faculty_id ?? `user:${p.id}`, {
		facultyId: p.faculty_id,
		userId: p.id,
		name: p.name || "Student",
		email: p.email || null,
		phone: p.phone
	});
	for (const r of registrations.data ?? []) {
		const existing = out.get(r.faculty_id);
		if (existing) {
			existing.phone ??= r.phone || null;
			existing.email ??= r.email || null;
		} else out.set(r.faculty_id, {
			facultyId: r.faculty_id,
			userId: null,
			name: r.name || "Student",
			email: r.email || null,
			phone: r.phone || null
		});
	}
	return [...out.values()].slice(0, 30);
});
var RecordInput = objectType({
	facultyId: stringType().trim().min(1).max(50).optional(),
	userId: stringType().uuid().optional()
}).refine((d) => d.facultyId || d.userId, "Faculty ID or user id required");
/** Admin: one student's profile, enrolments, payments, work scores and certificates. */
var getStudentRecord_createServerFn_handler = createServerRpc({
	id: "311ded73cc9f7d716acfb807c14437e140c67f850f7b905aeb36e2eb205406bd",
	name: "getStudentRecord",
	filename: "src/lib/student-lookup.functions.ts"
}, (opts) => getStudentRecord.__executeServer(opts));
var getStudentRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RecordInput.parse(d)).handler(getStudentRecord_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const profileQ = supabaseAdmin.from("profiles").select("id, faculty_id, name, email, phone, department, learning_mode, cohort_month, cohort_year, slack_channel_name, created_at");
	const { data: profile } = data.userId ? await profileQ.eq("id", data.userId).maybeSingle() : await profileQ.eq("faculty_id", data.facultyId).maybeSingle();
	const facultyId = profile?.faculty_id ?? data.facultyId ?? null;
	const userId = profile?.id ?? null;
	const none = {
		data: [],
		error: null
	};
	const [registration, enrollments, courseEnrollments, progress, deliverables, certificates] = await Promise.all([
		facultyId ? supabaseAdmin.from("faculty_ids").select("name, email, phone, course_interest, department, hear_about_us, status, created_at").eq("faculty_id", facultyId).maybeSingle() : Promise.resolve({
			data: null,
			error: null
		}),
		facultyId ? supabaseAdmin.from("enrollments").select("id, plan_name, learning_mode, status, amount_due, currency, coupon_code, tx_ref, payment_reference, paid_at, enrollment_date, created_at").eq("faculty_id", facultyId).order("created_at", { ascending: false }) : Promise.resolve(none),
		facultyId ? supabaseAdmin.from("course_enrollments").select("id, course_id, status, enrollment_date, courses(name, department)").eq("faculty_id", facultyId).order("enrollment_date", { ascending: false }) : Promise.resolve(none),
		facultyId ? supabaseAdmin.from("course_progress").select("course_id, progress_percentage, classes_completed, completed_at, last_accessed").eq("faculty_id", facultyId) : Promise.resolve(none),
		userId || facultyId ? supabaseAdmin.from("student_deliverables").select("id, course_name, class_number, title, status, score, reviewer_note, proof_url, week_of, created_at").eq(userId ? "user_id" : "faculty_id", userId ?? facultyId).order("created_at", { ascending: false }).limit(200) : Promise.resolve(none),
		facultyId ? supabaseAdmin.from("certificates").select("id, certificate_number, certificate_type, course_name, date_issued, issued_at, created_at").eq("faculty_id", facultyId).order("created_at", { ascending: false }) : Promise.resolve(none)
	]);
	for (const r of [
		registration,
		enrollments,
		courseEnrollments,
		progress,
		deliverables,
		certificates
	]) if (r.error) throw new Error(r.error.message);
	if (!profile && !registration.data) throw new Error("Student not found");
	const scored = (deliverables.data ?? []).filter((d) => d.score != null);
	const progressByCourse = new Map((progress.data ?? []).map((p) => [p.course_id, p]));
	return {
		facultyId,
		userId,
		name: profile?.name || registration.data?.name || "Student",
		email: profile?.email || registration.data?.email || null,
		phone: profile?.phone || registration.data?.phone || null,
		department: profile?.department || registration.data?.department || null,
		courseInterest: registration.data?.course_interest ?? null,
		heardAboutUs: registration.data?.hear_about_us ?? null,
		learningMode: profile?.learning_mode ?? null,
		cohort: profile?.cohort_month && profile?.cohort_year ? {
			month: profile.cohort_month,
			year: profile.cohort_year
		} : null,
		slackChannel: profile?.slack_channel_name ?? null,
		registeredAt: registration.data?.created_at ?? null,
		signedUpAt: profile?.created_at ?? null,
		enrollments: enrollments.data ?? [],
		courses: (courseEnrollments.data ?? []).map((c) => ({
			id: c.id,
			name: c.courses?.name ?? "Course",
			status: c.status,
			enrollmentDate: c.enrollment_date,
			progress: progressByCourse.get(c.course_id) ?? null
		})),
		work: deliverables.data ?? [],
		averageScore: scored.length ? Math.round(scored.reduce((s, d) => s + (d.score ?? 0), 0) / scored.length) : null,
		reviewedCount: scored.length,
		certificates: certificates.data ?? []
	};
});
//#endregion
export { getStudentRecord_createServerFn_handler, searchStudents_createServerFn_handler };
