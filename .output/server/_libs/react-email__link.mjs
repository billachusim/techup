import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "./@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/@react-email/link/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Link = import_react.forwardRef(({ target = "_blank", style, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
	...props,
	ref,
	style: {
		color: "#067df7",
		textDecorationLine: "none",
		...style
	},
	target,
	children: props.children
}));
Link.displayName = "Link";
//#endregion
export { Link as t };
