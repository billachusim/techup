import { i as mightHaveSession, r as isSupabaseLoaded, t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { t as createMiddleware } from "./createMiddleware-BiJSqR89.mjs";
import { t as createCsrfMiddleware } from "./createCsrfMiddleware-DFe1C9UR.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/start-GC_XMe0G.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
/**
* Attaches the signed-in user's bearer token to every server-function call so
* `requireSupabaseAuth` can verify it server-side.
*/
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	if (typeof window === "undefined") return next();
	if (!isSupabaseLoaded() && !mightHaveSession()) return next();
	const { data } = await (await getSupabase()).auth.getSession();
	const token = data.session?.access_token;
	if (!token) return next();
	return next({ headers: { Authorization: `Bearer ${token}` } });
});
var errorMiddleware = createMiddleware().server(async ({ request, next }) => {
	if (new URL(request.url).pathname.startsWith("/lovable/")) return next();
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({
	requestMiddleware: [errorMiddleware, csrfMiddleware],
	functionMiddleware: [attachSupabaseAuth]
}));
//#endregion
export { startInstance };
