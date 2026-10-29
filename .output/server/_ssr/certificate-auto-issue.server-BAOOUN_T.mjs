import { t as supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
import { t as sendTemplateEmail } from "./send-email-eDgP-isb.mjs";
import { i as isFreePlan } from "./enrollment-access-BaRzVf28.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/certificate-auto-issue.server-BAOOUN_T.js
var PAID_UP_STATUSES = ["active", "confirmed"];
/** "Digital Marketing Pro" -> "digital_marketing_pro", the key courses.plan_required uses. */
var planKey = (planName) => planName.trim().toLowerCase().replace(/\s+/g, "_");
/** True when one of the student's paid plans for this course is confirmed with no balance left owing. */
function paidInFull(enrollments, course) {
	return enrollments.some((e) => !isFreePlan(e.plan_name) && planKey(e.plan_name) === course.plan_required && PAID_UP_STATUSES.includes(e.status) && Number(e.balance_due ?? 0) <= 0);
}
var SITE = "https://techfaculty.ng";
var FREE_COURSE_PLAN = "bootcamp_starter";
/** Finished courses that have no certificate yet, and whether each can be issued now. */
async function findCertificateCandidates(facultyId) {
	let progressQuery = supabaseAdmin.from("course_progress").select("faculty_id, course_id").gte("progress_percentage", 100).limit(1e3);
	if (facultyId) progressQuery = progressQuery.eq("faculty_id", facultyId);
	const { data: finished, error } = await progressQuery;
	if (error) throw new Error(error.message);
	if (!finished?.length) return [];
	const facultyIds = [...new Set(finished.map((p) => p.faculty_id))];
	const courseIds = [...new Set(finished.map((p) => p.course_id))];
	const [certs, courses, enrollments, accepted] = await Promise.all([
		supabaseAdmin.from("certificates").select("faculty_id, course_id").in("faculty_id", facultyIds),
		supabaseAdmin.from("courses").select("id, name, plan_required").in("id", courseIds),
		supabaseAdmin.from("enrollments").select("faculty_id, plan_name, status, balance_due").in("faculty_id", facultyIds),
		supabaseAdmin.from("student_deliverables").select("faculty_id").eq("status", "reviewed").in("faculty_id", facultyIds)
	]);
	for (const r of [
		certs,
		courses,
		enrollments,
		accepted
	]) if (r.error) throw new Error(r.error.message);
	const issued = new Set((certs.data ?? []).map((c) => `${c.faculty_id}:${c.course_id}`));
	const courseById = new Map((courses.data ?? []).map((c) => [c.id, c]));
	const withWork = new Set((accepted.data ?? []).map((d) => d.faculty_id));
	const out = [];
	for (const p of finished) {
		const course = courseById.get(p.course_id);
		if (!course || issued.has(`${p.faculty_id}:${p.course_id}`)) continue;
		if (course.plan_required === FREE_COURSE_PLAN) continue;
		const theirs = (enrollments.data ?? []).filter((e) => e.faculty_id === p.faculty_id);
		out.push({
			facultyId: p.faculty_id,
			courseId: course.id,
			courseName: course.name,
			status: !paidInFull(theirs, course) ? "waiting_payment" : !withWork.has(p.faculty_id) ? "waiting_work" : "ready"
		});
	}
	return out;
}
function certificateNumber(now) {
	const day = now.toISOString().slice(0, 10).replace(/-/g, "");
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	return `TF-CERT-${day}-${Array.from(bytes, (b) => alphabet[b % 32]).join("")}`;
}
async function issue(c, name) {
	const now = /* @__PURE__ */ new Date();
	const { data: cert, error } = await supabaseAdmin.from("certificates").insert({
		faculty_id: c.facultyId,
		course_id: c.courseId,
		course_name: c.courseName,
		certificate_number: certificateNumber(now),
		student_name: name,
		date_issued: now.toLocaleDateString("en-US", {
			month: "long",
			day: "2-digit",
			year: "numeric",
			timeZone: "Africa/Lagos"
		}),
		auto_issued: true
	}).select("id, certificate_number, faculty_id, student_name, course_name").single();
	if (error) {
		if (error.code !== "23505") console.error("auto certificate failed", c.facultyId, c.courseId, error.message);
		return null;
	}
	const { error: auditError } = await supabaseAdmin.from("admin_audit_log").insert({
		actor_id: null,
		actor_email: "automation",
		action: "certificate.auto_issued",
		target_table: "certificates",
		target_id: cert.id,
		faculty_id: cert.faculty_id,
		subject: cert.student_name,
		details: {
			certificate_number: cert.certificate_number,
			course: cert.course_name
		}
	});
	if (auditError) console.error("Couldn't write admin audit log", auditError.message);
	return cert;
}
/** Emails the verify link for auto-issued certificates not yet emailed (new ones, and retries). */
async function sendCertificateEmails(facultyId) {
	let q = supabaseAdmin.from("certificates").select("id, certificate_number, faculty_id, student_name, course_name").eq("auto_issued", true).is("issued_email_sent_at", null).is("revoked_at", null).limit(200);
	if (facultyId) q = q.eq("faculty_id", facultyId);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	if (!rows?.length) return 0;
	const { data: profiles } = await supabaseAdmin.from("profiles").select("faculty_id, name, email").in("faculty_id", [...new Set(rows.map((r) => r.faculty_id))]);
	const byFaculty = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
	let sent = 0;
	for (const cert of rows) {
		const profile = byFaculty.get(cert.faculty_id);
		if (!profile?.email) continue;
		const { data: claimed } = await supabaseAdmin.from("certificates").update({ issued_email_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", cert.id).is("issued_email_sent_at", null).select("id").maybeSingle();
		if (!claimed) continue;
		try {
			await sendTemplateEmail("certificate-issued", profile.email, {
				templateData: {
					name: cert.student_name || profile.name,
					courseName: cert.course_name,
					certificateNumber: cert.certificate_number,
					verifyUrl: `${SITE}/verify/${cert.certificate_number}`
				},
				idempotencyKey: `certificate-issued-${cert.id}`
			});
			sent++;
		} catch (e) {
			console.error("certificate-issued email failed", cert.id, e.message);
			await supabaseAdmin.from("certificates").update({ issued_email_sent_at: null }).eq("id", cert.id);
		}
	}
	return sent;
}
/** Issues every certificate that is due (or just this student's) and emails the verify links. */
async function runCertificateAutoIssue(facultyId) {
	const candidates = await findCertificateCandidates(facultyId);
	const ready = candidates.filter((c) => c.status === "ready");
	const { data: profiles } = ready.length ? await supabaseAdmin.from("profiles").select("faculty_id, name").in("faculty_id", [...new Set(ready.map((c) => c.facultyId))]) : { data: [] };
	const nameOf = new Map((profiles ?? []).map((p) => [p.faculty_id, p.name]));
	let issued = 0;
	for (const c of ready) if (await issue(c, nameOf.get(c.facultyId) ?? null)) issued++;
	const emailed = await sendCertificateEmails(facultyId);
	return {
		issued,
		emailed,
		waitingPayment: candidates.filter((c) => c.status === "waiting_payment").length,
		waitingWork: candidates.filter((c) => c.status === "waiting_work").length
	};
}
//#endregion
export { runCertificateAutoIssue as n, findCertificateCandidates as t };
