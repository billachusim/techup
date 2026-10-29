import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/slack.functions-BPVRu3Vp.js
/** Channels the admin can pick from when wiring a project workspace. */
var listSlackChannels_createServerFn_handler = createServerRpc({
	id: "6bf1c1f15bceea3c0f9d952effe091f739ac13e52ec8b986719c1511c626dfe3",
	name: "listSlackChannels",
	filename: "src/lib/slack.functions.ts"
}, (opts) => listSlackChannels.__executeServer(opts));
var listSlackChannels = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listSlackChannels_createServerFn_handler, async ({ context }) => {
	const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!staff) throw new Error("Staff only");
	try {
		const { listChannels } = await import("./slack.server-BqTd8c5e.mjs");
		return {
			ok: true,
			channels: await listChannels()
		};
	} catch (e) {
		return {
			ok: false,
			channels: [],
			error: e.message
		};
	}
});
var SyncInput = objectType({ matchId: stringType().uuid() });
/**
* Slack side of the hiring flow.
* Matched (approved) -> general talent channel.
* Selected for the project (accepted / hired) -> that project's own channel too.
*/
var syncSlackForMatch_createServerFn_handler = createServerRpc({
	id: "7eef0bb7eae2ca63ca7901311ff37b30d8b2eca0e05787e60531102969a5b987",
	name: "syncSlackForMatch",
	filename: "src/lib/slack.functions.ts"
}, (opts) => syncSlackForMatch.__executeServer(opts));
var syncSlackForMatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SyncInput.parse(d)).handler(syncSlackForMatch_createServerFn_handler, async ({ data, context }) => {
	const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!staff) return {
		ok: false,
		notes: ["Staff only"]
	};
	const { syncMatchSlack } = await import("./match-slack.server-B6w5p9Lr.mjs");
	const res = await syncMatchSlack(data.matchId);
	return {
		ok: res.ok,
		notes: res.notes
	};
});
//#endregion
export { listSlackChannels_createServerFn_handler, syncSlackForMatch_createServerFn_handler };
