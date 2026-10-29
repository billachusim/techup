import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as useNavigate$1, o as useSearchParams, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { n as SignupForm, t as LoginForm } from "./LoginForm-BlYf1i3R.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/login-d8wMD6MF.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
function sanitizeNext(next) {
	if (!next) return "/";
	if (!next.startsWith("/") || next.startsWith("//")) return "/";
	return next;
}
var Login = () => {
	const navigate = useNavigate$1();
	const [params] = useSearchParams();
	const next = sanitizeNext(params.get("next"));
	const [mode, setMode] = (0, import_react.useState)("login");
	const goNext = () => navigate(next, { replace: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen flex items-center justify-center px-4 py-16 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: mode === "login" ? "Sign in to Tech Faculty" : "Create your Tech Faculty account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: mode === "login" ? "Access your dashboard, courses, and integrations." : "Join to enroll in courses and connect AI clients."
					})]
				}),
				mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {
					onSuccess: goNext,
					onForgotPassword: () => {}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignupForm, { onSuccess: goNext }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-sm text-muted-foreground",
					children: mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"New here?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary hover:underline",
							onClick: () => setMode("signup"),
							children: "Create an account"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary hover:underline",
							onClick: () => setMode("login"),
							children: "Sign in"
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/",
						className: "hover:underline",
						children: "← Back to home"
					})
				})
			]
		})
	});
};
var SplitComponent = Login;
//#endregion
export { SplitComponent as component };
