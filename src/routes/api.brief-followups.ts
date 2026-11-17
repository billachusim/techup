import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Called by the brief-followups pg_cron job every morning (09:00 Lagos) with the
// "brief-followups" secret from cron_secrets. Anyone else is refused. Each run is
// logged to scheduled_job_runs.
export const Route = createFileRoute("/api/brief-followups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } =
          await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("cron_secrets")
          .select("secret")
          .eq("job", "brief-followups")
          .maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runBriefFollowups } =
          await import("@/lib/brief-followups.server");
        const started = Date.now();
        try {
          const result = await runBriefFollowups();
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "brief-followups",
            trigger: "cron",
            success: result.failed === 0,
            items: result.sent,
            report: result,
            duration_ms: Date.now() - started,
          });
          return Response.json({ ok: true, ...result });
        } catch (e) {
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "brief-followups",
            trigger: "cron",
            success: false,
            items: 0,
            report: { error: (e as Error).message },
            duration_ms: Date.now() - started,
          });
          return Response.json(
            { ok: false, error: (e as Error).message },
            { status: 500 },
          );
        }
      },
    },
  },
});
