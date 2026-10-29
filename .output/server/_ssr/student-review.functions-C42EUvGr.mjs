import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, s as numberType, u as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-review.functions-C42EUvGr.js
/** Staff: list student submissions with student names. */
var listStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ status: enumType([
	"submitted",
	"reviewed",
	"needs_changes",
	"ai",
	"all"
]) }).parse(d)).handler(createSsrRpc("b37db7992b88c6f1d1e3bbab6257ededfb12ec7fd2357772b6987538338abca0"));
var ReviewInput = objectType({
	id: stringType().uuid(),
	status: enumType(["reviewed", "needs_changes"]),
	score: numberType().int().min(0).max(100).nullable(),
	note: stringType().max(1e3).optional()
});
/** Staff: score a submission (or change the AI's review), then email the student and post in their class group. */
var reviewStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ReviewInput.parse(d)).handler(createSsrRpc("9fce9923f3fb492726bfdd2afebdb99cbfd0766d2d6b84eeff81f205eace2889"));
/** Student: ask the AI to score the work they just submitted. Returns once it is scored (or left for staff). */
var requestAiWorkReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ deliverableId: stringType().uuid() }).parse(d)).handler(createSsrRpc("6b67f32684f0349b0295bda47cb55eb1e9d859879ad738094a1f296760e63222"));
var BriefInput = objectType({
	classKey: stringType().min(1).max(200),
	classTitle: stringType().min(1).max(200),
	classNumber: numberType().int().min(1).max(100).optional(),
	date: stringType().max(60).optional()
});
/** Student: once per class, brief their Slack class group and email them. */
var briefNextClass = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BriefInput.parse(d)).handler(createSsrRpc("0038bad0a42c3001072d156d8b34605486645a5f6c5556d4a363f1247d1bf031"));
//#endregion
export { reviewStudentWork as i, listStudentWork as n, requestAiWorkReview as r, briefNextClass as t };
