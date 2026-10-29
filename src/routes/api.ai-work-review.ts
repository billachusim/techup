import { createFileRoute } from "@tanstack/react-router";

function sameKey(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// Called by pg_cron every 5 minutes with the "ai-work-review" secret from
// cron_secrets, to score student work the instant review missed. Each run
// spends AI credits, so anyone else is refused.
export const Route = createFileRoute("/api/ai-work-review")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("cron_secrets")
          .select("secret")
          .eq("job", "ai-work-review")
          .maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runAiWorkReviewSweep } = await import("@/lib/ai-work-review.server");
        try {
          return Response.json(await runAiWorkReviewSweep());
        } catch (e) {
          console.error("ai-work-review error", (e as Error).message);
          return Response.json({ error: "Could not review student work" }, { status: 500 });
        }
      },
    },
  },
});
