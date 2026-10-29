import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useParams$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Gt as CalendarDays, Jt as Building2, Y as MapPin, an as ArrowLeft, bt as ExternalLink, ft as Globe, y as Ticket } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as eventSchema, c as fetchEventBySlug, d as locationLabel, f as priceLabel, i as dateLabel, l as fetchEvents, o as eventUrl, r as categoryLabel, u as formatLabel } from "./events-g7s0Buaf.mjs";
import { t as EventCard } from "./EventCard-fUk4J6dH.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/events._slug-CJYD_jF_.js
var import_jsx_runtime = require_jsx_runtime();
var EventDetail = () => {
	const { slug = "" } = useParams$1();
	const { data: event, isLoading } = useQuery({
		queryKey: ["event", slug],
		queryFn: () => fetchEventBySlug(slug),
		enabled: !!slug
	});
	const { data: all = [] } = useQuery({
		queryKey: ["events"],
		queryFn: () => fetchEvents(),
		staleTime: 18e5
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-32 px-4 container mx-auto max-w-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-2/3 bg-card border border-border rounded animate-pulse mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 bg-card border border-border rounded animate-pulse" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	if (!event) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-32 px-4 container mx-auto max-w-3xl text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl md:text-3xl font-bold",
						children: "This event is no longer listed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "It may have ended or been removed by the organiser."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/events",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Browse upcoming tech events" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const price = priceLabel(event);
	const online = event.format === "VIRTUAL";
	const place = locationLabel(event);
	`${event.title}${place}`;
	`${event.title}: ${categoryLabel(event.category).toLowerCase()} in ${place}, ${dateLabel(event)}. ${event.description}`.replace(/\s+/g, " ").slice(0, 158);
	const related = all.filter((e) => e.slug !== event.slug).filter((e) => e.city === event.city || e.category === event.category || e.format === event.format).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(() => {
				const schema = eventSchema(event);
				return schema ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(schema)
				}) : null;
			})(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: "https://techfaculty.ng/"
						},
						{
							"@type": "ListItem",
							position: 2,
							name: "Tech Events",
							item: "https://techfaculty.ng/events"
						},
						{
							"@type": "ListItem",
							position: 3,
							name: event.title,
							item: eventUrl(event)
						}
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-24 pb-20 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-3xl space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Breadcrumb",
							className: "text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/",
									className: "hover:text-primary",
									children: "Home"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/events",
									className: "hover:text-primary",
									children: "Tech Events"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: categoryLabel(event.category)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium",
									children: [
										categoryLabel(event.category),
										" · ",
										formatLabel(event.format)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-4xl font-bold leading-tight",
									children: event.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 14 }),
										" Organised by ",
										event.organizer
									]
								})
							]
						}),
						event.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: event.image_url,
							alt: `${event.title} event cover`,
							loading: "lazy",
							className: "w-full rounded-lg border border-border object-cover max-h-80"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card border border-border rounded-lg p-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-1 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 14 }), " Date & time"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: dateLabel(event)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-1 mb-1",
									children: [online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 14 }), " Location"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-medium",
									children: [
										event.venue_name ? `${event.venue_name}, ` : "",
										place,
										event.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-muted-foreground font-normal",
											children: event.address
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-1 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { size: 14 }), " Admission"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: price ?? "See organiser's page"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground mb-1",
									children: "Listed via"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: event.is_featured ? "Tech Faculty NG" : event.source_platform
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold",
								children: "About this event"
							}), event.description.split(/\n{2,}/).map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed",
								children: para
							}, i))]
						}),
						event.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3",
							children: "Topics"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-wrap gap-2",
							children: event.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground",
								children: tag
							}, tag))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "bg-card border border-border rounded-lg p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "How to attend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"Registration is handled by the organiser",
										event.is_featured ? " (Tech Faculty NG)" : ` on ${event.source_platform}`,
										". Open the official page to reserve a place, confirm the final date, and check any joining instructions."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: event.source_url,
											target: "_blank",
											rel: "noopener noreferrer nofollow",
											"aria-label": `Register for ${event.title} on the organiser's website`,
											children: ["Register for this event ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
												size: 16,
												className: "ml-2"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `https://wa.me/2348068597140?text=${encodeURIComponent(`Hello, I have a question about this event: ${event.title}`)}`,
											target: "_blank",
											rel: "noopener noreferrer",
											children: "Ask us about it"
										})
									})]
								})
							]
						}),
						related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold",
								children: "Related tech events"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-5",
								children: related.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event: e }, e.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/events",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
											size: 16,
											className: "mr-2"
										}), " All tech events"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/locations",
										children: "Campuses near you"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/careers",
										children: "AI & remote jobs"
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = EventDetail;
//#endregion
export { SplitComponent as component };
