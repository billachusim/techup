import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { A as Send, C as Sparkles, ft as Globe, in as ArrowRight, lt as Headphones, q as MessageCircle, w as Smartphone } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/tinypeople-Bg-vh3DM.js
var import_jsx_runtime = require_jsx_runtime();
var tinypeople_hero_default = "/assets/tinypeople-hero-anc2FSjJ.jpg";
var START_URL = "https://tinypeople.ai/start";
var LEARN_URL = "https://tinypeople.ai";
var TinyPeople = () => {
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), " Tech Faculty × Natura Inc"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-bold leading-tight mb-4",
								children: "Meet Tiny People AI — Your Personal AI Agent, Now in Africa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-muted-foreground mb-6",
								children: "Tech Faculty has partnered with Natura Inc to bring Tiny People AI to users across Nigeria and Africa. Talk to one of the world's most capable AI agents right from WhatsApp, Telegram or iMessage — no app to install."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: START_URL,
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Start Using Tiny People ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: LEARN_URL,
										target: "_blank",
										rel: "noopener noreferrer",
										children: "Learn more about Tiny People AI"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl overflow-hidden border border-border shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: tinypeople_hero_default,
								alt: "Tiny People AI agent connecting through messaging apps",
								width: 1280,
								height: 736,
								className: "w-full h-auto"
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-4xl mt-20 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold mb-4",
						children: "An AI agent that lives in your messages"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-lg",
						children: "Tiny People is not just a chatbot — it's a powerful personal AI agent that can plan, research, remember, and take action on your behalf. The best part? You talk to it exactly the same way you talk to your friends."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-6xl mt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-3 gap-6",
						children: [
							{
								icon: MessageCircle,
								name: "WhatsApp",
								desc: "Chat with your AI agent from the app you already use every day."
							},
							{
								icon: Send,
								name: "Telegram",
								desc: "Fast, private, secure conversations with your personal agent."
							},
							{
								icon: Smartphone,
								name: "iMessage",
								desc: "Native Apple experience — talk to Tiny People right from Messages."
							}
						].map(({ icon: Icon, name, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xl font-semibold",
										children: name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: desc
									})
								]
							})
						}, name))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "mt-6 border-primary/30 bg-primary/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { size: 22 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold mb-1",
								children: "Coming soon: AI Earbuds"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Pre-order Tiny People earbuds for hands-free conversations with your agent anywhere you go. Delivery available across Nigeria and Africa."
							})] })]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-4xl mt-20 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 14 }), " Built for our region"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-4xl font-bold mb-4",
							children: "World-class AI, on the channels we already use"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-lg",
							children: "We partnered with Natura Inc because Africa deserves first-class access to the best AI tools — not after, but right alongside the rest of the world. With Tiny People, the gift of AI is just one message away."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 max-w-4xl mt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] p-10 text-center text-background",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl md:text-4xl font-bold mb-3",
								children: "Start chatting with Tiny People"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opacity-90 mb-6 max-w-xl mx-auto",
								children: "Click below to connect via WhatsApp, Telegram or iMessage and meet your new AI agent."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								className: "gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: START_URL,
									target: "_blank",
									rel: "noopener noreferrer",
									children: ["Start Using Tiny People ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground mt-6",
						children: "Powered by Natura Inc · Brought to you by Tech Faculty"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
};
var SplitComponent = TinyPeople;
//#endregion
export { SplitComponent as component };
