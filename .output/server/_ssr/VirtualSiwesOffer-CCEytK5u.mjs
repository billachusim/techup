import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Ht as Check, in as ArrowRight, it as Laptop, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { i as formatNaira, r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/VirtualSiwesOffer-CCEytK5u.js
var import_jsx_runtime = require_jsx_runtime();
var whatsappMessage = (source, channel = "blog") => `Hello Tech Faculty NG, I ${channel === "blog" ? "read your article" : "saw your SIWES page"} (${source}) and I want to do Virtual SIWES (online IT). Please send me the details for the ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement.`;
var whatsappHref = (source, channel) => `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(whatsappMessage(source, channel))}`;
var OFFER_POINTS = [
	"Official placement letter addressed to your school within 48 hours of payment",
	"Weekly live sessions and real project work with a mentor from your department",
	"Logbook reviewed, signed and stamped, with courier pickup and return to your city",
	"Completion certificate, recommendation letter and a project portfolio link"
];
var VirtualSiwesOffer = ({ source, channel = "blog", variant = "full" }) => {
	if (variant === "inline") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "not-prose my-10 rounded-lg border border-primary/30 bg-primary/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
				size: 18,
				className: "mt-0.5 text-primary shrink-0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold leading-snug",
				children: "Can't find a host near you? Do your SIWES online with Tech Faculty NG."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [
					"Virtual SIWES is ",
					formatNaira(VIRTUAL_SIWES.placementPriceNGN),
					" ",
					"for your full IT, from any Nigerian city, with your logbook signed and stamped."
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 sm:mt-0 shrink-0 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: whatsappHref(source, channel),
					target: "_blank",
					rel: "noopener noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
						size: 14,
						className: "mr-1.5"
					}), " WhatsApp us"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
					to: "/virtual-siwes",
					children: "How it works"
				})
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "not-prose my-12 rounded-xl border-2 border-primary/40 bg-card p-6 md:p-8",
		"aria-labelledby": `virtual-siwes-offer-${source}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
					size: 16,
					className: "text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-wide text-primary",
					children: "Virtual SIWES"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: `virtual-siwes-offer-${source}`,
				className: "text-xl md:text-2xl font-bold mb-2",
				children: "Do your SIWES online, from any city in Nigeria"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mb-5 max-w-2xl",
				children: "No host near you, or your placement fell through? Tech Faculty NG, licensed by FMSTI through NBTI, places you online for your full IT and documents it exactly like an on-site intern."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 mb-6",
				children: OFFER_POINTS.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						size: 16,
						className: "mt-0.5 text-primary shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: point })]
				}, point))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-muted/50 p-4 mb-6 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: formatNaira(VIRTUAL_SIWES.placementPriceNGN)
					}),
					" ",
					"for the placement, whether your IT is three or six months.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: formatNaira(VIRTUAL_SIWES.logbookPriceNGN)
					}),
					" ",
					"for logbook review, signing, stamping and two-way waybill delivery."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-2",
					children: "Near one of our campuses? On-site SIWES has no placement fee. Only Virtual SIWES is charged, because it covers the waybill and online supervision."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/virtual-siwes#reserve-virtual-it",
						children: [
							"Pay ",
							formatNaira(VIRTUAL_SIWES.placementPriceNGN),
							" online",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								size: 18,
								className: "ml-2"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(source, channel),
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							size: 18,
							className: "mr-2"
						}), " Ask on WhatsApp"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-6 border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold mb-1",
						children: "Or reserve now and pay by transfer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mb-4",
						children: "Leave your details and a coordinator replies with payment details and your start date. Nothing is charged automatically."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, {
						interest: "virtual_siwes",
						source: `${channel}:${source}`,
						submitLabel: "Reserve my virtual IT slot",
						whatsappMessage: whatsappMessage(source, channel),
						extraFields: [{
							id: "department",
							label: "Course / department",
							placeholder: "e.g. Computer Science"
						}, {
							id: "duration",
							label: "IT duration",
							placeholder: "e.g. 6 months",
							required: true
						}]
					})
				]
			})
		]
	});
};
//#endregion
export { VirtualSiwesOffer as t };
