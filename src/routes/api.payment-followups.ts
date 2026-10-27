import { createFileRoute } from "@tanstack/react-router";

function sameKey(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// Called by the recover-checkouts and verify-payment edge functions, which send
// the "payment-followups" secret from cron_secrets. Anyone else is refused.
export const Route = createFileRoute("/api/payment-followups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("cron_secrets")
          .select("secret")
          .eq("job", "payment-followups")
          .maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runPaymentFollowups } = await import("@/lib/payment-followups.server");
        try {
          return Response.json(await runPaymentFollowups());
        } catch (e) {
          console.error("payment-followups error", (e as Error).message);
          return Response.json({ error: "Could not send follow-up emails" }, { status: 500 });
        }
      },
    },
  },
});
