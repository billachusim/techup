import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/LastUpdated-DLGRZy9q.js
var import_jsx_runtime = require_jsx_runtime();
/** Formats an ISO date as "8 October 2026", pinned to UTC so server and browser agree. */
var formatDate = (iso) => new Date(iso).toLocaleDateString("en-NG", {
	year: "numeric",
	month: "long",
	day: "numeric",
	timeZone: "UTC"
});
/** Visible "Last updated" line, matching the dateModified in the page's JSON-LD. */
var LastUpdated = ({ date, className = "" }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
	className: `text-xs text-muted-foreground ${className}`,
	children: ["Last updated ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
		dateTime: date,
		children: formatDate(date)
	})]
});
//#endregion
export { formatDate as n, LastUpdated as t };
