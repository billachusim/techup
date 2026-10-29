import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, c as CollapsibleTrigger$1, o as Collapsible$1, s as CollapsibleContent$1 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { c as PLAN_PRICING, d as instalmentSplit, i as LEARNING_MODES, l as PROMO_CODES, p as planMinimum, r as INSTALMENTS, t as ALL_COURSES } from "./fees-B-53IxaZ.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { i as mightHaveSession, t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { i as useUser, r as useCurrency } from "./UserContext-uFGsrvio.mjs";
import { $ as LoaderCircle, A as Send, At as Code, C as Sparkles, D as Shield, E as ShoppingBag, Et as Cpu, Ft as CircleCheck, Gt as CalendarDays, Ht as Check, Jt as Building2, K as MessageSquare, Lt as CircleAlert, Mt as Clock, Nt as Circle, O as ShieldCheck, Qt as BookOpen, R as PhoneCall, Tt as CreditCard, U as Palette, Vt as ChevronDown, Wt as Calendar, X as Mail, Xt as BriefcaseBusiness, Y as MapPin, Yt as Briefcase, Zt as Brain, _ as TrendingUp, bt as ExternalLink, dt as GraduationCap, ft as Globe, in as ArrowRight, j as Search, jt as Cloud, k as Share2, m as Trophy, nn as Award, o as Video, q as MessageCircle, r as X, rn as ArrowUpRight, rt as LayoutDashboard, s as Users, w as Smartphone, wt as Database, x as Star, z as Percent } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BWmmnMPu.mjs";
import { i as isFreePlan, r as grantsAccess } from "./enrollment-access-BaRzVf28.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as fetchPublishedRoles } from "./talent-CymeyHOO.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-v01m15hu.mjs";
import { n as COMMUNITY_WHATSAPP_URL, r as isMobileDevice, t as AI_FELLOWSHIP_WHATSAPP_URL } from "./whatsapp-BIGKDc9S.mjs";
import { n as rememberCheckout, r as trackEvent } from "./analytics-BrZRoVBL.mjs";
import { t as Checkbox } from "./checkbox-o9PPpNJX.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
import { t as RoleCard } from "./RoleCard-BZWs0FcC.mjs";
import { n as WhatsAppLeadDialog, r as hasCapturedLead, t as JoinWhatsAppButton } from "./JoinWhatsAppButton-gx5qEaAI.mjs";
import { r as onboardStudent, t as ScrollArea } from "./student-onboarding.functions-CZppZl7C.mjs";
import { l as fetchEvents } from "./events-g7s0Buaf.mjs";
import { t as EventCard } from "./EventCard-fUk4J6dH.mjs";
import { n as SignupForm, t as LoginForm } from "./LoginForm-BlYf1i3R.mjs";
import { a as googleReviews, i as GraduateStories, n as GOOGLE_REVIEWS_URL, r as GOOGLE_WRITE_REVIEW_URL, t as GOOGLE_RATING } from "./GraduateStories-Dcn_GfqR.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-Co1-8MUG.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/radix-ui__react-radio-group.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/routes-B2vZDtTP.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var taglines = [
	"Learn Today. Earn Tomorrow.",
	"Train. Certify. Get Hired.",
	"Your Future in Tech Starts Here.",
	"Build Skills. Build Wealth.",
	"From Student to Professional."
];
var Hero = () => {
	const [currentTagline, setCurrentTagline] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			setCurrentTagline((prev) => (prev + 1) % taglines.length);
		}, 3e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "hero",
		className: "min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0",
					style: {
						backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
						backgroundSize: "40px 40px"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "w-full h-full",
					xmlns: "http://www.w3.org/2000/svg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "grid-gradient",
						x1: "0%",
						y1: "0%",
						x2: "100%",
						y2: "100%",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "hsl(158, 100%, 50%)",
							stopOpacity: "0.2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
								attributeName: "stop-opacity",
								values: "0.2;0.4;0.2",
								dur: "4s",
								repeatCount: "indefinite"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "hsl(180, 100%, 45%)",
							stopOpacity: "0.2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
								attributeName: "stop-opacity",
								values: "0.2;0.4;0.2",
								dur: "4s",
								repeatCount: "indefinite",
								begin: "2s"
							})
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "100%",
						height: "100%",
						fill: "url(#grid-gradient)"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto max-w-4xl text-center space-y-8 relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
						children: [
							"Tech Training in Anambra & Across Nigeria: Get",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent",
								children: "Trained, Certified & Employed"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm md:text-base text-muted-foreground font-medium" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl md:text-2xl lg:text-3xl font-semibold min-h-[40px] md:min-h-[48px] flex items-center justify-center text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "animate-fade-in",
							children: taglines[currentTagline]
						}, currentTagline)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
						children: [
							"Over 6,000 students trained across ",
							departments.length,
							" departments since 2022. 75% of graduates secure tech roles within six months (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/outcomes",
								className: "underline hover:text-primary",
								children: "how we count"
							}),
							"). Our top students start earning through internships as early as month 3."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-4 justify-center items-center pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
							size: "lg",
							url: COMMUNITY_WHATSAPP_URL,
							groupName: "the Tech Faculty WhatsApp community",
							captureSource: "home-hero",
							captureContext: "Homepage hero",
							className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] hover:opacity-90 shadow-lg font-semibold text-background"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							variant: "outline",
							onClick: () => {
								document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
							},
							className: "font-semibold",
							children: ["Tech Up Now", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "ml-2",
								size: 20
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Free to join — get program updates, events, and job alerts first."
					})
				]
			})
		]
	});
};
var stats = [
	{
		icon: GraduationCap,
		value: "6,000+",
		label: "Students Trained"
	},
	{
		icon: TrendingUp,
		value: "75%",
		label: "Employed Within 6 Months"
	},
	{
		icon: BookOpen,
		value: String(departments.length),
		label: "Training Departments"
	},
	{
		icon: Award,
		value: "4+",
		label: "Years Training Excellence"
	}
];
var StatsBar = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-12 px-4 bg-primary/5 border-y border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-8",
					children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, {
								className: "w-7 h-7 text-primary",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl md:text-4xl font-bold text-foreground",
								children: stat.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: stat.label
							})
						]
					}, stat.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground text-center mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/outcomes",
						className: "underline hover:text-primary",
						children: "How we count these numbers"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground text-center mt-4 max-w-3xl mx-auto leading-relaxed",
					children: [
						"According to the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "underline hover:text-primary",
							children: "World Economic Forum Future of Jobs Report (2025)"
						}),
						", AI and big data are the fastest-growing skills employers are asking for, and AI and machine learning specialists are among the fastest-growing jobs."
					]
				})
			]
		})
	});
};
var programs = [
	{
		title: "SIWES / Industrial Training",
		badge: "Hot right now",
		description: "IT placement for university students at an FMSTI-licensed centre — choose the Learn & Pay track or the Tutor & Earn track, complete real projects, and get your logbook signed.",
		image: "/assets/siwes-featured-C15wEy-Y.jpg",
		alt: "SIWES and Industrial Training programme at Tech Faculty",
		cta: "Explore SIWES",
		href: "/siwes"
	},
	{
		title: "AI for Everything",
		badge: "Cohort forming",
		description: "Our AI Agents & Data Training Fellowship. Use AI agents to solve real-world tasks, train the models powering intelligent systems and robotics, and earn a certificate on completion.",
		image: "/assets/ai-for-everything-DKMGOsrj.jpg",
		alt: "AI for Everything — AI Agents and Data Training Fellowship",
		cta: "Join the AI Fellowship",
		href: AI_FELLOWSHIP_WHATSAPP_URL,
		external: true
	},
	{
		title: "Nnewi Tech Meetup",
		badge: "Last Saturday monthly",
		description: "The monthly gathering of the Nnewi tech community, on the last Saturday of every month — product demos, lightning talks, networking, and collaboration at Tech Faculty HQ.",
		image: "/assets/nnewi-tech-meetup-BWBFt0g_.jpg",
		alt: "Nnewi Tech Meetup community event poster",
		cta: "See event details",
		href: "/events#nnewi-tech-meetup"
	},
	{
		title: "Talent & Jobs Marketplace",
		badge: "Now hiring",
		description: "Create your talent profile, apply to open roles with one click, and get matched to real projects with Nigerian and African businesses.",
		image: "/assets/talent-marketplace-8_WdFyNc.jpg",
		alt: "Tech Faculty Talent and Jobs Marketplace",
		cta: "Browse open roles",
		href: "/careers"
	}
];
/** Links to the homepage with this hash open the bootcamp form, e.g. from ads or WhatsApp. */
var BOOTCAMP_HASH = "#free-bootcamp";
var bootcampFacts = [
	{
		icon: CalendarDays,
		label: "3 weeks, hands-on"
	},
	{
		icon: MapPin,
		label: "Free at every campus"
	},
	{
		icon: Percent,
		label: "Up to 50% off a full course"
	}
];
var bootcampFields = [{
	id: "campus",
	label: "Campus",
	placeholder: "Choose your nearest campus",
	required: true,
	options: [...new Set(campuses.map((c) => c.city))]
}, {
	id: "department",
	label: "Course you're most interested in",
	placeholder: "Not sure yet",
	options: departments.map((d) => d.title)
}];
/**
* On phones the cards stick on top of each other as you scroll: the next card
* slides up over the current one, which shrinks and dims behind it. Nothing
* moves on larger screens or when the visitor prefers reduced motion.
*/
function useStackedCards() {
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const list = listRef.current;
		if (!list) return;
		const query = window.matchMedia("(max-width: 767px) and (prefers-reduced-motion: no-preference)");
		const items = Array.from(list.children);
		const cardOf = (item) => item.firstElementChild;
		let frame = 0;
		const update = () => {
			frame = 0;
			items.forEach((item, i) => {
				const card = cardOf(item);
				const next = items[i + 1];
				if (!card) return;
				if (!query.matches || !next) {
					card.style.transform = "";
					card.style.filter = "";
					return;
				}
				const current = item.getBoundingClientRect();
				const covered = (current.bottom - next.getBoundingClientRect().top) / current.height;
				const progress = Math.min(Math.max(covered, 0), 1);
				card.style.transform = progress ? `scale(${1 - progress * .06})` : "";
				card.style.filter = progress ? `brightness(${1 - progress * .3})` : "";
			});
		};
		const schedule = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		query.addEventListener("change", schedule);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			query.removeEventListener("change", schedule);
		};
	}, []);
	return listRef;
}
/** Each list item sticks a little lower than the one before, so the stack shows its edges. */
var stackItemClass = "fp-reveal max-md:motion-safe:sticky max-md:top-[calc(5rem+var(--i)*0.75rem)]";
var cardShellClass = "h-full origin-top rounded-[1.75rem] transition-[box-shadow,translate] duration-500 ease-out max-md:min-h-[30rem]";
var BootcampCard = ({ onReserve }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
	id: "free-bootcamp",
	className: `${cardShellClass} relative isolate flex flex-col overflow-hidden bg-[hsl(165_35%_7%)] p-6 text-white shadow-xl shadow-primary/10 sm:p-8 md:min-h-[24rem] lg:p-10`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "fp-grid absolute inset-0 -z-10 opacity-40"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "fp-glow absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/40 blur-3xl"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "fp-glow fp-glow-slow absolute -bottom-32 -left-16 -z-10 size-72 rounded-full bg-[hsl(190_100%_45%)]/25 blur-3xl"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				size: 14,
				className: "text-primary"
			}), "Free · Every campus"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl",
			children: ["Free Tech ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient",
				children: "Bootcamp"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-base text-white/70 sm:text-lg",
			children: "Three weeks of hands-on tech training at any Tech Faculty NG campus, at no cost. Top performers qualify for up to 50% off any of our department courses."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 flex flex-wrap gap-2",
			children: bootcampFacts.map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm text-white/85 ring-1 ring-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					size: 15,
					className: "text-primary"
				}), label]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "lg",
				onClick: onReserve,
				className: "group/cta h-12 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90",
				children: ["Reserve my free seat", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-white/55",
				children: "Limited seats per campus. No payment needed."
			})]
		})
	]
});
var ctaArrow = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: "grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
		size: 18,
		className: "rotate-45"
	})
});
var ProgramCard = ({ program }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
	className: `${cardShellClass} group flex flex-col border border-border bg-card p-2 hover:shadow-2xl hover:shadow-foreground/5 md:hover:-translate-y-1 motion-reduce:hover:translate-y-0`,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: program.image,
			alt: program.alt,
			loading: "lazy",
			className: "size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur",
			children: program.badge
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col px-4 pb-4 pt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-semibold tracking-tight",
				children: program.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground",
				children: program.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: program.external ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(JoinWhatsAppButton, {
					url: program.href,
					groupName: program.title,
					captureSource: `home-featured:${program.title}`,
					captureContext: program.title,
					variant: "ghost",
					className: "h-auto w-full justify-between rounded-full p-0 text-base font-semibold hover:bg-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: program.cta }), ctaArrow]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: program.href,
					className: "flex items-center justify-between rounded-full text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
					children: [program.cta, ctaArrow]
				})
			})
		]
	})]
});
var FeaturedPrograms = () => {
	const listRef = useStackedCards();
	const [bootcampOpen, setBootcampOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.location.hash === BOOTCAMP_HASH) setBootcampOpen(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "featured-programs",
		className: "px-4 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Featured programs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-3 text-3xl font-bold tracking-tight md:text-5xl",
					children: ["Find your way ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gradient",
						children: "into tech"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-base text-muted-foreground md:text-right",
					children: "The programs and events our community is joining right now, open to students, professionals and complete beginners."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				ref: listRef,
				className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: `${stackItemClass} md:col-span-2`,
					style: { "--i": 0 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootcampCard, { onReserve: () => setBootcampOpen(true) })
				}), programs.map((program, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: stackItemClass,
					style: { "--i": i + 1 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, { program })
				}, program.title))]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: bootcampOpen,
			onOpenChange: setBootcampOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reserve your free bootcamp seat" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Three weeks of free, hands-on training at your nearest campus. Top performers qualify for up to 50% off any department course. We'll contact you with the next start date." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, {
					interest: "free_bootcamp",
					source: "home-featured:free-bootcamp",
					submitLabel: "Reserve my free seat",
					whatsappMessage: "Hello Tech Faculty NG, I just reserved a seat on the Free Tech Bootcamp.",
					extraFields: bootcampFields,
					schoolLabel: "School or workplace",
					schoolPlaceholder: "e.g. UNIZIK, or where you work",
					compact: true
				})]
			})
		})]
	});
};
var scrollTo = (id) => (e) => {
	const el = document.getElementById(id);
	if (el) {
		e.preventDefault();
		el.scrollIntoView({ behavior: "smooth" });
	}
};
var HowItWorks = () => {
	const features = [
		{
			step: "01",
			icon: GraduationCap,
			title: "Get Trained",
			description: `Hands-on projects with industry experts across ${departments.length} tech departments.`,
			hint: "Explore courses & pricing",
			to: "/#pricing",
			onClick: scrollTo("pricing")
		},
		{
			step: "02",
			icon: Award,
			title: "Get Certified",
			description: "A Tech Faculty NG certificate, licensed by FMSTI through NBTI, that any employer can verify online.",
			hint: "Verify a certificate",
			to: "/verify"
		},
		{
			step: "03",
			icon: Briefcase,
			title: "Get Employed",
			description: "100+ partner companies hire graduates who perform. Top students earn from month 3.",
			hint: "Browse jobs & talent",
			to: "/careers"
		}
	];
	const cardClass = "group relative flex flex-col h-full bg-card border border-border rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4 bg-secondary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-14 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl md:text-5xl font-bold",
						children: [
							"From L",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
								children: "earn"
							}),
							"er to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
								children: "Earn"
							}),
							"er; ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "3"
							}),
							" Steps in ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "3"
							}),
							" Months."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-base md:text-lg text-muted-foreground max-w-xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/outcomes",
							className: "underline hover:text-primary",
							children: "Over 6,000 students"
						}), " trained. Learn, get certified, and start earning from month 3."]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid md:grid-cols-3 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: "hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"
					}), features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: f.to,
						onClick: f.onClick,
						"aria-label": `${f.title}: ${f.hint}`,
						className: cardClass,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center bg-card",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "w-7 h-7 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-mono text-muted-foreground",
									children: f.step
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold mb-2",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed flex-1",
								children: f.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary",
								children: [f.hint, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
							})
						]
					}, f.title))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mt-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						onClick: () => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" }),
						className: "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg font-semibold text-primary-foreground",
						children: ["Start my 3-month glow-up", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							className: "ml-2",
							size: 20
						})]
					})
				})
			]
		})
	});
};
var icons = {
	Code,
	Smartphone,
	Database,
	Shield,
	Brain,
	Globe,
	Share2,
	Video,
	Cloud,
	Cpu
};
var DepartmentsSection = () => {
	const [query, setQuery] = (0, import_react.useState)("");
	const filtered = departments.filter((dept) => {
		const q = query.toLowerCase();
		return dept.title.toLowerCase().includes(q) || dept.tagline.toLowerCase().includes(q) || dept.courses.some((c) => c.toLowerCase().includes(q));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "departments",
		className: "py-24 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-5xl font-bold mb-4",
							children: "Our Departments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8",
							children: "Ten departments built around AI for everything — from complete beginner to job-ready engineer. Open one for a quick look, then enter the department for the full curriculum, tools, and salaries."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-md mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									placeholder: "Search departments or courses...",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									className: "pl-10",
									"aria-label": "Search departments or courses"
								})]
							})
						})
					]
				}),
				filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-muted-foreground py-10",
					children: "No departments found matching your search."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "divide-y rounded-lg border",
					children: filtered.map((dept) => {
						const Icon = icons[dept.icon] ?? Code;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
							value: dept.id,
							className: "border-0 px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
								className: "hover:no-underline py-4 min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-left flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "p-2 rounded-md flex-shrink-0",
										style: { backgroundColor: `${dept.color}20` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "h-4 w-4",
											style: { color: dept.color }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex min-w-0 items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold truncate",
												children: dept.title
											}), dept.trending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "gap-1 text-[10px] px-1.5 py-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-2.5 w-2.5" }), " Trending"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												" ",
												dept.duration
											]
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pb-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: dept.tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: dept.courses.slice(0, 4).map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												className: "h-3.5 w-3.5 mt-0.5 flex-shrink-0",
												style: { color: dept.color }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: course })]
										}, course))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: `/departments/${dept.slug}`,
											className: "flex-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "w-full",
												children: [
													"Enter ",
													dept.title,
													" department",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
														size: 14,
														className: "ml-2"
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
											size: "sm",
											url: COMMUNITY_WHATSAPP_URL,
											groupName: "the Tech Faculty WhatsApp community",
											captureSource: "home-departments",
											captureContext: dept.title,
											className: "flex-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-center gap-2",
												children: ["Join Community ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 14 })]
											})
										})]
									})
								]
							}) })]
						}, dept.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/departments",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "lg",
							children: ["Browse all departments ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								size: 16,
								className: "ml-2"
							})]
						})
					})
				})
			]
		})
	});
};
var LatestJobs = () => {
	const { data: roles = [], isLoading } = useQuery({
		queryKey: ["talent-roles-home"],
		queryFn: () => fetchPublishedRoles(),
		staleTime: 6e5
	});
	const featured = roles.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-secondary/20 px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold md:text-3xl",
						children: "Open roles for African talent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto max-w-2xl text-muted-foreground",
						children: "Build one Tech Faculty talent profile and get matched to our openings and approved business projects."
					})]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 animate-pulse rounded-lg border border-border bg-card" }, index))
				}) : featured.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3",
					children: featured.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, { role }, role.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-card p-8 text-center text-muted-foreground",
					children: "New openings are added as businesses submit approved work."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/careers",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gap-2",
							children: ["Browse Careers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/hire",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 16 }), " Hire talent"]
						})
					})]
				})
			]
		})
	});
};
var UpcomingEvents = () => {
	const { data: events = [], isLoading } = useQuery({
		queryKey: ["events"],
		queryFn: () => fetchEvents(),
		staleTime: 18e5
	});
	const featured = events.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl md:text-3xl font-bold",
						children: "Upcoming Tech Events in Nigeria & Africa"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground max-w-2xl mx-auto",
						children: "AI and data conferences, developer meetups, hackathons, cybersecurity workshops and free online webinars — plus our own Nnewi Tech Meetup and holiday bootcamps. Updated twice a month."
					})]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 rounded-lg border border-border bg-card animate-pulse" }, i))
				}) : featured.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left",
					children: featured.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event }, event.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/events",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "gap-2",
							children: ["See all tech events ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						})
					})
				})
			]
		})
	});
};
var getInitialColor = (name) => {
	const colors = [
		"bg-primary",
		"bg-[hsl(200,70%,50%)]",
		"bg-[hsl(270,60%,50%)]",
		"bg-[hsl(340,65%,50%)]",
		"bg-[hsl(30,80%,50%)]",
		"bg-[hsl(145,60%,40%)]",
		"bg-[hsl(210,60%,45%)]",
		"bg-[hsl(0,65%,50%)]"
	];
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return colors[Math.abs(hash) % colors.length];
};
var Testimonials = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "testimonials",
		className: "py-24 px-4 bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-12 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-5xl font-bold",
						children: "What Our Students Say"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: GOOGLE_REVIEWS_URL,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex flex-wrap items-center justify-center gap-2 text-lg text-muted-foreground hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex gap-0.5",
								"aria-hidden": "true",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									size: 18,
									className: "fill-primary text-primary"
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: GOOGLE_RATING.rating
								}),
								" on Google from",
								" ",
								GOOGLE_RATING.count,
								" reviews"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								size: 14,
								"aria-hidden": "true"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: googleReviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "bg-card border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"\"",
									review.text,
									"\""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-4 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 shrink-0 rounded-full ${getInitialColor(review.name)} flex items-center justify-center`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-white",
										children: review.name.charAt(0)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: review.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground",
									children: [review.context ? `${review.context} · ` : "", "Google review"]
								})] })]
							})]
						})
					}, review.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-col sm:flex-row items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: GOOGLE_WRITE_REVIEW_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Trained with us? Leave a Google review"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: GOOGLE_REVIEWS_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Read all reviews on Google"
						})
					})]
				})
			]
		})
	});
};
var AIChatModal = ({ open, onOpenChange }) => {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const handleSend = async () => {
		if (!input.trim() || isLoading) return;
		const userMessage = input.trim();
		setInput("");
		setMessages((prev) => [...prev, {
			role: "user",
			content: userMessage
		}]);
		setIsLoading(true);
		try {
			const { data, error } = await (await getSupabase()).functions.invoke("faculty-ai-chat", { body: {
				message: userMessage,
				conversationHistory: messages
			} });
			if (error) throw error;
			if (data?.response) setMessages((prev) => [...prev, {
				role: "assistant",
				content: data.response
			}]);
		} catch (error) {
			console.error("Error calling AI:", error);
			toast({
				title: "Error",
				description: "Failed to get AI response. Please try again.",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};
	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[500px] max-h-[600px] flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Talk to Faculty AI" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto space-y-4 py-4",
					children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center text-muted-foreground py-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2",
							children: "Hi! I'm Faculty AI 👋"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Tell me about your interests, goals, or what you'd like to learn, and I'll recommend the best courses for you!"
						})]
					}) : messages.map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `max-w-[80%] rounded-lg px-4 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm whitespace-pre-wrap",
								children: msg.content
							})
						})
					}, idx)), isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-muted rounded-lg px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-4 border-t",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyPress: handleKeyPress,
						placeholder: "Tell me about yourself and what you want to learn...",
						className: "min-h-[60px] resize-none",
						disabled: isLoading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSend,
						disabled: !input.trim() || isLoading,
						size: "icon",
						className: "h-[60px] w-[60px] shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5" })
					})]
				})
			]
		})
	});
};
var cards = [{
	icon: PhoneCall,
	title: "Not Sure Where to Start?",
	buttons: [{
		label: "Talk to Faculty AI",
		icon: MessageSquare,
		action: "ai"
	}, {
		label: "Book a Clarity Call",
		icon: Calendar,
		action: "call"
	}]
}, {
	icon: Sparkles,
	title: "Need A Custom Package?",
	description: "Looking for corporate training or personalized learning paths?",
	buttons: [{
		label: "Contact Us for Custom Package",
		icon: MessageSquare,
		action: "custom"
	}]
}];
var Clarity = () => {
	const [showAIChat, setShowAIChat] = (0, import_react.useState)(false);
	const [showClarityCall, setShowClarityCall] = (0, import_react.useState)(false);
	const [currentCard, setCurrentCard] = (0, import_react.useState)(0);
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const [touchStart, setTouchStart] = (0, import_react.useState)(0);
	const [touchEnd, setTouchEnd] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setCurrentCard((prev) => (prev + 1) % cards.length);
		}, 5e3);
		return () => clearInterval(interval);
	}, [isPaused]);
	const handleButtonClick = (action) => {
		if (action === "ai") setShowAIChat(true);
		else if (action === "call") setShowClarityCall(true);
		else if (action === "custom") window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(`Hi! I'd like to discuss a custom training package tailored to my needs.`)}`, "_blank");
	};
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientX);
	};
	const handleTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};
	const handleTouchEnd = () => {
		if (touchStart - touchEnd > 75) setCurrentCard((prev) => (prev + 1) % cards.length);
		if (touchStart - touchEnd < -75) setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-24 px-4 bg-muted/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto max-w-4xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative overflow-hidden",
					onMouseEnter: () => setIsPaused(true),
					onMouseLeave: () => setIsPaused(false),
					onTouchStart: handleTouchStart,
					onTouchMove: handleTouchMove,
					onTouchEnd: handleTouchEnd,
					children: cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-background to-muted/50 border-2 transition-all duration-500 ${index === currentCard ? "opacity-100 translate-x-0" : index < currentCard ? "opacity-0 -translate-x-full absolute inset-0" : "opacity-0 translate-x-full absolute inset-0"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "w-8 h-8 text-primary" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl md:text-4xl font-bold",
								children: card.title
							}),
							card.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground max-w-2xl mx-auto",
								children: card.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col sm:flex-row gap-4 justify-center pt-4",
								children: card.buttons.map((button, btnIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									variant: btnIndex === 0 ? "default" : "outline",
									onClick: () => handleButtonClick(button.action),
									className: btnIndex === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" : "shadow-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(button.icon, {
										className: "mr-2",
										size: 20
									}), button.label]
								}, btnIndex))
							})
						]
					}, index))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center gap-2 mt-6",
					children: cards.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCurrentCard(index),
						className: `w-2 h-2 rounded-full transition-all ${index === currentCard ? "bg-primary w-8" : "bg-muted-foreground/30"}`,
						"aria-label": `Go to slide ${index + 1}`
					}, index))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatModal, {
				open: showAIChat,
				onOpenChange: setShowAIChat
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showClarityCall,
				onOpenChange: setShowClarityCall,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[500px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Book Your Free Clarity Call" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"Choosing the right tech career path can be overwhelming. That's why we offer a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "free clarity call"
									}),
									" with our expert advisors."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "In this 30-minute call, you'll get:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "text-sm text-muted-foreground space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary mt-1",
												children: "✓"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personalized career path recommendations" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary mt-1",
												children: "✓"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Insights into industry trends and opportunities" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary mt-1",
												children: "✓"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear roadmap to achieve your tech career goals" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								onClick: () => window.open("https://calendly.com/techfaculty", "_blank"),
								className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
									className: "mr-2",
									size: 20
								}), "Open Calendly"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground text-center",
								children: "No commitment required. Just honest advice to help you succeed."
							})
						]
					})]
				})
			})
		]
	});
};
var FacultyDiscount = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto max-w-5xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row items-center gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[hsl(180,100%,45%)] flex items-center justify-center shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-12 h-12 text-background" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center border-4 border-background shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-6 h-6 text-accent-foreground" })
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 text-center md:text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl md:text-2xl font-semibold text-foreground",
								children: "Buy recommended laptops, gadgets and accessories at 50% discount from our tech store."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/tech-store",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] hover:opacity-90 shadow-lg font-semibold text-background",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
										className: "mr-2",
										size: 20
									}), "Shop Now"]
								})
							})
						})
					]
				})
			})
		})
	});
};
var services = [
	{
		title: "Business Partnerships",
		description: "Corporate training, AI workshops, and business digitization programs for organizations.",
		icon: Building2,
		href: "/business-partnerships",
		gradient: "from-blue-500/10 to-indigo-500/10",
		iconColor: "hsl(217 91% 60%)"
	},
	{
		title: "School Collaborations",
		description: "University bootcamps, curriculum integration, and student certification programs.",
		icon: GraduationCap,
		href: "/school-collaborations",
		gradient: "from-purple-500/10 to-pink-500/10",
		iconColor: "hsl(280 100% 70%)"
	},
	{
		title: "Events",
		description: "Community tech workshops, hackathons, speaker sessions, and networking events.",
		icon: Calendar,
		href: "/events",
		gradient: "from-orange-500/10 to-yellow-500/10",
		iconColor: "hsl(25 95% 53%)"
	},
	{
		title: "SIWES / Industrial Training",
		description: "IT placements for university students — Learn & Pay or Tutor & Earn tracks.",
		icon: Briefcase,
		href: "/siwes",
		gradient: "from-green-500/10 to-emerald-500/10",
		iconColor: "hsl(158 100% 50%)"
	}
];
var ServicesSection = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-3xl md:text-5xl font-bold mb-4",
					children: ["Beyond ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gradient",
						children: "Training"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg text-muted-foreground max-w-2xl mx-auto",
					children: "Tech Faculty NG partners with businesses, schools, and communities to bring technology education and innovation to every level."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
				children: services.map((service) => {
					const Icon = service.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: service.href,
						className: "group",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: `h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${service.gradient}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 flex flex-col h-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 rounded-lg w-fit mb-4 transition-transform duration-300 group-hover:scale-110",
										style: { backgroundColor: `${service.iconColor}20` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "h-6 w-6",
											style: { color: service.iconColor }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold mb-2",
										children: service.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground flex-1",
										children: service.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-sm font-medium text-primary mt-4 group-hover:gap-2 transition-all",
										children: [
											"Explore ",
											service.title,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })
										]
									})
								]
							})
						})
					}, service.href);
				})
			})]
		})
	});
};
var Collapsible = Collapsible$1;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
var CourseSelector = ({ courses, selectedCourses, onToggleCourse }) => {
	const [isOpen, setIsOpen] = (0, import_react.useState)(true);
	const { formatPrice } = useCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleTrigger, {
			className: "flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: "Courses & Modules"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
			className: "pt-4 space-y-3",
			children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center space-x-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						id: course.id,
						checked: selectedCourses.includes(course.id),
						onCheckedChange: () => onToggleCourse(course.id)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: course.id,
						className: "text-sm font-medium cursor-pointer text-foreground",
						children: course.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-primary",
					children: formatPrice(course.price)
				})]
			}, course.id))
		})]
	});
};
var BenefitSelector = ({ benefits, selectedBenefits, onToggleBenefit }) => {
	const [isOpen, setIsOpen] = (0, import_react.useState)(true);
	const { formatPrice } = useCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleTrigger, {
			className: "flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: "Career Benefits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
			className: "pt-4 space-y-3",
			children: benefits.map((benefit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center space-x-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						id: benefit.id,
						checked: selectedBenefits.includes(benefit.id),
						onCheckedChange: () => onToggleBenefit(benefit.id)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: benefit.id,
						className: "text-sm font-medium cursor-pointer text-foreground",
						children: benefit.name
					}), benefit.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: benefit.description
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-primary",
					children: benefit.price === 0 ? "Free" : formatPrice(benefit.price)
				})]
			}, benefit.id))
		})]
	});
};
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2.5 w-2.5 fill-current text-current" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var LearningModeSelector = ({ modes, selectedMode, onSelectMode }) => {
	const [isOpen, setIsOpen] = (0, import_react.useState)(true);
	const { formatPrice } = useCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleTrigger, {
			className: "flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: "Learning Mode"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
			className: "pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
				value: selectedMode,
				onValueChange: onSelectMode,
				className: "space-y-3",
				children: modes.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center space-x-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
							value: mode.id,
							id: mode.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: mode.id,
							className: "text-sm font-medium cursor-pointer text-foreground",
							children: mode.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: mode.description
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-primary",
						children: mode.price === 0 ? "Included" : formatPrice(mode.price)
					})]
				}, mode.id))
			})
		})]
	});
};
var CheckoutDialog = ({ open, onOpenChange, onSubmit, totalAmount, instalment, balanceDueDays, isLoading }) => {
	const [deliveryMethod, setDeliveryMethod] = (0, import_react.useState)("card");
	const [payInInstalments, setPayInInstalments] = (0, import_react.useState)(false);
	const { formatPrice } = useCurrency();
	const splitting = deliveryMethod === "card" && payInInstalments && !!instalment;
	const handleSubmit = () => {
		onSubmit(deliveryMethod, splitting);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Complete Your Enrollment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Choose your preferred payment or enrollment method" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-primary/10 rounded-lg border border-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Total Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-primary",
									children: formatPrice(totalAmount)
								}),
								splitting && instalment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: [
										"Pay ",
										formatPrice(instalment.deposit),
										" now to start, and ",
										formatPrice(instalment.balance),
										" within ",
										balanceDueDays,
										" days from your dashboard."
									]
								})
							]
						}),
						instalment && deliveryMethod === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
							value: payInInstalments ? "instalments" : "full",
							onValueChange: (value) => setPayInInstalments(value === "instalments"),
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "pay-full",
								className: "flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "full",
									id: "pay-full"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Pay in full"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "pay-instalments",
								className: "flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "instalments",
									id: "pay-instalments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Pay in 2 instalments"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
							value: deliveryMethod,
							onValueChange: (value) => setDeliveryMethod(value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
										value: "card",
										id: "card"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "card",
										className: "flex items-center space-x-2 cursor-pointer flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-foreground",
											children: "Pay with Card"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Visa, Mastercard, Bank Transfer, USSD, Mobile Money"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
										value: "whatsapp",
										id: "whatsapp"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "whatsapp",
										className: "flex items-center space-x-2 cursor-pointer flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5 text-green-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-foreground",
											children: "Enroll via WhatsApp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Send enrollment details & pay via bank transfer"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
										value: "email",
										id: "email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "email",
										className: "flex items-center space-x-2 cursor-pointer flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-foreground",
											children: "Enroll via Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Detailed enrollment request via email"
										})] })]
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "flex-1",
						disabled: isLoading,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSubmit,
						className: "flex-1",
						disabled: isLoading,
						children: isLoading ? "Processing..." : splitting && instalment ? `Pay ${formatPrice(instalment.deposit)} now` : deliveryMethod === "card" ? "Pay Now" : "Submit Request"
					})]
				})
			]
		})
	});
};
var departmentPlans = [
	{
		id: "bootcamp-starter",
		name: "Bootcamp Starter",
		fancyName: "Everyday AI & Digital Productivity",
		icon: Users,
		category: "beginner",
		description: "Start your tech journey with essential free courses",
		isFree: true,
		...PLAN_PRICING["bootcamp-starter"]
	},
	{
		id: "developer-pro",
		name: "Developer Pro",
		fancyName: "AI for Full-Stack Web Development",
		icon: Code,
		category: "development",
		description: "Master full-stack web development from scratch",
		...PLAN_PRICING["developer-pro"]
	},
	{
		id: "data-wizard",
		name: "Data Wizard",
		fancyName: "AI for Data Analytics & Business Intelligence",
		icon: Database,
		category: "data-ai",
		description: "Become a data science expert and unlock insights",
		...PLAN_PRICING["data-wizard"]
	},
	{
		id: "ai-innovator",
		name: "AI Innovator",
		fancyName: "AI & Autonomous Agents Engineering",
		icon: Sparkles,
		category: "data-ai",
		description: "Lead the AI revolution with cutting-edge skills",
		...PLAN_PRICING["ai-innovator"]
	},
	{
		id: "security-shield",
		name: "Security Shield",
		fancyName: "AI for Cybersecurity & Threat Intelligence",
		icon: Shield,
		category: "security",
		description: "Master cybersecurity and protect digital assets",
		...PLAN_PRICING["security-shield"]
	},
	{
		id: "mobile-app-developer",
		name: "Mobile App Developer",
		fancyName: "AI for Mobile App Development",
		icon: Smartphone,
		category: "development",
		description: "Build powerful mobile apps for iOS and Android",
		...PLAN_PRICING["mobile-app-developer"]
	},
	{
		id: "cloud-architect",
		name: "Cloud Architect",
		fancyName: "AI for Cloud & DevOps Engineering",
		icon: Cloud,
		category: "development",
		description: "Master cloud platforms and modern DevOps practices",
		...PLAN_PRICING["cloud-architect"]
	},
	{
		id: "design-master",
		name: "Design Master",
		fancyName: "AI for UI/UX & Product Design",
		icon: Palette,
		category: "creative",
		description: "Create stunning user experiences and interfaces",
		...PLAN_PRICING["design-master"]
	},
	{
		id: "digital-marketing-pro",
		name: "Digital Marketing Pro",
		fancyName: "AI for Digital Marketing & Growth",
		icon: TrendingUp,
		category: "creative",
		description: "Master digital marketing and growth strategies",
		...PLAN_PRICING["digital-marketing-pro"]
	},
	{
		id: "custom-builder",
		name: "Custom Program",
		fancyName: "AI-Powered Custom Programme",
		icon: Trophy,
		category: "custom",
		description: "Create your own custom learning journey",
		isCustom: true,
		...PLAN_PRICING["custom-builder"]
	}
];
var REFERRAL_STORAGE_KEY = "tf_referral_code";
var Pricing = () => {
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("beginner");
	const [facultyIdDialogOpen, setFacultyIdDialogOpen] = (0, import_react.useState)(false);
	const [signupDialogOpen, setSignupDialogOpen] = (0, import_react.useState)(false);
	const [checkoutDialogOpen, setCheckoutDialogOpen] = (0, import_react.useState)(false);
	const [facultyId, setFacultyId] = (0, import_react.useState)("");
	const [selectedPlanId, setSelectedPlanId] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [discountCode, setDiscountCode] = (0, import_react.useState)("");
	const [requestDiscount, setRequestDiscount] = (0, import_react.useState)(false);
	const [referralValid, setReferralValid] = (0, import_react.useState)(null);
	const [customCourseSearch, setCustomCourseSearch] = (0, import_react.useState)("");
	const [userHasPaidPlan, setUserHasPaidPlan] = (0, import_react.useState)(false);
	const [enrollmentData, setEnrollmentData] = (0, import_react.useState)(null);
	const { toast } = useToast();
	const { formatPrice, symbol, convertPrice, isNigeria } = useCurrency();
	const runOnboarding = useServerFn(onboardStudent);
	const [selections, setSelections] = (0, import_react.useState)({});
	const [totalPrices, setTotalPrices] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const checkUserPlan = async () => {
			if (!mightHaveSession()) return;
			const supabase = await getSupabase();
			const { data: { user } } = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase.from("profiles").select("faculty_id").eq("id", user.id).single();
				if (profile?.faculty_id) {
					const { data: enrollments } = await supabase.from("enrollments").select("*").eq("faculty_id", profile.faculty_id).order("created_at", { ascending: false });
					const hasPaidPlan = enrollments?.some((e) => !isFreePlan(e.plan_name) && grantsAccess(e));
					setUserHasPaidPlan(hasPaidPlan || false);
					if (enrollments && enrollments.length > 0) setEnrollmentData(enrollments[0]);
				}
			}
		};
		checkUserPlan();
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const fromLink = new URLSearchParams(window.location.search).get("ref")?.trim().toUpperCase();
			if (fromLink) localStorage.setItem(REFERRAL_STORAGE_KEY, fromLink);
			const code = fromLink || localStorage.getItem(REFERRAL_STORAGE_KEY);
			if (code) setDiscountCode((current) => current || code);
		} catch {}
	}, []);
	const typedCode = discountCode.trim().toUpperCase();
	(0, import_react.useEffect)(() => {
		if (!typedCode || PROMO_CODES[typedCode]) {
			setReferralValid(null);
			return;
		}
		setReferralValid(null);
		let active = true;
		const timer = setTimeout(async () => {
			const { data } = await (await getSupabase()).rpc("referral_code_exists", { _code: typedCode });
			if (active) setReferralValid(data === true);
		}, 400);
		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [typedCode]);
	const discountPercent = PROMO_CODES[typedCode] ?? (referralValid ? 10 : 0);
	(0, import_react.useEffect)(() => {
		const initialSelections = {};
		departmentPlans.forEach((plan) => {
			if (plan.isFree) initialSelections[plan.id] = {
				selectedCourses: plan.courses.map((c) => c.id),
				selectedBenefits: plan.benefits.map((b) => b.id),
				learningMode: plan.learningModes[0]?.id || ""
			};
			else initialSelections[plan.id] = {
				selectedCourses: [],
				selectedBenefits: [],
				learningMode: plan.learningModes[0]?.id || ""
			};
		});
		setSelections(initialSelections);
	}, []);
	(0, import_react.useEffect)(() => {
		const newTotalPrices = {};
		Object.keys(selections).forEach((planId) => {
			const plan = departmentPlans.find((p) => p.id === planId);
			if (!plan) return;
			const selection = selections[planId];
			let total = 0;
			const courses = plan.isCustom ? ALL_COURSES.filter((c) => selection.selectedCourses.includes(c.id)) : plan.courses;
			selection.selectedCourses.forEach((courseId) => {
				const course = courses.find((c) => c.id === courseId);
				if (course) total += course.price;
			});
			const mode = plan.learningModes.find((m) => m.id === selection.learningMode);
			if (mode) total += mode.price;
			selection.selectedBenefits.forEach((benefitId) => {
				const benefit = plan.benefits.find((b) => b.id === benefitId);
				if (benefit) total += benefit.price;
			});
			total = total * (100 - discountPercent) / 100;
			newTotalPrices[planId] = Math.round(total);
		});
		setTotalPrices(newTotalPrices);
	}, [selections, discountPercent]);
	const handleToggleCourse = (planId, courseId) => {
		if (departmentPlans.find((p) => p.id === planId)?.isFree) return;
		setSelections((prev) => {
			const current = prev[planId] || {
				selectedCourses: [],
				selectedBenefits: [],
				learningMode: ""
			};
			const selectedCourses = current.selectedCourses.includes(courseId) ? current.selectedCourses.filter((id) => id !== courseId) : [...current.selectedCourses, courseId];
			return {
				...prev,
				[planId]: {
					...current,
					selectedCourses
				}
			};
		});
	};
	const handleToggleBenefit = (planId, benefitId) => {
		if (departmentPlans.find((p) => p.id === planId)?.isFree) return;
		setSelections((prev) => {
			const current = prev[planId] || {
				selectedCourses: [],
				selectedBenefits: [],
				learningMode: ""
			};
			const selectedBenefits = current.selectedBenefits.includes(benefitId) ? current.selectedBenefits.filter((id) => id !== benefitId) : [...current.selectedBenefits, benefitId];
			return {
				...prev,
				[planId]: {
					...current,
					selectedBenefits
				}
			};
		});
	};
	const handleSelectLearningMode = (planId, modeId) => {
		setSelections((prev) => {
			const current = prev[planId] || {
				selectedCourses: [],
				selectedBenefits: [],
				learningMode: ""
			};
			return {
				...prev,
				[planId]: {
					...current,
					learningMode: modeId
				}
			};
		});
	};
	const handleSelectAll = (planId) => {
		const plan = departmentPlans.find((p) => p.id === planId);
		if (!plan || plan.isFree) return;
		const courses = plan.isCustom ? ALL_COURSES : plan.courses;
		setSelections((prev) => ({
			...prev,
			[planId]: {
				selectedCourses: courses.map((c) => c.id),
				selectedBenefits: plan.benefits.map((b) => b.id),
				learningMode: prev[planId]?.learningMode || plan.learningModes[0]?.id
			}
		}));
	};
	const handleAddCustomCourse = (planId, courseId) => {
		setSelections((prev) => {
			const current = prev[planId] || {
				selectedCourses: [],
				selectedBenefits: [],
				learningMode: "online-only"
			};
			if (current.selectedCourses.includes(courseId)) return prev;
			return {
				...prev,
				[planId]: {
					...current,
					selectedCourses: [...current.selectedCourses, courseId]
				}
			};
		});
	};
	const handleSubmitRequest = async (planId) => {
		const plan = departmentPlans.find((p) => p.id === planId);
		if (plan?.isFree && userHasPaidPlan) {
			toast({
				title: "Action Not Allowed",
				description: "You already have a paid plan. Contact support via WhatsApp to make changes.",
				variant: "destructive"
			});
			return;
		}
		if (!plan?.isFree && userHasPaidPlan) {
			toast({
				title: "Plan Change Restricted",
				description: "To change your paid plan, please contact us via WhatsApp.",
				variant: "destructive"
			});
			return;
		}
		const total = totalPrices[planId] || 0;
		if (!plan?.isFree && total < (plan?.minimumAmount || 0)) {
			toast({
				title: "Minimum Amount Required",
				description: `Please select items totaling at least ${formatPrice(plan?.minimumAmount || 0)}`,
				variant: "destructive"
			});
			return;
		}
		setSelectedPlanId(planId);
		const supabase = await getSupabase();
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			const { data: profile } = await supabase.from("profiles").select("faculty_id").eq("id", user.id).single();
			if (profile?.faculty_id) {
				setFacultyId(profile.faculty_id);
				trackBeginCheckout(planId);
				setCheckoutDialogOpen(true);
				return;
			}
		}
		setFacultyIdDialogOpen(true);
	};
	const handleFacultyIdSubmit = async () => {
		if (!facultyId.trim()) {
			toast({
				title: "Faculty ID Required",
				description: "Please enter your faculty ID",
				variant: "destructive"
			});
			return;
		}
		const { data, error } = await (await getSupabase()).from("profiles").select("faculty_id").eq("faculty_id", facultyId).single();
		if (error || !data) {
			toast({
				title: "Faculty ID Not Found",
				description: "Please sign up first to get your faculty ID",
				variant: "destructive"
			});
			setFacultyIdDialogOpen(false);
			setSignupDialogOpen(true);
			return;
		}
		setFacultyIdDialogOpen(false);
		trackBeginCheckout(selectedPlanId);
		setCheckoutDialogOpen(true);
	};
	const trackBeginCheckout = (planId) => {
		const plan = departmentPlans.find((p) => p.id === planId);
		if (!plan || plan.isFree) return;
		trackEvent("begin_checkout", {
			value: totalPrices[planId] || 0,
			currency: "NGN",
			items: [{
				item_id: plan.id,
				item_name: plan.fancyName
			}]
		});
	};
	const handleCheckoutSubmit = async (method, payInInstalments = false) => {
		setIsSubmitting(true);
		try {
			const plan = departmentPlans.find((p) => p.id === selectedPlanId);
			if (!plan) {
				setIsSubmitting(false);
				return;
			}
			const selection = selections[selectedPlanId];
			const total = totalPrices[selectedPlanId];
			const supabase = await getSupabase();
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");
			const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
			if (!profile) throw new Error("Profile not found");
			const currentFacultyId = profile.faculty_id;
			const selectedMode = LEARNING_MODES.find((m) => m.id === selection?.learningMode)?.name || "online-only";
			const { data: newFacultyId, error: idError } = await supabase.rpc("generate_faculty_id", {
				dept_name: plan.name,
				learn_mode: selectedMode,
				cohort_mo: (/* @__PURE__ */ new Date()).getMonth() + 1,
				cohort_yr: (/* @__PURE__ */ new Date()).getFullYear()
			});
			if (idError || !newFacultyId) {
				console.error("Error generating new faculty ID:", idError);
				throw new Error("Failed to generate faculty ID");
			}
			const { error: updateError } = await supabase.from("profiles").update({
				faculty_id: newFacultyId,
				department: plan.name,
				learning_mode: selectedMode,
				cohort_month: (/* @__PURE__ */ new Date()).getMonth() + 1,
				cohort_year: (/* @__PURE__ */ new Date()).getFullYear()
			}).eq("id", user.id);
			if (updateError) {
				console.error("Error updating profile:", updateError);
				throw new Error("Failed to update profile");
			}
			const { error: recordError } = await supabase.rpc("record_my_faculty_id", {
				_old_id: currentFacultyId ?? null,
				_department: plan.name
			});
			if (recordError) {
				console.error("Error recording faculty ID:", recordError);
				throw new Error("Failed to save Faculty ID");
			}
			if (currentFacultyId) await Promise.all([
				supabase.from("enrollments").update({
					faculty_id: newFacultyId,
					learning_mode: selectedMode
				}).eq("faculty_id", currentFacultyId),
				supabase.from("course_enrollments").update({ faculty_id: newFacultyId }).eq("faculty_id", currentFacultyId),
				supabase.from("course_progress").update({ faculty_id: newFacultyId }).eq("faculty_id", currentFacultyId)
			]);
			if (plan.isFree || method !== "card") {
				const { error: enrollError } = await supabase.from("enrollments").insert({
					faculty_id: newFacultyId,
					plan_name: plan.name,
					status: plan.isFree ? "active" : "pending",
					learning_mode: selectedMode,
					requested_selection: plan.isFree ? null : {
						planId: plan.id,
						courseIds: selection.selectedCourses,
						benefitIds: selection.selectedBenefits,
						learningModeId: selection.learningMode || null,
						currency: isNigeria ? "NGN" : "USD",
						discountCode: discountCode.trim() || null,
						discountRequested: requestDiscount || false
					}
				});
				if (enrollError) {
					console.error("Error creating enrollment:", enrollError);
					throw new Error("Failed to save your enrollment");
				}
			}
			try {
				await runOnboarding();
			} catch (onboardErr) {
				console.warn("Student onboarding automation failed:", onboardErr);
			}
			const courses = plan.isCustom ? ALL_COURSES.filter((c) => selection.selectedCourses.includes(c.id)) : plan.courses;
			const selectedCourseDetails = selection.selectedCourses.map((id) => {
				const course = courses.find((c) => c.id === id);
				return course ? {
					name: course.name,
					price: course.price
				} : null;
			}).filter(Boolean);
			const selectedBenefitDetails = selection.selectedBenefits.map((id) => {
				const benefit = plan.benefits.find((b) => b.id === id);
				return benefit ? {
					name: benefit.name,
					price: benefit.price,
					description: benefit.description
				} : null;
			}).filter(Boolean);
			const learningModeDetail = plan.learningModes.find((m) => m.id === selection.learningMode);
			const discountInfo = requestDiscount ? "\n*Requesting Discount Code*" : discountCode ? `\n*Discount Code Applied:* ${discountCode.toUpperCase()}` : "";
			if (!plan.isFree) trackEvent("add_payment_info", {
				value: total,
				currency: "NGN",
				payment_type: method,
				items: [{
					item_id: plan.id,
					item_name: plan.fancyName
				}]
			});
			if (method === "card") {
				const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke("create-checkout", { body: {
					planId: plan.id,
					planName: plan.fancyName,
					facultyId: newFacultyId,
					courseIds: selection.selectedCourses,
					benefitIds: selection.selectedBenefits,
					learningModeId: selection.learningMode || null,
					currencyCode: isNigeria ? "NGN" : "USD",
					discountCode: discountCode || "",
					payInInstalments: payInInstalments || void 0,
					successUrl: `${window.location.origin}/payment-success`,
					cancelUrl: `${window.location.origin}/#pricing`
				} });
				const checkoutUrl = checkoutData?.url?.trim();
				if (checkoutError || !checkoutUrl) throw new Error(checkoutData?.error || checkoutError?.message || "Failed to create checkout session");
				if (!/^https?:\/\//i.test(checkoutUrl)) throw new Error("Invalid checkout link received. Please try again.");
				try {
					localStorage.removeItem(REFERRAL_STORAGE_KEY);
				} catch {}
				rememberCheckout({
					plan: plan.fancyName,
					value: total,
					currency: "NGN"
				});
				setIsSubmitting(false);
				setCheckoutDialogOpen(false);
				window.location.assign(checkoutUrl);
				return;
			}
			const message = `Hello Tech Faculty! 👋

My name is ${profile.name} and I am ready to make payment for the *${plan.fancyName}* plan.

Here are my enrollment details:

*Faculty ID:* ${newFacultyId}
*(Previous ID: ${currentFacultyId})*
*Plan:* ${plan.fancyName}
*Total:* ${formatPrice(total)}${discountInfo}

*Selected Courses:*
${selectedCourseDetails.length > 0 ? selectedCourseDetails.map((c) => `✓ ${c.name} - ${formatPrice(c.price)}`).join("\n") : "No courses selected"}

*Learning Mode:* ${learningModeDetail?.name} - ${learningModeDetail?.price === 0 ? "Included" : formatPrice(learningModeDetail?.price || 0)}

*Additional Benefits:*
${selectedBenefitDetails.length > 0 ? selectedBenefitDetails.map((b) => `✓ ${b.name} - ${formatPrice(b.price)}`).join("\n") : "No benefits selected"}

Please share the payment details so I can complete my enrollment. Thank you!`;
			if (method === "whatsapp") {
				const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
				window.open(whatsappUrl, "_blank");
				toast({
					title: "Enrollment Submitted!",
					description: `Your new Faculty ID is ${newFacultyId}. Complete the request on WhatsApp.`
				});
			} else {
				const emailSubject = `Enrollment Request - ${newFacultyId} - ${plan.fancyName}`;
				const emailBody = message.replace(/\*/g, "").replace(/✓/g, "-");
				const mailtoUrl = `mailto:thetechfaculty@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
				window.location.href = mailtoUrl;
				toast({
					title: "Enrollment Submitted!",
					description: `Your new Faculty ID is ${newFacultyId}. Complete the request via email.`
				});
			}
			setIsSubmitting(false);
			setCheckoutDialogOpen(false);
			setFacultyId("");
			setSelectedPlanId("");
			setTimeout(() => window.location.reload(), 2e3);
		} catch (error) {
			console.error("Enrollment error:", error);
			toast({
				title: "Enrollment Failed",
				description: error instanceof Error && error.message || "An error occurred during enrollment",
				variant: "destructive"
			});
			setIsSubmitting(false);
		}
	};
	const filteredPlans = departmentPlans.filter((plan) => plan.category === activeCategory);
	const renderFreePlan = (plan) => {
		const Icon = plan.icon;
		const isUserOnThisPlan = enrollmentData?.plan_name === plan.name || enrollmentData?.plan_name === "Bootcamp Starter" && plan.name === "Free Bootcamp";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: `border-2 ${isUserOnThisPlan ? "border-primary" : "border-primary/30"} hover:border-primary/50 transition-colors`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-8 w-8 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [isUserOnThisPlan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								className: "bg-primary",
								children: "Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Free"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: plan.fancyName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: plan.description }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold text-primary mt-4",
						children: formatPrice(0)
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold text-sm text-foreground",
							children: "Included Courses:"
						}), plan.courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm p-2 bg-primary/5 rounded",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-4 w-4 rounded-sm border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: course.name
							})]
						}, course.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold text-sm text-foreground",
							children: "Benefits:"
						}), plan.benefits.map((benefit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm p-2 bg-primary/5 rounded",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-4 w-4 rounded-sm border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: benefit.name
							})]
						}, benefit.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => handleSubmitRequest(plan.id),
					className: "w-full",
					size: "lg",
					disabled: userHasPaidPlan || isUserOnThisPlan,
					children: isUserOnThisPlan ? "Current Plan" : userHasPaidPlan ? "Already Have Paid Plan" : "Start Free Journey"
				}) })
			]
		}, plan.id);
	};
	const renderCustomPlan = (plan) => {
		const Icon = plan.icon;
		const selection = selections[plan.id] || {
			selectedCourses: [],
			selectedBenefits: [],
			learningMode: "online-only"
		};
		const total = totalPrices[plan.id] || 0;
		const meetsMinimum = total >= plan.minimumAmount;
		const filteredCourses = customCourseSearch ? ALL_COURSES.filter((c) => c.name.toLowerCase().includes(customCourseSearch.toLowerCase()) || c.category?.toLowerCase().includes(customCourseSearch.toLowerCase())) : ALL_COURSES;
		const selectedCourses = ALL_COURSES.filter((c) => selection.selectedCourses.includes(c.id));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-2 hover:border-primary/50 transition-colors",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-8 w-8 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: meetsMinimum ? "default" : "destructive",
								className: "text-lg px-3 py-1",
								children: formatPrice(total)
							}), !meetsMinimum && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-destructive flex items-center gap-1 justify-end mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }),
									"Min: ",
									formatPrice(plan.minimumAmount)
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: plan.fancyName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: plan.description })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm text-foreground",
										children: "Search & Add Courses"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search courses by name or category...",
									value: customCourseSearch,
									onChange: (e) => setCustomCourseSearch(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
									className: "h-48 border rounded-lg p-2",
									children: filteredCourses.map((course) => {
										const isSelected = selection.selectedCourses.includes(course.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											onClick: () => !isSelected && handleAddCustomCourse(plan.id, course.id),
											className: `p-2 mb-1 rounded cursor-pointer transition-colors ${isSelected ? "bg-primary/10 cursor-not-allowed" : "hover:bg-muted"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium",
													children: course.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: course.category
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-semibold",
													children: formatPrice(course.price)
												})]
											})
										}, course.id);
									})
								})
							]
						}),
						selectedCourses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-semibold text-sm text-foreground",
									children: [
										"Selected Courses (",
										selectedCourses.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => handleSelectAll(plan.id),
									children: "Select All"
								})]
							}), selectedCourses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-sm p-2 bg-muted rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: course.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => handleToggleCourse(plan.id, course.id),
									children: "Remove"
								})]
							}, course.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningModeSelector, {
							modes: plan.learningModes,
							selectedMode: selection.learningMode,
							onSelectMode: (mode) => handleSelectLearningMode(plan.id, mode)
						}),
						plan.benefits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitSelector, {
							benefits: plan.benefits,
							selectedBenefits: selection.selectedBenefits,
							onToggleBenefit: (id) => handleToggleBenefit(plan.id, id)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => handleSubmitRequest(plan.id),
					className: "w-full",
					disabled: !meetsMinimum,
					size: "lg",
					children: "Submit Custom Request"
				}) })
			]
		}, plan.id);
	};
	const renderPaidPlan = (plan) => {
		const Icon = plan.icon;
		const selection = selections[plan.id] || {
			selectedCourses: [],
			selectedBenefits: [],
			learningMode: "online-only"
		};
		const total = totalPrices[plan.id] || 0;
		const meetsMinimum = total >= plan.minimumAmount;
		const isUserOnThisPlan = enrollmentData?.plan_name === plan.name;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: `border-2 ${isUserOnThisPlan ? "border-primary" : "border-border"} hover:border-primary/50 transition-colors`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-8 w-8 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right flex flex-col items-end gap-2",
							children: [
								isUserOnThisPlan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "default",
									className: "bg-primary",
									children: "Active Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: meetsMinimum ? "default" : "destructive",
									className: "text-lg px-3 py-1",
									children: formatPrice(total)
								}),
								!meetsMinimum && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-destructive flex items-center gap-1 justify-end mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }),
										"Min: ",
										formatPrice(plan.minimumAmount)
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: plan.fancyName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: plan.description })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleSelectAll(plan.id),
							className: "w-full",
							children: "Select All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseSelector, {
							courses: plan.courses,
							selectedCourses: selection.selectedCourses,
							onToggleCourse: (courseId) => handleToggleCourse(plan.id, courseId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningModeSelector, {
							modes: plan.learningModes,
							selectedMode: selection.learningMode,
							onSelectMode: (modeId) => handleSelectLearningMode(plan.id, modeId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitSelector, {
							benefits: plan.benefits,
							selectedBenefits: selection.selectedBenefits,
							onToggleBenefit: (benefitId) => handleToggleBenefit(plan.id, benefitId)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => handleSubmitRequest(plan.id),
					disabled: !meetsMinimum || isUserOnThisPlan,
					className: "w-full",
					size: "lg",
					children: isUserOnThisPlan ? "Current Plan" : "Submit Request"
				}) })
			]
		}, plan.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "pricing",
		className: "py-20 bg-gradient-to-b from-background to-muted/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-12 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-4xl font-bold",
								children: "Choose Your Path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl text-muted-foreground max-w-2xl mx-auto",
								children: "Build your custom learning package. Select courses and benefits that match your goals."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 justify-center flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-sm",
									children: "Flexible Pricing by Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "default",
									className: "text-sm",
									children: "Dynamic Pricing Active"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 space-y-4 max-w-md mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								placeholder: "Enter discount code (if you have one)",
								value: discountCode,
								onChange: (e) => setDiscountCode(e.target.value)
							}), typedCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "whitespace-nowrap",
								children: PROMO_CODES[typedCode] ? `${PROMO_CODES[typedCode]}% OFF` : referralValid === null ? "Checking…" : referralValid ? `10% OFF · Referral` : "Invalid"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "request-discount",
								checked: requestDiscount,
								onCheckedChange: (checked) => setRequestDiscount(checked)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "request-discount",
								className: "text-sm text-muted-foreground cursor-pointer",
								children: "Don't have a discount code? Request one in your enrollment message"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: activeCategory,
						onValueChange: (value) => setActiveCategory(value),
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-6 md:max-w-4xl md:mx-auto gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "beginner",
										className: "whitespace-nowrap px-4",
										children: "Beginner"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "development",
										className: "whitespace-nowrap px-4",
										children: "Development"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "data-ai",
										className: "whitespace-nowrap px-4",
										children: "Data & AI"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "creative",
										className: "whitespace-nowrap px-4",
										children: "Creative"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "security",
										className: "whitespace-nowrap px-4",
										children: "Security"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "custom",
										className: "whitespace-nowrap px-4",
										children: "Custom"
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto",
						children: filteredPlans.map((plan) => {
							if (plan.isFree) return renderFreePlan(plan);
							if (plan.isCustom) return renderCustomPlan(plan);
							return renderPaidPlan(plan);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 flex flex-wrap justify-center gap-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "Flexible Payment Plans"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "Expert Instructors"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "Industry Certifications"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: facultyIdDialogOpen,
				onOpenChange: setFacultyIdDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Enter Faculty ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Please enter your faculty ID to continue" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "faculty-id",
						children: "Faculty ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "faculty-id",
						value: facultyId,
						onChange: (e) => setFacultyId(e.target.value),
						placeholder: "TF-XXXX-XXXX"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setFacultyIdDialogOpen(false),
							className: "flex-1",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleFacultyIdSubmit,
							className: "flex-1",
							children: "Continue"
						})]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: signupDialogOpen,
				onOpenChange: setSignupDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create Your Account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Sign up to get your faculty ID and enroll" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignupForm, { onSuccess: () => setSignupDialogOpen(false) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutDialog, {
				open: checkoutDialogOpen,
				onOpenChange: setCheckoutDialogOpen,
				onSubmit: handleCheckoutSubmit,
				totalAmount: totalPrices[selectedPlanId] || 0,
				instalment: instalmentSplit(totalPrices[selectedPlanId] || 0),
				balanceDueDays: INSTALMENTS.balanceDueDays,
				isLoading: isSubmitting
			})
		]
	});
};
var GetStarted = () => {
	const [activeTab, setActiveTab] = (0, import_react.useState)("login");
	const [showForgotPasswordDialog, setShowForgotPasswordDialog] = (0, import_react.useState)(false);
	const [forgotPasswordEmail, setForgotPasswordEmail] = (0, import_react.useState)("");
	const [isResettingPassword, setIsResettingPassword] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const { isLoggedIn, userData, logout } = useUser();
	const handleSignupSuccess = () => {
		setActiveTab("login");
	};
	const handleForgotPasswordSubmit = async () => {
		if (!forgotPasswordEmail.trim()) {
			toast({
				title: "Email Required",
				description: "Please enter your email address.",
				variant: "destructive"
			});
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address.",
				variant: "destructive"
			});
			return;
		}
		setIsResettingPassword(true);
		try {
			const { error } = await (await getSupabase()).auth.resetPasswordForEmail(forgotPasswordEmail.trim(), { redirectTo: `${window.location.origin}/` });
			if (error) throw error;
			toast({
				title: "Password Reset Email Sent",
				description: "Check your email for a password reset link."
			});
			setShowForgotPasswordDialog(false);
			setForgotPasswordEmail("");
		} catch (error) {
			toast({
				title: "Reset Failed",
				description: error instanceof Error && error.message || "Unable to send password reset email.",
				variant: "destructive"
			});
		} finally {
			setIsResettingPassword(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "get-started",
		className: "py-24 px-4 bg-gradient-to-b from-background to-accent/5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl",
			children: [isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl md:text-5xl font-bold mb-4",
						children: [
							"Welcome Back, ",
							userData?.name,
							"!"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-muted-foreground max-w-2xl mx-auto",
						children: "Head to your dashboard to track progress, view upcoming classes, and access your certificates."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/dashboard",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 20 }), "Go to Dashboard"]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-3xl md:text-5xl font-bold mb-4",
					children: [
						"Join the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent",
							children: "Faculty"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg text-muted-foreground max-w-2xl mx-auto",
					children: "Create your account to access courses, track your progress, join communities, and start your tech career journey. Already a member? Log in below."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "bg-card border-border max-w-2xl mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: activeTab,
						onValueChange: (val) => setActiveTab(val),
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "login",
									children: "Login"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signup",
									children: "Sign Up"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "login",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {
									onSuccess: () => {
										toast({
											title: "Welcome Back!",
											description: "You've been logged in successfully."
										});
									},
									onForgotPassword: () => setShowForgotPasswordDialog(true)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signup",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignupForm, { onSuccess: handleSignupSuccess })
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showForgotPasswordDialog,
				onOpenChange: setShowForgotPasswordDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[450px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reset Your Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enter your email address and we'll send you a link to reset your password." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "forgot-password-email",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "forgot-password-email",
								type: "email",
								placeholder: "your.email@example.com",
								value: forgotPasswordEmail,
								onChange: (e) => setForgotPasswordEmail(e.target.value),
								maxLength: 255
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleForgotPasswordSubmit,
							className: "w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90",
							size: "lg",
							disabled: isResettingPassword,
							children: isResettingPassword ? "Sending..." : "Send Reset Link"
						})]
					})]
				})
			})]
		})
	});
};
var PROMPT_KEY = "tf_home_prompt_seen";
/**
* Homepage-only conversion helpers: a sticky mobile WhatsApp bar after the hero,
* plus a single scroll-depth / exit-intent prompt per visitor.
*/
var HomeWhatsAppPrompts = () => {
	const [sticky, setSticky] = (0, import_react.useState)(false);
	const [prompt, setPrompt] = (0, import_react.useState)(false);
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [source, setSource] = (0, import_react.useState)("home-sticky-bar");
	const alreadyLead = hasCapturedLead();
	(0, import_react.useEffect)(() => {
		const onScroll = () => setSticky(window.scrollY > 500);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		if (alreadyLead) return;
		let seen = false;
		try {
			seen = sessionStorage.getItem(PROMPT_KEY) === "1";
		} catch {}
		if (seen) return;
		const show = () => {
			setPrompt(true);
			try {
				sessionStorage.setItem(PROMPT_KEY, "1");
			} catch {}
			cleanup();
		};
		const onScroll = () => {
			if ((window.scrollY + window.innerHeight) / document.body.scrollHeight > .55) show();
		};
		const onLeave = (e) => {
			if (e.clientY <= 0) show();
		};
		const cleanup = () => {
			window.removeEventListener("scroll", onScroll);
			document.removeEventListener("mouseleave", onLeave);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		if (!isMobileDevice()) document.addEventListener("mouseleave", onLeave);
		return cleanup;
	}, [alreadyLead]);
	const openDialog = (src) => {
		setSource(src);
		setPrompt(false);
		if (alreadyLead) {
			window.open(COMMUNITY_WHATSAPP_URL, "_blank", "noopener,noreferrer");
			return;
		}
		setDialogOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-background/95 backdrop-blur border-t border-border transition-transform ${sticky ? "translate-y-0" : "translate-y-full"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full bg-[#25D366] text-black font-semibold hover:opacity-90",
				onClick: () => openDialog("home-sticky-bar"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
					size: 18,
					className: "mr-2"
				}), "Join our WhatsApp community"]
			})
		}),
		prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed bottom-40 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-50 rounded-xl border border-border bg-card shadow-xl p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: () => setPrompt(false),
					className: "absolute top-2 right-2 text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-sm pr-6",
					children: "Get free SIWES + AI updates on WhatsApp"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Class dates, placement openings and free AI sessions — sent to your WhatsApp. No spam."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "w-full mt-3 bg-[#25D366] text-black font-semibold hover:opacity-90",
					onClick: () => openDialog("home-scroll-prompt"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
						size: 16,
						className: "mr-2"
					}), "Join free"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppLeadDialog, {
			open: dialogOpen,
			onOpenChange: setDialogOpen,
			variant: "community",
			source,
			groupUrl: COMMUNITY_WHATSAPP_URL,
			context: "Homepage",
			onCaptured: () => window.open(COMMUNITY_WHATSAPP_URL, "_blank", "noopener,noreferrer")
		})
	] });
};
var provider = {
	"@type": "Organization",
	"name": "Tech Faculty NG",
	"url": "https://techfaculty.ng"
};
var courseLocation = {
	"@type": "Place",
	"name": "Tech Faculty NG, Nnewi",
	"address": {
		"@type": "PostalAddress",
		"addressLocality": "Nnewi",
		"addressRegion": "Anambra State",
		"addressCountry": "NG"
	}
};
var courseSchema = {
	"@context": "https://schema.org",
	"@type": "ItemList",
	"name": "Tech Faculty Courses",
	"description": "Technology bootcamp courses from Tech Faculty NG, licensed by FMSTI through NBTI",
	"itemListElement": [
		{
			position: 1,
			name: "Data Analytics & Data Science",
			slug: "data-science-analytics",
			description: "12-week intensive bootcamp covering Python, SQL, Power BI, and machine learning fundamentals. 75% graduate employment rate.",
			prerequisites: "Basic computer literacy",
			duration: "P12W",
			occupation: "Data Analyst",
			planId: "data-wizard"
		},
		{
			position: 2,
			name: "Web Development",
			slug: "web-development",
			description: "Full-stack web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js with real-world projects.",
			prerequisites: "Basic computer literacy",
			duration: "P12W",
			occupation: "Full-Stack Developer",
			planId: "developer-pro"
		},
		{
			position: 3,
			name: "Cybersecurity",
			slug: "cybersecurity",
			description: "Hands-on cybersecurity training covering network security, ethical hacking, and compliance frameworks.",
			prerequisites: "Basic networking knowledge",
			duration: "P12W",
			occupation: "Cybersecurity Analyst",
			planId: "security-shield"
		},
		{
			position: 4,
			name: "Artificial Intelligence & Machine Learning",
			slug: "ai-machine-learning",
			description: "Advanced AI/ML bootcamp with TensorFlow, PyTorch, and real-world deployment projects.",
			prerequisites: "Basic Python programming",
			duration: "P16W",
			occupation: "AI/ML Engineer",
			planId: "ai-innovator"
		},
		{
			position: 5,
			name: "Digital Marketing",
			slug: "digital-marketing",
			description: "Comprehensive digital marketing course covering SEO, social media, Google Ads, and analytics.",
			prerequisites: "None",
			duration: "P8W",
			occupation: "Digital Marketing Specialist",
			planId: "digital-marketing-pro"
		}
	].map((c) => ({
		"@type": "ListItem",
		"position": c.position,
		"item": {
			"@type": "Course",
			"name": c.name,
			"description": c.description,
			"url": `https://techfaculty.ng/departments/${c.slug}`,
			"provider": provider,
			"coursePrerequisites": c.prerequisites,
			"timeRequired": c.duration,
			"occupationalCategory": c.occupation,
			"inLanguage": "en",
			"offers": {
				"@type": "Offer",
				"price": String(planMinimum(c.planId)),
				"priceCurrency": "NGN",
				"availability": "https://schema.org/InStock",
				"category": "Paid",
				"url": "https://techfaculty.ng/#pricing"
			},
			"hasCourseInstance": {
				"@type": "CourseInstance",
				"courseMode": "Blended",
				"courseWorkload": c.duration,
				"location": courseLocation
			}
		}
	}))
};
var Index = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(courseSchema)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedPrograms, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LatestJobs, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpcomingEvents, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduateStories, { limit: 3 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clarity, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacultyDiscount, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GetStarted, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeWhatsAppPrompts, {})
		]
	});
};
var SplitComponent = Index;
//#endregion
export { SplitComponent as component };
