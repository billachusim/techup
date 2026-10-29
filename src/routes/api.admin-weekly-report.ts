import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Called by pg_cron every Monday with the "admin-weekly-report" secret from
// cron_secrets. Anyone else is refused. It sends at most one report a day.
export const Route = createFileRoute("/api/admin-weekly-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "admin-weekly-report").maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runWeeklyReport } = await import("@/lib/admin-weekly-report.server");
        try {
          return Response.json(await runWeeklyReport());
        } catch (e) {
          console.error("admin-weekly-report error", (e as Error).message);
          return Response.json({ error: "Could not send the weekly report" }, { status: 500 });
        }
      },
    },
  },
});
