import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/automatch.functions-BghdXy8V.js
var Input = objectType({
	roleId: stringType().uuid().optional(),
	talentId: stringType().uuid().optional()
});
/**
* Runs auto-matching after a role is published (staff) or a talent saves
* their profile (the owner). Never throws to the caller.
*/
var triggerAutoMatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("9d28578591f22d74c31951ede776b589862e4b81366e97aca736e5c0161e924f"));
//#endregion
export { triggerAutoMatch as t };
