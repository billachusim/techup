import { t as accessEnrollment } from "./enrollment-access-BaRzVf28.mjs";
import { a as followupDueAt, c as normaliseEmail, i as LEAD_REPLY_TO, l as startsSequence, n as ENROL_WINDOW_MS, o as followupEmail, s as isSendingHour, t as CLOSED_STATUSES } from "./lead-followups-BtMfwIFF.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/lead-followups.server-p0z4kGsw.js
var BATCH = 50;
async function startSequences(db, now) {
	const { data: leads, error } = await db.from("leads").select("id, name, email, interest, status, created_at, whatsapp_opt_in, email_marketing_opt_in").not("email", "is", null).gte("created_at", new Date(now - ENROL_WINDOW_MS).toISOString()).order("created_at", { ascending: true }).limit(500);
	if (error) throw new Error(`Could not load leads: ${error.message}`);
	const candidates = /* @__PURE__ */ new Map();
	for (const lead of leads ?? []) {
		if (!startsSequence(lead, now)) continue;
		if (!lead.email) continue;
		const email = normaliseEmail(lead.email);
		if (!candidates.has(email)) candidates.set(email, lead);
	}
	if (!candidates.size) return 0;
	const { data: existing, error: existingError } = await db.from("lead_email_followups").select("email").in("email", [...candidates.keys()]);
	if (existingError) throw new Error(`Could not load follow-ups: ${existingError.message}`);
	const known = new Set((existing ?? []).map((r) => r.email));
	let started = 0;
	for (const [email, lead] of candidates) {
		if (known.has(email)) continue;
		const { error: insertError } = await db.from("lead_email_followups").insert({
			email,
			lead_id: lead.id,
			interest: lead.interest,
			name: lead.name,
			lead_created_at: lead.created_at,
			steps_sent: 0,
			next_due_at: followupDueAt(lead.created_at, 0, now)
		});
		if (insertError && !/duplicate key/i.test(insertError.message)) throw new Error(`Could not start follow-up for a lead: ${insertError.message}`);
		if (!insertError) started++;
	}
	return started;
}
/** Why this person should get no more emails, or null to carry on. */
async function stopReason(db, email) {
	const { data: leads, error: leadsError } = await db.from("leads").select("status, email_marketing_opt_in").eq("email", email);
	if (leadsError) throw new Error(`Could not verify lead consent: ${leadsError.message}`);
	if (!leads?.some((lead) => lead.email_marketing_opt_in === true)) return "no_email_consent";
	if ((leads ?? []).some((l) => CLOSED_STATUSES.has(l.status))) return "lead_closed";
	const { data: profile, error: profileError } = await db.from("profiles").select("faculty_id").eq("email", email).maybeSingle();
	if (profileError) throw new Error(`Could not verify lead profile: ${profileError.message}`);
	if (profile?.faculty_id) {
		const { data: enrolments, error: enrollmentError } = await db.from("enrollments").select("status, plan_name, paid_at").eq("faculty_id", profile.faculty_id);
		if (enrollmentError) throw new Error(`Could not verify enrolment: ${enrollmentError.message}`);
		if (accessEnrollment(enrolments ?? [])) return "enrolled";
	}
	return null;
}
async function stop(db, row, reason) {
	await db.from("lead_email_followups").update({
		stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
		stop_reason: reason,
		next_due_at: null
	}).eq("email", row.email).is("stopped_at", null);
}
async function sendDue(db, send, now) {
	const { data: due, error } = await db.from("lead_email_followups").select("email, lead_id, interest, name, lead_created_at, steps_sent, next_due_at, unsubscribe_token").is("stopped_at", null).lte("next_due_at", new Date(now).toISOString()).order("next_due_at", { ascending: true }).limit(BATCH);
	if (error) throw new Error(`Could not load due follow-ups: ${error.message}`);
	const result = {
		sent: 0,
		stopped: 0,
		failed: 0
	};
	for (const row of due ?? []) {
		const step = row.steps_sent;
		if (!followupEmail(row.interest, step)) {
			await stop(db, row, "completed");
			continue;
		}
		const reason = await stopReason(db, row.email);
		if (reason) {
			await stop(db, row, reason);
			result.stopped++;
			continue;
		}
		const nextDue = followupDueAt(row.lead_created_at, step + 1, now);
		const sentAt = new Date(now).toISOString();
		const { data: claimed } = await db.from("lead_email_followups").update({
			steps_sent: step + 1,
			last_sent_at: sentAt,
			next_due_at: nextDue,
			...nextDue ? {} : {
				stopped_at: sentAt,
				stop_reason: "completed"
			}
		}).eq("email", row.email).eq("steps_sent", step).is("stopped_at", null).select("email").maybeSingle();
		if (!claimed) continue;
		try {
			if ((await send("lead-follow-up", row.email, {
				templateData: {
					name: row.name,
					interest: row.interest,
					step,
					unsubscribeUrl: `https://techfaculty.ng/api/lead-unsubscribe?t=${row.unsubscribe_token}`
				},
				idempotencyKey: `lead-follow-up-${row.lead_id}-${step}`,
				replyTo: LEAD_REPLY_TO
			})).sent) result.sent++;
			else {
				await stop(db, row, "suppressed");
				result.stopped++;
			}
		} catch (e) {
			console.error("lead follow-up email failed", row.email, e.message);
			await db.from("lead_email_followups").update({
				steps_sent: step,
				next_due_at: new Date(now + 36e5).toISOString(),
				stopped_at: null,
				stop_reason: null
			}).eq("email", row.email).eq("steps_sent", step + 1);
			result.failed++;
		}
	}
	return result;
}
async function runLeadFollowups(db, send, now = Date.now(), provider = "disabled") {
	if (provider !== "dedicated-marketing") return {
		started: 0,
		sent: 0,
		stopped: 0,
		failed: 0,
		quietHours: false,
		blocked: true
	};
	const started = await startSequences(db, now);
	if (!isSendingHour(now)) return {
		started,
		sent: 0,
		stopped: 0,
		failed: 0,
		quietHours: true
	};
	return {
		started,
		...await sendDue(db, send, now),
		quietHours: false
	};
}
/** Unsubscribe link handler: true when the token matched a sequence. */
async function unsubscribeLeadFollowups(db, token) {
	if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
	const { data } = await db.from("lead_email_followups").update({
		stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
		stop_reason: "unsubscribed",
		next_due_at: null
	}).eq("unsubscribe_token", token).select("email").maybeSingle();
	return !!data;
}
//#endregion
export { runLeadFollowups, unsubscribeLeadFollowups };
