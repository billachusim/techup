import { t as supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-review.server-B3_LJSOv.js
/** Emails the student their review and, when accepted, posts in their class group. Never throws. */
async function notifyStudentReviewed(review) {
	const { data: profile } = await supabaseAdmin.from("profiles").select("name, email, slack_user_id, slack_channel_id").eq("id", review.user_id).maybeSingle();
	if (profile?.email) try {
		const { sendTemplateEmail } = await import("../_libs/_9.mjs");
		await sendTemplateEmail("student-work-reviewed", profile.email, {
			templateData: {
				name: profile.name,
				title: review.title,
				status: review.status,
				note: review.note,
				score: review.score ?? void 0,
				byAi: review.byAi ?? false
			},
			idempotencyKey: `student-work-reviewed-${review.id}-${review.status}-${review.score ?? "x"}${review.byAi ? "-ai" : ""}`
		});
	} catch (e) {
		console.error("review email failed", e.message);
	}
	if (profile?.slack_channel_id && review.status === "reviewed") try {
		const { postChannelMessage } = await import("./slack.server-BqTd8c5e.mjs");
		const who = profile.slack_user_id ? `<@${profile.slack_user_id}>` : profile.name ?? "A student";
		await postChannelMessage(profile.slack_channel_id, `:white_check_mark: ${who}'s work *${review.title}* was reviewed${review.score != null ? ` — ${review.score}%` : ""}. Keep going!`);
	} catch (e) {
		console.error("review Slack post failed", e.message);
	}
}
//#endregion
export { notifyStudentReviewed };
