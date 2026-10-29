import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as useRouter, Q as redirect, _ as createRouter, b as createFileRoute, f as Scripts, p as HeadContent, v as Outlet, x as createRootRouteWithContext, y as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as UserProvider, t as CurrencyProvider } from "./UserContext-uFGsrvio.mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Button } from "../_libs/react-email__button.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Link } from "../_libs/react-email__link.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { r as render } from "../_libs/@react-email/render+[...].mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
import { t as TEMPLATES } from "./registry-Cs-NAxLC.mjs";
import { i as verifyWebhookRequest, n as createAuthEmailHandler } from "../_libs/@lovable.dev/email-js+[...].mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as sameKey$2 } from "./hr-api-rules-b4N1_q2Y.mjs";
import { i as pageHead, r as ogImage, t as LOGO_URL } from "./seo-CiXrTLvh.mjs";
import { n as articleOgImage, r as parseOgInput, t as OG_CACHE_CONTROL } from "./og-image-DZ-4tmP2.mjs";
import { t as installWhatsAppClickTracking } from "./analytics-BrZRoVBL.mjs";
import { i as REMOVED_HUB_SLUGS } from "./techHubs-JbJ8WLyC.mjs";
import { t as BLOG_REDIRECTS } from "./blog-redirects-COUXMWf2.mjs";
import { n as platformBySlug } from "./jobPlatforms-BS18fzAf.mjs";
import { t as NotFound } from "./NotFound-Do2-AqLX.mjs";
import { n as TooltipProvider$1, t as TooltipContent$1 } from "../_libs/radix-ui__react-tooltip.mjs";
import processModule from "node:process";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/router-CoRxDr7h.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var TooltipProvider = TooltipProvider$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}));
TooltipContent.displayName = TooltipContent$1.displayName;
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var styles_default = "/assets/styles-D36LbNyF.css";
var Toaster = (0, import_react.lazy)(() => import("./toaster-CbwPC0kH.mjs").then((m) => ({ default: m.Toaster })));
var Sonner = (0, import_react.lazy)(() => import("./sonner-D8Oz9v7V.mjs").then((m) => ({ default: m.Toaster })));
function DeferredToasters() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
		fallback: null,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sonner, {})]
	});
}
var organizationSchema = {
	"@context": "https://schema.org",
	"@type": [
		"Organization",
		"EducationalOrganization",
		"LocalBusiness"
	],
	name: "Tech Faculty NG",
	alternateName: "Tech Faculty",
	url: "https://techfaculty.ng",
	logo: LOGO_URL,
	description: "Tech Faculty NG is a licensed Nigerian technology training institute delivering nationwide in-person bootcamps and online programs in Software Engineering, Data Science, Cybersecurity, AI, and more. We train, certify, and place graduates into tech careers.",
	foundingDate: "2022",
	address: {
		"@type": "PostalAddress",
		streetAddress: "Technology Incubation Center, Onitsha-Okigwe Expressway, by Area Command, Umudim",
		addressLocality: "Nnewi",
		postalCode: "435101",
		addressRegion: "Anambra State",
		addressCountry: "NG"
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: 6.0089671,
		longitude: 6.9086291
	},
	hasMap: "https://www.google.com/maps/place/?q=place_id:ChIJ5ZxSzmi9QxAR23OzR7YbAkM",
	contactPoint: {
		"@type": "ContactPoint",
		telephone: "+234-806-859-7140",
		contactType: "admissions",
		availableLanguage: "English"
	},
	sameAs: [
		"https://www.linkedin.com/company/techfaculty",
		"https://x.com/TechFacultyNG",
		"https://www.facebook.com/techfacultyng",
		"https://www.google.com/maps/place/?q=place_id:ChIJ5ZxSzmi9QxAR23OzR7YbAkM",
		"https://www.google.com/maps/place/?q=place_id:ChIJodXXtba9QxARPM6Tyyb02a0",
		"https://wa.me/2348068597140",
		"https://www.wikidata.org/wiki/Q141702083"
	],
	areaServed: {
		"@type": "Place",
		name: "Nigeria"
	},
	knowsAbout: [
		"Software Engineering",
		"Data Science",
		"Artificial Intelligence",
		"Cybersecurity",
		"Web Development",
		"Digital Marketing",
		"Machine Learning",
		"UI/UX Design"
	],
	memberOf: {
		"@type": "Organization",
		name: "National Board for Technology Incubation (NBTI)",
		parentOrganization: {
			"@type": "GovernmentOrganization",
			name: "Federal Ministry of Science, Technology and Innovation"
		}
	},
	hasCredential: {
		"@type": "EducationalOccupationalCredential",
		credentialCategory: "Licensed Technology Training Center",
		recognizedBy: {
			"@type": "GovernmentOrganization",
			name: "Federal Ministry of Science, Technology and Innovation"
		}
	}
};
var webSiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Tech Faculty NG",
	url: "https://techfaculty.ng"
};
var Route$77 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "UTF-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			},
			{
				name: "author",
				content: "Tech Faculty NG"
			},
			{
				name: "robots",
				content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
			},
			{
				name: "google-site-verification",
				content: "E02mOgO2uC7YKjc1KT8VMhZlxiDK3Tn-8-Q-w6DVOG8"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "Tech Faculty NG"
			},
			{
				property: "og:locale",
				content: "en_NG"
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "shortcut icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "alternate",
				type: "application/rss+xml",
				title: "Tech Faculty NG Blog",
				href: "https://techfaculty.ng/rss.xml"
			}
		],
		scripts: [
			{
				src: "https://www.googletagmanager.com/gtag/js?id=G-1DG9P7LVRX",
				async: true
			},
			{ children: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-1DG9P7LVRX');" },
			{
				type: "application/ld+json",
				children: JSON.stringify(organizationSchema)
			},
			{
				type: "application/ld+json",
				children: JSON.stringify(webSiteSchema)
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFound,
	errorComponent: RootErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$77.useRouteContext();
	(0, import_react.useEffect)(() => {
		installWhatsAppClickTracking();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeferredToasters, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }) }) })
	});
}
function RootErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error(error);
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "This page didn't load"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-muted-foreground",
				children: "Something went wrong while loading this page. You can try again or head back home."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90",
					children: "Try again"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "rounded-md border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted",
					children: "Go home"
				})]
			})
		]
	});
}
var $$splitComponentImporter$53 = () => import("./routes-B2vZDtTP.mjs");
var Route$76 = createFileRoute("/")({
	head: () => pageHead({
		title: "Tech Training in Anambra & Across Nigeria",
		description: "Licensed by FMSTI through NBTI. Coding, data, AI and cybersecurity from ₦50,000; 6,000+ trained, 75% employed. 22 campuses or online, free on-site SIWES.",
		path: "/"
	}),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./about-Dhgus_fe.mjs");
var Route$75 = createFileRoute("/about")({
	head: () => pageHead({
		title: "About Us: Our Mission & Story",
		description: "Tech Faculty NG — licensed by FMSTI via NBTI. We train, certify, and place the next generation of Nigerian tech professionals from Nnewi, Anambra State.",
		path: "/about"
	}),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./business-partnerships-xxiH6LhX.mjs");
var Route$74 = createFileRoute("/business-partnerships")({
	head: () => pageHead({
		title: "Staff Training Packages for Businesses",
		description: "Staff training packages for Nigerian businesses: AI for teams, digital skills, data and reporting, cybersecurity awareness. Request a quote from Tech Faculty NG, licensed by FMSTI through NBTI.",
		path: "/business-partnerships"
	}),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./dashboard-D4mGaQJv.mjs");
var Route$73 = createFileRoute("/dashboard")({
	head: () => pageHead({
		title: "Dashboard",
		description: "Access your Tech Faculty student dashboard. Track course progress, view upcoming classes, and manage your certifications.",
		path: "/dashboard",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var Route$72 = createFileRoute("/feed.xml")({ server: { handlers: { GET: async () => {
	const { buildRssFeed, rssResponse } = await import("./rss.server-DuoGfLtW.mjs");
	return rssResponse(await buildRssFeed());
} } } });
var $$splitComponentImporter$49 = () => import("./hire-CNui1Okj.mjs");
var Route$71 = createFileRoute("/hire")({
	head: () => pageHead({
		title: "Hire Vetted Tech Talent in Nigeria",
		description: "Tell us what your business needs and we match you with vetted Nigerian tech talent — developers, data analysts, designers, marketers and support — remote or on-site.",
		path: "/hire"
	}),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./login-d8wMD6MF.mjs");
var Route$70 = createFileRoute("/login")({
	head: () => pageHead({
		title: "Sign In",
		description: "Sign in to your Tech Faculty account to access your dashboard, courses and certificates.",
		path: "/login",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./lovable-CrLE2NO5.mjs");
var Route$69 = createFileRoute("/lovable")({
	head: () => pageHead({
		title: "Build Apps with Lovable",
		description: "Tech Faculty recommends Lovable — the AI platform we use to build production web apps. Describe what you want, ship in minutes.",
		path: "/lovable"
	}),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./order-complete-NEq2dAee.mjs");
var Route$68 = createFileRoute("/order-complete")({
	head: () => pageHead({
		title: "Order Status",
		description: "Check whether your Tech Faculty NG payment has been confirmed.",
		path: "/order-complete",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./outcomes-Cgsli3dG.mjs");
var Route$67 = createFileRoute("/outcomes")({
	head: () => pageHead({
		title: "Student Outcomes - Tech Faculty NG | How We Count",
		description: "How Tech Faculty NG counts its 6,000+ students trained and 75% employed within six months, with live Talent Pool numbers, Google reviews and certificate checks.",
		path: "/outcomes"
	}),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./pay-balance-CNcTFNqI.mjs");
var Route$66 = createFileRoute("/pay-balance")({
	head: () => pageHead({
		title: "Pay Your Balance",
		description: "Pay the balance of your Tech Faculty NG instalment plan.",
		path: "/pay-balance",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./payment-success-DyEbMwIv.mjs");
var Route$65 = createFileRoute("/payment-success")({
	head: () => pageHead({
		title: "Payment Status",
		description: "Check whether your Tech Faculty payment has been confirmed.",
		path: "/payment-success",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./products-Z0Wv77JZ.mjs");
var Route$64 = createFileRoute("/products")({
	head: () => pageHead({
		title: "Software Products",
		description: "Explore the mobile apps built by Tech Faculty and Social Faculty — Dear Claire, Alter Ego, Eavesdrop and AI Clopedia, live on the App Store and Google Play.",
		path: "/products"
	}),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var Route$63 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async () => {
	const { buildRssFeed, rssResponse } = await import("./rss.server-DuoGfLtW.mjs");
	return rssResponse(await buildRssFeed());
} } } });
var $$splitComponentImporter$41 = () => import("./school-collaborations-CaeYJbt9.mjs");
var Route$62 = createFileRoute("/school-collaborations")({
	head: () => pageHead({
		title: "University Bootcamps & School Partnerships",
		description: "Bring tech bootcamps to your campus. Tech Faculty NG partners with universities for Python, AI, Data Science training and student certification programs. Licensed by FMSTI via NBTI.",
		path: "/school-collaborations"
	}),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./siwes-success-kit-Qfax8UqP.mjs");
var Route$61 = createFileRoute("/siwes-success-kit")({
	head: () => pageHead({
		title: "SIWES Success Kit: Logbook & Report Pack",
		description: "Land and finish your SIWES placement properly: free 7-step checklist plus the SIWES Success Kit — placement email templates, student CV, logbook pack and report outline.",
		path: "/siwes-success-kit",
		image: ogImage("siwes-success-kit.jpg")
	}),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./study-online-africa-DtEOIDD_.mjs");
var Route$60 = createFileRoute("/study-online-africa")({
	head: () => pageHead({
		title: "Study Tech Online from Anywhere in Africa",
		description: "Learn web development, data, AI, cybersecurity and design online with Tech Faculty NG from any African country: prices, certificate and how to pay in USD.",
		path: "/study-online-africa"
	}),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var Route$59 = createFileRoute("/tech")({ beforeLoad: () => {
	throw redirect({
		to: "/",
		replace: true
	});
} });
var $$splitComponentImporter$38 = () => import("./tech-store-BaDy41dP.mjs");
var Route$58 = createFileRoute("/tech-store")({
	head: () => pageHead({
		title: "Tech Store: Power Banks & Laptops",
		description: "Buy affordable tech in Nigeria: locally assembled Battery Bank power banks, student laptops, laptop accessories, custom phone cases and robotics kits. Order on WhatsApp — nationwide delivery, pay on delivery.",
		path: "/tech-store"
	}),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./tinypeople-Bg-vh3DM.mjs");
var Route$57 = createFileRoute("/tinypeople")({
	head: () => pageHead({
		title: "Tiny People AI in Africa, with Natura Inc",
		description: "Tech Faculty has partnered with Natura Inc to bring Tiny People AI — a powerful personal AI agent on WhatsApp, Telegram and iMessage — to Africa.",
		path: "/tinypeople"
	}),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./virtual-siwes-Wxd6XvhE.mjs");
var Route$56 = createFileRoute("/virtual-siwes")({
	head: () => pageHead({
		title: "Virtual SIWES Nigeria: Online IT Placement",
		description: "Do your SIWES or IT online from any Nigerian city with a licensed host. We review, fill, sign and stamp your logbook, then waybill it back to you — ₦45,000 + ₦15,000.",
		path: "/virtual-siwes",
		image: ogImage("virtual-siwes.jpg")
	}),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var Route$55 = createFileRoute("/why-90-of-tech-learners-quit-but-you-dont-have-to")({ beforeLoad: () => {
	throw redirect({
		to: "/blog",
		replace: true
	});
} });
var $$splitComponentImporter$35 = () => import("./admin.index-DeTwN31_.mjs");
var Route$54 = createFileRoute("/admin/")({
	head: () => pageHead({
		title: "Admin",
		description: "Staff area for managing Tech Faculty students, talent and certificates.",
		path: "/admin",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./admin.activity-BABqg_VJ.mjs");
var Route$53 = createFileRoute("/admin/activity")({
	head: () => pageHead({
		title: "Activity log",
		description: "Record of every admin action on Tech Faculty students and records.",
		path: "/admin/activity",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./admin.certificates-zkxnIJY8.mjs");
var Route$52 = createFileRoute("/admin/certificates")({
	head: () => pageHead({
		title: "Admin · Certificates",
		description: "Administrative certificate management for Tech Faculty NG.",
		path: "/admin/certificates",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./admin.leads-js30YgJS.mjs");
var Route$51 = createFileRoute("/admin/leads")({
	head: () => pageHead({
		title: "Leads",
		description: "Staff inbox for following up Tech Faculty enquiries.",
		path: "/admin/leads",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./admin.lookup-CpiYFVPJ.mjs");
var Route$50 = createFileRoute("/admin/lookup")({
	head: () => pageHead({
		title: "Admin · Student Lookup",
		description: "Find a Tech Faculty NG student and see their enrolments, payments, work and certificates.",
		path: "/admin/lookup",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./admin.referrals-BG6lV6L7.mjs");
var Route$49 = createFileRoute("/admin/referrals")({
	head: () => pageHead({
		title: "Admin · Referrals",
		description: "Alumni referrals and graduate rewards for Tech Faculty NG.",
		path: "/admin/referrals",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./admin.students-BbTCoVAZ.mjs");
var Route$48 = createFileRoute("/admin/students")({
	head: () => pageHead({
		title: "Student Work Review",
		description: "Staff area for reviewing and scoring Tech Faculty student submissions.",
		path: "/admin/students",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.talent-B1i8aOOe.mjs");
var Route$47 = createFileRoute("/admin/talent")({
	head: () => pageHead({
		title: "Talent Admin",
		description: "Administrative talent management for Tech Faculty.",
		path: "/admin/talent",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./admin.whatsapp-C5bUD1FL.mjs");
var Route$46 = createFileRoute("/admin/whatsapp")({
	head: () => pageHead({
		title: "WhatsApp inbox",
		description: "Staff WhatsApp Business inbox for Tech Faculty chats, replies and message templates.",
		path: "/admin/whatsapp",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var Route$45 = createFileRoute("/api/admin-digest")({ server: { handlers: { POST: async () => {
	const { runAdminDigest } = await import("./admin-digest.server-CJ3W2ZRL.mjs");
	try {
		return Response.json(await runAdminDigest());
	} catch (e) {
		console.error("admin-digest error", e.message);
		return Response.json({ error: "Could not send the digest" }, { status: 500 });
	}
} } } });
var Route$44 = createFileRoute("/api/admin-weekly-report")({ server: { handlers: { POST: async ({ request }) => {
	const given = request.headers.get("x-cron-secret") ?? "";
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "admin-weekly-report").maybeSingle();
	if (!given || !data?.secret || !sameKey$2(given, data.secret)) return Response.json({ error: "Not allowed" }, { status: 401 });
	const { runWeeklyReport } = await import("./admin-weekly-report.server-DvCIgm79.mjs");
	try {
		return Response.json(await runWeeklyReport());
	} catch (e) {
		console.error("admin-weekly-report error", e.message);
		return Response.json({ error: "Could not send the weekly report" }, { status: 500 });
	}
} } } });
function sameKey$1(a, b) {
	const x = new TextEncoder().encode(a);
	const y = new TextEncoder().encode(b);
	let diff = x.length ^ y.length;
	for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
	return diff === 0;
}
var Route$43 = createFileRoute("/api/ai-work-review")({ server: { handlers: { POST: async ({ request }) => {
	const given = request.headers.get("x-cron-secret") ?? "";
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "ai-work-review").maybeSingle();
	if (!given || !data?.secret || !sameKey$1(given, data.secret)) return Response.json({ error: "Not allowed" }, { status: 401 });
	const { runAiWorkReviewSweep } = await import("./ai-work-review.server-CbkA5jCh.mjs");
	try {
		return Response.json(await runAiWorkReviewSweep());
	} catch (e) {
		console.error("ai-work-review error", e.message);
		return Response.json({ error: "Could not review student work" }, { status: 500 });
	}
} } } });
var Route$42 = createFileRoute("/api/certificate-auto-issue")({ server: { handlers: { POST: async ({ request }) => {
	const [{ supabaseAdmin }, { runCertificateAutoIssue }] = await Promise.all([import("../_libs/_5.mjs"), import("../_libs/_10.mjs")]);
	const given = request.headers.get("x-cron-secret") ?? "";
	const { data: cron } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "certificate-auto-issue").maybeSingle();
	if (!given || !cron?.secret || !sameKey$2(given, cron.secret)) return Response.json({ error: "Not allowed" }, { status: 401 });
	const started = Date.now();
	try {
		const result = await runCertificateAutoIssue();
		const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "certificate-auto-issue",
			trigger: "cron",
			success: true,
			items: result.issued,
			report: result,
			duration_ms: Date.now() - started
		});
		if (logError) console.error("Could not log certificate run", logError.message);
		return Response.json(result);
	} catch (e) {
		const message = e.message;
		console.error("certificate-auto-issue error", message);
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "certificate-auto-issue",
			trigger: "cron",
			success: false,
			items: 0,
			report: {},
			error: message,
			duration_ms: Date.now() - started
		});
		return Response.json({ error: "Could not issue certificates" }, { status: 500 });
	}
} } } });
var Route$41 = createFileRoute("/api/class-reminders")({ server: { handlers: { POST: async ({ request }) => {
	const given = request.headers.get("x-cron-secret") ?? "";
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "class-reminders").maybeSingle();
	if (!given || !data?.secret || !sameKey$2(given, data.secret)) return Response.json({ error: "Not allowed" }, { status: 401 });
	const { runClassReminders } = await import("./class-reminders.server-CltDVe9n.mjs");
	const started = Date.now();
	try {
		const result = await runClassReminders();
		const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "class-reminders",
			trigger: "cron",
			success: result.failed === 0,
			items: result.sent,
			report: result,
			duration_ms: Date.now() - started
		});
		if (logError) console.error("Could not log class reminder run", logError.message);
		if (result.sent > 0) {
			const { error: auditError } = await supabaseAdmin.from("admin_audit_log").insert({
				actor_email: "automation",
				action: "class_reminders.sent",
				target_table: "lectures",
				subject: `${result.sent} class reminder${result.sent === 1 ? "" : "s"} for ${result.classes.length} class${result.classes.length === 1 ? "" : "es"}`,
				details: {
					classes: result.classes,
					skipped: result.skipped,
					failed: result.failed
				}
			});
			if (auditError) console.error("Could not write admin audit log", auditError.message);
		}
		return Response.json(result);
	} catch (e) {
		const message = e.message;
		console.error("class-reminders error", message);
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "class-reminders",
			trigger: "cron",
			success: false,
			items: 0,
			report: {},
			error: message,
			duration_ms: Date.now() - started
		});
		return Response.json({ error: "Could not send class reminders" }, { status: 500 });
	}
} } } });
var Route$40 = createFileRoute("/api/lead-followups")({ server: { handlers: { POST: async ({ request }) => {
	const expected = processModule.env["LEAD_EMAIL_CRON_SECRET"] ?? "";
	if (!sameKey$2(request.headers.get("x-cron-secret") ?? "", expected)) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const [{ supabaseAdmin }, { runLeadFollowups }] = await Promise.all([import("../_libs/_5.mjs"), import("./lead-followups.server-p0z4kGsw.mjs")]);
	const started = Date.now();
	try {
		const result = await runLeadFollowups(supabaseAdmin, async () => ({ sent: false }));
		const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "lead-email-followups",
			trigger: "cron",
			success: !result.failed,
			items: result.sent,
			report: result,
			duration_ms: Date.now() - started
		});
		if (logError) console.error("Could not log lead follow-up run", logError.message);
		return Response.json(result);
	} catch (e) {
		const message = e.message;
		console.error("lead-followups error", message);
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "lead-email-followups",
			trigger: "cron",
			success: false,
			items: 0,
			report: {},
			error: message,
			duration_ms: Date.now() - started
		});
		return Response.json({ error: "Could not send lead follow-up emails" }, { status: 500 });
	}
} } } });
var page = (title, body) => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Tech Faculty NG</title></head><body style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:48px auto;padding:0 16px;color:#333;line-height:1.5"><p style="font-size:12px;letter-spacing:2px;font-weight:700;color:#000">TECH FACULTY</p><h1 style="font-size:22px;color:#000">${title}</h1>${body}</body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
var tokenOf = (value) => typeof value === "string" ? value.replace(/[^0-9a-fA-F-]/g, "").slice(0, 36) : "";
var Route$39 = createFileRoute("/api/lead-unsubscribe")({ server: { handlers: {
	GET: async ({ request }) => {
		const token = tokenOf(new URL(request.url).searchParams.get("t"));
		if (!token) return page("Link not recognised", "<p>This unsubscribe link is incomplete.</p>");
		return page("Stop these emails?", `<p>You will get no more follow-up emails about your enquiry. Messages you ask us for, such as payment details, still reach you.</p><form method="post"><input type="hidden" name="t" value="${token}"><button type="submit" style="background:#000;color:#fff;border:0;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer">Unsubscribe</button></form>`);
	},
	POST: async ({ request }) => {
		const token = tokenOf((await request.formData().catch(() => null))?.get("t"));
		const [{ supabaseAdmin }, { unsubscribeLeadFollowups }] = await Promise.all([import("../_libs/_5.mjs"), import("./lead-followups.server-p0z4kGsw.mjs")]);
		try {
			return await unsubscribeLeadFollowups(supabaseAdmin, token) ? page("You're unsubscribed", "<p>We won't send you any more follow-up emails. If you change your mind, message us on WhatsApp.</p>") : page("Link not recognised", "<p>We couldn't find this unsubscribe link. Reply to the email and we will stop them for you.</p>");
		} catch (e) {
			console.error("lead-unsubscribe error", e.message);
			return page("Something went wrong", "<p>Please try again, or reply to the email and we will stop them for you.</p>");
		}
	}
} } });
function sameKey(a, b) {
	const x = new TextEncoder().encode(a);
	const y = new TextEncoder().encode(b);
	let diff = x.length ^ y.length;
	for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
	return diff === 0;
}
var Route$38 = createFileRoute("/api/payment-followups")({ server: { handlers: { POST: async ({ request }) => {
	const given = request.headers.get("x-cron-secret") ?? "";
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "payment-followups").maybeSingle();
	if (!given || !data?.secret || !sameKey(given, data.secret)) return Response.json({ error: "Not allowed" }, { status: 401 });
	const { runPaymentFollowups } = await import("./payment-followups.server-BlnULWEU.mjs");
	try {
		return Response.json(await runPaymentFollowups());
	} catch (e) {
		console.error("payment-followups error", e.message);
		return Response.json({ error: "Could not send follow-up emails" }, { status: 500 });
	}
} } } });
var Route$37 = createFileRoute("/api/success-kit")({ server: { handlers: { GET: async ({ request }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { checkKitAccess, kitFileResponse } = await import("./success-kit-download.server-gFKhFMGN.mjs");
	const url = new URL(request.url);
	const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "") || null;
	try {
		const access = await checkKitAccess(supabaseAdmin, url.searchParams.get("ref"), token);
		if (!access.ok) return new Response(`${access.message} Need help? WhatsApp us on +2348068597140.`, {
			status: access.status,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-store"
			}
		});
		return kitFileResponse();
	} catch (e) {
		console.error("success-kit download error", e.message);
		return new Response("Could not prepare your download. Please try again.", { status: 500 });
	}
} } } });
var $$splitComponentImporter$26 = () => import("./blog.index-BD9_te41.mjs");
var Route$36 = createFileRoute("/blog/")({
	head: () => pageHead({
		title: "Blog: Tech Career Tips & Guides",
		description: "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG. Practical advice for starting and growing your tech career in Nigeria.",
		path: "/blog"
	}),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./blog._slug-yM6ViITy.mjs");
var Route$35 = createFileRoute("/blog/$slug")({
	beforeLoad: ({ params }) => {
		const target = BLOG_REDIRECTS[params.slug];
		if (target) throw redirect({
			to: "/blog/$slug",
			params: { slug: target },
			statusCode: 301
		});
	},
	loader: async ({ params }) => {
		const { default: blogPosts } = await import("../_libs/_16.mjs").then((n) => n.n);
		const local = blogPosts.find((p) => p.slug === params.slug);
		if (local) return {
			title: local.seoTitle ?? local.title,
			description: local.description,
			published: local.date,
			modified: local.updated ?? local.date,
			image: articleOgImage(local)
		};
		try {
			const { supabase } = await import("../_libs/_.mjs").then((n) => n.t);
			const { data } = await supabase.from("blog_posts").select("title, description, category, tags, published_at, updated_at").eq("slug", params.slug).eq("is_published", true).maybeSingle();
			if (data) return {
				title: data.title,
				description: data.description,
				published: data.published_at,
				modified: data.updated_at ?? data.published_at,
				image: articleOgImage({
					title: data.title,
					description: data.description,
					tags: [data.category || data.tags?.[0] || "Career guide"]
				})
			};
		} catch {}
		return null;
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Blog & Resources",
		description: loaderData?.description ?? "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG.",
		path: `/blog/${params.slug}`,
		type: "article",
		image: loaderData?.image,
		publishedTime: loaderData?.published,
		modifiedTime: loaderData?.modified
	}),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./careers.index-DGtnMSSC.mjs");
var Route$34 = createFileRoute("/careers/")({
	head: () => pageHead({
		title: "Tech Jobs & Talent Marketplace",
		description: "Build one talent profile and get matched to verified tech roles and business projects across Nigeria and Africa, or hire skilled African talent.",
		path: "/careers"
	}),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var Route$33 = createFileRoute("/category/$")({ beforeLoad: () => {
	throw redirect({
		to: "/blog",
		replace: true
	});
} });
var $$splitComponentImporter$23 = () => import("./departments.index-DYwWcK-N.mjs");
var Route$32 = createFileRoute("/departments/")({
	head: () => pageHead({
		title: "Tech Departments & Bootcamps in Nigeria",
		description: "Explore Tech Faculty departments: web development, data science, AI, cybersecurity, UI/UX design, digital marketing and more — in person nationwide or online.",
		path: "/departments"
	}),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./departments._slug-DV3044JY.mjs");
var Route$31 = createFileRoute("/departments/$slug")({
	loader: async ({ params }) => {
		const { departments } = await import("../_libs/_3.mjs").then((n) => n.i);
		const dept = departments.find((d) => d.slug === params.slug);
		return dept ? {
			title: dept.metaTitle,
			description: dept.metaDescription
		} : null;
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Department Not Found",
		description: loaderData?.description ?? "This Tech Faculty department page is not available.",
		path: `/departments/${params.slug}`,
		image: loaderData ? ogImage(`departments/${params.slug}.jpg`) : void 0,
		noindex: !loaderData
	}),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./events.index-DoMua79I.mjs");
var Route$30 = createFileRoute("/events/")({
	head: () => pageHead({
		title: "Tech Events in Nigeria 2026: AI & Data",
		description: "Find upcoming tech events in Nigeria and Africa: AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work summits and free online webinars, updated twice a month.",
		path: "/events"
	}),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./events._slug-CJYD_jF_.mjs");
var Route$29 = createFileRoute("/events/$slug")({
	loader: async ({ params }) => {
		try {
			const { fetchEventBySlug, isOwnEvent } = await import("../_libs/_19.mjs").then((n) => n.s);
			const event = await fetchEventBySlug(params.slug);
			if (!event) return null;
			return {
				title: event.title,
				description: event.description.slice(0, 160),
				image: event.image_url ?? void 0,
				indexable: isOwnEvent(event) && !event.is_expired
			};
		} catch {
			return;
		}
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Tech Event",
		description: loaderData?.description ?? "Details for this tech event in Nigeria or Africa, curated by Tech Faculty.",
		path: `/events/${params.slug}`,
		image: loaderData?.image,
		type: "article",
		noindex: loaderData === null || loaderData?.indexable === false,
		follow: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./hubs.index-DcFw7hiP.mjs");
var Route$28 = createFileRoute("/hubs/")({
	head: () => pageHead({
		title: "Tech Hubs in Nigeria by City",
		description: "Find tech hubs, innovation centres and training institutes across Nigeria by city and course area. Tell us what you want to study and we help you enrol.",
		path: "/hubs"
	}),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./hubs._slug-DvO_ShtR.mjs");
var Route$27 = createFileRoute("/hubs/$slug")({
	beforeLoad: ({ params }) => {
		if (REMOVED_HUB_SLUGS.has(params.slug)) throw redirect({
			to: "/hubs",
			statusCode: 301
		});
	},
	loader: async ({ params }) => {
		const { techHubs } = await import("../_libs/_14.mjs").then((n) => n.d);
		const hub = techHubs.find((h) => h.slug === params.slug);
		return hub ? {
			name: hub.name,
			city: hub.city
		} : null;
	},
	head: ({ loaderData: hub, params }) => pageHead({
		title: hub ? `${hub.name}, Tech Hub in ${hub.city}` : "Hub Not Found",
		description: hub ? `${hub.name} in ${hub.city}: courses, programmes and how to enrol through Tech Faculty.`.slice(0, 160) : "This tech hub page is not available.",
		path: `/hubs/${params.slug}`,
		noindex: !hub
	}),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./locations.index-BUuG2FQn.mjs");
var Route$26 = createFileRoute("/locations/")({
	head: () => pageHead({
		title: "22 Tech Training Campuses Across Nigeria",
		description: "Find a Tech Faculty NG campus in Lagos, Abuja, Enugu, Kano, Nnewi and 17 more cities. In-person tech courses and SIWES, most at Technology Incubation Centres.",
		path: "/locations"
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./locations._slug-BaU6UAjl.mjs");
var Route$25 = createFileRoute("/locations/$slug")({
	loader: async ({ params }) => {
		const [{ campuses }, { campusMetaTitle, campusMetaDescription }] = await Promise.all([import("../_libs/_2.mjs").then((n) => n.r), import("../_libs/_17.mjs").then((n) => n.t)]);
		const campus = campuses.find((c) => c.slug === params.slug);
		return campus ? {
			title: campusMetaTitle(campus),
			description: campusMetaDescription(campus)
		} : null;
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Campus Not Found",
		description: loaderData?.description ?? "This Tech Faculty campus page is not available.",
		path: `/locations/${params.slug}`,
		image: loaderData ? ogImage(`locations/${params.slug}.jpg`) : void 0,
		noindex: !loaderData
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./reports.nigeria-tech-salaries-CHzt10CI.mjs");
var Route$24 = createFileRoute("/reports/nigeria-tech-salaries")({
	head: () => pageHead({
		title: "Nigerian Tech Salaries 2026: Sourced Pay by Role",
		description: "Sourced 2026 report on Nigerian tech pay: monthly naira ranges for 65 roles, the minimum wage gap, what startups pay senior hires, a free CSV and how to cite it.",
		path: "/reports/nigeria-tech-salaries",
		type: "article",
		image: articleOgImage({
			title: "Nigerian Tech Salaries 2026: What 65 Tech Roles Pay",
			description: "Sourced monthly naira pay ranges by role, with free data to download.",
			tags: ["Research"]
		}),
		publishedTime: "2026-10-25",
		modifiedTime: "2026-10-25"
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./siwes.index-D6ZK64Ky.mjs");
var Route$23 = createFileRoute("/siwes/")({
	head: () => pageHead({
		title: "SIWES & IT Placement in Nigeria",
		description: "Do your SIWES/IT placement at Tech Faculty NG, with no separate placement fee on site. Learn & Pay for mentored real-world experience or Tutor & Earn to teach and get paid.",
		path: "/siwes",
		image: ogImage("siwes.jpg")
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var Route$22 = createFileRoute("/tag/$")({ beforeLoad: () => {
	throw redirect({
		to: "/blog",
		replace: true
	});
} });
var $$splitComponentImporter$13 = () => import("./talent.index-DOlZNCAI.mjs");
var Route$21 = createFileRoute("/talent/")({
	head: () => pageHead({
		title: "Talent Pool: Remote Tech Work in Nigeria",
		description: "Join the Tech Faculty talent pool: build one profile, get matched to paid remote and on-site tech work with businesses across Nigeria and Africa. Free to join.",
		path: "/talent"
	}),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./talent.dashboard-DkEMzM9O.mjs");
var Route$20 = createFileRoute("/talent/dashboard")({
	head: () => pageHead({
		title: "Talent Dashboard",
		description: "Track your matches, engagements and payments on the Tech Faculty talent platform.",
		path: "/talent/dashboard",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./talent.profile-CJ26Iqlo.mjs");
var Route$19 = createFileRoute("/talent/profile")({
	head: () => pageHead({
		title: "My Talent Profile",
		description: "Manage your Tech Faculty talent profile, skills and availability.",
		path: "/talent/profile",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./team.bill-achusim-CsHSZ4oT.mjs");
var Route$18 = createFileRoute("/team/bill-achusim")({
	loader: async () => {
		const [{ getAllBlogPosts }, { default: cityGuides }] = await Promise.all([import("../_libs/_16.mjs").then((n) => n.n), import("../_libs/_15.mjs").then((n) => n.n)]);
		const guideSlugs = new Set(cityGuides.map((p) => p.slug));
		return { articles: getAllBlogPosts().filter((p) => !guideSlugs.has(p.slug)).slice(0, 10).map(({ slug, title, date }) => ({
			slug,
			title,
			date
		})) };
	},
	head: () => pageHead({
		title: "Bill Achusim - Founder of Tech Faculty NG",
		description: "Nnamdi Bill Achusim founded Tech Faculty NG in Nnewi, Anambra State, and the Nnewi Tech Meetup. He holds an MSc in Systems Engineering from the University of Lagos. His background, links and articles.",
		path: "/team/bill-achusim",
		type: "profile"
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./verify._-_9cXm1fW.mjs");
var Route$17 = createFileRoute("/verify/$")({
	head: () => pageHead({
		title: "Verify Certificate",
		description: "Verify and authenticate certificates issued by Tech Faculty NG using the official online certificate verification system.",
		path: "/verify"
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("../_._lovable.oauth.consent-9zP5cT9x.mjs");
var Route$16 = createFileRoute("/.lovable/oauth/consent")({
	head: () => pageHead({
		title: "Authorize Access",
		description: "Authorize an application to access your Tech Faculty account.",
		path: "/.lovable/oauth/consent",
		noindex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var Route$15 = createFileRoute("/api/public/og")({ server: { handlers: { GET: async ({ request }) => {
	const parsed = parseOgInput(new URL(request.url));
	if (!parsed.success) return Response.json({ error: "Invalid image parameters" }, {
		status: 400,
		headers: { "Cache-Control": "no-store" }
	});
	const { renderOgImage } = await import("./og-render.server-CF1R78Q6.mjs");
	const image = await renderOgImage(parsed.data);
	return new Response(image.body, { headers: {
		"Content-Type": image.contentType,
		"Cache-Control": OG_CACHE_CONTROL,
		"X-Content-Type-Options": "nosniff",
		"Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox"
	} });
} } } });
var $$splitComponentImporter$7 = () => import("./blog.category._slug-CCU4FB8F.mjs");
var Route$14 = createFileRoute("/blog/category/$slug")({
	loader: async ({ params }) => {
		const { getCategoryBySlug } = await import("../_libs/_13.mjs").then((n) => n.n);
		const category = getCategoryBySlug(params.slug);
		return category ? {
			title: category.title,
			description: category.description
		} : null;
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Blog Category",
		description: loaderData?.description ?? "Browse articles in this category on the Tech Faculty NG blog.",
		path: `/blog/category/${params.slug}`,
		noindex: !loaderData
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./careers.jobs._slug-DGGc5Sbx.mjs");
/** Lead with what searchers want (remote, apply), then the role summary. */
function jobDescription(title, company, body) {
	const text = `Remote ${title} role at ${company}. See requirements, pay and how to apply. ` + body.replace(/\s+/g, " ").trim();
	return text.length <= 158 ? text : text.slice(0, 155).replace(/\s+\S*$/, "") + "…";
}
var Route$13 = createFileRoute("/careers/jobs/$slug")({
	loader: async ({ params }) => {
		try {
			const { fetchJobBySlug } = await import("../_libs/_18.mjs").then((n) => n.a);
			const job = await fetchJobBySlug(params.slug);
			if (!job) return null;
			return {
				title: `${job.company} Job: ${job.title}`,
				description: jobDescription(job.title, job.company, job.description)
			};
		} catch {
			return;
		}
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Tech Job",
		description: loaderData?.description ?? "View this tech role on the Tech Faculty talent marketplace.",
		path: `/careers/jobs/${params.slug}`,
		type: "article",
		noindex: loaderData === null
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./careers.platforms._platformSlug-IKgskuej.mjs");
var Route$12 = createFileRoute("/careers/platforms/$platformSlug")({
	head: ({ params }) => {
		const platform = platformBySlug(params.platformSlug);
		return pageHead({
			title: platform ? platform.seoTitle ?? `${platform.keyword} for Nigerians & Africans (Remote)` : "Platform Not Found",
			description: platform ? platform.seoDescription ?? `Latest ${platform.keyword.toLowerCase()} open to Nigerian and African talent: ${platform.blurb} Pay, eligibility and how to apply.` : "This job platform page is not available.",
			path: `/careers/platforms/${params.platformSlug}`,
			noindex: !platform
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./siwes.courses.index-D6gosN8V.mjs");
var Route$11 = createFileRoute("/siwes/courses/")({
	head: () => pageHead({
		title: "SIWES by Course of Study in Nigeria",
		description: "Find the right tech SIWES placement for your course: engineering, mass communication, statistics, accounting, OTM and computer science, online or on site.",
		path: "/siwes/courses",
		image: ogImage("siwes.jpg")
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./siwes.courses._slug-Bya4X-RF.mjs");
var Route$10 = createFileRoute("/siwes/courses/$slug")({
	loader: async ({ params }) => {
		const { getSiwesCourse } = await import("../_libs/_21.mjs").then((n) => n.o);
		const course = getSiwesCourse(params.slug);
		return course ? {
			title: course.metaTitle,
			description: course.metaDescription
		} : null;
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "SIWES Course Not Found",
		description: loaderData?.description ?? "This SIWES course page is not available.",
		path: `/siwes/courses/${params.slug}`,
		image: loaderData ? ogImage("siwes.jpg") : void 0,
		noindex: !loaderData
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./talent.pool.index-D-mk2Vxb.mjs");
var Route$9 = createFileRoute("/talent/pool/")({
	head: () => pageHead({
		title: "Hire Vetted African Tech Talent",
		description: "Browse the Tech Faculty talent pool: developers, designers, analysts, marketers and project managers across Nigeria and Africa, ready for remote and on-site work.",
		path: "/talent/pool"
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./talent.pool._id-DMrfIqVr.mjs");
var Route$8 = createFileRoute("/talent/pool/$id")({
	loader: async ({ params }) => {
		try {
			const { supabase } = await import("../_libs/_.mjs").then((n) => n.t);
			const { data } = await supabase.rpc("get_public_talent", { profile_id: params.id });
			const person = data?.[0];
			if (!person) return null;
			return {
				title: `${person.full_name}, ${person.headline ?? "Tech Talent"}`,
				description: person.headline ?? "Vetted tech talent on the Tech Faculty talent pool, available for remote and on-site work."
			};
		} catch {
			return;
		}
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Talent Profile",
		description: loaderData?.description ?? "View this talent profile on the Tech Faculty talent pool.",
		path: `/talent/pool/${params.id}`,
		type: "profile",
		noindex: true,
		follow: loaderData !== null
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./talent.roles._slug-DNTSbjZC.mjs");
var Route$7 = createFileRoute("/talent/roles/$slug")({
	loader: async ({ params }) => {
		try {
			const { fetchRoleBySlug } = await import("../_libs/_11.mjs").then((n) => n.M);
			const role = await fetchRoleBySlug(params.slug);
			if (!role) return null;
			return {
				title: `${role.title} at ${role.company}`,
				description: role.summary.slice(0, 158)
			};
		} catch {
			return;
		}
	},
	head: ({ loaderData, params }) => pageHead({
		title: loaderData?.title ?? "Open Role",
		description: loaderData?.description ?? "View this open role on the Tech Faculty talent marketplace.",
		path: `/talent/roles/${params.slug}`,
		type: "article",
		noindex: loaderData === null
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$6 = createFileRoute("/api/public/hr-api/$")({ server: { handlers: {
	GET: async ({ request, params }) => {
		const { handleHrApi } = await import("./hr-api.server-BsbYZopn.mjs");
		return handleHrApi(request, params._splat ?? "");
	},
	POST: async ({ request, params }) => {
		const { handleHrApi } = await import("./hr-api.server-BsbYZopn.mjs");
		return handleHrApi(request, params._splat ?? "");
	}
} } });
var Route$5 = createFileRoute("/api/public/jobs/auto-match")({ server: { handlers: { POST: async ({ request }) => {
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const given = request.headers.get("x-cron-secret") ?? "";
	const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "auto-match").maybeSingle();
	if (!data?.secret || !sameKey$2(given, data.secret)) return new Response("Unauthorized", { status: 401 });
	const started = Date.now();
	const { runAutoMatch } = await import("./matching.server-C1cSwpKJ.mjs");
	try {
		const { retryPendingSlackPool } = await import("./match-slack.server-B6w5p9Lr.mjs");
		const res = {
			...await runAutoMatch(),
			slackPool: await retryPendingSlackPool()
		};
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "auto-match",
			trigger: "cron",
			success: true,
			items: res.created,
			report: res,
			duration_ms: Date.now() - started
		});
		return Response.json(res);
	} catch (e) {
		const msg = e.message;
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "auto-match",
			trigger: "cron",
			success: false,
			items: 0,
			report: {},
			error: msg,
			duration_ms: Date.now() - started
		});
		return Response.json({ error: "Auto-match failed" }, { status: 500 });
	}
} } } });
var Route$4 = createFileRoute("/api/public/whatsapp/lead-followups")({ server: { handlers: { POST: async ({ request }) => {
	const given = request.headers.get("x-cron-secret") ?? "";
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data, error } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "whatsapp-lead-followups").maybeSingle();
	if (error || !data?.secret || !sameKey$2(given, data.secret)) return new Response("Unauthorized", { status: 401 });
	const { runWhatsAppLeadFollowups } = await import("./whatsapp-followups.server-KJs0rKUg.mjs");
	const started = Date.now();
	try {
		const result = await runWhatsAppLeadFollowups(supabaseAdmin);
		const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "whatsapp-lead-followups",
			trigger: "cron",
			success: !result.failed && !result.unresolved,
			items: result.sent,
			report: result,
			duration_ms: Date.now() - started
		});
		if (logError) console.error("Could not log WhatsApp follow-up run", logError.message);
		return Response.json(result);
	} catch (error) {
		const message = error.message;
		await supabaseAdmin.from("scheduled_job_runs").insert({
			job: "whatsapp-lead-followups",
			trigger: "cron",
			success: false,
			items: 0,
			report: {},
			error: message,
			duration_ms: Date.now() - started
		});
		console.error("WhatsApp lead follow-ups failed", message);
		return Response.json({ error: "WhatsApp follow-up run failed" }, { status: 500 });
	}
} } } });
var Route$3 = createFileRoute("/api/public/whatsapp/webhook")({ server: { handlers: { POST: async ({ request }) => {
	const secret = processModule.env["WHATSAPP_API_KEY"];
	if (!secret) return new Response("Not configured", { status: 500 });
	let payload;
	try {
		payload = (await verifyWebhookRequest({
			req: request,
			secret,
			maxBodyBytes: 4194304
		})).payload;
	} catch {
		return new Response("Unauthorized", { status: 401 });
	}
	const deliveryId = request.headers.get("x-lovable-delivery");
	const event = request.headers.get("x-lovable-event");
	if (!deliveryId || !event) return new Response("Missing headers", { status: 400 });
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const db = supabaseAdmin;
	const { runRow, recoverPending } = await import("./whatsapp.server-CW9tC6q2.mjs");
	const { error: insErr } = await db.from("whatsapp_webhook_events").upsert({
		delivery_id: deliveryId,
		event,
		payload
	}, {
		onConflict: "delivery_id",
		ignoreDuplicates: true
	});
	if (insErr) return new Response("Store failed", { status: 500 });
	const { data: row, error } = await db.from("whatsapp_webhook_events").select("id,delivery_id,event,payload,attempts,processed_at").eq("delivery_id", deliveryId).single();
	if (error || !row) return new Response("Store failed", { status: 500 });
	if (!row.processed_at) {
		if (!await runRow(db, row)) return new Response("Processing failed", { status: 500 });
	}
	try {
		await recoverPending(db, 3);
	} catch {}
	return new Response("ok");
} } } });
var SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$4 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Confirm your email for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$5,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$5,
						children: "Confirm your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$5,
						children: [
							"Thanks for signing up for",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: siteUrl,
								style: link$2,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: siteName })
							}),
							"!"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$5,
						children: [
							"Please confirm your email address (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: `mailto:${recipient}`,
								style: link$2,
								children: recipient
							}),
							") by clicking the button below:"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "dm-btn",
						style: button$4,
						href: confirmationUrl,
						children: "Verify Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$5,
						children: "If you didn't create an account, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$5 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$5 = { padding: "20px 25px" };
var h1$5 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$5 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link$2 = {
	color: "inherit",
	textDecoration: "underline"
};
var button$4 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$5 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$4 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var InviteEmail = ({ siteName, siteUrl, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$3 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["You've been invited to join ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$4,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$4,
						children: "You've been invited"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$4,
						children: [
							"You've been invited to join",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: siteUrl,
								style: link$1,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: siteName })
							}),
							". Click the button below to accept the invitation and create your account."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "dm-btn",
						style: button$3,
						href: confirmationUrl,
						children: "Accept Invitation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$4,
						children: "If you weren't expecting this invitation, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$4 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$4 = { padding: "20px 25px" };
var h1$4 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$4 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link$1 = {
	color: "inherit",
	textDecoration: "underline"
};
var button$3 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$4 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$3 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var MagicLinkEmail = ({ siteName, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$2 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Your login link for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$3,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$3,
						children: "Your login link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$3,
						children: [
							"Click the button below to log in to ",
							siteName,
							". This link will expire shortly."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "dm-btn",
						style: button$2,
						href: confirmationUrl,
						children: "Log In"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$3,
						children: "If you didn't request this link, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$3 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$3 = { padding: "20px 25px" };
var h1$3 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$3 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var button$2 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$3 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$2 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var RecoveryEmail = ({ siteName, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$1 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Reset your password for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$2,
						children: "Reset your password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$2,
						children: [
							"We received a request to reset your password for ",
							siteName,
							". Click the button below to choose a new password."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "dm-btn",
						style: button$1,
						href: confirmationUrl,
						children: "Reset Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$2,
						children: "If you didn't request a password reset, you can safely ignore this email. Your password will not be changed."
					})
				]
			})
		})
	]
});
var main$2 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$2 = { padding: "20px 25px" };
var h1$2 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$2 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var button$1 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$2 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$1 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var EmailChangeEmail = ({ siteName, oldEmail, newEmail, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Confirm your email change for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$1,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$1,
						children: "Confirm your email change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$1,
						children: [
							"You requested to change your email address for ",
							siteName,
							" from",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: `mailto:${oldEmail}`,
								style: link,
								children: oldEmail
							}),
							" ",
							"to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: `mailto:${newEmail}`,
								style: link,
								children: newEmail
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text$1,
						children: "Click the button below to confirm this change:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "dm-btn",
						style: button,
						href: confirmationUrl,
						children: "Confirm Email Change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$1,
						children: "If you didn't request this change, please secure your account immediately."
					})
				]
			})
		})
	]
});
var main$1 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$1 = { padding: "20px 25px" };
var h1$1 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$1 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link = {
	color: "inherit",
	textDecoration: "underline"
};
var button = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$1 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var ReauthenticationEmail = ({ token }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: "Your verification code" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1,
						children: "Confirm reauthentication"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text,
						children: "Use the code below to confirm your identity:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: codeStyle,
						children: token
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer,
						children: "This code will expire shortly. If you didn't request this, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container = { padding: "20px 25px" };
var h1 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var codeStyle = {
	fontFamily: "Courier, monospace",
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 30px"
};
var footer = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var EMAIL_TEMPLATES = {
	signup: SignupEmail,
	invite: InviteEmail,
	magiclink: MagicLinkEmail,
	recovery: RecoveryEmail,
	email_change: EmailChangeEmail,
	reauthentication: ReauthenticationEmail
};
var SITE_NAME$1 = "Tech Faculty";
var SAMPLE_PROJECT_URL = "https://techup.lovable.app";
var SAMPLE_EMAIL = "user@example.test";
var SAMPLE_DATA = {
	signup: {
		siteName: SITE_NAME$1,
		siteUrl: SAMPLE_PROJECT_URL,
		recipient: SAMPLE_EMAIL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	magiclink: {
		siteName: SITE_NAME$1,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	recovery: {
		siteName: SITE_NAME$1,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	invite: {
		siteName: SITE_NAME$1,
		siteUrl: SAMPLE_PROJECT_URL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	email_change: {
		siteName: SITE_NAME$1,
		oldEmail: SAMPLE_EMAIL,
		email: SAMPLE_EMAIL,
		newEmail: SAMPLE_EMAIL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	reauthentication: { token: "123456" }
};
var Route$2 = createFileRoute("/lovable/email/auth/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = processModule.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	const authHeader = request.headers.get("Authorization");
	if (!authHeader || authHeader !== `Bearer ${apiKey}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
	let type;
	try {
		type = (await request.json()).type;
	} catch {
		return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
	}
	const EmailTemplate = EMAIL_TEMPLATES[type];
	if (!EmailTemplate) return Response.json({ error: `Unknown email type: ${type}` }, { status: 400 });
	const sampleData = SAMPLE_DATA[type] || {};
	const html = await render(import_react.createElement(EmailTemplate, sampleData));
	return new Response(html, {
		status: 200,
		headers: { "Content-Type": "text/html; charset=utf-8" }
	});
} } } });
var SITE_NAME = "Tech Faculty";
var SENDER_DOMAIN = "alerts.techfaculty.ng";
var ROOT_DOMAIN = "techfaculty.ng";
var FROM_DOMAIN = "alerts.techfaculty.ng";
var SITE_URL = `https://${ROOT_DOMAIN}`;
var Route$1 = createFileRoute("/lovable/email/auth/webhook")({ server: { handlers: { POST: ({ request }) => {
	return createAuthEmailHandler({
		apiKey: processModule.env["LOVABLE_API_KEY"],
		from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
		senderDomain: SENDER_DOMAIN,
		sendUrl: processModule.env["LOVABLE_SEND_URL"],
		emails: {
			signup: {
				subject: "Confirm your email",
				render: (data) => import_react.createElement(SignupEmail, {
					siteName: SITE_NAME,
					siteUrl: SITE_URL,
					recipient: data.email,
					confirmationUrl: data.url
				})
			},
			invite: {
				subject: "You've been invited",
				render: (data) => import_react.createElement(InviteEmail, {
					siteName: SITE_NAME,
					siteUrl: SITE_URL,
					confirmationUrl: data.url
				})
			},
			magiclink: {
				subject: "Your login link",
				render: (data) => import_react.createElement(MagicLinkEmail, {
					siteName: SITE_NAME,
					confirmationUrl: data.url
				})
			},
			recovery: {
				subject: "Reset your password",
				render: (data) => import_react.createElement(RecoveryEmail, {
					siteName: SITE_NAME,
					confirmationUrl: data.url
				})
			},
			email_change: {
				subject: "Confirm your new email",
				render: (data) => import_react.createElement(EmailChangeEmail, {
					siteName: SITE_NAME,
					oldEmail: data.old_email ?? "",
					email: data.email,
					newEmail: data.new_email ?? "",
					confirmationUrl: data.url
				})
			},
			reauthentication: {
				subject: "Your verification code",
				render: (data) => import_react.createElement(ReauthenticationEmail, { token: data.token ?? "" })
			}
		}
	})(request);
} } } });
var Route = createFileRoute("/lovable/email/transactional/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = processModule.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	if (request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") !== apiKey) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const templateNames = Object.keys(TEMPLATES);
	const results = [];
	for (const name of templateNames) {
		const entry = TEMPLATES[name];
		const displayName = entry.displayName || name;
		if (!entry.previewData) {
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "preview_data_required"
			});
			continue;
		}
		try {
			const html = await render(import_react.createElement(entry.component, entry.previewData));
			const resolvedSubject = typeof entry.subject === "function" ? entry.subject(entry.previewData) : entry.subject;
			results.push({
				templateName: name,
				displayName,
				subject: resolvedSubject,
				html,
				status: "ready"
			});
		} catch (err) {
			console.error("Failed to render template for preview", {
				template: name,
				error: err
			});
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "render_failed",
				errorMessage: err instanceof Error ? err.message : String(err)
			});
		}
	}
	return Response.json({ templates: results });
} } } });
var IndexRoute = Route$76.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$77
});
var AboutRoute = Route$75.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$77
});
var BusinessPartnershipsRoute = Route$74.update({
	id: "/business-partnerships",
	path: "/business-partnerships",
	getParentRoute: () => Route$77
});
var DashboardRoute = Route$73.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$77
});
var FeedDotxmlRoute = Route$72.update({
	id: "/feed.xml",
	path: "/feed.xml",
	getParentRoute: () => Route$77
});
var HireRoute = Route$71.update({
	id: "/hire",
	path: "/hire",
	getParentRoute: () => Route$77
});
var LoginRoute = Route$70.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$77
});
var LovableRoute = Route$69.update({
	id: "/lovable",
	path: "/lovable",
	getParentRoute: () => Route$77
});
var OrderCompleteRoute = Route$68.update({
	id: "/order-complete",
	path: "/order-complete",
	getParentRoute: () => Route$77
});
var OutcomesRoute = Route$67.update({
	id: "/outcomes",
	path: "/outcomes",
	getParentRoute: () => Route$77
});
var PayBalanceRoute = Route$66.update({
	id: "/pay-balance",
	path: "/pay-balance",
	getParentRoute: () => Route$77
});
var PaymentSuccessRoute = Route$65.update({
	id: "/payment-success",
	path: "/payment-success",
	getParentRoute: () => Route$77
});
var ProductsRoute = Route$64.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$77
});
var RssDotxmlRoute = Route$63.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$77
});
var SchoolCollaborationsRoute = Route$62.update({
	id: "/school-collaborations",
	path: "/school-collaborations",
	getParentRoute: () => Route$77
});
var SiwesSuccessKitRoute = Route$61.update({
	id: "/siwes-success-kit",
	path: "/siwes-success-kit",
	getParentRoute: () => Route$77
});
var StudyOnlineAfricaRoute = Route$60.update({
	id: "/study-online-africa",
	path: "/study-online-africa",
	getParentRoute: () => Route$77
});
var TechRoute = Route$59.update({
	id: "/tech",
	path: "/tech",
	getParentRoute: () => Route$77
});
var TechStoreRoute = Route$58.update({
	id: "/tech-store",
	path: "/tech-store",
	getParentRoute: () => Route$77
});
var TinypeopleRoute = Route$57.update({
	id: "/tinypeople",
	path: "/tinypeople",
	getParentRoute: () => Route$77
});
var VirtualSiwesRoute = Route$56.update({
	id: "/virtual-siwes",
	path: "/virtual-siwes",
	getParentRoute: () => Route$77
});
var Why90OfTechLearnersQuitButYouDontHaveToRoute = Route$55.update({
	id: "/why-90-of-tech-learners-quit-but-you-dont-have-to",
	path: "/why-90-of-tech-learners-quit-but-you-dont-have-to",
	getParentRoute: () => Route$77
});
var AdminIndexRoute = Route$54.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$77
});
var AdminActivityRoute = Route$53.update({
	id: "/admin/activity",
	path: "/admin/activity",
	getParentRoute: () => Route$77
});
var AdminCertificatesRoute = Route$52.update({
	id: "/admin/certificates",
	path: "/admin/certificates",
	getParentRoute: () => Route$77
});
var AdminLeadsRoute = Route$51.update({
	id: "/admin/leads",
	path: "/admin/leads",
	getParentRoute: () => Route$77
});
var AdminLookupRoute = Route$50.update({
	id: "/admin/lookup",
	path: "/admin/lookup",
	getParentRoute: () => Route$77
});
var AdminReferralsRoute = Route$49.update({
	id: "/admin/referrals",
	path: "/admin/referrals",
	getParentRoute: () => Route$77
});
var AdminStudentsRoute = Route$48.update({
	id: "/admin/students",
	path: "/admin/students",
	getParentRoute: () => Route$77
});
var AdminTalentRoute = Route$47.update({
	id: "/admin/talent",
	path: "/admin/talent",
	getParentRoute: () => Route$77
});
var AdminWhatsappRoute = Route$46.update({
	id: "/admin/whatsapp",
	path: "/admin/whatsapp",
	getParentRoute: () => Route$77
});
var ApiAdminDigestRoute = Route$45.update({
	id: "/api/admin-digest",
	path: "/api/admin-digest",
	getParentRoute: () => Route$77
});
var ApiAdminWeeklyReportRoute = Route$44.update({
	id: "/api/admin-weekly-report",
	path: "/api/admin-weekly-report",
	getParentRoute: () => Route$77
});
var ApiAiWorkReviewRoute = Route$43.update({
	id: "/api/ai-work-review",
	path: "/api/ai-work-review",
	getParentRoute: () => Route$77
});
var ApiCertificateAutoIssueRoute = Route$42.update({
	id: "/api/certificate-auto-issue",
	path: "/api/certificate-auto-issue",
	getParentRoute: () => Route$77
});
var ApiClassRemindersRoute = Route$41.update({
	id: "/api/class-reminders",
	path: "/api/class-reminders",
	getParentRoute: () => Route$77
});
var ApiLeadFollowupsRoute = Route$40.update({
	id: "/api/lead-followups",
	path: "/api/lead-followups",
	getParentRoute: () => Route$77
});
var ApiLeadUnsubscribeRoute = Route$39.update({
	id: "/api/lead-unsubscribe",
	path: "/api/lead-unsubscribe",
	getParentRoute: () => Route$77
});
var ApiPaymentFollowupsRoute = Route$38.update({
	id: "/api/payment-followups",
	path: "/api/payment-followups",
	getParentRoute: () => Route$77
});
var ApiSuccessKitRoute = Route$37.update({
	id: "/api/success-kit",
	path: "/api/success-kit",
	getParentRoute: () => Route$77
});
var BlogIndexRoute = Route$36.update({
	id: "/blog/",
	path: "/blog/",
	getParentRoute: () => Route$77
});
var BlogSlugRoute = Route$35.update({
	id: "/blog/$slug",
	path: "/blog/$slug",
	getParentRoute: () => Route$77
});
var CareersIndexRoute = Route$34.update({
	id: "/careers/",
	path: "/careers/",
	getParentRoute: () => Route$77
});
var CategorySplatRoute = Route$33.update({
	id: "/category/$",
	path: "/category/$",
	getParentRoute: () => Route$77
});
var DepartmentsIndexRoute = Route$32.update({
	id: "/departments/",
	path: "/departments/",
	getParentRoute: () => Route$77
});
var DepartmentsSlugRoute = Route$31.update({
	id: "/departments/$slug",
	path: "/departments/$slug",
	getParentRoute: () => Route$77
});
var EventsIndexRoute = Route$30.update({
	id: "/events/",
	path: "/events/",
	getParentRoute: () => Route$77
});
var EventsSlugRoute = Route$29.update({
	id: "/events/$slug",
	path: "/events/$slug",
	getParentRoute: () => Route$77
});
var HubsIndexRoute = Route$28.update({
	id: "/hubs/",
	path: "/hubs/",
	getParentRoute: () => Route$77
});
var HubsSlugRoute = Route$27.update({
	id: "/hubs/$slug",
	path: "/hubs/$slug",
	getParentRoute: () => Route$77
});
var LocationsIndexRoute = Route$26.update({
	id: "/locations/",
	path: "/locations/",
	getParentRoute: () => Route$77
});
var LocationsSlugRoute = Route$25.update({
	id: "/locations/$slug",
	path: "/locations/$slug",
	getParentRoute: () => Route$77
});
var ReportsNigeriaTechSalariesRoute = Route$24.update({
	id: "/reports/nigeria-tech-salaries",
	path: "/reports/nigeria-tech-salaries",
	getParentRoute: () => Route$77
});
var SiwesIndexRoute = Route$23.update({
	id: "/siwes/",
	path: "/siwes/",
	getParentRoute: () => Route$77
});
var TagSplatRoute = Route$22.update({
	id: "/tag/$",
	path: "/tag/$",
	getParentRoute: () => Route$77
});
var TalentIndexRoute = Route$21.update({
	id: "/talent/",
	path: "/talent/",
	getParentRoute: () => Route$77
});
var TalentDashboardRoute = Route$20.update({
	id: "/talent/dashboard",
	path: "/talent/dashboard",
	getParentRoute: () => Route$77
});
var TalentProfileRoute = Route$19.update({
	id: "/talent/profile",
	path: "/talent/profile",
	getParentRoute: () => Route$77
});
var TeamBillAchusimRoute = Route$18.update({
	id: "/team/bill-achusim",
	path: "/team/bill-achusim",
	getParentRoute: () => Route$77
});
var VerifySplatRoute = Route$17.update({
	id: "/verify/$",
	path: "/verify/$",
	getParentRoute: () => Route$77
});
var DotlovableOauthConsentRoute = Route$16.update({
	id: "/.lovable/oauth/consent",
	path: "/.lovable/oauth/consent",
	getParentRoute: () => Route$77
});
var ApiPublicOgRoute = Route$15.update({
	id: "/api/public/og",
	path: "/api/public/og",
	getParentRoute: () => Route$77
});
var BlogCategorySlugRoute = Route$14.update({
	id: "/blog/category/$slug",
	path: "/blog/category/$slug",
	getParentRoute: () => Route$77
});
var CareersJobsSlugRoute = Route$13.update({
	id: "/careers/jobs/$slug",
	path: "/careers/jobs/$slug",
	getParentRoute: () => Route$77
});
var CareersPlatformsPlatformSlugRoute = Route$12.update({
	id: "/careers/platforms/$platformSlug",
	path: "/careers/platforms/$platformSlug",
	getParentRoute: () => Route$77
});
var SiwesCoursesIndexRoute = Route$11.update({
	id: "/siwes/courses/",
	path: "/siwes/courses/",
	getParentRoute: () => Route$77
});
var SiwesCoursesSlugRoute = Route$10.update({
	id: "/siwes/courses/$slug",
	path: "/siwes/courses/$slug",
	getParentRoute: () => Route$77
});
var TalentPoolIndexRoute = Route$9.update({
	id: "/talent/pool/",
	path: "/talent/pool/",
	getParentRoute: () => Route$77
});
var TalentPoolIdRoute = Route$8.update({
	id: "/talent/pool/$id",
	path: "/talent/pool/$id",
	getParentRoute: () => Route$77
});
var TalentRolesSlugRoute = Route$7.update({
	id: "/talent/roles/$slug",
	path: "/talent/roles/$slug",
	getParentRoute: () => Route$77
});
var ApiPublicHrApiSplatRoute = Route$6.update({
	id: "/api/public/hr-api/$",
	path: "/api/public/hr-api/$",
	getParentRoute: () => Route$77
});
var ApiPublicJobsAutoMatchRoute = Route$5.update({
	id: "/api/public/jobs/auto-match",
	path: "/api/public/jobs/auto-match",
	getParentRoute: () => Route$77
});
var ApiPublicWhatsappLeadFollowupsRoute = Route$4.update({
	id: "/api/public/whatsapp/lead-followups",
	path: "/api/public/whatsapp/lead-followups",
	getParentRoute: () => Route$77
});
var ApiPublicWhatsappWebhookRoute = Route$3.update({
	id: "/api/public/whatsapp/webhook",
	path: "/api/public/whatsapp/webhook",
	getParentRoute: () => Route$77
});
var LovableRouteChildren = {
	LovableEmailAuthPreviewRoute: Route$2.update({
		id: "/email/auth/preview",
		path: "/email/auth/preview",
		getParentRoute: () => LovableRoute
	}),
	LovableEmailAuthWebhookRoute: Route$1.update({
		id: "/email/auth/webhook",
		path: "/email/auth/webhook",
		getParentRoute: () => LovableRoute
	}),
	LovableEmailTransactionalPreviewRoute: Route.update({
		id: "/email/transactional/preview",
		path: "/email/transactional/preview",
		getParentRoute: () => LovableRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	BusinessPartnershipsRoute,
	DashboardRoute,
	FeedDotxmlRoute,
	HireRoute,
	LoginRoute,
	LovableRoute: LovableRoute._addFileChildren(LovableRouteChildren),
	OrderCompleteRoute,
	OutcomesRoute,
	PayBalanceRoute,
	PaymentSuccessRoute,
	ProductsRoute,
	RssDotxmlRoute,
	SchoolCollaborationsRoute,
	SiwesSuccessKitRoute,
	StudyOnlineAfricaRoute,
	TechRoute,
	TechStoreRoute,
	TinypeopleRoute,
	VirtualSiwesRoute,
	Why90OfTechLearnersQuitButYouDontHaveToRoute,
	AdminActivityRoute,
	AdminCertificatesRoute,
	AdminLeadsRoute,
	AdminLookupRoute,
	AdminReferralsRoute,
	AdminStudentsRoute,
	AdminTalentRoute,
	AdminWhatsappRoute,
	ApiAdminDigestRoute,
	ApiAdminWeeklyReportRoute,
	ApiAiWorkReviewRoute,
	ApiCertificateAutoIssueRoute,
	ApiClassRemindersRoute,
	ApiLeadFollowupsRoute,
	ApiLeadUnsubscribeRoute,
	ApiPaymentFollowupsRoute,
	ApiSuccessKitRoute,
	BlogSlugRoute,
	CategorySplatRoute,
	DepartmentsSlugRoute,
	EventsSlugRoute,
	HubsSlugRoute,
	LocationsSlugRoute,
	ReportsNigeriaTechSalariesRoute,
	TagSplatRoute,
	TalentDashboardRoute,
	TalentProfileRoute,
	TeamBillAchusimRoute,
	VerifySplatRoute,
	AdminIndexRoute,
	BlogIndexRoute,
	CareersIndexRoute,
	DepartmentsIndexRoute,
	EventsIndexRoute,
	HubsIndexRoute,
	LocationsIndexRoute,
	SiwesIndexRoute,
	TalentIndexRoute,
	DotlovableOauthConsentRoute,
	ApiPublicOgRoute,
	BlogCategorySlugRoute,
	CareersJobsSlugRoute,
	CareersPlatformsPlatformSlugRoute,
	SiwesCoursesSlugRoute,
	TalentPoolIdRoute,
	TalentRolesSlugRoute,
	SiwesCoursesIndexRoute,
	TalentPoolIndexRoute,
	ApiPublicHrApiSplatRoute,
	ApiPublicJobsAutoMatchRoute,
	ApiPublicWhatsappLeadFollowupsRoute,
	ApiPublicWhatsappWebhookRoute
};
var routeTree = Route$77._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
