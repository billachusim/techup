import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Anonymous (publishable-key) client for public reads. Row-level security applies as a signed-out visitor. */
export function publicClient(): SupabaseClient | null {
  const g = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    Deno?: { env: { get(key: string): string | undefined } };
  };
  const get = (k: string) => g.process?.env?.[k] ?? g.Deno?.env.get(k);
  const url = get("SUPABASE_URL");
  const key = get("SUPABASE_PUBLISHABLE_KEY") ?? get("SUPABASE_ANON_KEY");
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
