import { t as supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
import { t as sendTemplateEmail } from "./send-email-eDgP-isb.mjs";
import { n as withWhatsAppWaiting, t as needsYouTodayRows } from "./needs-you-today-DelbY8Yw.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin-digest.server-CJ3W2ZRL.js
async function runAdminDigest() {
	const { data, error } = await supabaseAdmin.rpc("needs_you_today_counts");
	if (error) throw new Error(error.message);
	const counts = await withWhatsAppWaiting(data, () => supabaseAdmin.rpc("whatsapp_chats_waiting"));
	const rows = needsYouTodayRows(counts);
	const total = rows.reduce((n, r) => n + r.count, 0);
	if (total === 0) return { status: "nothing_waiting" };
	const day = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
	const { error: claimed } = await supabaseAdmin.from("admin_digest_sends").insert({
		sent_on: day,
		counts: data
	});
	if (claimed) return {
		status: "already_sent",
		day
	};
	try {
		await sendTemplateEmail("admin-morning-digest", "", {
			templateData: { rows },
			idempotencyKey: `admin-morning-digest-${day}`
		});
		return {
			status: "sent",
			day,
			total
		};
	} catch (e) {
		await supabaseAdmin.from("admin_digest_sends").delete().eq("sent_on", day);
		throw e;
	}
}
//#endregion
export { runAdminDigest };
