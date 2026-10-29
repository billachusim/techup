import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Asks the site to send any due payment emails. The site route only accepts
 * callers that send the "payment-followups" secret from public.cron_secrets,
 * so `admin` must be a service-role client.
 */
export async function triggerPaymentFollowups(admin: SupabaseClient): Promise<unknown> {
  const siteUrl = Deno.env.get("SITE_URL") ?? "https://techfaculty.ng";
  const { data } = await admin.from("cron_secrets").select("secret").eq("job", "payment-followups").maybeSingle();
  if (!data?.secret) return { error: "payment-followups secret missing" };
  const res = await fetch(`${siteUrl}/api/payment-followups`, {
    method: "POST",
    headers: { "x-cron-secret": data.secret },
  });
  return await res.json().catch(() => ({ status: res.status }));
}
