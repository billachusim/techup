import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/certificate-auto-issue.functions-DwzXm6fd.js
/**
* Student: issue any certificate they have now earned, right after they tick
* their last class. Only ever looks at the signed-in student's own courses;
* the rules are in certificate-auto-issue.server.ts.
*/
var claimMyCertificates_createServerFn_handler = createServerRpc({
	id: "8b4b010cfd753c12296592a06c22209a96286db208591eca54fa4ad1f724dfd5",
	name: "claimMyCertificates",
	filename: "src/lib/certificate-auto-issue.functions.ts"
}, (opts) => claimMyCertificates.__executeServer(opts));
var claimMyCertificates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(claimMyCertificates_createServerFn_handler, async ({ context }) => {
	const { data: profile } = await context.supabase.from("profiles").select("faculty_id").eq("id", context.userId).maybeSingle();
	if (!profile?.faculty_id) return {
		issued: 0,
		emailed: 0,
		waitingPayment: 0,
		waitingWork: 0
	};
	const { runCertificateAutoIssue } = await import("../_libs/_10.mjs");
	return runCertificateAutoIssue(profile.faculty_id);
});
//#endregion
export { claimMyCertificates_createServerFn_handler };
