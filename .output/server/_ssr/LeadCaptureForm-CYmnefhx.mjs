import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, Ft as CircleCheck, X as Mail, gt as FileDown, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as SUCCESS_KIT } from "./successKit-Ca2aXOxu.mjs";
import { i as trackLead } from "./analytics-BrZRoVBL.mjs";
import { n as clampLeadField, t as Checkbox } from "./checkbox-o9PPpNJX.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/LeadCaptureForm-CYmnefhx.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var UNLOCK_KEY = "tf_checklist_unlocked";
var successCopy = {
	free_checklist: {
		title: "Your free SIWES checklist is ready",
		body: "Download it instantly below — we've also noted your contact in case we need to resend it."
	},
	success_kit: {
		title: "Kit reserved — we'll confirm shortly",
		body: "Our team replies within one working day with payment details and your download link. Nothing is charged automatically."
	},
	partner_enquiry: {
		title: "Enquiry received",
		body: "Our partnerships team reviews every business enquiry within two working days and replies with a proposal and quote for your team."
	},
	siwes_placement: {
		title: "Placement request received",
		body: "A SIWES coordinator will contact you with available tracks, dates and the nearest Tech Faculty centre."
	},
	virtual_siwes: {
		title: "Virtual IT slot requested",
		body: "A coordinator replies within one working day with your payment details and start date. The ₦45,000 placement fee confirms your slot — nothing is charged automatically, and your acceptance letter follows within 48 hours of payment."
	},
	logbook_service: {
		title: "Logbook pickup requested",
		body: "We reply within one working day with payment details for the ₦15,000 service and confirm your courier pickup window. Review, signing, stamping and the return delivery are all included."
	},
	free_bootcamp: {
		title: "Your free bootcamp seat is requested",
		body: "A coordinator will contact you with the next start date and your campus address. The bootcamp is free, so there is nothing to pay."
	}
};
var LeadCaptureForm = ({ interest, source, submitLabel = "Send it to me", hint, whatsappMessage, compact = false, extraFields = [], initialExtras, schoolLabel = "School or institution", schoolPlaceholder = "e.g. Nnamdi Azikiwe University" }) => {
	const [channel, setChannel] = (0, import_react.useState)("email");
	const [name, setName] = (0, import_react.useState)("");
	const [contact, setContact] = (0, import_react.useState)("");
	const [school, setSchool] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [whatsappOptIn, setWhatsappOptIn] = (0, import_react.useState)(false);
	const [emailOptIn, setEmailOptIn] = (0, import_react.useState)(false);
	const [extras, setExtras] = (0, import_react.useState)(initialExtras ?? {});
	(0, import_react.useEffect)(() => {
		if (initialExtras) setExtras((prev) => ({
			...prev,
			...initialExtras
		}));
	}, [initialExtras]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	const [notesValue, setNotesValue] = (0, import_react.useState)(null);
	const [unlocking, setUnlocking] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [unlocked, setUnlocked] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem(UNLOCK_KEY) === "1";
		} catch {
			return false;
		}
	});
	const valid = channel === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()) : contact.replace(/\D/g, "").length >= 10;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!valid) {
			setError(channel === "email" ? "Enter a valid email address." : "Enter a valid WhatsApp number (at least 10 digits).");
			return;
		}
		const missing = extraFields.find((f) => f.required && !extras[f.id]?.trim());
		if (missing) {
			setError(`Please fill in "${missing.label}".`);
			return;
		}
		setStatus("saving");
		setError(null);
		const notes = extraFields.map((f) => extras[f.id]?.trim() ? `${f.label}: ${extras[f.id].trim()}` : null).filter(Boolean).join(" | ");
		const { error: insertError } = await (await getSupabase()).from("leads").insert({
			name: clampLeadField(name, "name"),
			channel,
			contact: clampLeadField(contact, "contact") ?? "",
			school: clampLeadField(school, "school"),
			location: clampLeadField(location, "location"),
			email: channel === "email" ? clampLeadField(contact.toLowerCase(), "email") : null,
			interest,
			source: clampLeadField(source, "source"),
			notes: clampLeadField(notes, "notes"),
			whatsapp_opt_in: channel === "whatsapp" && whatsappOptIn,
			email_marketing_opt_in: channel === "email" && emailOptIn
		});
		if (insertError) {
			setStatus("idle");
			setError("We couldn't save that. Please try again, or reach us on WhatsApp.");
			return;
		}
		trackLead("lead_capture", {
			interest,
			lead_source: source,
			channel
		});
		setNotesValue(notes || null);
		setStatus("done");
	};
	const unlockWhatsApp = () => {
		setUnlocking(true);
		try {
			localStorage.setItem(UNLOCK_KEY, "1");
		} catch {}
		getSupabase().then((supabase) => supabase.from("leads").insert({
			name: clampLeadField(name, "name"),
			channel,
			contact: clampLeadField(contact, "contact") ?? "",
			school: clampLeadField(school, "school"),
			location: clampLeadField(location, "location"),
			email: channel === "email" ? clampLeadField(contact.toLowerCase(), "email") : null,
			interest,
			source: clampLeadField(`${source}#whatsapp-unlock`, "source"),
			notes: clampLeadField([notesValue, "WhatsApp unlock clicked (checklist download unlocked)"].filter(Boolean).join(" | "), "notes")
		}));
		window.setTimeout(() => {
			setUnlocked(true);
			setUnlocking(false);
		}, 1200);
	};
	const waHref = `https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(whatsappMessage ?? "Hello Tech Faculty, I just submitted the SIWES form on your website.")}`;
	if (status === "done") {
		const copy = successCopy[interest];
		const gated = interest === "free_checklist";
		const checklistWa = `https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(`Hello Tech Faculty, I'd like the free SIWES Placement Checklist.${name.trim() ? ` Name: ${name.trim()}.` : ""}${school.trim() ? ` School: ${school.trim()}.` : ""}`)}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: gated && !unlocked ? "One quick step to unlock your checklist" : copy.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: gated && !unlocked ? "Send us the pre-filled WhatsApp message (and save our number) — your download unlocks right after." : copy.body
					})] })]
				}),
				gated ? unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full sm:w-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/downloads/siwes-placement-checklist.pdf",
						download: "SIWES-Placement-Checklist-TechFaculty.pdf",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {
							size: 16,
							className: "mr-2"
						}), "Download the checklist (PDF)"]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full sm:w-auto",
							disabled: unlocking,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: checklistWa,
								target: "_blank",
								rel: "noopener noreferrer",
								onClick: unlockWhatsApp,
								children: [unlocking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									size: 16,
									className: "mr-2 animate-spin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
									size: 16,
									className: "mr-2"
								}), unlocking ? "Unlocking your download…" : "Message us on WhatsApp to unlock"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Save our number so you get replies:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: ["+", SUCCESS_KIT.whatsappNumber]
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "underline underline-offset-2 hover:text-foreground",
									onClick: () => {
										navigator.clipboard?.writeText(`+${SUCCESS_KIT.whatsappNumber}`);
										setCopied(true);
										window.setTimeout(() => setCopied(false), 1500);
									},
									children: copied ? "Copied" : "Copy number"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"WhatsApp didn't open?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "underline underline-offset-2 hover:text-foreground",
									onClick: unlockWhatsApp,
									children: "Tap here to continue to your download"
								}),
								"."
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Sent to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: contact
						}),
						channel === "whatsapp" ? " on WhatsApp" : " by email",
						"."
					]
				}),
				(!gated || unlocked) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: waHref,
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							size: 14,
							className: "mr-2"
						}), "Continue on WhatsApp"]
					})
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		children: [
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex rounded-md border border-border p-1 bg-muted/40",
				role: "group",
				"aria-label": "Choose how we contact you",
				children: ["email", "whatsapp"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setChannel(c);
						setContact("");
						setError(null);
					},
					"aria-pressed": channel === c,
					className: `px-3 py-1.5 text-sm rounded-[4px] flex items-center gap-1.5 transition-colors ${channel === c ? "bg-background font-medium shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
					children: [c === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 14 }), c === "email" ? "Email" : "WhatsApp"]
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `lead-name-${interest}`,
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `lead-name-${interest}`,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Chisom Okeke",
							autoComplete: "name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `lead-contact-${interest}`,
							children: channel === "email" ? "Email address" : "WhatsApp number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `lead-contact-${interest}`,
							value: contact,
							onChange: (e) => setContact(e.target.value),
							inputMode: channel === "email" ? "email" : "tel",
							type: channel === "email" ? "email" : "tel",
							autoComplete: channel === "email" ? "email" : "tel",
							placeholder: channel === "email" ? "you@example.com" : "0803 000 0000",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: `lead-location-${interest}`,
							children: ["City / State ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `lead-location-${interest}`,
							value: location,
							onChange: (e) => setLocation(e.target.value),
							placeholder: "e.g. Awka, Anambra",
							autoComplete: "address-level2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: `lead-school-${interest}`,
							children: [
								schoolLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-normal",
									children: "(optional)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `lead-school-${interest}`,
							value: school,
							onChange: (e) => setSchool(e.target.value),
							placeholder: schoolPlaceholder
						})]
					}),
					extraFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: `lead-${interest}-${f.id}`,
							children: [f.label, !f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: " (optional)"
							})]
						}), f.options ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: `lead-${interest}-${f.id}`,
							value: extras[f.id] ?? "",
							onChange: (e) => setExtras((prev) => ({
								...prev,
								[f.id]: e.target.value
							})),
							className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: f.placeholder ?? "Choose one"
							}), f.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: o,
								children: o
							}, o))]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `lead-${interest}-${f.id}`,
							value: extras[f.id] ?? "",
							onChange: (e) => setExtras((prev) => ({
								...prev,
								[f.id]: e.target.value
							})),
							placeholder: f.placeholder
						})]
					}, f.id))
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				role: "alert",
				children: error
			}),
			channel === "whatsapp" && [
				"free_checklist",
				"siwes_placement",
				"virtual_siwes",
				"free_bootcamp"
			].includes(interest) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					id: `lead-whatsapp-opt-in-${interest}`,
					checked: whatsappOptIn,
					onCheckedChange: (checked) => setWhatsappOptIn(checked === true),
					"aria-label": "Agree to WhatsApp updates and follow-ups"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `lead-whatsapp-opt-in-${interest}`,
					className: "font-normal leading-relaxed",
					children: "I agree to receive WhatsApp updates and follow-ups from Tech Faculty about this request. Reply STOP anytime to opt out."
				})]
			}),
			channel === "email" && interest !== "partner_enquiry" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					id: `lead-email-opt-in-${interest}`,
					checked: emailOptIn,
					onCheckedChange: (checked) => setEmailOptIn(checked === true)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `lead-email-opt-in-${interest}`,
					className: "font-normal leading-relaxed",
					children: "I agree to receive admissions follow-up emails and programme updates from Tech Faculty. I can unsubscribe anytime."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "w-full sm:w-auto",
				disabled: status === "saving",
				children: [status === "saving" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					size: 16,
					className: "mr-2 animate-spin"
				}), submitLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: channel === "whatsapp" ? "We use your details to respond to this request. Automated WhatsApp follow-ups are sent only if you check the consent box above." : "We use your details only to send what you asked for. No spam."
			})
		]
	});
};
//#endregion
export { LeadCaptureForm as t };
