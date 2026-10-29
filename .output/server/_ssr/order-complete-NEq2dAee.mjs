import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useSearchParams, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, It as CircleCheckBig, Mt as Clock, Pt as CircleX, gt as FileDown, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { r as successKitDownloadPath, t as PRODUCTS } from "./products-Dwo_SXcO.mjs";
import { r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { a as trackPurchase } from "./analytics-BrZRoVBL.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/order-complete-NEq2dAee.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var RETRIES = 5;
var RETRY_MS = 3e3;
/** Flutterwave sends the buyer here after paying for Virtual SIWES, the logbook service or the Success Kit. */
var OrderComplete = () => {
	const [searchParams] = useSearchParams();
	const txRef = searchParams.get("tx_ref") || "";
	const redirectStatus = searchParams.get("status") || "";
	const [items, setItems] = (0, import_react.useState)([]);
	const [state, setState] = (0, import_react.useState)(!txRef || redirectStatus === "cancelled" || redirectStatus === "failed" ? "failed" : "checking");
	(0, import_react.useEffect)(() => {
		if (state !== "checking") return;
		let cancelled = false;
		(async () => {
			const supabase = await getSupabase();
			for (let attempt = 0; attempt < RETRIES && !cancelled; attempt++) {
				const { data } = await supabase.functions.invoke("verify-payment", { body: { txRef } });
				const status = data?.status;
				if (status === "paid") {
					const bought = (data.items ?? []).filter((id) => id in PRODUCTS);
					trackPurchase(txRef, bought.map((id) => PRODUCTS[id].name).join(" + "));
					if (!cancelled) {
						setItems(bought);
						setState("paid");
					}
					return;
				}
				if (status === "failed" || status === "not_found") {
					if (!cancelled) setState("failed");
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
	const heading = {
		checking: "Confirming your payment…",
		paid: "Payment confirmed",
		pending: "Payment is still processing",
		failed: "Payment not completed"
	}[state];
	const subheading = {
		checking: "This takes a few seconds. Please keep this page open.",
		paid: "Thank you. Your receipt is on its way to your email.",
		pending: "We haven't received confirmation from the payment provider yet. We check again automatically and email you as soon as it lands, usually within 30 minutes.",
		failed: "We couldn't confirm a payment for this order. If you were charged, message us on WhatsApp with the reference below and we will sort it out."
	}[state];
	const StatusIcon = {
		checking: LoaderCircle,
		paid: CircleCheckBig,
		pending: Clock,
		failed: CircleX
	}[state];
	const whatsappHref = `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(`Hello Tech Faculty NG, I just paid online. My payment reference is ${txRef}.`)}`;
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
								state === "paid" && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3 text-left text-sm bg-muted/50 rounded-lg p-4",
									children: items.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: PRODUCTS[id].name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mt-1",
										children: id === "success_kit" ? "Your SIWES Success Kit is ready to download below. We have also emailed you the link." : PRODUCTS[id].nextStep
									})] }, id))
								}),
								state === "paid" && items.includes("success_kit") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: successKitDownloadPath(txRef),
										download: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {
											size: 18,
											className: "mr-2"
										}), " Download the SIWES Success Kit"]
									})
								}),
								txRef && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground break-all",
									children: ["Payment reference: ", txRef]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: state === "paid" ? "outline" : "default",
										className: "flex-1",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: whatsappHref,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												size: 18,
												className: "mr-2"
											}), " WhatsApp us"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "flex-1",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/virtual-siwes",
											children: "Back to Virtual SIWES"
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
var SplitComponent = OrderComplete;
//#endregion
export { SplitComponent as component };
