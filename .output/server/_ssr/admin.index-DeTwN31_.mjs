import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, F as Radar, Kt as CalendarClock, P as RefreshCw, Xt as BriefcaseBusiness, dt as GraduationCap, j as Search, nn as Award, ot as Inbox, pt as Gift, st as History } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { n as withWhatsAppWaiting, t as needsYouTodayRows } from "./needs-you-today-DelbY8Yw.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.index-DeTwN31_.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var num$1 = (n) => n.toLocaleString();
/** Share of `part` in `whole` as a whole-number percentage, or "—" when there is nothing to divide. */
function percent(part, whole) {
	return whole > 0 ? `${Math.round(part / whole * 100)}%` : "—";
}
var TOP_SOURCES = 8;
/** Leads -> checkouts started -> paid for the chosen period, with a per-page breakdown. */
function ConversionFunnel({ days }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setError(null);
		(async () => {
			try {
				const supabase = await getSupabase();
				const { data: result, error: rpcError } = await supabase.rpc.call(supabase, "admin_conversion_funnel", { _days: days });
				if (rpcError) throw new Error(rpcError.message);
				if (!cancelled) setData(result);
			} catch (e) {
				if (!cancelled) setError(e.message);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [days]);
	const period = `last ${days} days`;
	const steps = data ? [
		{
			label: "Leads",
			value: data.leads,
			hint: "Left their email or WhatsApp number"
		},
		{
			label: "Started checkout",
			value: data.checked_out,
			hint: "Then began a paid enrolment"
		},
		{
			label: "Paid",
			value: data.paid,
			hint: "Payment confirmed online or by an admin"
		}
	] : [];
	const max = Math.max(1, data?.leads ?? 0);
	const top = data?.by_source.slice(0, TOP_SOURCES) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold text-sm",
				children: ["Lead conversion, ", period]
			}), data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [percent(data.paid, data.leads), " of leads paid"]
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-destructive",
			children: ["Couldn't load the funnel: ", error]
		}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				role: "img",
				"aria-label": `Of ${data.leads} leads, ${data.checked_out} started checkout and ${data.paid} paid`,
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [" · ", s.hint]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [num$1(s.value), i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									" ",
									"(",
									percent(s.value, steps[i - 1].value),
									" of previous)"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-3 rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary/80",
							style: { width: s.value > 0 ? `max(4px, ${s.value / max * 100}%)` : 0 }
						})
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-muted-foreground",
					children: "By source page"
				}), data.by_source.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"No leads in the ",
						period,
						"."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 pr-2 font-normal",
									children: "Page"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2 font-normal text-right",
									children: "Leads"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2 font-normal text-right",
									children: "Checkout"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2 font-normal text-right",
									children: "Paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 pl-2 font-normal text-right",
									children: "Lead to paid"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (showAll ? data.by_source : top).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTableRow, { row: r }, r.page)) })]
					}), data.by_source.length > TOP_SOURCES && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-1 text-xs text-muted-foreground underline",
						onClick: () => setShowAll((v) => !v),
						children: showAll ? "Show fewer pages" : `Show all ${data.by_source.length} pages`
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"A lead counts as converted when a student with the same email or phone number started a paid checkout after leaving it. All checkouts in the ",
					period,
					", from leads or not:",
					" ",
					num$1(data.all_checkouts.started),
					" started,",
					" ",
					num$1(data.all_checkouts.paid),
					" paid."
				]
			})
		] })]
	}) });
}
function SourceTableRow({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-1 pr-2 max-w-[16rem] truncate",
				title: row.page,
				children: row.page
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-1 px-2 text-right tabular-nums",
				children: num$1(row.leads)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-1 px-2 text-right tabular-nums",
				children: num$1(row.checked_out)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-1 px-2 text-right tabular-nums",
				children: num$1(row.paid)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-1 pl-2 text-right tabular-nums",
				children: percent(row.paid, row.leads)
			})
		]
	});
}
var PERIODS = [
	7,
	30,
	90,
	365
];
var METHOD_LABELS = {
	bank: "bank",
	whatsapp: "WhatsApp",
	cash: "cash",
	card: "card",
	other: "other"
};
var num = (n) => n.toLocaleString();
function money(list) {
	if (list.length === 0) return "—";
	return list.map(({ currency, amount }) => {
		try {
			return new Intl.NumberFormat(void 0, {
				style: "currency",
				currency,
				maximumFractionDigits: 0
			}).format(amount);
		} catch {
			return `${currency} ${num(Math.round(amount))}`;
		}
	}).join(" + ");
}
function monthLabel(ym) {
	const [y, m] = ym.split("-").map(Number);
	return new Date(y, m - 1, 1).toLocaleDateString(void 0, { month: "short" });
}
function last12Months() {
	const now = /* @__PURE__ */ new Date();
	return Array.from({ length: 12 }, (_, i) => {
		const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	});
}
function Stat({ label, value, hint, to }) {
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `h-full ${to ? "transition-colors hover:border-primary/50" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg sm:text-2xl font-bold tabular-nums leading-tight",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: hint
				})
			]
		})
	});
	return to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
		to,
		children: body
	}) : body;
}
/** One-series monthly bar chart. Each bar shows its exact value on hover and in the label row. */
function MonthBars({ title, points, format }) {
	const max = Math.max(1, ...points.map((p) => p.value));
	const total = points.reduce((s, p) => s + p.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-sm",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["12 months: ", format(total)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-36 items-end gap-[2px] border-b border-border",
				role: "img",
				"aria-label": `${title}, last 12 months`,
				children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "group relative flex h-full flex-1 items-end",
					title: `${monthLabel(p.month)} ${p.month.slice(0, 4)}: ${format(p.value)}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full rounded-t-[4px] bg-primary/80 group-hover:bg-primary",
						style: { height: p.value > 0 ? `max(2px, ${p.value / max * 100}%)` : 0 }
					})
				}, p.month))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-[2px] text-[10px] text-muted-foreground",
				children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-center",
					children: monthLabel(p.month).slice(0, 1)
				}, p.month))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer text-muted-foreground",
					children: "Show as table"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "mt-2 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-1",
							children: [
								monthLabel(p.month),
								" ",
								p.month.slice(0, 4)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-right tabular-nums",
							children: format(p.value)
						})]
					}, p.month)) })
				})]
			})
		]
	}) });
}
function Breakdown({ title, rows }) {
	const max = Math.max(1, ...rows.map((r) => r.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold text-sm",
			children: title
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Nothing yet."
		}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: r.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-muted-foreground",
					children: num(r.count)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-primary/80",
					style: { width: `${r.count / max * 100}%` }
				})
			})]
		}, r.label))]
	}) });
}
/** Admin-only overview of students, payments, revenue, learning and talent. */
function AdminMetrics() {
	const [days, setDays] = (0, import_react.useState)(30);
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const load = async (period) => {
		setBusy(true);
		setError(null);
		try {
			const supabase = await getSupabase();
			const { data: result, error: rpcError } = await supabase.rpc.call(supabase, "admin_dashboard_metrics", { _days: period });
			if (rpcError) throw new Error(rpcError.message);
			setData(result);
		} catch (e) {
			setError(e.message);
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load(days);
	}, [days]);
	const months = last12Months();
	const mainCurrency = data?.revenue.total[0]?.currency ?? "NGN";
	const revenuePoints = months.map((month) => ({
		month,
		value: data?.revenue.by_month.filter((r) => r.month === month && r.currency === mainCurrency).reduce((s, r) => s + r.amount, 0) ?? 0
	}));
	const signupPoints = months.map((month) => ({
		month,
		value: data?.students.signups_by_month.find((s) => s.month === month)?.count ?? 0
	}));
	const formatMain = (n) => money([{
		currency: mainCurrency,
		amount: n
	}]);
	const period = `last ${days} days`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: days === p ? "default" : "outline",
					onClick: () => setDays(p),
					children: p === 365 ? "1 year" : `${p} days`
				}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => void load(days),
					disabled: busy,
					"aria-label": "Refresh",
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
				})]
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-destructive",
			children: ["Couldn't load the numbers: ", error]
		}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `space-y-6 ${busy ? "opacity-60" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "Revenue and payments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: `Revenue, ${period}`,
								value: money(data.revenue.in_period)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Revenue, all time",
								value: money(data.revenue.total),
								hint: data.payments.without_amount ? `${num(data.payments.without_amount)} paid plans have no amount recorded` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: `Payments confirmed, ${period}`,
								value: num(data.payments.confirmed_in_period),
								hint: [`${num(data.payments.online)} online · ${num(data.payments.manual)} marked by admin · ${num(data.payments.confirmed)} total`, ...(data.payments.by_method ?? []).map((m) => `${num(m.count)} ${METHOD_LABELS[m.method] ?? m.method}`)].join(" · ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Waiting on payment",
								value: num(data.payments.pending),
								hint: data.payments.pending_value.length ? `Worth ${money(data.payments.pending_value)}` : `${num(data.payments.cancelled)} cancelled`,
								to: "/admin/students"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBars, {
						title: `Revenue by month (${mainCurrency})`,
						points: revenuePoints,
						format: formatMain
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBars, {
						title: "New students by month",
						points: signupPoints,
						format: num
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "Students"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Students",
								value: num(data.students.total),
								hint: "With a Faculty ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: `New students, ${period}`,
								value: num(data.students.new_in_period)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "With course access",
								value: num(data.students.with_access),
								hint: "Free or paid-up plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Paying students",
								value: num(data.students.paying)
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, {
							title: "Top paid plans",
							rows: data.revenue.top_plans.map((p) => ({
								label: p.plan,
								count: p.count
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, {
							title: "Students by department",
							rows: data.students.by_department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, {
							title: "Students by learning mode",
							rows: data.students.by_learning_mode
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "Learning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Work awaiting review",
								value: num(data.learning.awaiting_review),
								hint: `${num(data.learning.needs_changes)} sent back for changes`,
								to: "/admin/students"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: `Work submitted, ${period}`,
								value: num(data.learning.submitted_in_period),
								hint: `${num(data.learning.accepted)} accepted all time`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Average score",
								value: data.learning.average_score != null ? `${data.learning.average_score}%` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Certificates issued",
								value: num(data.learning.certificates),
								hint: `${num(data.learning.certificates_in_period)} in the ${period}`,
								to: "/admin/certificates"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "Talent and hiring"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Talent profiles",
								value: num(data.talent.profiles),
								hint: `${num(data.talent.vetted)} vetted · ${num(data.talent.public)} public · ${num(data.talent.new_profiles_in_period)} new`,
								to: "/admin/talent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Open roles",
								value: num(data.talent.published_roles),
								hint: `${num(data.talent.applications_in_period)} applications in the ${period}`,
								to: "/admin/talent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Active engagements",
								value: num(data.talent.active_engagements),
								hint: data.talent.weekly_payroll.length ? `${money(data.talent.weekly_payroll)} a week` : void 0,
								to: "/admin/talent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "New requests to handle",
								value: num(data.talent.new_interest_requests + data.talent.new_business_briefs),
								hint: `${num(data.talent.new_interest_requests)} talent intros · ${num(data.talent.new_business_briefs)} business briefs`,
								to: "/admin/talent"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: `Leads, ${period}`,
						value: num(data.leads.in_period),
						hint: `${num(data.leads.total)} all time`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, {
							title: `Lead interests, ${period}`,
							rows: data.leads.by_interest
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversionFunnel, { days }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Updated ",
						new Date(data.generated_at).toLocaleString(),
						". Revenue counts confirmed paid plans with a recorded amount."
					]
				})
			]
		})]
	});
}
/**
* Resubmits every sitemap URL to IndexNow (Bing, Yandex and others). The weekly
* blog job pings on its own; this is for posts or pages changed by hand.
*/
function NotifySearchEngines() {
	const { toast } = useToast();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const notify = async () => {
		setBusy(true);
		const { data, error } = await (await getSupabase()).functions.invoke("indexnow-ping", { body: {} });
		setBusy(false);
		if (error || !data?.ok) {
			toast({
				title: "Search engines not notified",
				description: data?.error ?? error?.message ?? `IndexNow returned ${data?.status}`,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "Search engines notified",
			description: `Sent ${data.sent} URLs to IndexNow.`
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "h-5 w-5 text-primary" }), "Notify search engines"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "After publishing or editing a post or page by hand, send the sitemap to Bing and other IndexNow engines."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: notify,
			disabled: busy,
			children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Notify now"]
		})]
	}) });
}
/** Admin strip at the top of /admin: what is waiting, each linking to its page. */
function NeedsYouToday() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const supabase = await getSupabase();
			const { data, error } = await supabase.rpc("admin_needs_you_today");
			if (!active) return;
			if (error) setError(error.message);
			else {
				const counts = await withWhatsAppWaiting(data, () => supabase.rpc("whatsapp_chats_waiting"));
				if (active) setRows(needsYouTodayRows(counts));
			}
		})();
		return () => {
			active = false;
		};
	}, []);
	const total = rows?.reduce((n, r) => n + r.count, 0) ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-semibold",
			children: "Needs you today"
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: ["Could not load the queues: ", error]
		}) : !rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
				to: r.path,
				className: "group",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: `h-full transition-colors group-hover:border-primary/50 ${r.count > 0 ? "border-primary/40" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-2xl font-bold ${r.count > 0 ? "text-primary" : "text-muted-foreground"}`,
							children: r.count
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: r.label
						})]
					})
				})
			}, r.key))
		}), total === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nothing is waiting. A summary is emailed each morning when something is."
		})] })]
	});
}
/** Parses one cron field ("*", "5", "1,15", "1-5", "*\/2") into the values it allows. */
function parseField(field, min, max) {
	const values = /* @__PURE__ */ new Set();
	for (const part of field.split(",")) {
		const [range, stepText] = part.split("/");
		const step = stepText ? Number(stepText) : 1;
		let lo = min;
		let hi = max;
		if (range !== "*") {
			const [a, b] = range.split("-").map(Number);
			lo = a;
			hi = b ?? (stepText ? max : a);
		}
		if (![
			lo,
			hi,
			step
		].every(Number.isInteger) || step < 1 || lo < min || hi > max) return null;
		for (let v = lo; v <= hi; v += step) values.add(v);
	}
	return values;
}
/**
* The most recent time at or before `now` that a standard 5-field pg_cron schedule fired,
* read in UTC as pg_cron does. Returns null for schedules it cannot read (e.g. "30 seconds")
* or when nothing matched in the last 62 days.
*/
function previousCronRun(schedule, now = /* @__PURE__ */ new Date()) {
	const fields = schedule.trim().split(/\s+/);
	if (fields.length !== 5) return null;
	const [minF, hourF, domF, monF, dowF] = fields;
	const minutes = parseField(minF, 0, 59);
	const hours = parseField(hourF, 0, 23);
	const days = parseField(domF, 1, 31);
	const months = parseField(monF, 1, 12);
	const weekdays = parseField(dowF.replace(/\b7\b/g, "0"), 0, 6);
	if (!minutes || !hours || !days || !months || !weekdays) return null;
	const dayMatches = (d) => {
		const dom = days.has(d.getUTCDate());
		const dow = weekdays.has(d.getUTCDay());
		if (domF === "*" && dowF === "*") return true;
		if (domF === "*") return dow;
		if (dowF === "*") return dom;
		return dom || dow;
	};
	const t = new Date(now);
	t.setUTCSeconds(0, 0);
	const stop = now.getTime() - 53568e5;
	while (t.getTime() >= stop) {
		if (!months.has(t.getUTCMonth() + 1) || !dayMatches(t)) {
			t.setUTCHours(0, 0, 0, 0);
			t.setUTCMinutes(-1);
			continue;
		}
		if (!hours.has(t.getUTCHours())) {
			t.setUTCMinutes(0);
			t.setUTCMinutes(-1);
			continue;
		}
		if (minutes.has(t.getUTCMinutes())) return t;
		t.setUTCMinutes(t.getUTCMinutes() - 1);
	}
	return null;
}
var ordinal = (n) => `${n}${[
	11,
	12,
	13
].includes(n % 100) ? "th" : [
	"th",
	"st",
	"nd",
	"rd"
][n % 10] ?? "th"}`;
var WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
/** Plain-English wording for common schedules, in Nigerian time (WAT, UTC+1). Falls back to the raw schedule. */
function describeCron(schedule) {
	const fields = schedule.trim().split(/\s+/);
	const raw = `on the schedule "${schedule.trim()}" (UTC)`;
	if (fields.length !== 5) return raw;
	const [m, h, dom, mon, dow] = fields;
	const every = m.match(/^\*\/(\d+)$/);
	if (every && h === "*" && dom === "*" && mon === "*" && dow === "*") return `every ${every[1]} minutes`;
	if (!/^\d+$/.test(m) || !/^\d+$/.test(h) || mon !== "*") return raw;
	const wat = (Number(h) + 1) % 24;
	const time = `${String(wat).padStart(2, "0")}:${m.padStart(2, "0")} WAT`;
	if (dom === "*" && dow === "*") return `daily at ${time}`;
	if (dom === "*" && /^[0-7]$/.test(dow)) return `every ${WEEKDAYS[Number(dow) % 7]} at ${time}`;
	if (dow === "*" && /^\d+(,\d+)*$/.test(dom)) {
		const days = dom.split(",").map((d) => ordinal(Number(d)));
		return `on the ${days.length > 1 ? `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}` : days[0]} of each month at ${time}`;
	}
	return raw;
}
/** Scheduled edge functions that log each run and can be run by hand from here. */
var KNOWN = [{
	fn: "scrape-events",
	title: "Events directory",
	source: "Meetup, Eventbrite and Luma",
	unit: "events",
	defaultSchedule: "30 5 1,15 * *"
}, {
	fn: "scrape-jobs",
	title: "Jobs board",
	source: "Mercor, Micro1, Outlier and other job platforms",
	unit: "jobs",
	defaultSchedule: "0 5 1,15 * *"
}];
/** A run due this long ago with no good run since means the schedule has stopped. */
var GRACE_MS = 216e5;
async function loadRuns(fn) {
	const supabase = await getSupabase();
	const { data, error } = fn === "scrape-events" ? await supabase.from("event_scrape_runs").select("ran_at, success, items:upserted, error").order("ran_at", { ascending: false }).limit(10) : await supabase.from("scheduled_job_runs").select("ran_at, success, items, error").eq("job", fn).order("ran_at", { ascending: false }).limit(10);
	if (error) throw error;
	return data ?? [];
}
var when = (iso) => new Date(iso).toLocaleString("en-NG", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "Africa/Lagos"
});
/** True when a run was due at least GRACE_MS ago and no good run has happened since. */
function isStuck(schedule, lastOkAt) {
	const due = previousCronRun(schedule, /* @__PURE__ */ new Date(Date.now() - GRACE_MS));
	if (!due) return false;
	return !lastOkAt || new Date(lastOkAt).getTime() < due.getTime() - 6e4;
}
/**
* Every scheduled job on one card: when it runs, when it last worked, whether it looks stuck,
* and (for the scrapers) a button to run it straight away.
*/
function ScheduledJobsHealth() {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const cron = useQuery({
		queryKey: ["admin-scheduled-jobs"],
		queryFn: async () => {
			const { data, error } = await (await getSupabase()).rpc("admin_scheduled_jobs");
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		retry: false
	});
	const runs = useQuery({
		queryKey: ["scheduled-job-runs"],
		queryFn: async () => {
			const entries = await Promise.all(KNOWN.map(async (k) => [k.fn, await loadRuns(k.fn).catch(() => null)]));
			return Object.fromEntries(entries);
		}
	});
	const refresh = async (fn, title, unit) => {
		setBusy(fn);
		const { data, error } = await (await getSupabase()).functions.invoke(fn, { body: { trigger: "admin" } });
		setBusy(null);
		queryClient.invalidateQueries({ queryKey: ["scheduled-job-runs"] });
		queryClient.invalidateQueries({ queryKey: ["admin-scheduled-jobs"] });
		if (error || !data?.success) {
			toast({
				title: `${title} not refreshed`,
				description: data?.error ?? error?.message ?? "The run failed. See the latest run below.",
				variant: "destructive"
			});
			return;
		}
		toast({
			title: `${title} refreshed`,
			description: `Saved ${data.upserted} ${unit}.`
		});
	};
	const cronJobs = cron.data ?? [];
	const knownFns = new Set(KNOWN.map((k) => k.fn));
	const otherJobs = cronJobs.filter((j) => !j.edge_function || !knownFns.has(j.edge_function));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-5 w-5 text-primary" }), "Scheduled jobs"]
			}), cron.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "The full schedule list is not available yet (its database update has not been run)."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "divide-y",
			children: [KNOWN.map((k) => {
				const job = cronJobs.find((j) => j.edge_function === k.fn);
				const schedule = job?.schedule ?? k.defaultSchedule;
				const list = runs.data?.[k.fn];
				const last = list?.[0];
				const lastOk = list?.find((r) => r.success);
				const missing = cron.isSuccess && !job;
				const paused = job && !job.active;
				const stuck = !runs.isLoading && list != null && list.length > 0 && !missing && !paused && isStuck(schedule, lastOk?.ran_at);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: k.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"From ",
									k.source,
									", ",
									describeCron(schedule),
									".",
									" ",
									runs.isLoading ? "" : list == null ? "Run history is not available yet." : lastOk ? `Last good run ${when(lastOk.ran_at)} (${lastOk.items} ${k.unit}).` : "No successful run has been logged yet."
								]
							}),
							last && !last.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-destructive",
								children: ["Latest run failed: ", last.error ?? "unknown error"]
							}),
							missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: "Not scheduled. Run the latest database update."
							}),
							paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: "The schedule is paused."
							}),
							stuck && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: "Looks stuck: the last scheduled run did not succeed. Run it now, and check the Firecrawl key and credits if it fails."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => refresh(k.fn, k.title, k.unit),
						disabled: busy !== null,
						title: "Each run uses Firecrawl credits",
						className: "shrink-0",
						children: [busy === k.fn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Refresh now"]
					})]
				}, k.fn);
			}), otherJobs.map((j) => {
				const failed = j.last_status === "failed";
				const lastOkAt = j.last_status === "succeeded" ? j.last_started_at : null;
				const stuck = j.active && !failed && isStuck(j.schedule, lastOkAt ?? null);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: j.edge_function ?? j.jobname
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Runs ",
								describeCron(j.schedule),
								".",
								" ",
								j.last_started_at ? `Last started ${when(j.last_started_at)}.` : "No run recorded yet."
							]
						}),
						failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-destructive",
							children: ["Latest run failed: ", j.last_message ?? "unknown error"]
						}),
						!j.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: "The schedule is paused."
						}),
						stuck && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: "Looks stuck: it missed its last scheduled run."
						})
					]
				}, j.jobname);
			})]
		})]
	}) });
}
var SECTIONS = [
	{
		to: "/admin/leads",
		title: "Leads",
		description: "Every enquiry from the site's forms, with WhatsApp follow-up and status.",
		icon: Inbox,
		adminOnly: true
	},
	{
		to: "/admin/students",
		title: "Students",
		description: "Confirm WhatsApp, email and bank payments, and review weekly student work.",
		icon: GraduationCap
	},
	{
		to: "/admin/lookup",
		title: "Student lookup",
		description: "Find a student by name, phone or Faculty ID and see their enrolments, payments, work and certificates.",
		icon: Search,
		adminOnly: true
	},
	{
		to: "/admin/talent",
		title: "Talent",
		description: "Roles, applications, matches, engagements and hiring requests.",
		icon: BriefcaseBusiness
	},
	{
		to: "/admin/certificates",
		title: "Certificates",
		description: "Issue certificates to students who finish a programme.",
		icon: Award,
		adminOnly: true
	},
	{
		to: "/admin/referrals",
		title: "Referrals",
		description: "See who referred whom and pay graduates their referral rewards.",
		icon: Gift,
		adminOnly: true
	},
	{
		to: "/admin/activity",
		title: "Activity log",
		description: "Who marked payments paid, cancelled enrolments, issued certificates and more.",
		icon: History,
		adminOnly: true
	}
];
/** Staff landing page: one place to reach every admin area this account can use. */
function AdminHome() {
	const { loading, isStaff, isAdmin } = useIsStaff();
	const sections = SECTIONS.filter((s) => !s.adminOnly || isAdmin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container mx-auto px-4 pt-28 pb-16 max-w-6xl space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Choose an area to manage."
					})] }),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This page is for Tech Faculty staff. Sign in with a staff account."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/login?next=/admin",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeedsYouToday, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: sections.map(({ to, title, description, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to,
								className: "group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "h-full transition-colors group-hover:border-primary/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: description
											})
										]
									})
								})
							}, to))
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminMetrics, {}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifySearchEngines, {}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduledJobsHealth, {})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var SplitComponent = AdminHome;
//#endregion
export { SplitComponent as component };
