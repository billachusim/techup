import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { c as zones, i as directionsUrl, n as campuses } from "./campuses-DtkbL75I.mjs";
import { Jt as Building2, W as Navigation, Y as MapPin, in as ArrowRight, j as Search } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as CredibilityBanner } from "./CredibilityBanner-f1_Ygk8h.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as CampusMap } from "./CampusMap-C25Pzt0-.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/locations.index-BUuG2FQn.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var Locations = () => {
	const [query, setQuery] = (0, import_react.useState)("");
	const [zone, setZone] = (0, import_react.useState)("All");
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return campuses.filter((c) => {
			if (zone !== "All" && c.zone !== zone) return false;
			if (!q) return true;
			return c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
		});
	}, [query, zone]);
	const hq = campuses.find((c) => c.isHeadquarters);
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Tech Faculty Campuses in Nigeria",
		itemListElement: campuses.map((c, i) => ({
			"@type": "ListItem",
			position: i + 1,
			item: {
				"@type": "EducationalOrganization",
				name: `Tech Faculty — ${c.name}`,
				address: {
					"@type": "PostalAddress",
					streetAddress: c.address,
					addressLocality: c.city,
					addressRegion: c.state,
					addressCountry: "NG"
				},
				geo: {
					"@type": "GeoCoordinates",
					latitude: c.lat,
					longitude: c.lng
				}
			}
		}))
	};
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
									children: "Nationwide presence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-5xl font-bold tracking-tight mb-4",
									children: "A Tech Faculty campus in every city that matters."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground text-base md:text-lg leading-relaxed",
									children: [
										"Through our partnership with the",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "National Board for Technology Incubation"
										}),
										", under the",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Federal Ministry of Science, Technology and Innovation"
										}),
										", Tech Faculty operates physically inside Technology Incubation Centres across Nigeria — giving students in-person labs, mentors and exam venues in their own city, not just online."
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 md:p-8 flex flex-col md:flex-row items-start gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "shrink-0 w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-7 h-7 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase tracking-wider text-primary font-semibold mb-1",
											children: "Main Campus / Headquarters"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-xl md:text-2xl font-bold mb-2",
											children: "Technology Incubation Centre, Nnewi"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground mb-4",
											children: [hq.address, ". Our Nnewi campus also serves as the South-East zonal headquarters for the Technology Incubation Centre network."]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: directionsUrl(hq),
													target: "_blank",
													rel: "noopener noreferrer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "w-4 h-4" }), " Get directions"]
												})
											})
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold",
									children: "Campus locator"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-sm mt-1",
									children: "Search by city or state, or filter by geopolitical zone."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full md:w-80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search e.g. Owerri, Anambra…",
										className: "pl-9"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: zone === "All" ? "default" : "outline",
									onClick: () => setZone("All"),
									children: "All zones"
								}), zones.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: zone === z ? "default" : "outline",
									onClick: () => setZone(z),
									children: z
								}, z))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid lg:grid-cols-[1fr,1.2fr] gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 lg:max-h-[480px] lg:overflow-y-auto lg:pr-2",
									children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground py-8 text-center",
										children: "No campuses match that search."
									}), filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										onClick: () => setActiveId(c.id),
										className: `cursor-pointer transition-colors ${activeId === c.id ? "border-primary ring-1 ring-primary/40" : "hover:border-primary/40"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-4 flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-semibold text-sm md:text-base leading-tight",
															children: c.name
														}), c.isHeadquarters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "default",
															className: "text-[10px]",
															children: "HQ"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground mt-1",
														children: c.address
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground mt-1.5",
														children: c.tagline
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3 mt-2 flex-wrap",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "secondary",
																className: "text-[10px]",
																children: c.zone
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
																to: `/locations/${c.slug}`,
																onClick: (e) => e.stopPropagation(),
																className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
																children: [
																	"Tech Faculty ",
																	c.city,
																	" details ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3 h-3" })
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
																href: directionsUrl(c),
																target: "_blank",
																rel: "noopener noreferrer",
																onClick: (e) => e.stopPropagation(),
																className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "w-3 h-3" }), " Directions"]
															})
														]
													})
												]
											})]
										})
									}, c.id))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-h-[480px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampusMap, {
										activeId,
										onSelect: setActiveId
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-3",
								children: "Browse every campus page A–Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mb-5 max-w-3xl",
								children: "Each city has its own page covering the courses, SIWES placement, teen holiday bootcamps and events available there."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2",
								children: [...campuses].sort((a, b) => a.city.localeCompare(b.city)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: `/locations/${c.slug}`,
									className: "text-sm text-muted-foreground hover:text-primary py-1.5 inline-flex items-center gap-1",
									children: [
										"Tech training in ",
										c.city,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3 h-3" })
									]
								}, c.slug))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl mx-auto text-center mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-3",
								children: "How we're everywhere at once"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Our partnership with the National Board for Technology Incubation, an agency of the Federal Ministry of Science, Technology and Innovation, lets Tech Faculty operate inside the same federally-run Technology Incubation Centres that host Nigeria's innovation ecosystem — so wherever the government has built a centre, our students already have a campus."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredibilityBanner, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Locations;
//#endregion
export { SplitComponent as component };
