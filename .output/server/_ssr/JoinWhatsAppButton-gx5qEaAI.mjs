import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, Dt as Copy, Ht as Check, Ot as Contact, bt as ExternalLink, q as MessageCircle, s as Users } from "../_libs/lucide-react.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as SUCCESS_KIT } from "./successKit-Ca2aXOxu.mjs";
import { r as isMobileDevice } from "./whatsapp-BIGKDc9S.mjs";
import { i as trackLead } from "./analytics-BrZRoVBL.mjs";
import { n as clampLeadField, t as Checkbox } from "./checkbox-o9PPpNJX.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/JoinWhatsAppButton-gx5qEaAI.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var LEAD_CAPTURED_KEY = "tf_wa_lead_captured";
var hasCapturedLead = () => {
	try {
		return localStorage.getItem(LEAD_CAPTURED_KEY) === "1";
	} catch {
		return false;
	}
};
var rememberLead = () => {
	try {
		localStorage.setItem(LEAD_CAPTURED_KEY, "1");
	} catch {}
};
var TOPICS = [
	"SIWES / Industrial Training",
	"Courses & bootcamps",
	"AI for Everything",
	"Jobs & remote work",
	"Tech store",
	"Something else"
];
var WHATSAPP_NUMBER = SUCCESS_KIT.whatsappNumber;
var vCard = () => [
	"BEGIN:VCARD",
	"VERSION:3.0",
	"N:Faculty;Tech;;;",
	"FN:Tech Faculty NG",
	"ORG:Tech Faculty NG",
	`TEL;TYPE=CELL:+${WHATSAPP_NUMBER}`,
	"URL:https://techfaculty.ng",
	"END:VCARD"
].join("\n");
var WhatsAppLeadDialog = ({ open, onOpenChange, variant, source, groupUrl, context, onCaptured }) => {
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [topic, setTopic] = (0, import_react.useState)(variant === "chat" ? "" : "");
	const [whatsappOptIn, setWhatsappOptIn] = (0, import_react.useState)(false);
	const [emailOptIn, setEmailOptIn] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [saidHi, setSaidHi] = (0, import_react.useState)(false);
	const cityOptions = (0, import_react.useMemo)(() => {
		const set = new Set(campuses.map((c) => `${c.city}, ${c.state}`));
		return Array.from(set).sort((a, b) => a.localeCompare(b));
	}, []);
	const digits = phone.replace(/\D/g, "");
	const emailOk = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
	const valid = name.trim().length >= 2 && digits.length >= 10 && emailOk;
	const supportsFollowup = variant === "community" || topic === "Courses & bootcamps" || topic === "SIWES / Industrial Training";
	const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(variant === "chat" ? `Hello Tech Faculty, I'm ${name.trim() || "a student"}${city ? ` from ${city}` : ""}. I need help with: ${topic || "Something else"}.${context ? ` (from ${context})` : ""}` : `Hello Tech Faculty, I'm ${name.trim() || "a student"}${city ? ` from ${city}` : ""} and I just joined your WhatsApp community.${topic ? ` I'm interested in ${topic}.` : ""}`)}`;
	const save = async (e) => {
		e.preventDefault();
		if (!valid) {
			setError(name.trim().length < 2 ? "Please enter your name." : !emailOk ? "That email doesn't look right — fix it or leave it blank." : "Enter a valid WhatsApp number (at least 10 digits).");
			return;
		}
		setStatus("saving");
		setError(null);
		const notes = [
			topic ? `Interest: ${topic}` : null,
			context ? `Context: ${context}` : null,
			variant === "community" ? "Community join capture" : "Floating WhatsApp chat capture"
		].filter(Boolean).join(" | ");
		const { error: insertError } = await (await getSupabase()).from("leads").insert({
			name: clampLeadField(name, "name"),
			channel: "whatsapp",
			contact: clampLeadField(phone, "contact") ?? "",
			email: clampLeadField(email.toLowerCase(), "email"),
			location: clampLeadField(city, "location"),
			interest: variant === "community" ? "community_join" : "whatsapp_chat",
			source: clampLeadField(source, "source"),
			notes: clampLeadField(notes, "notes"),
			whatsapp_opt_in: supportsFollowup && whatsappOptIn,
			email_marketing_opt_in: !!email.trim() && emailOptIn
		});
		if (insertError) {
			setStatus("idle");
			setError("We couldn't save that. Please try again, or message us on WhatsApp.");
			return;
		}
		trackLead(variant === "community" ? "community_join" : "whatsapp_chat", {
			lead_source: source,
			channel: "whatsapp"
		});
		rememberLead();
		setStatus("done");
		if (variant === "community") {
			if (isMobileDevice()) onCaptured?.();
		} else window.open(waHref, "_blank", "noopener,noreferrer");
	};
	const markSaidHi = () => {
		setSaidHi(true);
		getSupabase().then((supabase) => supabase.from("leads").insert({
			name: clampLeadField(name, "name"),
			channel: "whatsapp",
			contact: clampLeadField(phone, "contact") ?? "",
			email: clampLeadField(email.toLowerCase(), "email"),
			location: clampLeadField(city, "location"),
			interest: variant === "community" ? "community_join" : "whatsapp_chat",
			source: clampLeadField(`${source}#said-hi`, "source"),
			notes: "Said hi on WhatsApp (direct chat opened)"
		}));
	};
	const downloadVCard = () => {
		const blob = new Blob([vCard()], { type: "text/vcard;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "Tech-Faculty-NG.vcf";
		a.click();
		URL.revokeObjectURL(url);
	};
	const copyNumber = () => {
		navigator.clipboard?.writeText(`+${WHATSAPP_NUMBER}`);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md max-h-[85dvh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "pr-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: status === "done" ? "You're in — two quick things" : variant === "community" ? "Join the Tech Faculty community" : "Chat with Tech Faculty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: status === "done" ? "Save our number so our replies reach you, and send us a quick hello." : variant === "community" ? "Takes 20 seconds. Choose whether you'd also like WhatsApp updates about SIWES openings, class dates and free AI sessions." : "Tell us who we're speaking with and we'll reply on WhatsApp — usually within an hour." })]
			}), status === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: downloadVCard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {
							size: 16,
							className: "mr-2"
						}), "Save our number to your phone"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground",
							children: ["+", WHATSAPP_NUMBER]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "underline underline-offset-2 hover:text-foreground",
							onClick: copyNumber,
							children: copied ? "Copied" : "Copy number"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: waHref,
							target: "_blank",
							rel: "noopener noreferrer",
							onClick: markSaidHi,
							children: [saidHi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								size: 16,
								className: "mr-2"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
								size: 16,
								className: "mr-2"
							}), saidHi ? "Message opened — we'll reply shortly" : "Say hi on WhatsApp"]
						})
					}),
					variant === "community" && groupUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => {
							onOpenChange(false);
							onCaptured?.();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
							size: 16,
							className: "mr-2"
						}), "Open the community group"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "We only use your details to send what you asked for and occasional openings. No spam."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa-lead-name",
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "wa-lead-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Chisom Okeke",
							autoComplete: "name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa-lead-phone",
							children: "WhatsApp number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "wa-lead-phone",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							type: "tel",
							inputMode: "tel",
							autoComplete: "tel",
							placeholder: "0803 000 0000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "wa-lead-email",
							children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "wa-lead-email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							type: "email",
							inputMode: "email",
							autoComplete: "email",
							placeholder: "you@example.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa-lead-city",
							children: "City / State"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: city,
							onValueChange: setCity,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "wa-lead-city",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Where are you based?" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "max-h-60",
								children: [cityOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c,
									children: c
								}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Online / Elsewhere",
									children: "Online / Elsewhere"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: variant === "chat" ? "What do you need?" : "What interests you?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: TOPICS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTopic(topic === t ? "" : t),
								"aria-pressed": topic === t,
								className: `px-2.5 py-1 text-xs rounded-full border transition-colors ${topic === t ? "border-primary bg-primary/10 text-foreground font-medium" : "border-border text-muted-foreground hover:text-foreground"}`,
								children: t
							}, t))
						})]
					}),
					supportsFollowup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							id: "wa-lead-opt-in",
							checked: whatsappOptIn,
							onCheckedChange: (checked) => setWhatsappOptIn(checked === true),
							"aria-label": "Agree to WhatsApp updates and follow-ups"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa-lead-opt-in",
							className: "font-normal leading-relaxed",
							children: "I agree to receive WhatsApp updates and follow-ups from Tech Faculty about this request. Reply STOP anytime to opt out."
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						role: "alert",
						children: error
					}),
					email.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							id: "wa-lead-email-opt-in",
							checked: emailOptIn,
							onCheckedChange: (checked) => setEmailOptIn(checked === true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa-lead-email-opt-in",
							className: "font-normal leading-relaxed",
							children: "I agree to receive admissions follow-up emails and programme updates from Tech Faculty. I can unsubscribe anytime."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: status === "saving",
						children: [status === "saving" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 16,
							className: "mr-2 animate-spin"
						}), variant === "community" ? "Join the community on WhatsApp" : "Start the chat on WhatsApp"]
					}),
					variant === "community" && groupUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground w-full text-center",
						onClick: () => {
							onOpenChange(false);
							onCaptured?.();
						},
						children: "Already a member? Open the group"
					}),
					variant === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground text-center",
						children: "Mon–Sat, 9am–6pm WAT. Typically replies within an hour."
					})
				]
			})]
		})
	});
};
/**
* WhatsApp group invite links open natively on mobile, but on desktop browsers
* they frequently land on an error page unless the invite is opened from a
* logged-in WhatsApp session. On desktop we show a QR code to scan with the
* phone plus an explicit "open in browser" escape hatch.
*
* When `capture` is on (default), first-time visitors get a short lead form so
* their name, number and city land in the leads table before they join.
*/
var JoinWhatsAppButton = ({ url, label = "Join Our WhatsApp Community", groupName = "our WhatsApp community", children, capture = true, captureSource, captureContext, ...buttonProps }) => {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [leadOpen, setLeadOpen] = (0, import_react.useState)(false);
	const [qr, setQr] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open || qr) return;
		let cancelled = false;
		import("../_libs/_27.mjs").then((m) => /* @__PURE__ */ __toESM(m.default)).then((mod) => {
			return (mod.default ?? mod).toDataURL(url, {
				width: 512,
				margin: 1
			});
		}).then((dataUrl) => {
			if (!cancelled) setQr(dataUrl);
		}).catch(() => {
			if (!cancelled) setQr(null);
		});
		return () => {
			cancelled = true;
		};
	}, [
		open,
		qr,
		url
	]);
	const proceed = () => {
		if (isMobileDevice()) {
			window.open(url, "_blank", "noopener,noreferrer");
			return;
		}
		setOpen(true);
	};
	const handleClick = () => {
		if (capture && !hasCapturedLead()) {
			setLeadOpen(true);
			return;
		}
		proceed();
	};
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast({
				title: "Invite link copied",
				description: "Paste it into WhatsApp on your phone."
			});
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast({
				title: "Could not copy",
				description: url,
				variant: "destructive"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			...buttonProps,
			onClick: handleClick,
			children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
				className: "mr-2",
				size: 20
			}), label] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppLeadDialog, {
			open: leadOpen,
			onOpenChange: setLeadOpen,
			variant: "community",
			source: captureSource ?? `join-whatsapp:${typeof window !== "undefined" ? window.location.pathname : "/"}`,
			groupUrl: url,
			context: captureContext ?? groupName,
			onCaptured: proceed
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Join ", groupName] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "WhatsApp group invites work best from your phone. Scan this QR code with your phone camera to join instantly." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [
						qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qr,
							alt: "QR code to join the Tech Faculty WhatsApp group",
							className: "w-56 h-56 rounded-lg border border-border bg-card p-2"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-56 h-56 rounded-lg border border-border animate-pulse bg-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full",
								onClick: copyLink,
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "mr-2",
									size: 16
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
									className: "mr-2",
									size: 16
								}), copied ? "Link copied" : "Copy invite link"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "w-full",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
										className: "mr-2",
										size: 16
									}), "Open in browser instead"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground text-center",
							children: "Already have WhatsApp Desktop or WhatsApp Web signed in? \"Open in browser\" will take you straight to the group."
						})
					]
				})]
			})
		})
	] });
};
//#endregion
export { WhatsAppLeadDialog as n, hasCapturedLead as r, JoinWhatsAppButton as t };
