import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, u as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/marketplace-emails.functions-zvG-qfKQ.js
var Input = objectType({
	event: enumType([
		"application_submitted",
		"match_updated",
		"deliverable_reviewed",
		"talent_approved",
		"profile_submitted",
		"intro_approved",
		"slack_link"
	]),
	id: stringType().uuid()
});
/**
* Sends the marketplace email for one event. The recipient is always looked up
* server-side from the record — callers only pass the event and record id.
*/
var notifyMarketplaceEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("270e17d756963778b4df9826f19b475394808832d5870aeff0fbbc118e9179b4"));
//#endregion
export { notifyMarketplaceEvent as t };
