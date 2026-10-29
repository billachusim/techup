import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as fmsti_logo_default } from "./fmsti-logo-CyQYTmKO.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/CredibilityBanner-f1_Ygk8h.js
var import_jsx_runtime = require_jsx_runtime();
var nbti_logo_default = "/assets/nbti-logo-QSEkbKpg.png";
var CredibilityBanner = ({ compact = false }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-muted/50 border border-border rounded-xl p-6 md:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex flex-col ${compact ? "md:flex-row" : ""} items-center gap-6`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: fmsti_logo_default,
					alt: "Federal Ministry of Science, Technology and Innovation",
					className: "h-14 w-14 md:h-16 md:w-16 object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: nbti_logo_default,
					alt: "National Board for Technology Incubation",
					className: "h-14 w-14 md:h-16 md:w-16 object-contain"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `text-sm md:text-base text-muted-foreground ${compact ? "text-left" : "text-center"} leading-relaxed`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "Tech Faculty"
					}),
					" is licensed and partnered by the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "Federal Ministry of Science, Technology and Innovation"
					}),
					" via the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "National Board for Technology Incubation (NBTI)"
					}),
					" — to assist schools and businesses integrate standard and regulated use of AI and Technology across Nigeria."
				]
			})]
		})
	});
};
//#endregion
export { CredibilityBanner as t };
