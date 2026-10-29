import { a as __toESM } from "./_runtime.mjs";
import { n as supabase } from "./_ssr/client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as useSearchParams } from "./_ssr/router-compat-DeSPa1fq.mjs";
import { t as Button } from "./_ssr/button-VUUBE8Tw.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-9zP5cT9x.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
function getAuthOAuth() {
	return supabase.auth.oauth ?? null;
}
var OAuthConsent = () => {
	const [params] = useSearchParams();
	const authorizationId = params.get("authorization_id") ?? "";
	const [details, setDetails] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [userEmail, setUserEmail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			if (!authorizationId) {
				setError("Missing authorization_id in the URL.");
				return;
			}
			const { data: sess } = await supabase.auth.getSession();
			if (!sess.session) {
				const next = window.location.pathname + window.location.search;
				window.location.href = "/login?next=" + encodeURIComponent(next);
				return;
			}
			setUserEmail(sess.session.user.email ?? null);
			const oauth = getAuthOAuth();
			if (!oauth) {
				setError("OAuth authorization is not available in this build.");
				return;
			}
			const { data, error: err } = await oauth.getAuthorizationDetails(authorizationId);
			if (cancelled) return;
			if (err) return setError(err.message);
			const immediate = data?.redirect_url ?? data?.redirect_to;
			if (immediate && !data?.client) {
				window.location.href = immediate;
				return;
			}
			setDetails(data);
		})();
		return () => {
			cancelled = true;
		};
	}, [authorizationId]);
	const decide = async (approve) => {
		const oauth = getAuthOAuth();
		if (!oauth) return;
		setBusy(true);
		const { data, error: err } = approve ? await oauth.approveAuthorization(authorizationId) : await oauth.denyAuthorization(authorizationId);
		if (err) {
			setBusy(false);
			setError(err.message);
			return;
		}
		const target = data?.redirect_url ?? data?.redirect_to;
		if (!target) {
			setBusy(false);
			setError("Authorization completed but no redirect URL was returned.");
			return;
		}
		window.location.href = target;
	};
	const clientName = details?.client?.name ?? details?.client?.client_name ?? "an application";
	const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen flex items-center justify-center px-4 py-16 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-xs",
			children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold text-foreground",
				children: "Authorization error"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: error
			})] }) : !details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground text-center",
				children: "Loading authorization request…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-xl font-bold text-foreground",
						children: [
							"Connect ",
							clientName,
							" to Tech Faculty"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"This lets ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: clientName }),
							" use Tech Faculty as you",
							userEmail ? ` (${userEmail})` : "",
							". It can call Tech Faculty's tools while you are signed in. This does not bypass row-level security or backend policies."
						]
					})]
				}),
				scopes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground mb-1",
						children: "Requested access"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-5 space-y-1 text-muted-foreground",
						children: scopes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							s === "openid" && "Verify your identity",
							s === "email" && "Share your email address",
							s === "profile" && "Share your basic profile",
							![
								"openid",
								"email",
								"profile"
							].includes(s) && `Additional permission: ${s}`
						] }, s))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => decide(true),
						disabled: busy,
						className: "w-full",
						children: busy ? "Working…" : `Approve and connect ${clientName}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => decide(false),
						disabled: busy,
						variant: "outline",
						className: "w-full",
						children: "Cancel"
					})]
				})
			] })
		})
	});
};
var SplitComponent = OAuthConsent;
//#endregion
export { SplitComponent as component };
