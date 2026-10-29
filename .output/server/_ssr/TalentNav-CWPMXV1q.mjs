import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as useLocation$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as useUser } from "./UserContext-uFGsrvio.mjs";
import { c as useIsStaff } from "./Footer-BKqEypqK.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/TalentNav-CWPMXV1q.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared marketplace navigation. Keeps every talent page one tap away from
* the others so people never get stranded on the dashboard or a role page.
*/
var TalentNav = () => {
	const { pathname } = useLocation$1();
	const { isLoggedIn } = useUser();
	const { isStaff } = useIsStaff();
	const items = [
		{
			to: "/careers",
			label: "Open roles"
		},
		{
			to: "/talent/pool",
			label: "Talent directory"
		},
		{
			to: "/hire",
			label: "Hire talent"
		},
		isLoggedIn ? {
			to: "/talent/dashboard",
			label: "My dashboard"
		} : {
			to: "/login?next=/talent/profile",
			label: "Join as talent"
		}
	];
	if (isLoggedIn) items.push({
		to: "/talent/profile",
		label: "My profile"
	});
	if (isStaff) items.push({
		to: "/admin/talent",
		label: "Admin"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Talent marketplace",
		className: "border-b border-border bg-card/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto max-w-6xl px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "-mx-1 flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: items.map((item) => {
					const active = pathname === item.to.split("?")[0];
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
			})
		})
	});
};
//#endregion
export { TalentNav as t };
