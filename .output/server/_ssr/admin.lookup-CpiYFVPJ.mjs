import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle, j as Search } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.lookup-CpiYFVPJ.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Quotes, backslashes and wildcards would break the quoted or() values below. */
/**
* Admin: find students by name, email, phone or Faculty ID. Looks in both
* profiles (signed-up accounts) and faculty_ids (registrations), merged by
* Faculty ID so each student appears once.
*/
var searchStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ q: stringType().trim().min(2).max(100) }).parse(d)).handler(createSsrRpc("be9bb7d87bc6dd7c4035a7f9bedac9af355914c988cb39806861bbb42cd5583d"));
var RecordInput = objectType({
	facultyId: stringType().trim().min(1).max(50).optional(),
	userId: stringType().uuid().optional()
}).refine((d) => d.facultyId || d.userId, "Faculty ID or user id required");
/** Admin: one student's profile, enrolments, payments, work scores and certificates. */
var getStudentRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RecordInput.parse(d)).handler(createSsrRpc("311ded73cc9f7d716acfb807c14437e140c67f850f7b905aeb36e2eb205406bd"));
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var date = (s) => s ? new Date(s).toLocaleDateString() : "—";
var money = (n, currency) => n == null ? "—" : `${currency === "NGN" || !currency ? "₦" : `${currency} `}${Number(n).toLocaleString()}`;
var digits = (phone) => phone.replace(/\D/g, "").replace(/^0/, "234");
var STATUS_VARIANT = {
	active: "default",
	paid: "default",
	completed: "default",
	reviewed: "default",
	pending: "secondary",
	submitted: "secondary",
	cancelled: "destructive",
	needs_changes: "destructive"
};
var StatusBadge = ({ status }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
	variant: STATUS_VARIANT[status] ?? "outline",
	children: status.replace(/_/g, " ")
});
function Section({ title, count, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-semibold",
			children: [
				title,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground font-normal",
					children: [
						"(",
						count,
						")"
					]
				})
			]
		}), count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "None yet."
		}) : children]
	}) });
}
/** Admin: find a student by name, phone, email or Faculty ID and see their whole record. */
function AdminLookup() {
	const { loading, isAdmin } = useIsStaff();
	const search = useServerFn(searchStudents);
	const fetchRecord = useServerFn(getStudentRecord);
	const [q, setQ] = (0, import_react.useState)("");
	const [matches, setMatches] = (0, import_react.useState)(null);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [record, setRecord] = (0, import_react.useState)(null);
	const [opening, setOpening] = (0, import_react.useState)(null);
	const onSearch = async (e) => {
		e.preventDefault();
		if (q.trim().length < 2) {
			toast.error("Type at least 2 characters");
			return;
		}
		setSearching(true);
		setRecord(null);
		try {
			const found = await search({ data: { q } });
			setMatches(found);
			if (found.length === 1) await open(found[0]);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSearching(false);
		}
	};
	const open = async (m) => {
		const key = m.facultyId ?? m.userId ?? "";
		setOpening(key);
		try {
			setRecord(await fetchRecord({ data: m.facultyId ? { facultyId: m.facultyId } : { userId: m.userId } }));
		} catch (err) {
			toast.error(err.message);
		} finally {
			setOpening(null);
		}
	};
	const paid = record?.enrollments.filter((e) => e.status === "active" || e.paid_at) ?? [];
	const totalPaid = paid.reduce((s, e) => s + (e.amount_due ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Student lookup"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Search by name, phone, email or Faculty ID to see a student's enrolments, payments, work and certificates together."
					})] }),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This page is for Tech Faculty admins. Sign in with an admin account."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/login?next=/admin/lookup",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onSearch,
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								maxLength: 100,
								autoFocus: true,
								placeholder: "e.g. Chioma, 0803 123 4567 or TF-2026-0012",
								"aria-label": "Search students"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: searching,
								children: [searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2",
									children: "Search"
								})]
							})]
						}),
						matches && !record && (matches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"No student matches \"",
								q,
								"\"."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y rounded-md border",
							children: matches.map((m) => {
								const key = m.facultyId ?? m.userId ?? "";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => open(m),
									disabled: opening !== null,
									className: "w-full text-left px-4 py-3 hover:bg-muted flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted-foreground truncate",
											children: [
												m.facultyId ?? "No Faculty ID",
												m.phone,
												m.email
											].filter(Boolean).join(" · ")
										})]
									}), opening === key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin shrink-0" })]
								}) }, key);
							})
						})),
						record && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								matches && matches.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setRecord(null),
									children: [
										"Back to ",
										matches.length,
										" results"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xl font-bold",
											children: record.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: record.facultyId ?? "No Faculty ID yet"
										})] }), !record.userId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: "Registered, no account yet"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Phone",
												children: record.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													record.phone,
													" ·",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														className: "underline",
														href: `https://wa.me/${digits(record.phone)}`,
														target: "_blank",
														rel: "noreferrer",
														children: "WhatsApp"
													})
												] }) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Email",
												children: record.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													className: "underline break-all",
													href: `mailto:${record.email}`,
													children: record.email
												}) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Department",
												children: record.department ?? record.courseInterest ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Learning mode",
												children: record.learningMode ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Cohort",
												children: record.cohort ? `${MONTHS[record.cohort.month - 1]} ${record.cohort.year}` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Slack group",
												children: record.slackChannel ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Registered",
												children: date(record.registeredAt)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Account created",
												children: date(record.signedUpAt)
											}),
											record.heardAboutUs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Heard about us",
												children: record.heardAboutUs
											})
										]
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
									title: "Enrolments and payments",
									count: record.enrollments.length,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [
												"Paid so far:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: money(totalPaid, "NGN")
												}),
												" ",
												"across ",
												paid.length,
												" enrolment",
												paid.length === 1 ? "" : "s",
												"."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-2",
											children: record.enrollments.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "rounded-md border p-3 text-sm space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-medium",
															children: [e.plan_name, e.learning_mode ? ` · ${e.learning_mode}` : ""]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-muted-foreground",
														children: [
															money(e.amount_due, e.currency),
															" · started",
															" ",
															date(e.created_at),
															e.paid_at ? ` · paid ${date(e.paid_at)}` : "",
															e.coupon_code ? ` · coupon ${e.coupon_code}` : ""
														]
													}),
													(e.payment_reference || e.tx_ref) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted-foreground break-all",
														children: [e.payment_reference?.startsWith("manual:") ? "Marked paid by hand" : e.payment_reference ? `Ref ${e.payment_reference}` : "", e.tx_ref ? `${e.payment_reference ? " · " : ""}Tx ${e.tx_ref}` : ""]
													})
												]
											}, e.id))
										}),
										record.enrollments.some((e) => e.status === "pending") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Confirm pending payments on",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: "/admin/students",
													className: "underline",
													children: "Students"
												}),
												"."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Courses",
									count: record.courses.length,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: record.courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex flex-wrap items-center justify-between gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													" ",
													"· since ",
													date(c.enrollmentDate),
													c.progress ? ` · ${c.progress.progress_percentage}% done${c.progress.classes_completed ? `, ${c.progress.classes_completed} classes` : ""}` : ""
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })]
										}, c.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
									title: "Work",
									count: record.work.length,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [
											"Running score:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: record.averageScore != null ? `${record.averageScore}%` : "not scored yet"
											}),
											record.reviewedCount ? ` over ${record.reviewedCount} scored` : "",
											"."
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: record.work.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "rounded-md border p-3 text-sm space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-medium",
														children: [w.class_number ? `Class ${w.class_number}: ` : "", w.title]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [w.score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-medium",
															children: [w.score, "%"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: w.status })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-muted-foreground",
													children: [
														w.course_name ?? "Programme",
														" · ",
														date(w.created_at)
													]
												}),
												w.proof_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: w.proof_url,
													target: "_blank",
													rel: "noreferrer",
													className: "text-xs underline break-all",
													children: w.proof_url
												}),
												w.reviewer_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs border-l-2 pl-2 text-muted-foreground",
													children: w.reviewer_note
												})
											]
										}, w.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Certificates",
									count: record.certificates.length,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: record.certificates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex flex-wrap items-center justify-between gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: c.course_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													" ",
													"· ",
													c.certificate_type,
													" ·",
													" ",
													date(c.date_issued ?? c.issued_at ?? c.created_at)
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: `/verify/${c.certificate_number}`,
												className: "underline",
												children: c.certificate_number
											})]
										}, c.id))
									})
								})
							]
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: "text-muted-foreground shrink-0",
			children: [label, ":"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "min-w-0",
			children
		})]
	});
}
var SplitComponent = AdminLookup;
//#endregion
export { SplitComponent as component };
