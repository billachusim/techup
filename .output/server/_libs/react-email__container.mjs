import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "./@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/@react-email/container/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Container = import_react.forwardRef(({ children, style, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		align: "center",
		width: "100%",
		...props,
		border: 0,
		cellPadding: "0",
		cellSpacing: "0",
		ref,
		role: "presentation",
		style: {
			maxWidth: "37.5em",
			...style
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
			style: { width: "100%" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children })
		}) })
	});
});
Container.displayName = "Container";
//#endregion
export { Container as t };
