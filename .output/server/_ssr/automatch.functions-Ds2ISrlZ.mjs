import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/automatch.functions-Ds2ISrlZ.js
var Input = objectType({
	roleId: stringType().uuid().optional(),
	talentId: stringType().uuid().optional()
});
/**
* Runs auto-matching after a role is published (staff) or a talent saves
* their profile (the owner). Never throws to the caller.
*/
var triggerAutoMatch_createServerFn_handler = createServerRpc({
	id: "9d28578591f22d74c31951ede776b589862e4b81366e97aca736e5c0161e924f",
	name: "triggerAutoMatch",
	filename: "src/lib/automatch.functions.ts"
}, (opts) => triggerAutoMatch.__executeServer(opts));
var triggerAutoMatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(triggerAutoMatch_createServerFn_handler, async ({ data, context }) => {
	if (!data.roleId && !data.talentId) return {
		ok: false,
		created: 0,
		promoted: 0
	};
	const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (data.roleId && !staff) return {
		ok: false,
		created: 0,
		promoted: 0
	};
	if (data.talentId && !staff) {
		const { data: own } = await context.supabase.from("talent_profiles").select("id").eq("id", data.talentId).eq("user_id", context.userId).maybeSingle();
		if (!own) return {
			ok: false,
			created: 0,
			promoted: 0
		};
	}
	try {
		const { runAutoMatch } = await import("./matching.server-C1cSwpKJ.mjs");
		const res = await runAutoMatch({
			roleIds: data.roleId ? [data.roleId] : void 0,
			talentIds: data.talentId ? [data.talentId] : void 0
		});
		return {
			ok: true,
			created: res.created,
			promoted: res.promoted
		};
	} catch (e) {
		console.error("auto-match trigger failed", e.message);
		return {
			ok: false,
			created: 0,
			promoted: 0
		};
	}
});
//#endregion
export { triggerAutoMatch_createServerFn_handler };
