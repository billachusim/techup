import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, t as arrayType, u as stringType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/whatsapp.functions-BLt9F19w.js
async function assertStaff(ctx) {
	const { data } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
	if (!data) throw new Error("Staff only");
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
var sendWhatsAppMessage_createServerFn_handler = createServerRpc({
	id: "9b0d04452f3d5ecdc8743a55f2cc793186ed30e48c0b301ee754fcb39b25711e",
	name: "sendWhatsAppMessage",
	filename: "src/lib/whatsapp.functions.ts"
}, (opts) => sendWhatsAppMessage.__executeServer(opts));
var sendWhatsAppMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SendInput.parse(d)).handler(sendWhatsAppMessage_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { sendWhatsApp } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		return {
			ok: true,
			id: (data.template ? await sendWhatsApp({
				to: data.to,
				template: data.template,
				sentBy: context.userId
			}) : await sendWhatsApp({
				to: data.to,
				text: data.text,
				sentBy: context.userId
			})).id
		};
	} catch (e) {
		return {
			ok: false,
			error: e.message
		};
	}
});
var listWhatsAppTemplates_createServerFn_handler = createServerRpc({
	id: "d75b03618f1a6d9b5d3576e9d6238dbfed6963144ececef27f745bf4d5912324",
	name: "listWhatsAppTemplates",
	filename: "src/lib/whatsapp.functions.ts"
}, (opts) => listWhatsAppTemplates.__executeServer(opts));
var listWhatsAppTemplates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listWhatsAppTemplates_createServerFn_handler, async ({ context }) => {
	await assertStaff(context);
	const { gateway } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		return {
			ok: true,
			templates: (await gateway("/message_templates?limit=100&fields=name,status,language,category,components"))?.data ?? []
		};
	} catch (e) {
		return {
			ok: false,
			templates: [],
			error: e.message
		};
	}
});
var TemplateInput = objectType({
	name: stringType().regex(/^[a-z0-9_]{1,512}$/, "Use lowercase letters, numbers and underscores"),
	language: stringType().min(2).max(15),
	category: enumType(["UTILITY", "MARKETING"]),
	body: stringType().trim().min(10).max(1024),
	examples: arrayType(stringType().min(1).max(200)).max(20)
});
var createWhatsAppTemplate_createServerFn_handler = createServerRpc({
	id: "06702f1e7141d9dcd6e5ed9d68b585d3aef52b36cafcbc0652e8c5b91c80d35b",
	name: "createWhatsAppTemplate",
	filename: "src/lib/whatsapp.functions.ts"
}, (opts) => createWhatsAppTemplate.__executeServer(opts));
var createWhatsAppTemplate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => TemplateInput.parse(d)).handler(createWhatsAppTemplate_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const vars = data.body.match(/\{\{\d+\}\}/g)?.length ?? 0;
	if (vars !== data.examples.length) return {
		ok: false,
		error: `Give one example for each of the ${vars} blanks.`
	};
	const { gateway } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		await gateway("/message_templates", {
			method: "POST",
			body: {
				name: data.name,
				language: data.language,
				category: data.category,
				components: [{
					type: "BODY",
					text: data.body,
					...vars ? { example: { body_text: [data.examples] } } : {}
				}]
			}
		});
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: e.message
		};
	}
});
var deleteWhatsAppTemplate_createServerFn_handler = createServerRpc({
	id: "2b52d2442a7b106e74363f310022d806594a937df9d57a18e18267a5bba8b52f",
	name: "deleteWhatsAppTemplate",
	filename: "src/lib/whatsapp.functions.ts"
}, (opts) => deleteWhatsAppTemplate.__executeServer(opts));
var deleteWhatsAppTemplate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ name: stringType().regex(/^[a-z0-9_]+$/) }).parse(d)).handler(deleteWhatsAppTemplate_createServerFn_handler, async ({ data, context }) => {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) return {
		ok: false,
		error: "Admins only"
	};
	const { gateway } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		await gateway(`/message_templates?name=${encodeURIComponent(data.name)}`, { method: "DELETE" });
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: e.message
		};
	}
});
var getWhatsAppMedia_createServerFn_handler = createServerRpc({
	id: "cf7afe7113d86c5d213c73cf5ab5e92a12a77ce0b3b98e8cb69384cc956ddb88",
	name: "getWhatsAppMedia",
	filename: "src/lib/whatsapp.functions.ts"
}, (opts) => getWhatsAppMedia.__executeServer(opts));
var getWhatsAppMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ mediaId: stringType().regex(/^\d+$/) }).parse(d)).handler(getWhatsAppMedia_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const MAX = 8388608;
	const { gateway } = await import("./whatsapp.server-CW9tC6q2.mjs");
	try {
		const meta = await gateway(`/media/${data.mediaId}`);
		if (Number(meta?.file_size ?? 0) > MAX) return {
			ok: false,
			error: "File is too large to preview (over 8 MB)."
		};
		const res = await fetch("https://connector-gateway.lovable.dev/whatsapp/media_download", { headers: {
			Authorization: `Bearer ${processModule.env["LOVABLE_API_KEY"]}`,
			"X-Connection-Api-Key": processModule.env["WHATSAPP_API_KEY"] ?? "",
			"X-WhatsApp-Media-URL": meta.url
		} });
		if (!res.ok || !res.body) return {
			ok: false,
			error: `Download failed [${res.status}]`
		};
		const reader = res.body.getReader();
		const chunks = [];
		let total = 0;
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.byteLength;
			if (total > MAX) {
				await reader.cancel();
				return {
					ok: false,
					error: "File is too large to preview."
				};
			}
			chunks.push(value);
		}
		const buf = new Uint8Array(total);
		let o = 0;
		for (const c of chunks) {
			buf.set(c, o);
			o += c.byteLength;
		}
		let bin = "";
		for (let i = 0; i < buf.length; i += 32768) bin += String.fromCharCode(...buf.subarray(i, i + 32768));
		const mime = res.headers.get("content-type") ?? meta.mime_type ?? "application/octet-stream";
		return {
			ok: true,
			dataUrl: `data:${mime};base64,${btoa(bin)}`,
			mime
		};
	} catch (e) {
		return {
			ok: false,
			error: e.message
		};
	}
});
//#endregion
export { createWhatsAppTemplate_createServerFn_handler, deleteWhatsAppTemplate_createServerFn_handler, getWhatsAppMedia_createServerFn_handler, listWhatsAppTemplates_createServerFn_handler, sendWhatsAppMessage_createServerFn_handler };
