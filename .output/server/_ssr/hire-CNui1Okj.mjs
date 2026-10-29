import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { Ft as CircleCheck, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { j as talentWhatsAppUrl, w as parseList } from "./talent-CymeyHOO.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { i as trackLead } from "./analytics-BrZRoVBL.mjs";
import { t as notifyHiringRequest } from "./public-requests.functions-2w0aaxeq.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/hire-CNui1Okj.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var benefits = [
	"Vetted Nigerian and African talent, matched to your brief in 48 hours",
	"Remote by default, on-site available in Anambra, Lagos and Abuja",
	"Start with one small project — no retainer, no platform fee to you",
	"A Tech Faculty project manager oversees delivery end to end"
];
var Hire = () => {
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		company: "",
		contact_name: "",
		email: "",
		phone: "",
		city: "",
		country: "Nigeria",
		project_title: "",
		description: "",
		skills_needed: "",
		budget_text: "",
		timeline: "",
		engagement: "project",
		selection_process: "direct"
	});
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const submit = async (e) => {
		e.preventDefault();
		if (!form.company.trim() || !form.contact_name.trim() || !form.phone.trim() || !form.project_title.trim() || !form.description.trim()) {
			toast({
				title: "Please fill the required fields",
				variant: "destructive"
			});
			return;
		}
		setSubmitting(true);
		try {
			const briefId = crypto.randomUUID();
			const { error } = await (await getSupabase()).from("business_briefs").insert({
				id: briefId,
				company: form.company.trim().slice(0, 160),
				contact_name: form.contact_name.trim().slice(0, 120),
				email: form.email.trim() || null,
				phone: form.phone.trim().slice(0, 40),
				city: form.city.trim().slice(0, 80) || null,
				country: form.country.trim() || "Nigeria",
				project_title: form.project_title.trim().slice(0, 160),
				description: form.description.trim().slice(0, 4e3),
				skills_needed: parseList(form.skills_needed),
				budget_text: form.budget_text.trim().slice(0, 160) || null,
				timeline: form.timeline.trim().slice(0, 160) || null,
				engagement: form.engagement,
				selection_process: form.selection_process
			});
			if (error) throw error;
			trackLead("hiring_request");
			setDone(true);
			const data = { id: briefId };
			if (data.id) try {
				await notifyHiringRequest({ data: { briefId: data.id } });
			} catch {}
		} catch (err) {
			toast({
				title: "Could not send your brief",
				description: err instanceof Error ? err.message : "Please try again or message us on WhatsApp.",
				variant: "destructive"
			});
		} finally {
			setSubmitting(false);
		}
	};
	const waMessage = `Hello Tech Faculty, I want to hire talent for my business${form.company ? ` (${form.company})` : ""}.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Service",
					name: "Hire vetted tech talent",
					serviceType: "Tech talent placement and project delivery",
					provider: {
						"@type": "Organization",
						name: "Tech Faculty NG",
						url: "https://techfaculty.ng"
					},
					areaServed: [{
						"@type": "Country",
						name: "Nigeria"
					}, {
						"@type": "Place",
						name: "Africa"
					}],
					description: "Tech Faculty matches businesses in Nigeria and Africa with vetted developers, data analysts, designers, marketers and support talent for remote and on-site work."
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-4 py-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto grid max-w-6xl gap-10 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl font-bold md:text-4xl",
									children: ["Need tech work done? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "We have the people."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed text-muted-foreground",
									children: "Tech Faculty trains and vets tech talent across Nigeria and Africa. Tell us the problem — a website that does not convert, records still on paper, a dashboard nobody built, marketing nobody runs — and we match the right people to it."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/talent/pool",
										className: "font-medium text-primary hover:underline",
										children: "Browse the talent directory →"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2.5 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 18,
												className: "mt-0.5 shrink-0 text-primary"
											}),
											" ",
											b
										]
									}, b))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: talentWhatsAppUrl(waMessage),
									target: "_blank",
									rel: "noopener noreferrer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 18
										}), " Rather talk on WhatsApp"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border bg-card p-6",
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 py-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										className: "mx-auto text-primary",
										size: 40
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl font-semibold",
										children: "Brief received"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Our team reviews every brief and comes back within two working days with a shortlist. For a faster reply, send us the same details on WhatsApp."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: talentWhatsAppUrl(waMessage),
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 18
										}), " Message us now"] })
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submit,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold",
										children: "Tell us what you need"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "company",
												children: "Business name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "company",
												value: form.company,
												onChange: (e) => set("company", e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "contact_name",
												children: "Your name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "contact_name",
												value: form.contact_name,
												onChange: (e) => set("contact_name", e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "phone",
												children: "Phone or WhatsApp *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "phone",
												value: form.phone,
												onChange: (e) => set("phone", e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "email",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email",
												type: "email",
												value: form.email,
												onChange: (e) => set("email", e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "city",
												children: "City"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "city",
												value: form.city,
												onChange: (e) => set("city", e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "country",
												children: "Country"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "country",
												value: form.country,
												onChange: (e) => set("country", e.target.value)
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "project_title",
										children: "What do you need done? *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "project_title",
										value: form.project_title,
										onChange: (e) => set("project_title", e.target.value),
										placeholder: "Website and online ordering for my shop"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "description",
										children: "Describe it *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "description",
										rows: 5,
										value: form.description,
										onChange: (e) => set("description", e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "skills_needed",
										children: "Skills or roles you think you need"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "skills_needed",
										value: form.skills_needed,
										onChange: (e) => set("skills_needed", e.target.value),
										placeholder: "Web developer, designer"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "budget_text",
												children: "Budget"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "budget_text",
												value: form.budget_text,
												onChange: (e) => set("budget_text", e.target.value),
												placeholder: "₦300,000"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "timeline",
												children: "Timeline"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "timeline",
												value: form.timeline,
												onChange: (e) => set("timeline", e.target.value),
												placeholder: "4 weeks"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Engagement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: form.engagement,
												onValueChange: (v) => set("engagement", v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "project",
														children: "One project"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "ongoing",
														children: "Ongoing support"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "hire",
														children: "Full-time hire"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "intern",
														children: "Intern or trainee"
													})
												] })]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Do you want to test or interview talent first?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.selection_process,
													onValueChange: (v) => set("selection_process", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "direct",
															children: "No, start straight away"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "assessment",
															children: "Yes, a short assessment"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "interview",
															children: "Yes, an interview"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "assessment_interview",
															children: "Both an assessment and an interview"
														})
													] })]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "w-full",
										disabled: submitting,
										children: submitting ? "Sending…" : "Send my brief"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-center text-xs text-muted-foreground",
										children: [
											"Looking for work instead? ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/talent",
												className: "text-primary hover:underline",
												children: "Join the talent pool"
											}),
											"."
										]
									})
								]
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Hire;
//#endregion
export { SplitComponent as component };
