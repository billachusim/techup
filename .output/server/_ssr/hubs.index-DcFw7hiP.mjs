import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Jt as Building2, Y as MapPin, in as ArrowRight, j as Search, q as MessageCircle, xt as Earth } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { a as directoryWhatsAppUrl, c as hubWhatsAppUrl, r as HUBS_DISCLAIMER, s as hubCities, t as COURSE_AREAS, u as techHubs } from "./techHubs-JbJ8WLyC.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/hubs.index-DcFw7hiP.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var CANONICAL = "https://techfaculty.ng/hubs";
var Hubs = () => {
	const [query, setQuery] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("All");
	const [courseArea, setCourseArea] = (0, import_react.useState)("All");
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return techHubs.filter((h) => {
			if (city !== "All" && h.city !== city) return false;
			if (courseArea !== "All" && !h.courseAreas.includes(courseArea)) return false;
			if (!q) return true;
			return h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.region.toLowerCase().includes(q) || h.focus.toLowerCase().includes(q) || h.courseAreas.some((c) => c.toLowerCase().includes(q));
		});
	}, [
		query,
		city,
		courseArea
	]);
	const jsonLd = [{
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Tech hubs and training institutes in Nigeria",
		numberOfItems: techHubs.length,
		itemListElement: techHubs.map((h, i) => ({
			"@type": "ListItem",
			position: i + 1,
			url: `https://techfaculty.ng/hubs/${h.slug}`,
			name: h.name
		}))
	}, {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: "https://techfaculty.ng/"
		}, {
			"@type": "ListItem",
			position: 2,
			name: "Tech Hubs",
			item: CANONICAL
		}]
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(jsonLd)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-24 pb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "mb-4",
									children: "The hub of hubs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-5xl font-bold tracking-tight mb-4",
									children: "Tech hubs and training institutes across Nigeria"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-base md:text-lg leading-relaxed",
									children: "Our mission is to move Nigerians and Africans into the AI future — wherever they live. So we do not only teach at our own campuses: we keep a curated directory of the hubs, innovation centres and institutes people can learn in, city by city. Tell us the course and the city, and we help you choose a route and enrol — online, hybrid or in person."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: directoryWhatsAppUrl(),
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4" }), " Talk to us on WhatsApp"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: "/locations",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), " Our own campuses"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: "/departments",
												children: ["Browse courses ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
											})
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative md:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search hub, city or skill",
										className: "pl-9",
										"aria-label": "Search tech hubs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: city,
									onValueChange: setCity,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"aria-label": "Filter by city",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "City" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "All",
										children: "All cities"
									}), hubCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: courseArea,
									onValueChange: setCourseArea,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"aria-label": "Filter by course area",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Course area" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "All",
										children: "All course areas"
									}), COURSE_AREAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c))] })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-4",
							children: [
								"Showing ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-semibold",
									children: filtered.length
								}),
								" of",
								" ",
								techHubs.length,
								" listings."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: filtered.map((hub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "flex flex-col",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-5 flex flex-col flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3 mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: hub.isTechFaculty ? "default" : "secondary",
												className: "text-xs",
												children: hub.type
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "w-3 h-3" }),
													" ",
													hub.country
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-semibold leading-snug mb-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: `/hubs/${hub.slug}`,
												className: "hover:text-primary transition-colors",
												children: hub.name
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground flex items-center gap-1 mb-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3" }),
												" ",
												hub.city,
												", ",
												hub.region
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground mb-4",
											children: hub.focus
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5 mb-4",
											children: hub.courseAreas.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground",
												children: c
											}, c))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "outline",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
													to: `/hubs/${hub.slug}`,
													children: ["View hub ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" })]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: hubWhatsAppUrl(hub),
													target: "_blank",
													rel: "noopener noreferrer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-3.5 h-3.5" }), " Apply on WhatsApp"]
												})
											})]
										})
									]
								})
							}, hub.slug))
						}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-4",
									children: "No listing matches that search yet — but we can still place you."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: directoryWhatsAppUrl(),
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4" }), " Ask us on WhatsApp"]
									})
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 mt-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 md:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl md:text-2xl font-bold mb-3",
									children: "Anywhere you are, there is a study route"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground mb-4 leading-relaxed",
									children: [
										"If there is no hub near you, distance is no longer the blocker. Our online and hybrid tracks run nationwide and across Africa, our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/virtual-siwes",
											className: "text-primary hover:underline",
											children: "virtual SIWES and logbook service"
										}),
										" ",
										"covers students on industrial training, and our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/careers",
											className: "text-primary hover:underline",
											children: "remote jobs board"
										}),
										" ",
										"is where graduates go next. Message us with your city and the course you want, and we will map the shortest path."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: HUBS_DISCLAIMER
								})
							]
						}) })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Hubs;
//#endregion
export { SplitComponent as component };
