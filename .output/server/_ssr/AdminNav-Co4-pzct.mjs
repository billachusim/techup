import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as useLocation$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { an as ArrowLeft } from "../_libs/lucide-react.mjs";
import { c as useIsStaff } from "./Footer-BKqEypqK.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/AdminNav-Co4-pzct.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/admin",
		label: "Dashboard"
	},
	{
		to: "/admin/leads",
		label: "Leads",
		adminOnly: true
	},
	{
		to: "/admin/whatsapp",
		label: "WhatsApp"
	},
	{
		to: "/admin/students",
		label: "Students"
	},
	{
		to: "/admin/lookup",
		label: "Lookup",
		adminOnly: true
	},
	{
		to: "/admin/talent",
		label: "Jobs"
	},
	{
		to: "/admin/certificates",
		label: "Certificates",
		adminOnly: true
	},
	{
		to: "/admin/referrals",
		label: "Referrals",
		adminOnly: true
	},
	{
		to: "/admin/activity",
		label: "Activity",
		adminOnly: true
	}
];
/** Shared admin navigation, so every admin page is one tap from the dashboard and the others. */
function AdminNav() {
	const { pathname } = useLocation$1();
	const { isStaff, isAdmin } = useIsStaff();
	if (!isStaff) return null;
	const current = pathname.replace(/\/+$/, "") || "/";
	const items = ITEMS.filter((i) => !i.adminOnly || isAdmin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Admin",
		className: "flex flex-wrap items-center gap-2",
		children: [current !== "/admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
			to: "/admin",
			className: "mr-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to admin"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: items.map((item) => {
				const active = current === item.to;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: item.to,
						"aria-current": active ? "page" : void 0,
						className: cn("block rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: item.label
					})
				}, item.to);
			})
		})]
	});
}
//#endregion
export { AdminNav as t };
