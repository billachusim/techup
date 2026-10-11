import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarSync, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabase } from "@/integrations/supabase/lazy";
import { useToast } from "@/hooks/use-toast";

interface ScrapeRun {
  ran_at: string;
  trigger: string;
  success: boolean;
  upserted: number;
  error: string | null;
}

/** No good run for longer than this means the 1st/15th schedule has stopped. */
const STALE_AFTER_DAYS = 17;

/**
 * Shows when the /events directory was last refreshed from Meetup, Eventbrite and Luma,
 * whether that run worked, and lets an admin run it straight away.
 */
export function EventsRefreshStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: runs = [], isLoading } = useQuery({
    queryKey: ["event-scrape-runs"],
    queryFn: async () => {
      const supabase = await getSupabase();
      // Table comes from a pending migration not yet in generated types.
      const { data, error } = await (supabase as unknown as { from: (t: string) => any })
        .from("event_scrape_runs")
        .select("ran_at, trigger, success, upserted, error")
        .order("ran_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as ScrapeRun[];
    },
  });

  const refresh = async () => {
    setBusy(true);
    const supabase = await getSupabase();
    const { data, error } = await supabase.functions.invoke("scrape-events", { body: { trigger: "admin" } });
    setBusy(false);
    queryClient.invalidateQueries({ queryKey: ["event-scrape-runs"] });
    if (error || !data?.success) {
      toast({
        title: "Events not refreshed",
        description: data?.error ?? error?.message ?? "The scrape failed. See the latest run below.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Events refreshed", description: `Saved ${data.upserted} upcoming events.` });
  };

  const last = runs[0];
  const lastOk = runs.find((r) => r.success);
  const stale = !lastOk || Date.now() - new Date(lastOk.ran_at).getTime() > STALE_AFTER_DAYS * 864e5;
  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" });

  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <CalendarSync className="h-5 w-5 text-primary" />
            Events directory
          </p>
          <p className="text-sm text-muted-foreground">
            Refreshes automatically on the 1st and 15th of each month.{" "}
            {isLoading
              ? ""
              : lastOk
                ? `Last good refresh ${when(lastOk.ran_at)} (${lastOk.upserted} events).`
                : "No successful refresh has been logged yet."}
          </p>
          {!isLoading && last && !last.success && (
            <p className="text-sm text-destructive">Latest run failed: {last.error ?? "unknown error"}</p>
          )}
          {!isLoading && stale && (
            <p className="text-sm text-destructive">
              The schedule looks stopped. Run it now, and check the Firecrawl key and credits if it fails.
            </p>
          )}
        </div>
        <Button onClick={refresh} disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Refresh now
        </Button>
      </CardContent>
    </Card>
  );
}
