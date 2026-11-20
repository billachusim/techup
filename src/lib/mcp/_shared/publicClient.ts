import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

/** Read a runtime env var lazily, on Deno (edge function) or Node/Workers. */
function env(name: string): string | undefined {
  const g = globalThis as RuntimeGlobals;
  const value = g.Deno?.env?.get?.(name) ?? g.process?.env?.[name];
  return value?.trim() || undefined;
}

function publishableKey(): string | undefined {
  const direct = env("SUPABASE_PUBLISHABLE_KEY") ?? env("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (direct) return direct;
  const keyset = env("SUPABASE_PUBLISHABLE_KEYS");
  if (keyset) {
    try {
      const parsed: unknown = JSON.parse(keyset);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const keys = parsed as Record<string, unknown>;
        const key = [keys["default"], ...Object.values(keys)].find(
          (v): v is string => typeof v === "string" && v.trim().startsWith("sb_publishable_"),
        );
        if (key) return key.trim();
      }
    } catch {
      // Fall through to the legacy anon key.
    }
  }
  return env("SUPABASE_ANON_KEY") ?? env("VITE_SUPABASE_ANON_KEY");
}

/**
 * Anonymous (publishable-key) client for public reads. Row-level security applies as a signed-out
 * visitor. The MCP server is public (no sign-in), so this is the only database client its tools use.
 */
export function publicClient(): SupabaseClient | null {
  const url = env("SUPABASE_URL") ?? env("VITE_SUPABASE_URL");
  const key = publishableKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const SITE = "https://techfaculty.ng";

/** Lowercase haystack match for free-text filters. */
export const matches = (query: string | undefined, ...fields: Array<string | null | undefined | string[]>) => {
  if (!query?.trim()) return true;
  const hay = fields.flat().filter(Boolean).join(" ").toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};

/** Caller-visible failure result. */
export const toolError = (text: string) => ({ content: [{ type: "text" as const, text }], isError: true as const });
