//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/needs-you-today-DelbY8Yw.js
var NEEDS_YOU_TODAY = [
	{
		key: "orders_to_fulfil",
		label: "Paid orders to fulfil",
		path: "/admin/leads"
	},
	{
		key: "whatsapp_waiting",
		label: "WhatsApp chats to answer",
		path: "/admin/whatsapp"
	},
	{
		key: "new_leads",
		label: "New leads",
		path: "/admin/leads"
	},
	{
		key: "payments_to_confirm",
		label: "Payments to confirm",
		path: "/admin/students"
	},
	{
		key: "work_to_review",
		label: "Work awaiting review",
		path: "/admin/students"
	},
	{
		key: "talent_requests",
		label: "Talent requests",
		path: "/admin/talent"
	},
	{
		key: "referral_rewards",
		label: "Referral rewards owed",
		path: "/admin/referrals"
	}
];
/** Adds the WhatsApp waiting count, which lives in its own function. Left out if that migration hasn't run. */
async function withWhatsAppWaiting(counts, rpc) {
	const { data, error } = await rpc();
	return error || data == null ? counts : {
		...counts,
		whatsapp_waiting: data
	};
}
/** The items that exist on this site, with their counts. */
function needsYouTodayRows(counts) {
	return NEEDS_YOU_TODAY.filter((i) => counts[i.key] != null).map((i) => ({
		...i,
		count: Number(counts[i.key])
	}));
}
//#endregion
export { withWhatsAppWaiting as n, needsYouTodayRows as t };
