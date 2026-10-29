//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/lazy-BHIYDGla.js
var clientPromise = null;
var loadedClient = null;
var listeners = /* @__PURE__ */ new Set();
function getSupabase() {
	if (!clientPromise) clientPromise = import("../_libs/_.mjs").then((n) => n.t).then(({ supabase }) => {
		loadedClient = supabase;
		for (const listener of listeners) listener(supabase);
		listeners.clear();
		return supabase;
	}, (error) => {
		clientPromise = null;
		throw error;
	});
	return clientPromise;
}
function isSupabaseLoaded() {
	return loadedClient !== null;
}
/** Calls `listener` once the client has loaded, right away if it already has. */
function onSupabaseLoaded(listener) {
	if (loadedClient) {
		listener(loadedClient);
		return () => {};
	}
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
var AUTH_TOKEN_KEY = /^sb-.+-auth-token$/;
function isAuthStorageKey(key) {
	return key !== null && AUTH_TOKEN_KEY.test(key);
}
var PREVIEW_ZONES = [
	"lovableproject.com",
	"lovableproject-dev.com",
	"lovable.app",
	"gpt-eng.com",
	"gptengineer.run"
];
/**
* False only when this browser certainly has no Supabase session: no stored
* auth token, no sign-in redirect in the URL, and not a Lovable preview.
*/
function mightHaveSession() {
	if (typeof window === "undefined") return false;
	const host = location.hostname;
	if (PREVIEW_ZONES.some((zone) => host === zone || host.endsWith("." + zone))) return true;
	if (/[#&](access_token|error_description)=/.test(location.hash)) return true;
	if (/[?&]code=/.test(location.search)) return true;
	try {
		for (let i = 0; i < localStorage.length; i++) if (isAuthStorageKey(localStorage.key(i))) return true;
	} catch {
		return true;
	}
	return false;
}
//#endregion
export { onSupabaseLoaded as a, mightHaveSession as i, isAuthStorageKey as n, isSupabaseLoaded as r, getSupabase as t };
