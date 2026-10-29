import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Scrapers spend Firecrawl credits on every run, so only two callers may start one:
// the pg_cron schedule, which sends the secret stored in public.cron_secrets, and a
// signed-in admin pressing "Refresh now" on /admin.

/** Constant-time string comparison, so the secret can't be guessed byte by byte. */
function sameSecret(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/**
 * Returns null when the caller may run the job, otherwise the 401/403 response to send.
 * `supabase` must be a service-role client.
 */
export async function requireCronOrAdmin(
  req: Request,
  supabase: SupabaseClient,
  job: string,
  headers: Record<string, string>,
): Promise<Response | null> {
  const deny = (status: number, error: string) =>
    new Response(JSON.stringify({ success: false, error }), {
      status,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret) {
    const { data } = await supabase.from("cron_secrets").select("secret").eq("job", job).maybeSingle();
    return data?.secret && sameSecret(cronSecret, data.secret) ? null : deny(401, "Invalid schedule secret");
  }

  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const { data: auth } = token ? await supabase.auth.getUser(token) : { data: { user: null } };
  if (!auth.user) return deny(401, "Please sign in with an admin account");
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("role", "admin");
  return roles && roles.length > 0 ? null : deny(403, "Admins only");
}
