import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// The Supabase client is ~56 KB gzip, so pages that only need it for a button
// press or for a signed-in visitor load it on demand instead of on every page.
// Import it like this:
// const supabase = await getSupabase();

type Client = SupabaseClient<Database>;

let clientPromise: Promise<Client> | null = null;
let loadedClient: Client | null = null;
const listeners = new Set<(client: Client) => void>();

export function getSupabase(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = import("./client").then(
      ({ supabase }) => {
        loadedClient = supabase;
        for (const listener of listeners) listener(supabase);
        listeners.clear();
        return supabase;
      },
      (error) => {
        clientPromise = null;
        throw error;
      },
    );
  }
  return clientPromise;
}

export function isSupabaseLoaded() {
  return loadedClient !== null;
}

/** Calls `listener` once the client has loaded, right away if it already has. */
export function onSupabaseLoaded(listener: (client: Client) => void) {
  if (loadedClient) {
    listener(loadedClient);
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const AUTH_TOKEN_KEY = /^sb-.+-auth-token$/;

export function isAuthStorageKey(key: string | null) {
  return key !== null && AUTH_TOKEN_KEY.test(key);
}

// Lovable preview surfaces keep the session with the editor rather than in
// localStorage (see previewAuthStorage.ts), so a missing local token there
// says nothing about whether the visitor is signed in.
const PREVIEW_ZONES = [
  "lovableproject.com",
  "lovableproject-dev.com",
  "lovable.app",
  "gpt-eng.com",
  "gptengineer.run",
];

/**
 * False only when this browser certainly has no Supabase session: no stored
 * auth token, no sign-in redirect in the URL, and not a Lovable preview.
 */
export function mightHaveSession() {
  if (typeof window === "undefined") return false;
  const host = location.hostname;
  if (PREVIEW_ZONES.some((zone) => host === zone || host.endsWith("." + zone))) return true;
  // OAuth, magic-link, email-confirmation and password-reset redirects land
  // with tokens or a code in the URL, which the client picks up when created.
  if (/[#&](access_token|error_description)=/.test(location.hash)) return true;
  if (/[?&]code=/.test(location.search)) return true;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      if (isAuthStorageKey(localStorage.key(i))) return true;
    }
  } catch {
    return true;
  }
  return false;
}
