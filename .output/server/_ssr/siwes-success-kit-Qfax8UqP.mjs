import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Ft as CircleCheck, O as ShieldCheck, ht as FileText, in as ArrowRight, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { a as kitFaqs, i as kitContents, n as formatNaira, r as freeChecklist, t as SUCCESS_KIT } from "./successKit-Ca2aXOxu.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-Co1-8MUG.mjs";
import { t as PayOrReserve } from "./OrderPayForm-0LLaEVnC.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/siwes-success-kit-Qfax8UqP.js
var import_jsx_runtime = require_jsx_runtime();
var SuccessKit = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-background",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Product",
					name: SUCCESS_KIT.name,
					description: "Digital kit for Nigerian students on SIWES/industrial training: placement email templates, student CV templates, logbook and weekly report pack, technical report outline, ITF allowance tracker and IT host directory.",
					brand: {
						"@type": "Brand",
						name: "Tech Faculty NG"
					},
					category: "Educational digital download",
					url: "https://techfaculty.ng/siwes-success-kit",
					offers: {
						"@type": "Offer",
						price: SUCCESS_KIT.priceNGN,
						priceCurrency: "NGN",
						availability: "https://schema.org/InStock",
						url: "https://techfaculty.ng/siwes-success-kit"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: kitFaqs.map((f) => ({
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
							name: "SIWES",
							item: "https://techfaculty.ng/siwes"
						},
						{
							"@type": "ListItem",
							position: 3,
							name: SUCCESS_KIT.name,
							item: "https://techfaculty.ng/siwes-success-kit"
						}
					]
				})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "pt-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-14 md:py-20 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-block bg-primary/10 text-primary font-semibold text-xs px-3 py-1.5 rounded-full mb-5",
								children: "For Nigerian students on SIWES / IT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight",
								children: ["Stop photocopying documents. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "Do SIWES properly."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base md:text-lg text-muted-foreground mb-6 leading-relaxed",
								children: [SUCCESS_KIT.tagline, " Start with the free 7-step placement checklist, then get the full kit of templates, logbook pack and report outline used by students we've placed since 2022."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 mb-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#free-checklist",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											size: 18,
											className: "mr-2"
										}), "Get the free checklist"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#get-the-kit",
										children: ["Get the full kit — ", formatNaira(SUCCESS_KIT.priceNGN)]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									size: 16,
									className: "text-primary shrink-0"
								}), "Built by an FMSTI-licensed training institute that hosts SIWES students across five centres."]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 md:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl font-bold mb-1",
										children: "Free preview: the 7-step checklist"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mb-6",
										children: "Read it here. Enter your details below and we'll send the printable version."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "space-y-4",
										children: freeChecklist.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5",
												children: i + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-sm leading-snug",
												children: item.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground mt-0.5",
												children: item.detail
											})] })]
										}, item.title))
									})
								]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "free-checklist",
					className: "py-14 px-4 bg-muted/30 scroll-mt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-2",
								children: "Send me the free checklist"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mb-6",
								children: "Printable one-pager, free. Choose email or WhatsApp — whichever you actually check."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-card p-6 md:p-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, {
									interest: "free_checklist",
									source: "page:siwes-success-kit",
									submitLabel: "Send me the checklist",
									whatsappMessage: "Hello Tech Faculty, please send me the free SIWES placement checklist."
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "get-the-kit",
					className: "py-16 px-4 scroll-mt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-6xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center max-w-2xl mx-auto mb-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-3",
								children: ["The complete ", SUCCESS_KIT.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Seven resources that cover the whole placement — from the first cold email to the final technical report and the job conversation afterwards."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid lg:grid-cols-3 gap-8 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:col-span-2 grid sm:grid-cols-2 gap-4",
								children: kitContents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-border bg-card p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											size: 16,
											className: "text-primary mt-0.5 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm leading-snug",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground mt-1",
											children: item.detail
										})] })]
									})
								}, item.title))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-2 border-primary/40 lg:sticky lg:top-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-6 space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: "One-time payment, yours to keep"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline gap-2 mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-3xl font-bold",
													children: formatNaira(SUCCESS_KIT.priceNGN)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-muted-foreground line-through",
													children: formatNaira(SUCCESS_KIT.compareAtNGN)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: "Introductory student price. Digital download — no shipping."
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-4 border-t border-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-sm mb-1",
													children: "Get your kit now"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground mb-4",
													children: "Pay online and your download opens straight away, with the link sent to your email too."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOrReserve, {
													product: "success_kit",
													source: "page:siwes-success-kit-offer#pay",
													reserve: {
														interest: "success_kit",
														source: "page:siwes-success-kit-offer",
														submitLabel: "Reserve my kit",
														compact: true,
														whatsappMessage: `Hello Tech Faculty, I want to order the ${SUCCESS_KIT.name} (${formatNaira(SUCCESS_KIT.priceNGN)}).`
													}
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-4 border-t border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												className: "w-full",
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: `https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(`Hello Tech Faculty, I have a question about the ${SUCCESS_KIT.name}.`)}`,
													target: "_blank",
													rel: "noopener noreferrer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
														size: 16,
														className: "mr-2"
													}), "Ask a question on WhatsApp"]
												})
											})
										})
									]
								})
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-16 px-4 bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-6",
							children: "Questions students ask"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "w-full",
							children: kitFaqs.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: `faq-${i}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
									className: "text-muted-foreground",
									children: f.a
								})]
							}, f.q))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-14 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl text-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl md:text-2xl font-bold",
								children: "Need the placement itself?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "We host SIWES students across Nnewi, Onitsha/Awada, Enugu, Aba and Owerri on our Learn & Pay and Tutor & Earn tracks."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/siwes",
										children: ["Explore SIWES placements ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											size: 16,
											className: "ml-1.5"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/careers",
										children: "Browse open roles"
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
var SplitComponent = SuccessKit;
//#endregion
export { SplitComponent as component };
