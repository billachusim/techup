import { a as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/useBlogLikeCounts-HWPN6VMo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useBlogLikeCounts() {
	const [counts, setCounts] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const { data, error } = await (await getSupabase()).from("blog_post_likes").select("post_slug");
			if (cancelled || error || !data) return;
			const tally = {};
			for (const row of data) tally[row.post_slug] = (tally[row.post_slug] ?? 0) + 1;
			setCounts(tally);
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	return counts;
}
//#endregion
export { useBlogLikeCounts as t };
