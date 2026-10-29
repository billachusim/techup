import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, Q as Lock, Tt as CreditCard } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as PRODUCTS } from "./products-Dwo_SXcO.mjs";
import { n as rememberCheckout, r as trackEvent } from "./analytics-BrZRoVBL.mjs";
import { t as Checkbox } from "./checkbox-o9PPpNJX.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/OrderPayForm-0LLaEVnC.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;
/**
* Card / transfer / USSD payment through Flutterwave for Virtual SIWES, the
* logbook service or the Success Kit. Prices come from the shared product
* list; create-order-checkout re-prices on the server and sends the buyer to
* Flutterwave, which returns them to /order-complete.
*/
function OrderPayForm({ product, addOn, source, extraFields = [] }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [school, setSchool] = (0, import_react.useState)("");
	const [extras, setExtras] = (0, import_react.useState)({});
	const [withAddOn, setWithAddOn] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const items = addOn && withAddOn ? [product, addOn] : [product];
	const total = items.reduce((n, id) => n + PRODUCTS[id].priceNGN, 0);
	const idFor = (field) => `order-${product}-${field}`;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) return setError("Enter your name.");
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address for your receipt.");
		if (phone.replace(/\D/g, "").length < 10) return setError("Enter a valid WhatsApp number (at least 10 digits).");
		const missing = extraFields.find((f) => f.required && !extras[f.id]?.trim());
		if (missing) return setError(`Please fill in "${missing.label}".`);
		setSaving(true);
		setError(null);
		const notes = extraFields.map((f) => extras[f.id]?.trim() ? `${f.label}: ${extras[f.id].trim()}` : null).filter(Boolean).join(" | ");
		const { data, error: fnError } = await (await getSupabase()).functions.invoke("create-order-checkout", { body: {
			items,
			name,
			email,
			phone,
			school,
			notes,
			source
		} });
		if (fnError || !data?.url) {
			setSaving(false);
			let message = "We couldn't open the payment page. Please try again, or reserve your slot and pay by transfer.";
			const body = await fnError?.context?.json?.().catch(() => null);
			if (body?.error) message = body.error;
			setError(message);
			return;
		}
		const plan = items.map((id) => PRODUCTS[id].name).join(" + ");
		trackEvent("begin_checkout", {
			value: total,
			currency: "NGN",
			items: items.map((id) => ({
				item_id: id,
				item_name: PRODUCTS[id].name
			}))
		});
		rememberCheckout({
			plan,
			value: total,
			currency: "NGN"
		});
		window.location.href = data.url;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: idFor("name"),
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: idFor("name"),
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Chisom Okeke",
							autoComplete: "name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: idFor("email"),
							children: "Email address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: idFor("email"),
							type: "email",
							inputMode: "email",
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: idFor("phone"),
							children: "WhatsApp number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: idFor("phone"),
							type: "tel",
							inputMode: "tel",
							autoComplete: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "0803 000 0000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: idFor("school"),
							children: ["School or institution ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: idFor("school"),
							value: school,
							onChange: (e) => setSchool(e.target.value),
							placeholder: "e.g. Nnamdi Azikiwe University"
						})]
					}),
					extraFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: idFor(f.id),
							children: [f.label, !f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: " (optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: idFor(f.id),
							value: extras[f.id] ?? "",
							onChange: (e) => setExtras((prev) => ({
								...prev,
								[f.id]: e.target.value
							})),
							placeholder: f.placeholder
						})]
					}, f.id))
				]
			}),
			addOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					id: idFor("addon"),
					checked: withAddOn,
					onCheckedChange: (c) => setWithAddOn(c === true)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					htmlFor: idFor("addon"),
					className: "font-normal leading-relaxed",
					children: [
						"Add ",
						PRODUCTS[addOn].name.toLowerCase(),
						" (",
						formatNaira(PRODUCTS[addOn].priceNGN),
						")"
					]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "w-full sm:w-auto",
				disabled: saving,
				children: [
					saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						size: 16,
						className: "mr-2 animate-spin"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
						size: 16,
						className: "mr-2"
					}),
					"Pay ",
					formatNaira(total),
					" now"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground flex items-start gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
					size: 12,
					className: "mt-0.5 shrink-0"
				}), "Secure payment by card, bank transfer or USSD through Flutterwave. Your receipt goes to your email, and we contact you on WhatsApp."]
			})
		]
	});
}
/** Pay online by default, with the reserve-and-pay-later form one click away. */
function PayOrReserve({ reserve, ...pay }) {
	const [mode, setMode] = (0, import_react.useState)("pay");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [mode === "pay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderPayForm, { ...pay }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, { ...reserve }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground border-t border-border pt-3",
			children: [
				mode === "pay" ? "Rather pay by bank transfer to us directly? " : "Rather pay online now? ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "underline underline-offset-2 hover:text-foreground",
					onClick: () => setMode(mode === "pay" ? "reserve" : "pay"),
					children: mode === "pay" ? "Reserve instead and we send the details" : "Pay by card, transfer or USSD"
				}),
				"."
			]
		})]
	});
}
//#endregion
export { PayOrReserve as t };
