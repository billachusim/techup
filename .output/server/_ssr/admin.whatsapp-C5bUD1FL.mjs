import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, A as Send, Ht as Check, Mt as Clock, P as RefreshCw, Ut as CheckCheck, V as Paperclip, r as X } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BWmmnMPu.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, t as arrayType, u as stringType } from "../_libs/zod.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { t as Switch } from "./switch-4pagn7-e.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-v01m15hu.mjs";
import { t as SLACK_JOIN_URL } from "./coursePrograms-ONlp_ggE.mjs";
import { n as AUTO_ANSWER_RULES, t as AUTO_ANSWER_LABEL } from "./whatsapp-auto-answers-BHpo12w7.mjs";
import { n as COMMUNITY_WHATSAPP_URL } from "./whatsapp-BIGKDc9S.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.whatsapp-C5bUD1FL.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var founderLink = `https://wa.me/2348068597140?text=${encodeURIComponent("Hello Mr. Bill, Claire from admissions referred me.")}`;
var HANDOFF_LABEL = {
	founder: "Hand off to Mr. Bill",
	community: "Invite to community",
	slack: "Invite to Slack",
	all: "Send all links"
};
function handoffMessage(kind) {
	const founder = `For payments or anything that needs the founder, please chat with Mr. Bill Achusim directly: ${founderLink}`;
	const community = `Join the Tech Faculty WhatsApp community for updates and free resources: ${COMMUNITY_WHATSAPP_URL}`;
	const slack = `Join our Tech Faculty Slack to meet other students and mentors: ${SLACK_JOIN_URL}`;
	if (kind === "founder") return founder;
	if (kind === "community") return community;
	if (kind === "slack") return slack;
	return `Here are the best next steps:\n\n1. ${founder}\n\n2. ${community}\n\n3. ${slack}`;
}
var SendInput = objectType({
	to: stringType().min(6).max(20),
	text: stringType().trim().min(1).max(4096).optional(),
	template: objectType({
		name: stringType().min(1).max(512),
		language: stringType().min(2).max(15),
		params: arrayType(stringType().max(1e3)).max(20).optional()
	}).optional()
}).refine((d) => !!d.text !== !!d.template, "Send either text or a template");
var sendWhatsAppMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SendInput.parse(d)).handler(createSsrRpc("9b0d04452f3d5ecdc8743a55f2cc793186ed30e48c0b301ee754fcb39b25711e"));
var listWhatsAppTemplates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d75b03618f1a6d9b5d3576e9d6238dbfed6963144ececef27f745bf4d5912324"));
var TemplateInput = objectType({
	name: stringType().regex(/^[a-z0-9_]{1,512}$/, "Use lowercase letters, numbers and underscores"),
	language: stringType().min(2).max(15),
	category: enumType(["UTILITY", "MARKETING"]),
	body: stringType().trim().min(10).max(1024),
	examples: arrayType(stringType().min(1).max(200)).max(20)
});
var createWhatsAppTemplate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => TemplateInput.parse(d)).handler(createSsrRpc("06702f1e7141d9dcd6e5ed9d68b585d3aef52b36cafcbc0652e8c5b91c80d35b"));
var deleteWhatsAppTemplate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ name: stringType().regex(/^[a-z0-9_]+$/) }).parse(d)).handler(createSsrRpc("2b52d2442a7b106e74363f310022d806594a937df9d57a18e18267a5bba8b52f"));
/** Streams an inbound photo/document to staff, size-capped. Returns base64 data URL. */
var getWhatsAppMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ mediaId: stringType().regex(/^\d+$/) }).parse(d)).handler(createSsrRpc("cf7afe7113d86c5d213c73cf5ab5e92a12a77ce0b3b98e8cb69384cc956ddb88"));
var DAY = 864e5;
function StatusIcon({ s }) {
	if (s === "read") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
		className: "h-3.5 w-3.5 text-primary",
		"aria-label": "Read"
	});
	if (s === "delivered") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
		className: "h-3.5 w-3.5",
		"aria-label": "Delivered"
	});
	if (s === "sent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
		className: "h-3.5 w-3.5",
		"aria-label": "Sent"
	});
	if (s === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		className: "h-3.5 w-3.5 text-destructive",
		"aria-label": "Failed"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
		className: "h-3.5 w-3.5",
		"aria-label": "Waiting"
	});
}
function Media({ id }) {
	const fetchMedia = useServerFn(getWhatsAppMedia);
	const [state, setState] = (0, import_react.useState)({});
	const load = async () => {
		setState({ loading: true });
		const r = await fetchMedia({ data: { mediaId: id } });
		setState(r.ok ? {
			url: r.dataUrl,
			mime: r.mime
		} : { err: r.error });
	};
	if (state.url) return state.mime?.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: state.url,
		alt: "Attachment sent on WhatsApp",
		className: "mt-1 max-h-60 rounded"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: state.url,
		download: true,
		className: "mt-1 block text-sm underline",
		children: "Download attachment"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		size: "sm",
		variant: "ghost",
		className: "mt-1 h-7 px-2",
		onClick: load,
		disabled: state.loading,
		children: [state.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-1",
			children: state.err ?? "Open attachment"
		})]
	});
}
function AdminWhatsApp() {
	const { isStaff, isAdmin, loading: staffLoading } = useIsStaff();
	const { toast } = useToast();
	const send = useServerFn(sendWhatsAppMessage);
	const listTpl = useServerFn(listWhatsAppTemplates);
	const createTpl = useServerFn(createWhatsAppTemplate);
	const deleteTpl = useServerFn(deleteWhatsAppTemplate);
	const [msgs, setMsgs] = (0, import_react.useState)([]);
	const [paused, setPaused] = (0, import_react.useState)(null);
	const [autoOn, setAutoOn] = (0, import_react.useState)(null);
	const [autoReplies, setAutoReplies] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [newTo, setNewTo] = (0, import_react.useState)("");
	const [templates, setTemplates] = (0, import_react.useState)([]);
	const [tplErr, setTplErr] = (0, import_react.useState)(null);
	const [tplPick, setTplPick] = (0, import_react.useState)("");
	const [tplParams, setTplParams] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		category: "UTILITY",
		body: "",
		examples: ""
	});
	const load = (0, import_react.useCallback)(async () => {
		const sb = await getSupabase();
		const [{ data }, { data: st }, { data: auto }] = await Promise.all([
			sb.from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(1e3),
			sb.from("whatsapp_account_state").select("*").eq("id", 1).maybeSingle(),
			sb.from("whatsapp_auto_replies").select("contact_phone,intent,outcome,reason,reply_message_id,resolved_at,created_at").order("created_at", { ascending: false }).limit(1e3)
		]);
		setMsgs(data ?? []);
		setPaused(st?.sending_paused ? st.last_event ?? "paused" : null);
		setAutoOn(st && "auto_answer_enabled" in st ? st.auto_answer_enabled !== false : null);
		setAutoReplies(auto ?? []);
	}, []);
	const loadTemplates = (0, import_react.useCallback)(async () => {
		const r = await listTpl();
		setTemplates(r.templates);
		setTplErr(r.ok ? null : r.error ?? null);
	}, [listTpl]);
	(0, import_react.useEffect)(() => {
		if (!isStaff) return;
		load();
		loadTemplates();
		let ch;
		getSupabase().then((sb) => {
			ch = sb.channel("wa-inbox").on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "whatsapp_messages"
			}, () => load()).subscribe();
		});
		return () => {
			ch?.unsubscribe?.();
		};
	}, [
		isStaff,
		load,
		loadTemplates
	]);
	const threads = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of msgs) {
			const t = map.get(m.contact_phone) ?? {
				phone: m.contact_phone,
				name: null,
				last: m,
				lastInbound: null,
				unreadish: 0
			};
			if (!t.name && m.contact_name) t.name = m.contact_name;
			if (m.direction === "inbound") {
				const ts = new Date(m.provider_timestamp ?? m.created_at).getTime();
				if (!t.lastInbound || ts > t.lastInbound) t.lastInbound = ts;
			}
			map.set(m.contact_phone, t);
		}
		return [...map.values()];
	}, [msgs]);
	const autoReplyIds = (0, import_react.useMemo)(() => new Set(autoReplies.map((a) => a.reply_message_id).filter(Boolean)), [autoReplies]);
	/** Latest open handoff per contact: the chats that need a staff reply. */
	const waiting = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const a of autoReplies) if (a.outcome === "handed_off" && !a.resolved_at && !map.has(a.contact_phone)) map.set(a.contact_phone, a);
		return map;
	}, [autoReplies]);
	const toggleAuto = async (on) => {
		const { error } = await (await getSupabase()).rpc("set_whatsapp_auto_answer", { _enabled: on });
		if (error) toast({
			title: "Not changed",
			description: error.message,
			variant: "destructive"
		});
		else setAutoOn(on);
	};
	const thread = (0, import_react.useMemo)(() => msgs.filter((m) => m.contact_phone === active).reverse(), [msgs, active]);
	const activeT = threads.find((t) => t.phone === active);
	const windowOpen = !!activeT?.lastInbound && Date.now() - activeT.lastInbound < DAY;
	const approved = templates.filter((t) => t.status === "APPROVED");
	const pickedTpl = approved.find((t) => `${t.name}|${t.language}` === tplPick);
	const pickedVars = pickedTpl?.components?.find((c) => c.type === "BODY")?.text?.match(/\{\{\d+\}\}/g)?.length ?? 0;
	const doSend = async (to, payload) => {
		setSending(true);
		const r = await send({ data: {
			to,
			...payload
		} });
		setSending(false);
		if (!r.ok) toast({
			title: "Not sent",
			description: r.error,
			variant: "destructive"
		});
		else {
			setDraft("");
			setTplParams([]);
			load();
		}
		return r.ok;
	};
	if (staffLoading) return null;
	if (!isStaff) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "WhatsApp inbox"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Staff only."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container space-y-6 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "WhatsApp inbox"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [autoOn !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: autoOn,
									disabled: !isAdmin,
									onCheckedChange: toggleAuto,
									"aria-label": "Automatic answers"
								}),
								"Auto-answers ",
								autoOn ? "on" : "off"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								load();
								loadTemplates();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-4 w-4" }), " Refresh"]
						})]
					})]
				}),
				autoOn !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Questions about prices, campus locations and SIWES are answered automatically. Everything else is marked \"Needs reply\" for you, and the sender is told someone will reply shortly. Auto-answers stay quiet for ",
						AUTO_ANSWER_RULES.staffActiveHours,
						" hours after you reply in a chat."
					]
				}),
				paused && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded border border-destructive p-3 text-sm text-destructive",
					children: [
						"Sending is paused because WhatsApp reported \"",
						paused,
						"\". Reconnect WhatsApp in Connectors."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "inbox",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "inbox",
							children: "Chats"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "templates",
							children: "Templates"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "inbox",
							className: "grid gap-4 md:grid-cols-[280px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "New chat: phone e.g. 0803...",
											value: newTo,
											onChange: (e) => setNewTo(e.target.value),
											"aria-label": "Phone number for a new chat"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => {
												const d = newTo.replace(/\D/g, "");
												const p = d.startsWith("0") && d.length === 11 ? "234" + d.slice(1) : d;
												if (p.length >= 8) {
													setActive(p);
													setNewTo("");
												}
											},
											children: "Open"
										})]
									}),
									threads.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "p-2 text-sm text-muted-foreground",
										children: "No chats yet. Messages people send to your WhatsApp number appear here."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "max-h-[60vh] space-y-1 overflow-y-auto",
										children: threads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActive(t.phone),
											className: cn("w-full rounded p-2 text-left text-sm hover:bg-muted", active === t.phone && "bg-muted"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: t.name ?? `+${t.phone}`
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex gap-1",
													children: [waiting.has(t.phone) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Needs reply" }), t.lastInbound && Date.now() - t.lastInbound < DAY && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: "Open"
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-muted-foreground",
												children: [t.last.direction === "outbound" ? "You: " : "", t.last.body]
											})]
										}) }, t.phone))
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-6 text-muted-foreground",
								children: "Pick a chat."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-lg",
										children: activeT?.name ?? `+${active}`
									}),
									waiting.get(active) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-primary",
										children: ["Handed to you: ", waiting.get(active).reason ?? AUTO_ANSWER_LABEL.other]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"+",
											active,
											" · ",
											windowOpen ? "You can reply freely (they messaged in the last 24 hours)." : "They haven't messaged in 24 hours — you must use an approved template."
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-h-[50vh] space-y-2 overflow-y-auto",
										children: thread.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("max-w-[80%] rounded-lg p-2 text-sm", m.direction === "outbound" ? "ml-auto bg-primary/10" : "bg-muted"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "whitespace-pre-wrap",
													children: m.body
												}),
												m.media_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Media, { id: m.media_id }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground",
													children: [
														autoReplyIds.has(m.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium",
															children: "Auto ·"
														}),
														new Date(m.provider_timestamp ?? m.created_at).toLocaleString(),
														m.direction === "outbound" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { s: m.status })
													]
												}),
												m.status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-destructive",
													children: m.error?.message ?? m.error?.[0]?.title ?? "Failed"
												})
											]
										}, m.id))
									}),
									windowOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										"aria-label": "Handoff shortcuts",
										children: Object.keys(HANDOFF_LABEL).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: () => setDraft(handoffMessage(k)),
											children: HANDOFF_LABEL[k]
										}, k))
									}),
									windowOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "flex gap-2",
										onSubmit: (e) => {
											e.preventDefault();
											if (draft.trim()) doSend(active, { text: draft.trim() });
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: draft,
											onChange: (e) => setDraft(e.target.value),
											placeholder: "Type a reply",
											"aria-label": "Reply message"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: sending || !!paused,
											"aria-label": "Send reply",
											children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 rounded border p-3",
										children: approved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "No approved templates yet. Create one in the Templates tab; WhatsApp usually approves within 48 hours."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: tplPick,
												onValueChange: (v) => {
													setTplPick(v);
													setTplParams([]);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													"aria-label": "Choose a template",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a template" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: approved.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: `${t.name}|${t.language}`,
													children: [
														t.name,
														" (",
														t.language,
														")"
													]
												}, t.name + t.language)) })]
											}),
											pickedTpl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground whitespace-pre-wrap",
												children: pickedTpl.components.find((c) => c.type === "BODY")?.text
											}),
											Array.from({ length: pickedVars }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: `Blank {{${i + 1}}}`,
												value: tplParams[i] ?? "",
												onChange: (e) => {
													const p = [...tplParams];
													p[i] = e.target.value;
													setTplParams(p);
												}
											}, i)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												disabled: !pickedTpl || sending || !!paused || tplParams.filter(Boolean).length < pickedVars,
												onClick: () => pickedTpl && doSend(active, { template: {
													name: pickedTpl.name,
													language: pickedTpl.language,
													params: tplParams.slice(0, pickedVars)
												} }),
												children: "Send template"
											})
										] })
									})
								]
							})] }) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "templates",
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-lg",
								children: "Your templates"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [
									tplErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-destructive",
										children: tplErr
									}),
									templates.length === 0 && !tplErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "None yet."
									}),
									templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded border p-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium",
													children: [
														t.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-muted-foreground",
															children: [
																"(",
																t.language,
																", ",
																t.category.toLowerCase(),
																")"
															]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: t.status === "APPROVED" ? "default" : t.status === "REJECTED" ? "destructive" : "secondary",
													children: t.status.toLowerCase()
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 whitespace-pre-wrap text-muted-foreground",
												children: t.components?.find((c) => c.type === "BODY")?.text
											}),
											isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												className: "mt-1 h-7 px-2 text-destructive",
												onClick: async () => {
													if (!confirm(`Delete template "${t.name}"?`)) return;
													const r = await deleteTpl({ data: { name: t.name } });
													if (!r.ok) toast({
														title: "Not deleted",
														description: r.error,
														variant: "destructive"
													});
													else loadTemplates();
												},
												children: "Delete"
											})
										]
									}, t.name + t.language))
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-lg",
								children: "New template"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-2",
								onSubmit: async (e) => {
									e.preventDefault();
									const examples = form.examples.split("|").map((s) => s.trim()).filter(Boolean);
									const r = await createTpl({ data: {
										name: form.name,
										language: "en",
										category: form.category,
										body: form.body,
										examples
									} });
									if (!r.ok) toast({
										title: "Not created",
										description: r.error,
										variant: "destructive"
									});
									else {
										toast({
											title: "Sent for WhatsApp review",
											description: "Usually approved within 48 hours."
										});
										setForm({
											name: "",
											category: "UTILITY",
											body: "",
											examples: ""
										});
										loadTemplates();
									}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Name, e.g. class_reminder",
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
										}),
										"aria-label": "Template name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.category,
										onValueChange: (v) => setForm({
											...form,
											category: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											"aria-label": "Template type",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "UTILITY",
											children: "Update (reminders, payments, classes)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "MARKETING",
											children: "Marketing (promotions — paid)"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 4,
										placeholder: "Hi {{1}}, your next {{2}} class starts tomorrow. Reply here if you have any questions.",
										value: form.body,
										onChange: (e) => setForm({
											...form,
											body: e.target.value
										}),
										"aria-label": "Template message"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Examples for blanks, separated by | e.g. Ada | Data Analytics",
										value: form.examples,
										onChange: (e) => setForm({
											...form,
											examples: e.target.value
										}),
										"aria-label": "Examples for blanks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Use ",
											"{{1}}",
											", ",
											"{{2}}",
											" for blanks. Write a full sentence around them or WhatsApp will reject it."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										children: "Submit for review"
									})
								]
							}) })] })]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
var SplitComponent = AdminWhatsApp;
//#endregion
export { SplitComponent as component };
