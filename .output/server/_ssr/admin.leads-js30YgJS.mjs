import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, Ft as CircleCheck, P as RefreshCw, St as Download, Tt as CreditCard, X as Mail, gt as FileDown, j as Search, ot as Inbox, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as PRODUCTS } from "./products-Dwo_SXcO.mjs";
import { r as FOLLOWUP_DAYS } from "./lead-followups-BtMfwIFF.mjs";
import { n as downloadCsv, r as toCsv, t as csvFilename } from "./csv-CwucF6vt.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.leads-js30YgJS.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var itemNames = (items) => items.map((id) => PRODUCTS[id]?.name ?? id).join(" + ");
var formatDate$1 = (iso) => new Date(iso).toLocaleString("en-NG", {
	day: "numeric",
	month: "short",
	hour: "numeric",
	minute: "2-digit"
});
var whatsappUrl$1 = (order) => {
	const digits = (order.phone ?? "").replace(/\D/g, "");
	const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
	const firstName = order.name?.trim().split(/\s+/)[0];
	const message = `Hello${firstName ? ` ${firstName}` : ""}, this is Tech Faculty NG. Thank you for your payment for ${itemNames(order.items)}.`;
	return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};
/** Online orders paid by card (Virtual SIWES, logbook service, Success Kit) that still need sending. */
function PaidOrders() {
	const { toast } = useToast();
	const [orders, setOrders] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		const { data, error } = await (await getSupabase()).from("product_orders").select("id, items, amount_due, name, email, phone, school, notes, paid_at, fulfilled_at").eq("status", "paid").is("fulfilled_at", null).order("paid_at", { ascending: true }).limit(100);
		setOrders(error ? [] : data ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const markFulfilled = async (order) => {
		setSaving(order.id);
		const supabase = await getSupabase();
		const { data: auth } = await supabase.auth.getUser();
		const { error } = await supabase.from("product_orders").update({
			fulfilled_at: (/* @__PURE__ */ new Date()).toISOString(),
			fulfilled_by: auth.user?.id ?? null
		}).eq("id", order.id);
		setSaving(null);
		if (error) {
			toast({
				title: "Couldn't update the order",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setOrders((prev) => (prev ?? []).filter((o) => o.id !== order.id));
		toast({
			title: "Marked fulfilled",
			description: order.name || order.email
		});
	};
	if (!orders?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-primary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold",
						children: [
							"Paid online, to fulfil (",
							orders.length,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Send the acceptance letter, arrange the logbook pickup or check the kit download, then mark it fulfilled."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-sm min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										order.name || order.email,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "ml-1",
											children: ["₦", Number(order.amount_due).toLocaleString("en-NG")]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: itemNames(order.items) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground break-words",
									children: [
										order.email,
										order.phone ? ` · ${order.phone}` : "",
										order.school ? ` · ${order.school}` : "",
										order.paid_at ? ` · paid ${formatDate$1(order.paid_at)}` : ""
									]
								}),
								order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground break-words",
									children: order.notes
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 shrink-0",
							children: [order.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: whatsappUrl$1(order),
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 mr-1.5" }), " WhatsApp"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => void markFulfilled(order),
								disabled: saving === order.id,
								children: [saving === order.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-1.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-1.5" }), "Mark fulfilled"]
							})]
						})]
					}, order.id))
				})
			]
		})
	});
}
var STATUSES = [
	"new",
	"contacted",
	"enrolled",
	"not_interested",
	"archived"
];
var STATUS_LABEL = {
	new: "New",
	contacted: "Contacted",
	enrolled: "Enrolled",
	not_interested: "Not interested",
	archived: "Archived"
};
var INTEREST_LABEL = {
	free_checklist: "Free SIWES checklist",
	success_kit: "SIWES Success Kit",
	partner_enquiry: "Business / partner enquiry",
	siwes_placement: "SIWES placement",
	virtual_siwes: "Virtual SIWES",
	logbook_service: "Logbook service",
	community_join: "Join WhatsApp community",
	whatsapp_chat: "WhatsApp chat",
	free_bootcamp: "Free Tech Bootcamp"
};
/** The checklist form inserts a second "marker" row when someone opens WhatsApp; it is folded into the original lead. */
var UNLOCK_SUFFIX = "#whatsapp-unlock";
var STOP_LABEL = {
	lead_closed: "stopped",
	enrolled: "stopped, enrolled",
	suppressed: "stopped, address bounced",
	unsubscribed: "unsubscribed"
};
/** Where a lead's follow-up email sequence is up to, for its badge. */
var emailFollowupLabel = (f) => {
	const sent = `${f.steps_sent} of ${FOLLOWUP_DAYS.length} sent`;
	const stopped = f.stop_reason && STOP_LABEL[f.stop_reason];
	return `Follow-up emails: ${stopped ? `${sent}, ${stopped}` : sent}`;
};
var interestLabel = (interest) => INTEREST_LABEL[interest] ?? interest.replace(/_/g, " ");
var CITY_IN_SCHOOL = /* @__PURE__ */ new Set(["community_join", "whatsapp_chat"]);
var leadEmail = (l) => l.email || (l.contact.includes("@") ? l.contact : null);
var leadLocation = (l) => l.location || (CITY_IN_SCHOOL.has(l.interest) ? l.school : null);
var leadSchool = (l) => CITY_IN_SCHOOL.has(l.interest) ? null : l.school;
var looksLikePhone = (contact) => !contact.includes("@") && contact.replace(/\D/g, "").length >= 10;
/** Nigerian numbers are usually typed as 080...; wa.me needs the international form. */
var whatsappUrl = (lead) => {
	const digits = lead.contact.replace(/\D/g, "");
	const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
	const firstName = lead.name?.trim().split(/\s+/)[0];
	const message = `Hello${firstName ? ` ${firstName}` : ""}, this is Tech Faculty NG. Thanks for your enquiry about ${interestLabel(lead.interest)}. How can we help?`;
	return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};
