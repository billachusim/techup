import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron every Monday. It sends at most one report a day, to the
// fixed staff address, so it needs no secret.
export const Route = createFileRoute("/api/admin-weekly-report")({
  server: {
    handlers: {
      POST: async () => {
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
