import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Twice-weekly rescan, called by pg_cron with the secret stored in cron_secrets ('auto-match').
export const Route = createFileRoute("/api/public/jobs/auto-match")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const given = request.headers.get("x-cron-secret") ?? "";
        const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "auto-match").maybeSingle();
        if (!data?.secret || !sameKey(given, data.secret)) return new Response("Unauthorized", { status: 401 });

        const started = Date.now();
        const { runAutoMatch } = await import("@/lib/matching.server");
        try {
          const res = await runAutoMatch();
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "auto-match", trigger: "cron", success: true, items: res.created,
            report: res, duration_ms: Date.now() - started,
          });
          return Response.json(res);
        } catch (e) {
          const msg = (e as Error).message;
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "auto-match", trigger: "cron", success: false, items: 0, report: {}, error: msg, duration_ms: Date.now() - started,
          });
          return Response.json({ error: "Auto-match failed" }, { status: 500 });
        }
      },
    },
  },
});
