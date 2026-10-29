//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/dates-Sj88MuGL.js
/** Today in Lagos, as YYYY-MM-DD. */
var lagosToday = (now = /* @__PURE__ */ new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now);
/** "Mon, 3 Nov 2026" for a YYYY-MM-DD date. */
var formatDay = (date) => (/* @__PURE__ */ new Date(`${date}T12:00:00Z`)).toLocaleDateString("en-NG", {
	weekday: "short",
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC"
});
//#endregion
export { lagosToday as n, formatDay as t };
