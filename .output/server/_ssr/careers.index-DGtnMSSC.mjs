import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { i as useUser } from "./UserContext-uFGsrvio.mjs";
import { C as Sparkles, Ft as CircleCheck, Xt as BriefcaseBusiness, in as ArrowRight, j as Search, l as UserRoundSearch, q as MessageCircle, u as UserPlus } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { O as roleLocationLabel, g as fetchPublishedRoles, j as talentWhatsAppUrl, r as EMPLOYMENT_LABEL, w as parseList } from "./talent-CymeyHOO.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { i as trackLead } from "./analytics-BrZRoVBL.mjs";
import { t as jobPlatforms } from "./jobPlatforms-BS18fzAf.mjs";
import { t as RoleCard } from "./RoleCard-BZWs0FcC.mjs";
import { t as notifyHiringRequest } from "./public-requests.functions-2w0aaxeq.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/careers.index-DGtnMSSC.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var PlatformPartners = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
	"aria-labelledby": "external-platforms-heading",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "external-platforms-heading",
			className: "text-xl md:text-2xl font-bold",
			children: "External work platforms"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Independent platforms where you can find additional AI and remote work. These are not Tech Faculty roles."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
		children: jobPlatforms.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-border rounded-lg p-5 bg-card space-y-4 flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-lg",
					children: platform.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: platform.blurb
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: platform.signupUrl,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						variant: "outline",
						size: "sm",
						"aria-label": `Get started with ${platform.name}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
								size: 14,
								className: "mr-2"
							}),
							"Get Started with ",
							platform.name
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: `/careers/platforms/${platform.slug}`,
					className: "inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: [
						"View ",
						platform.name,
						" jobs",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })
					]
				})]
			})]
		}, platform.name))
	})]
});
/** Compact hiring request form for clients browsing the roles marketplace. */
var HiringRequestForm = () => {
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		company: "",
		contact_name: "",
		phone: "",
		email: "",
		project_title: "",
		description: "",
		skills_needed: "",
		engagement: "project"
	});
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const waMessage = `Hello Tech Faculty, I want to hire talent${form.company ? ` for ${form.company}` : ""}.`;
	const submit = async (event) => {
		event.preventDefault();
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
				phone: form.phone.trim().slice(0, 40),
				email: form.email.trim().slice(0, 160) || null,
				country: "Nigeria",
				project_title: form.project_title.trim().slice(0, 160),
				description: form.description.trim().slice(0, 4e3),
				skills_needed: parseList(form.skills_needed),
				engagement: form.engagement
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
				title: "Could not send your request",
				description: err instanceof Error ? err.message : "Please try again or message us on WhatsApp.",
				variant: "destructive"
			});
		} finally {
			setSubmitting(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 rounded-lg border border-border bg-card p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
				className: "mx-auto text-primary",
				size: 40
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-semibold",
				children: "Request received"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "We sent a confirmation to your email and our team comes back within two working days with matched talent."
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
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4 rounded-lg border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "hr-company",
						children: "Business name *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "hr-company",
						value: form.company,
						onChange: (e) => set("company", e.target.value),
						maxLength: 160
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "hr-name",
						children: "Your name *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "hr-name",
						value: form.contact_name,
						onChange: (e) => set("contact_name", e.target.value),
						maxLength: 120
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "hr-phone",
						children: "Phone or WhatsApp *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "hr-phone",
						value: form.phone,
						onChange: (e) => set("phone", e.target.value),
						maxLength: 40
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "hr-email",
						children: "Email (for your confirmation)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "hr-email",
						type: "email",
						value: form.email,
						onChange: (e) => set("email", e.target.value),
						maxLength: 160
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "hr-title",
				children: "What do you need done? *"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "hr-title",
				value: form.project_title,
				onChange: (e) => set("project_title", e.target.value),
				placeholder: "Website and online ordering for my shop",
				maxLength: 160
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "hr-description",
				children: "Describe it *"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "hr-description",
				rows: 4,
				value: form.description,
				onChange: (e) => set("description", e.target.value),
				maxLength: 4e3
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "hr-skills",
					children: "Skills or roles you need"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "hr-skills",
					value: form.skills_needed,
					onChange: (e) => set("skills_needed", e.target.value),
					placeholder: "Web developer, designer",
					maxLength: 200
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Engagement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
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
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: submitting,
				children: submitting ? "Sending…" : "Send hiring request"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: "We introduce you to matched talent on WhatsApp. Talent contact details and CVs stay private."
			})
		]
	});
};
var steps = [
	{
		icon: UserRoundSearch,
		title: "Build one profile",
		body: "Add your skills, CV, availability and preferred rate once, then keep improving your profile."
	},
	{
		icon: Sparkles,
		title: "Receive reviewed matches",
		body: "Our system scores suitable roles, and our team reviews every match before sharing it with you."
	},
	{
		icon: BriefcaseBusiness,
		title: "Apply and get hired",
		body: "Apply to Tech Faculty openings and approved client projects directly with your talent profile."
	}
];
var Careers = () => {
	const { isLoggedIn, facultyId, userData } = useUser();
	const [search, setSearch] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [workplace, setWorkplace] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const { data: roles = [], isLoading } = useQuery({
		queryKey: ["talent-roles-careers"],
		queryFn: () => fetchPublishedRoles(),
		staleTime: 6e5
	});
	const types = (0, import_react.useMemo)(() => Array.from(new Set(roles.map((role) => role.employment_type))).sort(), [roles]);
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(roles.map((role) => role.category).filter(Boolean))).sort(), [roles]);
	const filtered = (0, import_react.useMemo)(() => {
		const query = search.trim().toLowerCase();
		return roles.filter((role) => {
			if (type !== "all" && role.employment_type !== type) return false;
			if (category !== "all" && role.category !== category) return false;
			if (workplace === "remote" && !role.is_remote) return false;
			if (workplace === "onsite" && role.is_remote) return false;
			if (!query) return true;
			return `${role.title} ${role.company} ${role.summary} ${role.description} ${role.category ?? ""} ${role.required_skills.join(" ")} ${roleLocationLabel(role)}`.toLowerCase().includes(query);
		});
	}, [
		roles,
		search,
		type,
		workplace,
		category
	]);
	const totalOpenings = (0, import_react.useMemo)(() => filtered.reduce((sum, role) => sum + (role.openings ?? 1), 0), [filtered]);
	const joinHref = isLoggedIn ? "/talent/profile" : "/login?next=/talent/profile";
	const itemList = filtered.map((role, index) => ({
		"@type": "ListItem",
		position: index + 1,
		url: `https://techfaculty.ng/talent/roles/${role.slug}`,
		name: `${role.title} at ${role.company}`
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "CollectionPage",
					name: "Tech Faculty Careers and Talent Marketplace",
					description: "A talent marketplace matching skilled African professionals to Tech Faculty and approved client roles.",
					url: "https://techfaculty.ng/careers",
					mainEntity: {
						"@type": "ItemList",
						numberOfItems: itemList.length,
						itemListElement: itemList
					}
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-12 md:py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-sm font-semibold text-primary",
									children: "Tech Faculty Talent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl font-bold md:text-5xl",
									children: ["One profile. Real roles. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "Work that matters."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg",
									children: "We connect skilled people across Nigeria and Africa with Tech Faculty openings and approved business projects. Build your profile once and get matched as new work becomes available."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: joinHref,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "lg",
												children: isLoggedIn ? "Enter talent portal" : "Join as talent"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/hire",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "lg",
												variant: "outline",
												children: "Hire talent"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/talent/pool",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "lg",
												variant: "ghost",
												children: "Browse the talent directory"
											})
										})
									]
								}),
								isLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mx-auto mt-5 max-w-md rounded-lg border border-border bg-card p-4 text-sm",
									children: [userData?.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: ["Signed in as ", userData.name]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "You are signed in"
									}), facultyId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-muted-foreground",
										children: ["Your Faculty ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: facultyId
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-muted-foreground",
										children: "No Faculty ID needed to apply. You get one when you enrol in a programme, or the moment your talent profile is 100% complete."
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-y border-border bg-card/40 px-4 py-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto grid max-w-5xl gap-6 md:grid-cols-3",
							children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
												size: 18,
												className: "text-primary"
											}),
											" Step ",
											index + 1
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold",
										children: step.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: step.body
									})
								]
							}, step.title))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-16",
						"aria-labelledby": "open-roles-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-7 flex flex-wrap items-end justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										id: "open-roles-heading",
										className: "text-2xl font-bold md:text-3xl",
										children: "Open roles"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "Roles from Tech Faculty and businesses using our talent pipeline."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted-foreground",
										children: [
											filtered.length,
											" ",
											filtered.length === 1 ? "role" : "roles",
											" · ",
											totalOpenings,
											" ",
											totalOpenings === 1 ? "opening" : "openings"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_11rem_11rem]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
												className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
												size: 16
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: search,
												onChange: (event) => setSearch(event.target.value),
												placeholder: "Search role, skill, company or location",
												className: "pl-9",
												"aria-label": "Search open roles"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: category,
											onValueChange: setCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by category",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All categories"
											}), categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: item,
												children: item
											}, item))] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: type,
											onValueChange: setType,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by role type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role type" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All role types"
											}), types.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: item,
												children: EMPLOYMENT_LABEL[item] ?? item
											}, item))] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: workplace,
											onValueChange: setWorkplace,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by workplace",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Workplace" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "Any workplace"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "remote",
													children: "Remote friendly"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "onsite",
													children: "On-site"
												})
											] })]
										})
									]
								}),
								isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
									children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-card" }, index))
								}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
									children: filtered.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, { role }, role.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-10 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "No roles match those filters right now."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: joinHref,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "mt-5",
											variant: "outline",
											children: "Complete my profile for future matches"
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "hire",
						className: "border-t border-border bg-card/40 px-4 py-16",
						"aria-labelledby": "hire-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										id: "hire-heading",
										className: "text-2xl font-bold md:text-3xl",
										children: "Hiring instead? Request talent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: "Tell us what your business needs and we introduce you to matched talent from our pipeline. A Tech Faculty project manager oversees the work, so you get delivery, not just a contact."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "You get an email confirmation immediately, and a shortlist within two working days."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/talent/pool",
											className: "font-medium text-primary hover:underline",
											children: "Browse the talent directory →"
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiringRequestForm, {})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-t border-border px-4 py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-6xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformPartners, {})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Careers;
//#endregion
export { SplitComponent as component };
