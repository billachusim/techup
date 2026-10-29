import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useSearchParams, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, It as CircleCheckBig, Mt as Clock, Pt as CircleX, in as ArrowRight, rt as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { a as trackPurchase } from "./analytics-BrZRoVBL.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/payment-success-DyEbMwIv.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var RETRIES = 5;
var RETRY_MS = 3e3;
var PaymentSuccess = () => {
	const [searchParams] = useSearchParams();
	const facultyId = searchParams.get("faculty_id") || "";
	const plan = searchParams.get("plan") || "";
	const txRef = searchParams.get("tx_ref") || "";
	const redirectStatus = searchParams.get("status") || "";
	const [state, setState] = (0, import_react.useState)(!txRef || redirectStatus === "cancelled" || redirectStatus === "failed" ? "failed" : "checking");
	(0, import_react.useEffect)(() => {
		if (state !== "checking") return;
		let cancelled = false;
		(async () => {
			const supabase = await getSupabase();
			for (let attempt = 0; attempt < RETRIES && !cancelled; attempt++) {
				const { data } = await supabase.functions.invoke("verify-payment", { body: { txRef } });
				const status = data?.status;
				if (status === "active" || status === "failed" || status === "not_found") {
					if (!cancelled) setState(status === "active" ? "active" : "failed");
					return;
				}
				await new Promise((r) => setTimeout(r, RETRY_MS));
			}
			if (!cancelled) setState("pending");
		})();
		return () => {
			cancelled = true;
		};
	}, [state, txRef]);
	(0, import_react.useEffect)(() => {
		if (state === "active" && txRef) trackPurchase(txRef, plan);
	}, [
		state,
		txRef,
		plan
	]);
	const heading = {
		checking: "Confirming your payment…",
		active: "Payment Successful! 🎉",
		pending: "Payment is still processing",
		failed: "Payment not completed"
	}[state];
	const subheading = {
		checking: "This takes a few seconds. Please keep this page open.",
		active: "Your enrollment has been confirmed and activated.",
		pending: "We haven't received confirmation from the payment provider yet. Your plan activates automatically once it arrives. Check your dashboard in a few minutes.",
		failed: "We couldn't confirm a payment for this enrollment, so it hasn't been activated. If you were charged, message us on WhatsApp with your reference below."
	}[state];
	const StatusIcon = {
		checking: LoaderCircle,
		active: CircleCheckBig,
		pending: Clock,
		failed: CircleX
	}[state];
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
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: `w-10 h-10 text-primary ${state === "checking" ? "animate-spin" : ""}` })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-2xl md:text-3xl font-bold",
										children: heading
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: subheading
									})]
								}),
								facultyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-muted rounded-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Your Faculty ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xl font-bold text-primary",
										children: facultyId
									})]
								}),
								plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-primary/5 rounded-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Enrolled Plan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-semibold",
										children: plan
									})]
								}),
								state !== "active" && txRef && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground break-all",
									children: ["Payment reference: ", txRef]
								}),
								state === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-left text-sm text-muted-foreground bg-muted/50 rounded-lg p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground",
										children: "What's Next?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["✅ Your enrollment is now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-primary",
												children: "active"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "📧 You'll receive a confirmation email shortly" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "💬 Join your cohort's WhatsApp group from your dashboard" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "📚 Start accessing your courses immediately" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/dashboard",
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											className: "w-full gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 18 }), "Go to Dashboard"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/",
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "w-full gap-2",
											children: ["Home ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })]
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
var SplitComponent = PaymentSuccess;
//#endregion
export { SplitComponent as component };
