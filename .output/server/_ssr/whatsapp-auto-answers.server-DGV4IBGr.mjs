import { i as decideAutoAnswer, n as AUTO_ANSWER_RULES, r as HANDOFF_ACK } from "./whatsapp-auto-answers-BHpo12w7.mjs";
import { a as isWhatsAppOptOutMessage } from "./whatsapp-followups-xPGuBfv6.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/whatsapp-auto-answers.server-DGV4IBGr.js
var HOUR = 36e5;
async function logAutomation(db, entry) {
	const { error } = await db.from("admin_audit_log").insert({
		actor_id: null,
		actor_email: "automation",
		target_table: "whatsapp_messages",
		faculty_id: null,
		...entry
	});
	if (error) console.error("Couldn't write WhatsApp automation to the audit log", error.message);
}
async function autoAnswerInbound(db, m) {
	try {
		await run(db, m);
	} catch (e) {
		console.error("WhatsApp auto-answer failed", m.waMessageId, e.message);
	}
}
async function run(db, m) {
	if (isWhatsAppOptOutMessage(m.text)) return;
	const now = Date.now();
	const [{ data: state }, { data: recent }] = await Promise.all([db.from("whatsapp_account_state").select("sending_paused,auto_answer_enabled").eq("id", 1).maybeSingle(), db.from("whatsapp_auto_replies").select("intent,outcome,acknowledged,created_at").eq("contact_phone", m.from).gte("created_at", (/* @__PURE__ */ new Date(now - AUTO_ANSWER_RULES.repeatHours * HOUR)).toISOString())]);
	const { data: staffMsgs } = await db.from("whatsapp_messages").select("id").eq("contact_phone", m.from).eq("direction", "outbound").not("sent_by", "is", null).gte("created_at", (/* @__PURE__ */ new Date(now - AUTO_ANSWER_RULES.staffActiveHours * HOUR)).toISOString()).limit(1);
	const decision = decideAutoAnswer(m.text);
	const sentToday = (recent ?? []).filter((r) => r.outcome === "answered" || r.acknowledged).length;
	const sentAt = m.timestamp ? Number(m.timestamp) * 1e3 : now;
	let quiet = null;
	if (state && state.auto_answer_enabled === false) quiet = "Auto-answers are switched off";
	else if (state?.sending_paused) quiet = "WhatsApp sending is paused";
	else if (staffMsgs?.length) quiet = "Staff are already chatting with this contact";
	else if (now - sentAt > AUTO_ANSWER_RULES.staleMinutes * 60 * 1e3) quiet = "Message arrived late";
	else if (sentToday >= AUTO_ANSWER_RULES.maxPerDay) quiet = "Daily limit of automatic messages reached";
	let outcome = "handed_off";
	let intents = [decision.kind === "handoff" ? decision.intent : "other"];
	let reason = decision.kind === "handoff" ? decision.reason : null;
	let reply = null;
	let acknowledged = false;
	if (!quiet && decision.kind === "answer") if (decision.intents.filter((i) => (recent ?? []).some((r) => r.outcome === "answered" && r.intent.split(",").includes(i))).length === decision.intents.length) {
		reason = "Already answered this today; they may need more detail";
		intents = decision.intents;
	} else {
		outcome = "answered";
		intents = decision.intents;
		reply = decision.reply;
	}
	if (quiet) reason = reason ? `${quiet} (${reason})` : quiet;
	if (!quiet && outcome === "handed_off") {
		const ackSince = now - AUTO_ANSWER_RULES.ackHours * HOUR;
		if (!(recent ?? []).some((r) => (r.acknowledged || r.outcome === "answered") && new Date(r.created_at).getTime() >= ackSince)) {
			reply = HANDOFF_ACK;
			acknowledged = true;
		}
	}
	const { data: claim, error: claimError } = await db.from("whatsapp_auto_replies").insert({
		inbound_wa_message_id: m.waMessageId,
		contact_phone: m.from,
		contact_name: m.name,
		inbound_text: m.text.slice(0, 1e3),
		intent: intents.join(","),
		outcome,
		reason,
		acknowledged
	}).select("id").maybeSingle();
	if (claimError || !claim) return;
	if (!reply) return;
	const { sendWhatsApp } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		const sent = await sendWhatsApp({
			to: m.from,
			text: reply,
			sentBy: null
		});
		await db.from("whatsapp_auto_replies").update({ reply_message_id: sent.id }).eq("id", claim.id);
		if (outcome === "answered") await logAutomation(db, {
			action: "whatsapp.auto_answered",
			target_id: sent.id,
			subject: m.name || `+${m.from}`,
			details: {
				intents,
				question: m.text.slice(0, 300)
			}
		});
	} catch (e) {
		await db.from("whatsapp_auto_replies").update({
			outcome: "handed_off",
			acknowledged: false,
			reason: `Automatic reply failed: ${e.message.slice(0, 300)}`
		}).eq("id", claim.id);
	}
}
//#endregion
export { autoAnswerInbound };
