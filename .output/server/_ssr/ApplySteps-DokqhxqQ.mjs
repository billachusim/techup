import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { bt as ExternalLink, u as UserPlus } from "../_libs/lucide-react.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/ApplySteps-DokqhxqQ.js
var import_jsx_runtime = require_jsx_runtime();
/** Two-step apply flow: create an account on the platform, then open the listing. */
var ApplySteps = ({ platform, jobUrl, jobTitle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
	className: "space-y-4",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
			children: "1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						"Create your free ",
						platform.name,
						" account"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [platform.name, " handles the hiring, so you need an account there to apply. Already have one? Move to step 2."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: platform.signupUrl,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full sm:w-auto",
						"aria-label": `Get started with ${platform.name}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
								size: 14,
								className: "mr-2"
							}),
							"Get Started with ",
							platform.name
						]
					})
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
			children: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Open the job listing and apply"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Opens in a new tab so you can come back here anytime."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: jobUrl,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full sm:w-auto",
						"aria-label": `Open the ${jobTitle} listing on ${platform.name}`,
						children: ["Open job listing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
							size: 14,
							className: "ml-2"
						})]
					})
				})
			]
		})]
	})]
});
//#endregion
export { ApplySteps as t };
