import { t as supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
import { t as sendTemplateEmail } from "./send-email-eDgP-isb.mjs";
import { t as accessEnrollment } from "./enrollment-access-BaRzVf28.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/class-reminders.server-CltDVe9n.js
var HOUR = 36e5;
var WINDOW = 24 * HOUR;
var db = supabaseAdmin;
/** "today, Thursday 29 October at 4:00 pm (Lagos time)" */
function classTime(at, now) {
	const day = (d) => d.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
	const date = at.toLocaleDateString("en-GB", {
		timeZone: "Africa/Lagos",
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	const time = at.toLocaleTimeString("en-US", {
		timeZone: "Africa/Lagos",
		hour: "numeric",
		minute: "2-digit"
	}).toLowerCase();
	return `${day(at) === day(now) ? "today, " : day(at) === day(new Date(now.getTime() + 24 * HOUR)) ? "tomorrow, " : ""}${date} at ${time} (Lagos time)`;
}
async function runClassReminders(now = /* @__PURE__ */ new Date()) {
	const { data: lectures, error } = await supabaseAdmin.from("lectures").select("id, title, scheduled_at, duration_minutes, course_id, courses(name)").eq("status", "scheduled").gt("scheduled_at", now.toISOString()).lte("scheduled_at", new Date(now.getTime() + WINDOW).toISOString()).order("scheduled_at", { ascending: true });
	if (error) throw new Error(`Could not load lectures: ${error.message}`);
	let sent = 0;
	let skipped = 0;
	let failed = 0;
	const classes = [];
	for (const lecture of lectures ?? []) {
		const { data: enrolled, error: enrolledError } = await supabaseAdmin.from("course_enrollments").select("faculty_id").eq("course_id", lecture.course_id).eq("status", "active");
		if (enrolledError) throw new Error(`Could not load course students: ${enrolledError.message}`);
		const ids = [...new Set((enrolled ?? []).map((e) => e.faculty_id))];
		if (!ids.length) continue;
		const [{ data: profiles }, { data: enrolments }] = await Promise.all([supabaseAdmin.from("profiles").select("faculty_id, name, email").in("faculty_id", ids), supabaseAdmin.from("enrollments").select("faculty_id, status, plan_name, paid_at, created_at").in("faculty_id", ids).order("created_at", { ascending: false })]);
		const course = Array.isArray(lecture.courses) ? lecture.courses[0] : lecture.courses;
		const when = classTime(new Date(lecture.scheduled_at), now);
		let lectureSent = 0;
		for (const profile of profiles ?? []) {
			const own = (enrolments ?? []).filter((e) => e.faculty_id === profile.faculty_id);
			if (!profile.email || !accessEnrollment(own)) {
				skipped++;
				continue;
			}
			const { error: claimError } = await db.from("class_reminder_sends").insert({
				lecture_id: lecture.id,
				faculty_id: profile.faculty_id,
				email: profile.email
			});
			if (claimError) {
				if (!/duplicate key/i.test(claimError.message)) throw new Error(`Could not claim reminder: ${claimError.message}`);
				continue;
			}
			try {
				if ((await sendTemplateEmail("class-reminder", profile.email, {
					templateData: {
						name: profile.name ?? void 0,
						classTitle: lecture.title,
						courseName: course?.name,
						when,
						durationMinutes: lecture.duration_minutes ?? void 0
					},
					idempotencyKey: `class-reminder-${lecture.id}-${profile.faculty_id}`
				})).sent) {
					sent++;
					lectureSent++;
				} else skipped++;
			} catch (e) {
				failed++;
				console.error("class reminder failed", lecture.id, e.message);
				await db.from("class_reminder_sends").delete().eq("lecture_id", lecture.id).eq("faculty_id", profile.faculty_id);
			}
		}
		classes.push({
			lecture_id: lecture.id,
			title: lecture.title,
			sent: lectureSent
		});
	}
	return {
		lectures: lectures?.length ?? 0,
		sent,
		skipped,
		failed,
		classes
	};
}
//#endregion
export { runClassReminders };
