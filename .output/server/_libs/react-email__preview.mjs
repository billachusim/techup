import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "./@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/@react-email/preview/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PREVIEW_MAX_LENGTH = 150;
var Preview = import_react.forwardRef(({ children = "", ...props }, ref) => {
	const text = (Array.isArray(children) ? children.join("") : children).substring(0, PREVIEW_MAX_LENGTH);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "none",
			overflow: "hidden",
			lineHeight: "1px",
			opacity: 0,
			maxHeight: 0,
			maxWidth: 0
		},
		"data-skip-in-text": true,
		...props,
		ref,
		children: [text, renderWhiteSpace(text)]
	});
});
Preview.displayName = "Preview";
var whiteSpaceCodes = "\xA0‌​‍‎‏﻿";
var renderWhiteSpace = (text) => {
	if (text.length >= PREVIEW_MAX_LENGTH) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length) });
};
//#endregion
export { Preview as t };
