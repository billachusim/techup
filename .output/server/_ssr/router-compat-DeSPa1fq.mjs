import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as Link, D as useRouter, E as useParams, T as useNavigate, m as useLocation, w as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/router-compat-DeSPa1fq.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Router-compat shim — bridges @/lib/router-compat v6 call sites to
* @tanstack/react-router without hand-rewriting every component.
* This is the same load-bearing pattern used in Klar's dev-copy migration.
*/
function parseTo(to) {
	const [beforeHash, hashStr] = (to ?? "").split("#");
	const [pathname, searchStr] = beforeHash.split("?");
	return {
		pathname: pathname || ".",
		search: searchStr ? Object.fromEntries(new URLSearchParams(searchStr)) : void 0,
		hash: hashStr || void 0
	};
}
function useNavigate$1() {
	const tsNav = useNavigate();
	const router = useRouter();
	return (0, import_react.useCallback)((to, options) => {
		if (typeof to === "number") {
			router.history.go(to);
			return;
		}
		const { pathname, search, hash } = parseTo(to);
		tsNav({
			to: pathname,
			search,
			hash,
			state: options?.state,
			replace: options?.replace
		});
	}, [tsNav, router]);
}
function useLocation$1() {
	const loc = useLocation();
	return (0, import_react.useMemo)(() => ({
		pathname: loc.pathname,
		search: loc.searchStr ? `?${loc.searchStr}` : "",
		hash: loc.hash ?? "",
		state: loc.state ?? null,
		key: loc.pathname + (loc.searchStr ?? "")
	}), [
		loc.pathname,
		loc.searchStr,
		loc.hash,
		loc.state
	]);
}
function useParams$1() {
	return useParams({ strict: false });
}
function useSearchParams() {
	const loc = useLocation();
	const nav = useNavigate();
	const router = useRouter();
	return [(0, import_react.useMemo)(() => new URLSearchParams(loc.searchStr ?? ""), [loc.searchStr]), (0, import_react.useCallback)((init, opts) => {
		const live = router.state.location;
		const current = new URLSearchParams(live.searchStr ?? "");
		const next = typeof init === "function" ? init(current) : init instanceof URLSearchParams ? init : new URLSearchParams(init);
		const searchObj = {};
		next.forEach((v, k) => {
			searchObj[k] = v;
		});
		nav({
			to: live.pathname,
			search: searchObj,
			replace: opts?.replace
		});
	}, [nav, router])];
}
var Link$1 = (0, import_react.forwardRef)(function Link$2({ to, replace, state, children, ...rest }, ref) {
	const { pathname, search, hash } = parseTo(to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		ref,
		to: pathname,
		search,
		hash,
		replace,
		state,
		...rest ?? {},
		children
	});
});
function Navigate$1({ to, replace, state }) {
	const { pathname, search, hash } = parseTo(to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: pathname,
		search,
		hash,
		state,
		replace
	});
}
//#endregion
export { useParams$1 as a, useNavigate$1 as i, Navigate$1 as n, useSearchParams as o, useLocation$1 as r, Link$1 as t };
