import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { Y as MapPin, a as Wallet, in as ArrowRight, s as Users } from "../_libs/lucide-react.mjs";
import { C as openingsLabel, D as roleBadges, O as roleLocationLabel, v as formatBudget } from "./talent-CymeyHOO.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/RoleCard-BZWs0FcC.js
var import_jsx_runtime = require_jsx_runtime();
var RoleCard = ({ role }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
	className: "flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: roleBadges(role).map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: badge === "Paid training" || badge === "New" ? "rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground" : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
					children: badge
				}, badge))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold leading-snug",
				children: role.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs font-medium text-muted-foreground",
				children: role.company
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground line-clamp-3",
				children: role.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 12 }),
							" ",
							roleLocationLabel(role)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 12 }),
							" ",
							formatBudget(role)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 font-medium text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 12 }),
							" ",
							openingsLabel(role.openings)
						]
					})
				]
			}),
			role.required_skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: role.required_skills.slice(0, 4).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground",
					children: skill
				}, skill))
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
		to: `/talent/roles/${role.slug}`,
		className: "mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline",
		children: ["View role and apply ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
	})]
});
//#endregion
export { RoleCard as t };
