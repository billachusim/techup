import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { C as Sparkles, H as PanelsTopLeft, K as MessageSquare, N as Rocket, ft as Globe, in as ArrowRight, jt as Cloud, t as Zap, wt as Database } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/lovable-CrLE2NO5.js
var import_jsx_runtime = require_jsx_runtime();
var lovable_hero_default = "/assets/lovable-hero-DcdBpwjl.jpg";
var LOVABLE_REFERRAL_URL = "https://lovable.dev/?via=YOUR_REFERRAL_CODE";
var Lovable = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "pt-24 pb-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "container mx-auto px-4 max-w-6xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-10 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), " Recommended by Tech Faculty"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-bold leading-tight mb-4",
								children: "Build Apps with AI — Powered by Lovable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-muted-foreground mb-6",
								children: "Lovable is the AI platform we use to ship real production apps — including parts of this very website. Describe what you want, iterate in plain English, and publish in minutes."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: LOVABLE_REFERRAL_URL,
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Start Building on Lovable ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
									})
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl overflow-hidden border border-border shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: lovable_hero_default,
								alt: "Build apps with AI on Lovable",
								width: 1280,
								height: 736,
								className: "w-full h-auto"
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-6xl mt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold text-center mb-10",
						children: "What you can build"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4",
						children: [
							{
								icon: Globe,
								label: "Marketing sites"
							},
							{
								icon: PanelsTopLeft,
								label: "Dashboards"
							},
							{
								icon: Database,
								label: "SaaS products"
							},
							{
								icon: Rocket,
								label: "Internal tools"
							}
						].map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5 flex flex-col items-center text-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 20 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: label
								})]
							})
						}, label))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-6xl mt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold text-center mb-10",
						children: "Why Lovable"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 gap-6",
						children: [
							{
								icon: MessageSquare,
								title: "Chat to code",
								desc: "Describe features in plain English and watch them appear in your live preview."
							},
							{
								icon: Cloud,
								title: "Full-stack with Cloud",
								desc: "Database, auth, storage and edge functions built in — no separate setup."
							},
							{
								icon: Zap,
								title: "Instant publish",
								desc: "Ship to a free .lovable.app domain or connect your own custom domain."
							},
							{
								icon: Rocket,
								title: "Real production code",
								desc: "React, TypeScript and Tailwind under the hood — own your code on GitHub."
							}
						].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold mb-1",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: desc
								})] })]
							})
						}, title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-5xl mt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold text-center mb-10",
						children: "How it works"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-3 gap-6",
						children: [
							{
								n: "1",
								title: "Describe",
								desc: "Tell Lovable what you want to build in your own words."
							},
							{
								n: "2",
								title: "Iterate",
								desc: "See changes live and refine through chat — no setup."
							},
							{
								n: "3",
								title: "Publish",
								desc: "One click to share or connect your own domain."
							}
						].map(({ n, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 text-center space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background flex items-center justify-center mx-auto font-bold",
										children: n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-semibold",
										children: title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: desc
									})
								]
							})
						}, n))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-4xl mt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] p-10 text-center text-background",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl md:text-4xl font-bold mb-3",
								children: "Ready to build with AI?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opacity-90 mb-6 max-w-xl mx-auto",
								children: "Sign up for Lovable through our link and start shipping today."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								className: "gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: LOVABLE_REFERRAL_URL,
									target: "_blank",
									rel: "noopener noreferrer",
									children: ["Start Building on Lovable ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground mt-6",
						children: "Disclosure: We may earn a referral reward when you sign up through our link."
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
};
var SplitComponent = Lovable;
//#endregion
export { SplitComponent as component };
