import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { a as ScrollAreaViewport, i as ScrollAreaThumb, n as ScrollAreaCorner, r as ScrollAreaScrollbar, t as ScrollArea$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/student-onboarding.functions-CZppZl7C.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea$1, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCorner, {})
	]
}));
ScrollArea.displayName = ScrollArea$1.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
/**
* Student onboarding automation: Slack cohort channel + welcome email.
* Safe to call repeatedly — every step is idempotent.
*/
var onboardStudent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d54d4bdb3c1dc6276cc9b320ba1ff68f76e64c162dbc090ff9f2560fe2dbcd0a"));
var WorkInput = objectType({ deliverableId: stringType().uuid() });
/** Posts a student's submitted assignment into their course cohort channel. */
var notifyStudentWork = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => WorkInput.parse(d)).handler(createSsrRpc("0ccb1254bda9ff2aaf6ae03163522886fabd20394c7ef5e98f149f27f7c43877"));
//#endregion
export { notifyStudentWork as n, onboardStudent as r, ScrollArea as t };
