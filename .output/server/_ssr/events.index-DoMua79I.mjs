import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { f as naira, u as TEEN_HOLIDAY_FROM } from "./fees-B-53IxaZ.mjs";
import { P as RefreshCw, Wt as Calendar, in as ArrowRight, j as Search, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as eventSchema, l as fetchEvents, n as EVENT_FORMATS, t as EVENT_CATEGORIES } from "./events-g7s0Buaf.mjs";
import { t as EventCard } from "./EventCard-fUk4J6dH.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/events.index-DoMua79I.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var PAGE_TITLE = "Tech Events in Nigeria 2026 — AI, Data & Developer Conferences";
var PAGE_DESCRIPTION = "Find upcoming tech events in Nigeria and Africa: AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work summits and free online webinars, updated twice a month.";
var FAQS = [
	{
		q: "What tech events are happening in Nigeria in 2026?",
		a: "This page lists upcoming AI and data conferences, developer meetups, hackathons, cybersecurity workshops, design sessions, remote work summits and free webinars across Nigeria and Africa. Listings refresh twice a month from public event platforms, and Tech Faculty NG's own meetups, workshops and holiday bootcamps appear alongside them."
	},
	{
		q: "Are there free tech events and webinars I can attend?",
		a: "Yes. Use the price filter to show only free events. Community meetups such as the Nnewi Tech Meetup, Google Developer Group sessions and most online webinars cost nothing to attend; you only register on the organiser's page. The same filter shows paid events if you are looking for larger conferences."
	},
	{
		q: "How do I register for an event listed here?",
		a: "Open the event's page on this site to read the full details, then use the register link to go straight to the organiser's official registration or ticket page. Tech Faculty NG does not collect ticket payments for events we do not organise, so you always pay the organiser directly."
	},
	{
		q: "Does Tech Faculty host its own tech events?",
		a: `Yes. Tech Faculty NG runs the Nnewi Tech Meetup at the Technology Incubation Centre in Nnewi on the last Saturday of every month, the AI for Everything Fellowship every Monday and Saturday from 11am to 2pm, practical AI workshops for business owners, and holiday tech bootcamps every school holiday for children and teenagers in Nnewi, Onitsha, Enugu, Owerri, Aba and other cities. Teen holiday tracks start from ${naira(TEEN_HOLIDAY_FROM.amount)}.`
	},
	{
		q: "Can I list or co-host an event with Tech Faculty?",
		a: "Yes. Community organisers, companies and developer groups can co-host or sponsor events with Tech Faculty NG, or send an event for inclusion in this directory. Message us on WhatsApp or email thetechfaculty@gmail.com with the event name, date, city and registration link, and we reply with the next steps."
	}
];
var Events = () => {
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [format, setFormat] = (0, import_react.useState)("all");
	const [city, setCity] = (0, import_react.useState)("all");
	const [price, setPrice] = (0, import_react.useState)("all");
	const { data: events = [], isLoading } = useQuery({
		queryKey: ["events"],
		queryFn: () => fetchEvents(),
		staleTime: 18e5
	});
	const cities = (0, import_react.useMemo)(() => Array.from(new Set(events.map((e) => e.city).filter(Boolean))).sort(), [events]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return events.filter((e) => {
			if (e.is_featured) return false;
			if (category !== "all" && e.category !== category) return false;
			if (format !== "all" && e.format !== format) return false;
			if (city !== "all" && e.city !== city) return false;
			if (price === "free" && !e.is_free) return false;
			if (!q) return true;
			return `${e.title} ${e.description} ${e.organizer} ${e.city ?? ""} ${e.tags.join(" ")}`.toLowerCase().includes(q);
		});
	}, [
		events,
		search,
		category,
		format,
		city,
		price
	]);
	const featured = events.filter((e) => e.is_featured);
	const lastRefreshed = (0, import_react.useMemo)(() => {
		const seen = events.filter((e) => !e.is_featured).map((e) => e.last_seen_at).sort();
		return seen.length ? seen[seen.length - 1] : null;
	}, [events]);
	const PAGE_SIZE = 12;
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		setVisibleCount(PAGE_SIZE);
	}, [
		search,
		category,
		format,
		city,
		price
	]);
	const visibleEvents = filtered.slice(0, visibleCount);
	(0, import_react.useEffect)(() => {
		const hash = window.location.hash.replace("#", "");
		if (!hash) return;
		const timer = window.setTimeout(() => {
			document.getElementById(hash)?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [isLoading]);
	const resetFilters = () => {
		setSearch("");
		setCategory("all");
		setFormat("all");
		setCity("all");
		setPrice("all");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: PAGE_TITLE,
						description: PAGE_DESCRIPTION,
						url: "https://techfaculty.ng/events",
						inLanguage: "en-NG",
						isPartOf: {
							"@type": "WebSite",
							name: "Tech Faculty NG",
							url: "https://techfaculty.ng"
						},
						about: [
							{
								"@type": "Thing",
								name: "Tech events Nigeria"
							},
							{
								"@type": "Thing",
								name: "AI conferences Africa"
							},
							{
								"@type": "Thing",
								name: "Developer meetups Nigeria"
							},
							{
								"@type": "Thing",
								name: "Hackathons Nigeria"
							}
						]
					})
				}),
				(() => {
					const items = events.slice(0, 25).map(eventSchema).filter(Boolean);
					if (items.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
						type: "application/ld+json",
						children: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "ItemList",
							name: "Upcoming tech events in Nigeria and Africa",
							numberOfItems: items.length,
							itemListElement: items.map((item, i) => ({
								"@type": "ListItem",
								position: i + 1,
								item
							}))
						})
					});
				})(),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: FAQS.map((f) => ({
							"@type": "Question",
							name: f.q,
							acceptedAnswer: {
								"@type": "Answer",
								text: f.a
							}
						}))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
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
							name: "Tech Events",
							item: "https://techfaculty.ng/events"
						}]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-16 md:py-24 px-4 relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-30",
							style: {
								backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
								backgroundSize: "40px 40px"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
									"aria-label": "Breadcrumb",
									className: "text-sm text-muted-foreground mb-4",
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "Tech Events"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl md:text-5xl font-bold mb-5",
									children: [
										"Tech ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient",
											children: "Events"
										}),
										" in Nigeria & Africa"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8",
									children: "AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work summits and free online webinars — refreshed twice a month, with registration links straight to each organiser."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/2348068597140?text=Hello%2C%20I%20want%20to%20know%20about%20upcoming%20Tech%20Faculty%20events",
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 20
											}), "Get event updates"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#upcoming",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
												className: "mr-2",
												size: 18
											}), " Browse upcoming events"]
										})
									})]
								})
							]
						})]
					}),
					featured.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-12 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold mb-2",
									children: "Tech Faculty events"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-8 max-w-2xl",
									children: "Meetups, workshops and holiday bootcamps we run ourselves across our campuses in Nnewi, Onitsha, Enugu, Owerri, Aba, Abuja, Lagos and other Nigerian cities."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
									children: featured.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event }, event.id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "upcoming",
						className: "py-16 px-4 scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold mb-2",
									children: "Upcoming tech events"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground mb-8 max-w-2xl",
									children: ["Gathered twice a month from Meetup, Eventbrite, Luma and Microsoft Reactor, with events in the South-East and online first. Filter by city, format, category or price.", lastRefreshed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block mt-1 text-sm",
										children: [
											"Last updated",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
												dateTime: lastRefreshed,
												children: new Date(lastRefreshed).toLocaleDateString("en-NG", {
													day: "numeric",
													month: "long",
													year: "numeric"
												})
											}),
											"."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative lg:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
												size: 16,
												className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: search,
												onChange: (e) => setSearch(e.target.value),
												placeholder: "Search events, topics, organisers",
												className: "pl-9",
												"aria-label": "Search tech events"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: category,
											onValueChange: setCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by event category",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All categories"
											}), EVENT_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c.value,
												children: c.label
											}, c.value))] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: format,
											onValueChange: setFormat,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by event format",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Format" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All formats"
											}), EVENT_FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: f.value,
												children: f.label
											}, f.value))] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: city,
												onValueChange: setCity,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													"aria-label": "Filter by city",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "City" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All cities"
												}), cities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: c,
													children: c
												}, c))] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: price,
												onValueChange: setPrice,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													"aria-label": "Filter by price",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Price" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "Any price"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "free",
													children: "Free only"
												})] })]
											})]
										})
									]
								}),
								isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
									children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 bg-card border border-border rounded-lg animate-pulse" }, i))
								}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center py-16 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "No events match those filters yet. New listings are added every Monday."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: resetFilters,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
											size: 16,
											className: "mr-2"
										}), " Clear filters"]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground mb-4",
										children: [
											"Showing ",
											Math.min(visibleCount, filtered.length),
											" of ",
											filtered.length,
											" event",
											filtered.length === 1 ? "" : "s"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
										children: visibleEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event }, event.id))
									}),
									visibleCount < filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "lg",
											onClick: () => setVisibleCount((c) => c + PAGE_SIZE),
											children: [
												"See more events (",
												filtered.length - visibleCount,
												" left)"
											]
										})
									})
								] })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-8",
								children: "Tech events in Nigeria — questions answered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-6",
								children: FAQS.map((faq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold mb-2",
									children: faq.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-sm leading-relaxed",
									children: faq.a
								})] }, faq.q))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-14 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "Keep going after the event"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/departments",
											children: "Explore our departments"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/locations",
											children: "Find a campus near you"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/careers",
											children: "Browse AI & remote jobs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/blog",
											children: "Read the blog"
										})
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 px-4 text-center bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold mb-4",
									children: "Hosting, sponsoring or listing an event?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-8",
									children: "Partner with Tech Faculty to co-host workshops, sponsor a hackathon, or get your Nigerian or African tech event listed in this directory."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-4 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20hosting%2C%20sponsoring%20or%20listing%20a%20tech%20event",
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 18
											}), " Talk to us on WhatsApp"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "mailto:thetechfaculty@gmail.com",
											children: ["Email the events team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												className: "ml-2",
												size: 18
											})]
										})
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Events;
//#endregion
export { SplitComponent as component };
