import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/public-requests.functions-2w0aaxeq.js
/** Confirms a client's "introduce me to this talent" request and alerts staff. */
var notifyIntroRequest = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	talentId: stringType().uuid(),
	contact: stringType().min(5).max(160)
}).parse(d)).handler(createSsrRpc("9f108984c97f03abfcd9dc74908c9e0097c9b8810cee92fed3d983e6b2e1696a"));
/** Confirms a business hiring request and alerts staff. */
var notifyHiringRequest = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ briefId: stringType().uuid() }).parse(d)).handler(createSsrRpc("c835ab5c71cf756397042d3a0656f280ee5374020cb5591a1c71ee1ed25b7371"));
//#endregion
export { notifyIntroRequest as n, notifyHiringRequest as t };
