import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useSearchParams, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, a as Wallet } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/pay-balance-CNcTFNqI.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var PayBalance = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("t") || "";
	const [error, setError] = (0, import_react.useState)(token ? "" : "This payment link is incomplete.");
	(0, import_react.useEffect)(() => {
		if (!token) return;
		let cancelled = false;
		(async () => {
			const { data, error: fnError } = await (await getSupabase()).functions.invoke("create-checkout", { body: { balancePayToken: token } });
			const url = data?.url?.trim();
			if (cancelled) return;
			if (fnError || !url || !/^https?:\/\//i.test(url)) {
				let message = data?.error;
				const ctx = fnError?.context;
				if (!message && ctx?.json) message = (await ctx.json().catch(() => null))?.error;
				setError(message || "We couldn't open the payment page. Please try again.");
				return;
			}
			window.location.assign(url);
		})();
		return () => {
			cancelled = true;
		};
	}, [token]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-24 pb-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container mx-auto max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-2 border-primary/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-8 text-center space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center",
										children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-10 h-10 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-10 h-10 text-primary animate-spin" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-2xl md:text-3xl font-bold",
										children: error ? "Pay your balance" : "Opening the payment page…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: error || "You'll be taken to Flutterwave to pay by card or bank transfer."
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/dashboard",
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "w-full",
											children: "Pay from your dashboard"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://wa.me/2348068597140",
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "w-full",
											children: "Message us on WhatsApp"
										})
									})]
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = PayBalance;
//#endregion
export { SplitComponent as component };
