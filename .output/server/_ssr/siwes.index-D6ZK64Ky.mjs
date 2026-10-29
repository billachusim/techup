import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { a as LOWEST_PAID_PLAN } from "./fees-B-53IxaZ.mjs";
import { Ct as DollarSign, Ft as CircleCheck, G as Monitor, Qt as BookOpen, S as Stamp, Yt as Briefcase, dt as GraduationCap, in as ArrowRight, nn as Award, q as MessageCircle, s as Users } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as CredibilityBanner } from "./CredibilityBanner-f1_Ygk8h.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { i as formatNaira, r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { t as LastUpdated } from "./LastUpdated-DLGRZy9q.mjs";
import { a as siwesCourses } from "./siwesCourses-DZzSWWov.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/siwes.index-D6ZK64Ky.js
var import_jsx_runtime = require_jsx_runtime();
/** When this page's copy last changed. Bump it when you edit the page. */
var SIWES_UPDATED = "2026-10-25";
var tracks = [{
	icon: BookOpen,
	title: "Learn & Pay Track",
	subtitle: "Gain Real-World Experience",
	color: "hsl(217 91% 60%)",
	gradient: "from-blue-500/10 to-indigo-500/10",
	description: `Gain structured, hands-on tech experience during your IT placement, paying your department's regular course fee, with up to 50% off for SIWES students and no separate placement fee. Perfect for students who want to build real skills beyond what the classroom offers.`,
	features: [
		"Structured mentorship from industry professionals",
		"Hands-on projects with real clients and products",
		"Access to all Tech Faculty courses during your placement",
		"Certificate of completion for your institution",
		"Recommendation letter upon successful completion",
		"Portfolio of real projects to showcase to employers"
	]
}, {
	icon: DollarSign,
	title: "Tutor & Earn Track",
	subtitle: "Teach and Get Paid",
	color: "hsl(158 100% 50%)",
	gradient: "from-green-500/10 to-emerald-500/10",
	description: "Already skilled in a tech area? Join as a student tutor — teach other learners, gain teaching experience, and earn money while completing your IT.",
	features: [
		"Get paid for tutoring other students",
		"Build leadership and communication skills",
		"Flexible schedule around your academic calendar",
		"Certificate of completion + tutoring certificate",
		"Strong recommendation letter for future employers",
		"Potential for full-time employment after graduation"
	]
}];
var whatYouGet = [
	{
		icon: Award,
		label: "Industry Certificate"
	},
	{
		icon: Briefcase,
		label: "Real Project Experience"
	},
	{
		icon: Users,
		label: "Professional Mentorship"
	},
	{
		icon: GraduationCap,
		label: "IT Completion Letter"
	}
];
var siwesFaqs = [
	{
		q: "How much does SIWES with Tech Faculty NG cost?",
		a: `There is no separate placement fee for on-site SIWES. On the Learn & Pay track you pay your department's regular course fee, from ${formatNaira(LOWEST_PAID_PLAN)}, and SIWES and IT students can get up to 50% off it at checkout, so ask us on WhatsApp for your SIWES discount. Tutor & Earn pays you instead. Virtual SIWES is charged because it includes courier delivery of your logbook and kit: ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for the full placement and ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for the logbook service.`
	},
	{
		q: "How long is a SIWES placement at Tech Faculty NG?",
		a: "As long as your school requires. Most students come for three or six months, and you tell us your IT duration and start date when you apply. Your placement letter, mentor schedule and project work are planned around that duration, and you leave with an IT completion letter and a certificate."
	},
	{
		q: "Is Tech Faculty NG accepted for SIWES and ITF paperwork?",
		a: "Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation through NBTI, and over 120 students have completed SIWES with us since 2022. We complete the company sections of your ITF SPE-1 and Form 8, but your school decides which hosts it accepts, so confirm with your SIWES coordinator first."
	},
	{
		q: "What is the difference between Learn & Pay and Tutor & Earn?",
		a: `Learn & Pay is for students who want structured mentorship and real client projects, and you pay your department's regular course fee, with up to 50% off for SIWES students. Tutor & Earn is for students already skilled in a tech area: you teach other learners and get paid while completing your IT. Both tracks end with a certificate and a recommendation letter.`
	},
	{
		q: "How do I apply for SIWES at Tech Faculty NG?",
		a: "Send a WhatsApp message to 0806 859 7140 or email thetechfaculty@gmail.com with your name, school, department, preferred track, IT duration and start date. We review your application and schedule an onboarding call within 48 hours, then send your placement letter and onboarding materials once you are accepted."
	}
];
var SIWES = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "EducationalOccupationalProgram",
					"name": "SIWES & Industrial Training Placement",
					"provider": {
						"@type": "EducationalOrganization",
						"name": "Tech Faculty NG",
						"url": "https://techfaculty.ng",
						"accreditation": "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) via NBTI"
					},
					"description": "Student Industrial Work Experience Scheme (SIWES) placements with two tracks: Learn & Pay for structured mentorship, or Tutor & Earn for skilled students to teach and get paid. Over 120 interns placed since 2022.",
					"educationalProgramMode": "onsite",
					"occupationalCategory": [
						"Software Development",
						"Data Science",
						"Cybersecurity",
						"AI/ML",
						"Digital Marketing"
					],
					"programType": "Internship",
					"timeToComplete": "P3M",
					"offers": [{
						"@type": "Offer",
						"name": "Learn & Pay Track",
						"description": "Structured mentorship with hands-on projects; regular course fee with up to 50% off for SIWES students, no separate placement fee"
					}, {
						"@type": "Offer",
						"name": "Tutor & Earn Track",
						"description": "Teach other students and earn during your IT placement"
					}],
					"url": "https://techfaculty.ng/siwes"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					url: "https://techfaculty.ng/siwes",
					dateModified: SIWES_UPDATED,
					mainEntity: siwesFaqs.map((f) => ({
						"@type": "Question",
						name: f.q,
						acceptedAnswer: {
							"@type": "Answer",
							text: f.a
						}
					}))
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-24 px-4 relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-30",
							style: {
								backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
								backgroundSize: "40px 40px"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-6",
									children: "SIWES / Industrial Training"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
									children: [
										"Do Your ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient",
											children: "IT"
										}),
										" With Tech Faculty NG"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8",
									children: "Over 120 university students have completed their SIWES/IT placement with us since 2022. Our program is regulated under Federal Ministry of Education policies. No separate placement fee on site. Choose Learn & Pay or Tutor & Earn — either way, you leave with real skills, a certificate, and industry connections."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdated, {
									date: SIWES_UPDATED,
									className: "-mt-4 mb-8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://wa.me/2348068597140?text=Hello%2C%20I'm%20a%20student%20interested%20in%20doing%20my%20SIWES%2FIT%20with%20Tech%20Faculty%20NG",
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 20
										}), "Apply Now"]
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredibilityBanner, { compact: true })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl md:text-4xl font-bold text-center mb-4",
									children: "Choose Your Track"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-muted-foreground mb-12 max-w-xl mx-auto",
									children: "Two pathways to complete your industrial training — pick the one that fits your goals."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
									children: tracks.map((track, idx) => {
										const Icon = track.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
											className: `border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${track.gradient}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
												className: "p-8",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "p-3 rounded-lg w-fit mb-4",
														style: { backgroundColor: `${track.color}20` },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
															className: "h-7 w-7",
															style: { color: track.color }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-2xl font-bold mb-1",
														children: track.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium mb-4",
														style: { color: track.color },
														children: track.subtitle
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground mb-6",
														children: track.description
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "space-y-3",
														children: track.features.map((feature, fIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-start gap-2 text-sm",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
																className: "h-4 w-4 mt-0.5 shrink-0",
																style: { color: track.color }
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feature })]
														}, fIdx))
													})
												]
											})
										}, idx);
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-12",
								children: "What Every Intern Gets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-6",
								children: whatYouGet.map((item, idx) => {
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: item.label
										})]
									}, idx);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "Not studying computer science?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8",
									children: "Engineering, media, statistics, business and OTM students do relevant industrial training here too. See the real work, logbook examples and what to confirm with your coordinator for your course."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: siwesCourses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: `/siwes/courses/${c.slug}`,
										className: "flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium hover:border-primary/50 hover:text-primary",
										children: [
											"SIWES for ",
											c.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												size: 16,
												className: "shrink-0 ml-2"
											})
										]
									}, c.slug))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/siwes/courses",
										className: "text-sm text-primary font-semibold hover:underline",
										children: "All courses, including computer science"
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "Can't attend in person? Do it virtually"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-10",
									children: "Both tracks — Learn & Pay and Tutor & Earn — also run fully online for students anywhere in Nigeria, and we handle your logbook by delivery so you never travel."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-primary/30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-3 rounded-xl bg-primary/10 w-fit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-5 w-5 text-primary" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-semibold text-lg",
													children: "Virtual IT placement — ₦45,000"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground leading-relaxed",
													children: "Placement letter for your school, weekly live sessions, a mentor, real project work, attendance records and your completion certificate — all online."
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-3 rounded-xl bg-primary/10 w-fit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "h-5 w-5 text-primary" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-semibold text-lg",
													children: "Logbook service — ₦15,000"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground leading-relaxed",
													children: "We arrange courier pickup of your logbook and ITF forms, review and complete the entries, sign and stamp them, then waybill everything back to you. On-site interns can use this too."
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center mt-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/virtual-siwes",
											children: ["See how Virtual SIWES works ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												className: "ml-2",
												size: 18
											})]
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-8",
								children: "How to Apply"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: [
									"Send us a WhatsApp message or email with your full name, school, department, and preferred track (Learn & Pay or Tutor & Earn).",
									"Include your IT duration (e.g., 3 months, 6 months) and preferred start date.",
									"We'll review your application and schedule an onboarding call within 48 hours.",
									"Once accepted, you'll receive your placement letter and onboarding materials.",
									"Prefer to stay in your city? Tell us you want the virtual IT track and we onboard you online instead."
								].map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 rounded-full bg-primary text-background font-bold text-sm flex items-center justify-center shrink-0",
										children: idx + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm md:text-base pt-1",
										children: step
									})]
								}, idx))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-8",
								children: "SIWES questions, answered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: siwesFaqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold mb-2",
										children: f.q
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: f.a
									})]
								}) }, f.q))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-24 px-4 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold mb-4",
									children: "Ready to Start Your IT?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground mb-8",
									children: [
										"Join 120+ students who've completed their industrial training with Tech Faculty NG and launched their tech careers. The ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "underline hover:text-primary",
											children: "World Economic Forum (2025)"
										}),
										" projects Africa's tech talent demand will grow 25% annually — start building your career now."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-4 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/2348068597140?text=Hello%2C%20I%20want%20to%20do%20my%20SIWES%2FIT%20with%20Tech%20Faculty%20NG",
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 18
											}), "Apply via WhatsApp"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "mailto:thetechfaculty@gmail.com",
											children: ["Email Us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
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
var SplitComponent = SIWES;
//#endregion
export { SplitComponent as component };
