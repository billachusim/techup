import { createFileRoute } from "@tanstack/react-router";

function sameKey(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// Called by pg_cron with the "admin-digest" secret from cron_secrets. Anyone else is refused.
export const Route = createFileRoute("/api/admin-digest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("cron_secrets")
          .select("secret")
          .eq("job", "admin-digest")
          .maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runAdminDigest } = await import("@/lib/admin-digest.server");
        try {
          return Response.json(await runAdminDigest());
        } catch (e) {
          console.error("admin-digest error", (e as Error).message);
          return Response.json({ error: "Could not send the digest" }, { status: 500 });
        }
      },
    },
  },
});
