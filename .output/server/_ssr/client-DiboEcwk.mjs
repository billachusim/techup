import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/client-DiboEcwk.js
var RESULT = "lovable-preview-auth:result";
function readBrokerReply(data, requestId) {
	if (typeof data !== "object" || data === null) return null;
	if (!("type" in data) || data.type !== RESULT) return null;
	if (!("requestId" in data) || data.requestId !== requestId) return null;
	return {
		ok: "ok" in data && Boolean(data.ok),
		value: "value" in data && typeof data.value === "string" ? data.value : null
	};
}
/**
* On a Lovable preview surface, broker the auth session to the editor over
* postMessage so the project's preview surfaces share one login; else localStorage.
*/
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	const host = location.hostname;
	const projectId = [
		"lovableproject.com",
		"lovableproject-dev.com",
		"lovable.app",
		"gpt-eng.com",
		"gptengineer.run"
	].some((z) => host === z || host.endsWith("." + z)) ? (/* @__PURE__ */ new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-dev)?(?=\\.|$)", "i")).exec(host)?.[1] ?? (/* @__PURE__ */ new RegExp("^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?=[.-])", "i")).exec(host)?.[1] : void 0;
	const parentWindow = window.parent;
	if (!projectId || !(parentWindow !== null && parentWindow !== window)) return localStorage;
	const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
	const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
	const ancestor = location.ancestorOrigins?.[0] ?? (document.referrer ? new URL(document.referrer).origin : "");
	const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
	const TIMEOUT = 2e3;
	const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
	const request = (type, key, value) => new Promise((resolve) => {
		const requestId = newId();
		let done = false;
		const finish = (reply) => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(reply);
		};
		const onMessage = (e) => {
			if (!editorOrigins.includes(e.origin)) return;
			const reply = readBrokerReply(e.data, requestId);
			if (reply) finish(reply);
		};
		window.addEventListener("message", onMessage);
		const timer = setTimeout(() => {
			finish(null);
		}, TIMEOUT);
		const msg = {
			type,
			requestId,
			projectId,
			key
		};
		if (value !== void 0) msg.value = value;
		for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
	});
	let firstGet = true;
	const RETRY_DELAY = 250;
	const readLocal = (key) => {
		try {
			return localStorage.getItem(key);
		} catch {
			return;
		}
	};
	return {
		getItem: async (key) => {
			const local = readLocal(key);
			let res = await request("lovable-preview-auth:get", key, local ?? void 0);
			if (!res && firstGet) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				res = await request("lovable-preview-auth:get", key, local ?? void 0);
			}
			firstGet = false;
			if (res?.ok && res.value !== null) {
				if (res.value === "") {
					if (local !== void 0 && readLocal(key) === local) localStorage.removeItem(key);
					return null;
				}
				if (local === null && readLocal(key) === null) try {
					localStorage.setItem(key, res.value);
				} catch {}
				return res.value;
			}
			return localStorage.getItem(key);
		},
		setItem: (key, value) => {
			localStorage.setItem(key, value);
			return request("lovable-preview-auth:set", key, value).then((res) => {
				if (res?.ok && res.value !== null && localStorage.getItem(key) === value) if (res.value === "") localStorage.removeItem(key);
				else localStorage.setItem(key, res.value);
			});
		},
		removeItem: (key) => {
			const local = readLocal(key);
			localStorage.removeItem(key);
			return request("lovable-preview-auth:remove", key, local ?? void 0).then(() => {});
		}
	};
}
var client_exports = /* @__PURE__ */ __exportAll({ supabase: () => supabase });
var supabase = createClient("https://flxwtwzjslufglpwfjdx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseHd0d3pqc2x1ZmdscHdmamR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzE0NDgsImV4cCI6MjA3NzkwNzQ0OH0.vMnPWcrGQzptcCvnsclM3PHzxzdGu5MbyAS5EAlff1I", { auth: {
	storage: brokeredPreviewStorage(),
	persistSession: true,
	autoRefreshToken: true
} });
//#endregion
export { supabase as n, client_exports as t };