var formatDate = (iso) => new Date(iso).toLocaleString("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit"
});
/** Admin inbox for every enquiry saved by the site's lead forms. */
function AdminLeads() {
	const { toast } = useToast();
	const { loading: roleLoading, isAdmin } = useIsStaff();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [whatsappFollowups, setWhatsappFollowups] = (0, import_react.useState)({});
	const [emailFollowups, setEmailFollowups] = (0, import_react.useState)({});
	const [filter, setFilter] = (0, import_react.useState)("new");
	const [interest, setInterest] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const supabase = await getSupabase();
		const { data, error } = await supabase.from("leads").select("id, name, channel, contact, email, location, school, interest, source, notes, status, whatsapp_opt_in, whatsapp_opt_in_at, created_at").order("created_at", { ascending: false }).limit(1e3);
		setLoading(false);
		if (error) {
			toast({
				title: "Couldn't load leads",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		const rows = data ?? [];
		setLeads(rows);
		const leadIds = rows.filter((lead) => lead.channel === "whatsapp").map((lead) => lead.id);
		if (leadIds.length) {
			const { data: queue, error: queueError } = await supabase.from("whatsapp_lead_followups").select("lead_id, stage, status, sent_at").in("lead_id", leadIds);
			if (queueError) {
				toast({
					title: "WhatsApp follow-up status unavailable",
					description: queueError.message,
					variant: "destructive"
				});
				setWhatsappFollowups({});
			} else {
				const byLead = {};
				for (const item of queue ?? []) (byLead[item.lead_id] ??= []).push(item);
				setWhatsappFollowups(byLead);
			}
		} else setWhatsappFollowups({});
		const { data: emails } = await supabase.from("lead_email_followups").select("lead_id, steps_sent, stop_reason").order("created_at", { ascending: false }).limit(1e3);
		setEmailFollowups(Object.fromEntries((emails ?? []).map((f) => [f.lead_id, f])));
	}, [toast]);
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
	}, [isAdmin, load]);
	const { inbox, openedWhatsApp } = (0, import_react.useMemo)(() => {
		const opened = /* @__PURE__ */ new Set();
		const rows = [];
		for (const lead of leads) if (lead.source?.endsWith(UNLOCK_SUFFIX)) opened.add(lead.contact.toLowerCase());
		else rows.push(lead);
		return {
			inbox: rows,
			openedWhatsApp: opened
		};
	}, [leads]);
	const counts = (0, import_react.useMemo)(() => {
		const c = { all: inbox.length };
		for (const s of STATUSES) c[s] = 0;
		for (const lead of inbox) c[lead.status] = (c[lead.status] ?? 0) + 1;
		return c;
	}, [inbox]);
	const interests = (0, import_react.useMemo)(() => [...new Set(inbox.map((l) => l.interest))].sort(), [inbox]);
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return inbox.filter((l) => (filter === "all" || l.status === filter) && (interest === "all" || l.interest === interest) && (!q || [
			l.name,
			l.contact,
			l.email,
			l.location,
			l.school,
			l.notes
		].some((v) => v?.toLowerCase().includes(q))));
	}, [
		inbox,
		filter,
		interest,
		query
	]);
	/** Downloads the leads currently shown, so the status, interest and search filters apply. */
	const exportCsv = () => {
		const csv = toCsv(visible, [
			{
				header: "Received",
				value: (l) => formatDate(l.created_at)
			},
			{
				header: "Name",
				value: (l) => l.name
			},
			{
				header: "Contact",
				value: (l) => l.contact
			},
			{
				header: "Channel",
				value: (l) => l.channel
			},
			{
				header: "Email",
				value: (l) => leadEmail(l)
			},
			{
				header: "Location",
				value: (l) => leadLocation(l)
			},
			{
				header: "School",
				value: (l) => leadSchool(l)
			},
			{
				header: "Interest",
				value: (l) => interestLabel(l.interest)
			},
			{
				header: "Status",
				value: (l) => STATUS_LABEL[l.status] ?? l.status
			},
			{
				header: "Opened WhatsApp",
				value: (l) => openedWhatsApp.has(l.contact.toLowerCase()) ? "Yes" : ""
			},
			{
				header: "Source",
				value: (l) => l.source
			},
			{
				header: "Notes",
				value: (l) => l.notes
			}
		]);
		const parts = [filter !== "all" && filter, interest !== "all" && interest].filter(Boolean);
		downloadCsv(csvFilename(["leads", ...parts].join("-")), csv);
	};
	/** The paid kit is not a public file; admins fetch it here to send to transfer buyers on WhatsApp. */
	const downloadKit = async () => {
		const { data } = await (await getSupabase()).auth.getSession();
		const res = await fetch("/api/success-kit", { headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` } });
		if (!res.ok) {
			toast({
				title: "Couldn't download the kit",
				description: await res.text(),
				variant: "destructive"
			});
			return;
		}
		const url = URL.createObjectURL(await res.blob());
		const a = document.createElement("a");
		a.href = url;
		a.download = "SIWES-Success-Kit-TechFacultyNG.zip";
		a.click();
		URL.revokeObjectURL(url);
	};
	const setStatus = async (lead, status) => {
		if (lead.status === status) return;
		setSaving(lead.id);
		const { error } = await (await getSupabase()).from("leads").update({
			status,
			status_updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", lead.id);
		setSaving(null);
		if (error) {
			toast({
				title: "Couldn't update status",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setLeads((prev) => prev.map((l) => l.id === lead.id ? {
			...l,
			status
		} : l));
		toast({
			title: `Marked ${STATUS_LABEL[status].toLowerCase()}`,
			description: lead.name || lead.contact
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container mx-auto px-4 pt-28 pb-16 max-w-5xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Leads"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Every enquiry from the site's forms. Follow up, then update its status."
						})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: exportCsv,
									disabled: !visible.length,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-1.5" }),
										" Download CSV (",
										visible.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => void downloadKit(),
									title: "For kit buyers who paid by bank transfer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-1.5" }), " Success Kit file"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => void load(),
									disabled: loading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-4 w-4 mr-1.5", loading && "animate-spin") }), " Refresh"]
								})
							]
						})]
					}),
					roleLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This page is for Tech Faculty admins. Sign in with an admin account."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/login?next=/admin/leads",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaidOrders, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							role: "tablist",
							"aria-label": "Filter by status",
							children: [...STATUSES, "all"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": filter === s,
								onClick: () => setFilter(s),
								className: cn("rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", filter === s ? "bg-primary text-primary-foreground font-medium" : "bg-muted text-muted-foreground hover:text-foreground"),
								children: [
									s === "all" ? "All" : STATUS_LABEL[s],
									" (",
									counts[s] ?? 0,
									")"
								]
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search name, phone, email, location, school or notes",
									className: "pl-9",
									"aria-label": "Search leads"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: interest,
								onValueChange: setInterest,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "sm:w-60",
									"aria-label": "Filter by interest",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All interests"
								}), interests.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: i,
									children: interestLabel(i)
								}, i))] })]
							})]
						}),
						loading && !leads.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !visible.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-col items-center gap-2 py-12 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: inbox.length ? "No leads match these filters." : "No enquiries yet."
							})]
						}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: visible.map((lead) => {
								const phone = looksLikePhone(lead.contact);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold",
														children: lead.name || "No name given"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm break-all",
														children: [lead.contact, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-muted-foreground",
															children: [" · ", lead.channel === "whatsapp" ? "WhatsApp" : "Email"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center gap-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "secondary",
																children: interestLabel(lead.interest)
															}),
															openedWhatsApp.has(lead.contact.toLowerCase()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "outline",
																children: "Opened WhatsApp"
															}),
															lead.channel === "whatsapp" && lead.whatsapp_opt_in && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "outline",
																children: "WhatsApp updates: opted in"
															}),
															lead.channel === "whatsapp" && !lead.whatsapp_opt_in && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "outline",
																children: "WhatsApp updates: not opted in"
															}),
															emailFollowups[lead.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "outline",
																children: emailFollowupLabel(emailFollowups[lead.id])
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs text-muted-foreground",
																children: formatDate(lead.created_at)
															})
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														asChild: true,
														size: "sm",
														className: "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
															href: whatsappUrl(lead),
															target: "_blank",
															rel: "noopener noreferrer",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 mr-1.5" }), " WhatsApp"]
														})
													}),
													leadEmail(lead) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														asChild: true,
														size: "sm",
														variant: "outline",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
															href: `mailto:${leadEmail(lead)}`,
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 mr-1.5" }), " Email"]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: lead.status,
														onValueChange: (v) => void setStatus(lead, v),
														disabled: saving === lead.id,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "w-36",
															"aria-label": `Status for ${lead.name || lead.contact}`,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: s,
															children: STATUS_LABEL[s]
														}, s)) })]
													})
												]
											})]
										}),
										lead.channel === "whatsapp" && whatsappFollowups[lead.id]?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: ["Automated WhatsApp: ", whatsappFollowups[lead.id].map((f) => `${f.stage === "confirmation" ? "confirmation" : "48-hour follow-up"} — ${f.status.replace(/_/g, " ")}`).join(" · ")]
										}) : null,
										(leadEmail(lead) || leadLocation(lead) || leadSchool(lead) || lead.notes || lead.source) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "grid gap-1 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:gap-x-3",
											children: [
												leadEmail(lead) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "font-medium text-foreground",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "break-all",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														className: "underline underline-offset-2",
														href: `mailto:${leadEmail(lead)}`,
														children: leadEmail(lead)
													})
												})] }),
												leadLocation(lead) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "font-medium text-foreground",
													children: "Location"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: leadLocation(lead) })] }),
												leadSchool(lead) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "font-medium text-foreground",
													children: "School"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: leadSchool(lead) })] }),
												lead.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "font-medium text-foreground",
													children: "Notes"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "break-words",
													children: lead.notes
												})] }),
												lead.source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "font-medium text-foreground",
													children: "From"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "break-all",
													children: lead.source
												})] })
											]
										})
									]
								}) }) }, lead.id);
							})
						}),
						leads.length >= 1e3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Showing the latest 1,000 enquiries."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var SplitComponent = AdminLeads;
//#endregion
export { SplitComponent as component };
