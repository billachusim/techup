import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/router-compat";
import { Loader2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/lazy";
import { needsYouTodayRows, type NeedsYouTodayCounts } from "@/lib/needs-you-today";

/** Admin strip at the top of /admin: what is waiting, each linking to its page. */
export function NeedsYouToday() {
  const [rows, setRows] = useState<ReturnType<typeof needsYouTodayRows> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.rpc("admin_needs_you_today");
      if (!active) return;
      if (error) setError(error.message);
      else setRows(needsYouTodayRows(data as unknown as NeedsYouTodayCounts));
    })();
    return () => { active = false; };
  }, []);

  const total = rows?.reduce((n, r) => n + r.count, 0) ?? 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Needs you today</h2>
      {error ? (
        <p className="text-sm text-muted-foreground">Could not load the queues: {error}</p>
      ) : !rows ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map((r) => (
              <Link key={r.key} to={r.path} className="group">
                <Card className={`h-full transition-colors group-hover:border-primary/50 ${r.count > 0 ? "border-primary/40" : ""}`}>
                  <CardContent className="p-4">
                    <p className={`text-2xl font-bold ${r.count > 0 ? "text-primary" : "text-muted-foreground"}`}>{r.count}</p>
                    <p className="text-sm text-muted-foreground">{r.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {total === 0 && <p className="text-sm text-muted-foreground">Nothing is waiting. A summary is emailed each morning when something is.</p>}
        </>
      )}
    </section>
  );
}
