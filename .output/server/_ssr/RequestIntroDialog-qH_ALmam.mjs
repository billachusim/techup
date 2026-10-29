import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { S as introRequestUrl } from "./talent-CymeyHOO.mjs";
import { n as notifyIntroRequest } from "./public-requests.functions-2w0aaxeq.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/RequestIntroDialog-qH_ALmam.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var RequestIntroDialog = ({ talentId, talentName, skills, source = "talent_pool", trigger, onRequested }) => {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		org: "",
		contact: "",
		message: ""
	});
	const firstName = talentName.split(" ")[0];
	const submit = async () => {
		if (form.name.trim().length < 2 || form.contact.trim().length < 5) {
			toast({
				title: "Almost there",
				description: "Add your name and a phone number or email we can reply to.",
				variant: "destructive"
			});
			return;
		}
		setSending(true);
		const { error } = await (await getSupabase()).rpc("request_talent_intro", {
			_profile_id: talentId,
			_requester_name: form.name.trim().slice(0, 120),
			_requester_contact: form.contact.trim().slice(0, 160),
			_requester_org: form.org.trim().slice(0, 160) || void 0,
			_message: form.message.trim().slice(0, 1e3) || void 0,
			_source: source
		});
		setSending(false);
		if (error) {
			toast({
				title: "Could not send that",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "Request received",
			description: `We will introduce you to ${firstName} on WhatsApp shortly.`
		});
		try {
			await notifyIntroRequest({ data: {
				talentId,
				contact: form.contact.trim().slice(0, 160)
			} });
		} catch {}
		onRequested?.();
		setOpen(false);
		setForm({
			name: "",
			org: "",
			contact: "",
			message: ""
		});
		window.open(introRequestUrl(talentName, skills), "_blank", "noopener,noreferrer");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Request an introduction to ", firstName] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Tell us who you are and we handle the introduction, the assessment and the working agreement on WhatsApp." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "intro-name",
						children: "Your name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "intro-name",
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						}),
						maxLength: 120
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "intro-org",
						children: "Company (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "intro-org",
						value: form.org,
						onChange: (e) => setForm({
							...form,
							org: e.target.value
						}),
						maxLength: 160
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "intro-contact",
						children: "WhatsApp number or email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "intro-contact",
						value: form.contact,
						onChange: (e) => setForm({
							...form,
							contact: e.target.value
						}),
						maxLength: 160
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "intro-message",
						children: "What do you need done? (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "intro-message",
						rows: 3,
						value: form.message,
						onChange: (e) => setForm({
							...form,
							message: e.target.value
						}),
						maxLength: 1e3
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: submit,
						disabled: sending,
						children: [sending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "mr-1.5 animate-spin"
						}), "Send request and open WhatsApp"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Contact details, emails and CVs of our talent stay private."
					})
				]
			})]
		})]
	});
};
//#endregion
export { RequestIntroDialog as t };
