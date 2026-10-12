import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabase } from "@/integrations/supabase/lazy";
import { useToast } from "@/hooks/use-toast";
import { describeCron, previousCronRun } from "@/lib/cron";

interface Run {
  ran_at: string;
  success: boolean;
  items: number;
  error: string | null;
}

interface CronJob {
  jobname: string;
  schedule: string;
  active: boolean;
  edge_function: string | null;
  last_started_at: string | null;
  last_status: string | null;
  last_message: string | null;
}

/** Scheduled edge functions that log each run and can be run by hand from here. */
const KNOWN = [
  {
    fn: "scrape-events",
    title: "Events directory",
    source: "Meetup, Eventbrite and Luma",
    unit: "events",
    defaultSchedule: "30 5 1,15 * *",
  },
  {
    fn: "scrape-jobs",
    title: "Jobs board",
    source: "Mercor, Micro1, Outlier and other job platforms",
    unit: "jobs",
    defaultSchedule: "0 5 1,15 * *",
  },
] as const;

type KnownFn = (typeof KNOWN)[number]["fn"];

/** A run due this long ago with no good run since means the schedule has stopped. */
const GRACE_MS = 6 * 3600e3;

// Tables and function below come from pending migrations not yet in generated types.
type Untyped = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (t: string) => any;
  rpc: (fn: string) => Promise<{ data: unknown; error: { message: string } | null }>;
};

async function loadRuns(fn: KnownFn): Promise<Run[]> {
  const supabase = (await getSupabase()) as unknown as Untyped;
  const { data, error } =
    fn === "scrape-events"
      ? await supabase
          .from("event_scrape_runs")
          .select("ran_at, success, items:upserted, error")
          .order("ran_at", { ascending: false })
          .limit(10)
      : await supabase
          .from("scheduled_job_runs")
          .select("ran_at, success, items, error")
          .eq("job", fn)
          .order("ran_at", { ascending: false })
          .limit(10);
  if (error) throw error;
  return (data ?? []) as Run[];
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" });

/** True when the schedule's most recent due time passed without a good run after it. */
function isStuck(schedule: string, lastOkAt: string | null | undefined): boolean {
  const due = previousCronRun(schedule);
  if (!due || Date.now() - due.getTime() < GRACE_MS) return false;
  return !lastOkAt || new Date(lastOkAt).getTime() < due.getTime() - 60e3;
}

/**
 * Every scheduled job on one card: when it runs, when it last worked, whether it looks stuck,
 * and (for the scrapers) a button to run it straight away.
 */
export function ScheduledJobsHealth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const cron = useQuery({
    queryKey: ["admin-scheduled-jobs"],
    queryFn: async () => {
      const supabase = (await getSupabase()) as unknown as Untyped;
      const { data, error } = await supabase.rpc("admin_scheduled_jobs");
      if (error) throw new Error(error.message);
      return (data ?? []) as CronJob[];
    },
    retry: false,
  });

  const runs = useQuery({
    queryKey: ["scheduled-job-runs"],
    queryFn: async () => {
      const entries = await Promise.all(
        KNOWN.map(async (k) => [k.fn, await loadRuns(k.fn).catch(() => null)] as const),
      );
      return Object.fromEntries(entries) as Record<KnownFn, Run[] | null>;
    },
  });

  const refresh = async (fn: KnownFn, title: string, unit: string) => {
    setBusy(fn);
    const supabase = await getSupabase();
    const { data, error } = await supabase.functions.invoke(fn, { body: { trigger: "admin" } });
    setBusy(null);
    queryClient.invalidateQueries({ queryKey: ["scheduled-job-runs"] });
    queryClient.invalidateQueries({ queryKey: ["admin-scheduled-jobs"] });
    if (error || !data?.success) {
      toast({
        title: `${title} not refreshed`,
        description: data?.error ?? error?.message ?? "The run failed. See the latest run below.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: `${title} refreshed`, description: `Saved ${data.upserted} ${unit}.` });
  };

  const cronJobs = cron.data ?? [];
  const knownFns = new Set<string>(KNOWN.map((k) => k.fn));
  const otherJobs = cronJobs.filter((j) => !j.edge_function || !knownFns.has(j.edge_function));

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Scheduled jobs
          </p>
          {cron.isError && (
            <p className="text-sm text-muted-foreground">
              The full schedule list is not available yet (its database update has not been run).
            </p>
          )}
        </div>

        <ul className="divide-y">
          {KNOWN.map((k) => {
            const job = cronJobs.find((j) => j.edge_function === k.fn);
            const schedule = job?.schedule ?? k.defaultSchedule;
            const list = runs.data?.[k.fn];
            const last = list?.[0];
            const lastOk = list?.find((r) => r.success);
            const missing = cron.isSuccess && !job;
            const paused = job && !job.active;
            const stuck = !runs.isLoading && list != null && !missing && !paused && isStuck(schedule, lastOk?.ran_at);
            return (
              <li key={k.fn} className="py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{k.title}</p>
                  <p className="text-sm text-muted-foreground">
                    From {k.source}, {describeCron(schedule)}.{" "}
                    {runs.isLoading
                      ? ""
                      : list == null
                        ? "Run history is not available yet."
                        : lastOk
                          ? `Last good run ${when(lastOk.ran_at)} (${lastOk.items} ${k.unit}).`
                          : "No successful run has been logged yet."}
                  </p>
                  {last && !last.success && (
                    <p className="text-sm text-destructive">Latest run failed: {last.error ?? "unknown error"}</p>
                  )}
                  {missing && <p className="text-sm text-destructive">Not scheduled. Run the latest database update.</p>}
                  {paused && <p className="text-sm text-destructive">The schedule is paused.</p>}
                  {stuck && (
                    <p className="text-sm text-destructive">
                      Looks stuck: the last scheduled run did not succeed. Run it now, and check the Firecrawl key and
                      credits if it fails.
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => refresh(k.fn, k.title, k.unit)}
                  disabled={busy !== null}
                  title="Each run uses Firecrawl credits"
                  className="shrink-0"
                >
                  {busy === k.fn && <Loader2 className="h-4 w-4 animate-spin" />}
                  Refresh now
                </Button>
              </li>
            );
          })}

          {otherJobs.map((j) => {
            const failed = j.last_status === "failed";
            const lastOkAt = j.last_status === "succeeded" ? j.last_started_at : null;
            // Without a run log only pg_cron's own record is known, so judge stuck from the latest start.
            const stuck = j.active && !failed && isStuck(j.schedule, lastOkAt ?? null);
            return (
              <li key={j.jobname} className="py-3 space-y-1">
                <p className="font-medium">{j.edge_function ?? j.jobname}</p>
                <p className="text-sm text-muted-foreground">
                  Runs {describeCron(j.schedule)}.{" "}
                  {j.last_started_at ? `Last started ${when(j.last_started_at)}.` : "No run recorded yet."}
                </p>
                {failed && <p className="text-sm text-destructive">Latest run failed: {j.last_message ?? "unknown error"}</p>}
                {!j.active && <p className="text-sm text-destructive">The schedule is paused.</p>}
                {stuck && <p className="text-sm text-destructive">Looks stuck: it missed its last scheduled run.</p>}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
