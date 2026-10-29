import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { Gt as CalendarDays, Jt as Building2, Y as MapPin, ft as Globe, y as Ticket } from "../_libs/lucide-react.mjs";
import { d as locationLabel, f as priceLabel, i as dateLabel, r as categoryLabel, u as formatLabel } from "./events-g7s0Buaf.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/EventCard-fUk4J6dH.js
var import_jsx_runtime = require_jsx_runtime();
var EventCard = ({ event }) => {
	const price = priceLabel(event);
	const online = event.format === "VIRTUAL";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: event.slug,
		className: "bg-card border border-border rounded-lg p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col scroll-mt-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted-foreground font-semibold",
					children: event.is_featured ? "Tech Faculty" : event.source_platform
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium whitespace-nowrap",
					children: categoryLabel(event.category)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold leading-snug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: `/events/${event.slug}`,
						className: "hover:text-primary transition-colors",
						children: event.title
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 12 }),
						" ",
						event.organizer
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground line-clamp-3 flex-1",
				children: event.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 12 }),
							" ",
							dateLabel(event)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 12 }),
							locationLabel(event),
							" · ",
							formatLabel(event.format)
						]
					}),
					price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 font-medium text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { size: 12 }),
							" ",
							price
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
					to: `/events/${event.slug}`,
					className: "text-sm font-medium text-primary hover:underline",
					"aria-label": `Full details for ${event.title}`,
					children: "Event details →"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: event.source_url,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
					"aria-label": `Register for ${event.title} on ${event.source_platform}`,
					children: "Register"
				})]
			})
		]
	});
};
//#endregion
export { EventCard as t };
