import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

function env() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
}

export function supabaseForUser(ctx: ToolContext): SupabaseClient {
  const e = env();
  return createClient(e.SUPABASE_URL!, e.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function requireAuth(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) {
    return {
      error: {
        content: [{ type: "text" as const, text: "Not authenticated. Sign in to your Tech Faculty account to use this tool." }],
        isError: true as const,
      },
    };
  }
  return { error: null };
}