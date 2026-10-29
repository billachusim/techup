//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/csv-CwucF6vt.js
/**
* Spreadsheet apps run cells that start with these characters as formulas, so
* a lead who types "=HYPERLINK(...)" as their name could plant one. Such cells
* get a leading apostrophe so they stay plain text. Phone numbers like
* "+234 801 234 5678" can't do harm, so they're left as typed.
*/
var FORMULA_START = /^[=+\-@\t\r]/;
var PLAIN_NUMBER = /^[+-][\d\s().-]*$/;
function csvCell(value) {
	if (value === null || value === void 0) return "";
	let text = String(value);
	if (typeof value === "string" && FORMULA_START.test(text) && !PLAIN_NUMBER.test(text)) text = `'${text}`;
	return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}
function toCsv(rows, columns) {
	const lines = [columns.map((c) => csvCell(c.header)).join(",")];
	for (const row of rows) lines.push(columns.map((c) => csvCell(c.value(row))).join(","));
	return lines.join("\r\n");
}
/** "leads-2026-10-12.csv" style names, using the admin's local date. */
function csvFilename(name, date = /* @__PURE__ */ new Date()) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${name}-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.csv`;
}
/** Saves the CSV in the browser. The byte-order mark makes Excel read ₦ and accents correctly. */
function downloadCsv(filename, csv) {
	const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 0);
}
//#endregion
export { downloadCsv as n, toCsv as r, csvFilename as t };
