import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/lazy";

interface SourceRow {
  page: string;
  leads: number;
  checked_out: number;
  paid: number;
}

/** Shape returned by the admin_conversion_funnel database function. */
export interface FunnelData {
  generated_at: string;
  period_days: number;
  leads: number;
  checked_out: number;
  paid: number;
  by_source: SourceRow[];
  all_checkouts: { started: number; paid: number };
}

const num = (n: number) => n.toLocaleString();

/** Share of `part` in `whole` as a whole-number percentage, or "—" when there is nothing to divide. */
export function percent(part: number, whole: number) {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";
}

const TOP_SOURCES = 8;

/** Leads -> checkouts started -> paid for the chosen period, with a per-page breakdown. */
export function ConversionFunnel({ days }: { days: number }) {
  const [data, setData] = useState<FunnelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const supabase = await getSupabase();
        // The database function checks the admin role itself and refuses everyone else.
        const rpc = supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
        const { data: result, error: rpcError } = await rpc.call(
          supabase,
          "admin_conversion_funnel",
          { _days: days },
        );
        if (rpcError) throw new Error(rpcError.message);
        if (!cancelled) setData(result as FunnelData);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const period = `last ${days} days`;
  const steps = data
    ? [
        {
          label: "Leads",
          value: data.leads,
          hint: "Left their email or WhatsApp number",
        },
        {
          label: "Started checkout",
          value: data.checked_out,
          hint: "Then began a paid enrolment",
        },
        {
          label: "Paid",
          value: data.paid,
          hint: "Payment confirmed online or by an admin",
        },
      ]
    : [];
  const max = Math.max(1, data?.leads ?? 0);
  const top = data?.by_source.slice(0, TOP_SOURCES) ?? [];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-sm">Lead conversion, {period}</p>
          {data && (
            <p className="text-xs text-muted-foreground">
              {percent(data.paid, data.leads)} of leads paid
            </p>
          )}
        </div>

        {error ? (
          <p className="text-sm text-destructive">
            Couldn't load the funnel: {error}
          </p>
        ) : !data ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <div
              className="space-y-3"
              role="img"
              aria-label={`Of ${data.leads} leads, ${data.checked_out} started checkout and ${data.paid} paid`}
            >
              {steps.map((s, i) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between gap-2 text-xs">
                    <span>
                      <span className="font-medium">{s.label}</span>
                      <span className="text-muted-foreground"> · {s.hint}</span>
                    </span>
                    <span className="tabular-nums">
                      {num(s.value)}
                      {i > 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({percent(s.value, steps[i - 1].value)} of previous)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{
                        width:
                          s.value > 0
                            ? `max(4px, ${(s.value / max) * 100}%)`
                            : 0,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                By source page
              </p>
              {data.by_source.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No leads in the {period}.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="py-1 pr-2 font-normal">Page</th>
                        <th className="py-1 px-2 font-normal text-right">
                          Leads
                        </th>
                        <th className="py-1 px-2 font-normal text-right">
                          Checkout
                        </th>
                        <th className="py-1 px-2 font-normal text-right">
                          Paid
                        </th>
                        <th className="py-1 pl-2 font-normal text-right">
                          Lead to paid
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(showAll ? data.by_source : top).map((r) => (
                        <SourceTableRow key={r.page} row={r} />
                      ))}
                    </tbody>
                  </table>
                  {data.by_source.length > TOP_SOURCES && (
                    <button
                      type="button"
                      className="mt-1 text-xs text-muted-foreground underline"
                      onClick={() => setShowAll((v) => !v)}
                    >
                      {showAll
                        ? "Show fewer pages"
                        : `Show all ${data.by_source.length} pages`}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              A lead counts as converted when a student with the same email or
              phone number started a paid checkout after leaving it. All
              checkouts in the {period}, from leads or not:{" "}
              {num(data.all_checkouts.started)} started,{" "}
              {num(data.all_checkouts.paid)} paid.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SourceTableRow({ row }: { row: SourceRow }) {
  return (
    <tr className="border-t border-border">
      <td className="py-1 pr-2 max-w-[16rem] truncate" title={row.page}>
        {row.page}
      </td>
      <td className="py-1 px-2 text-right tabular-nums">{num(row.leads)}</td>
      <td className="py-1 px-2 text-right tabular-nums">
        {num(row.checked_out)}
      </td>
      <td className="py-1 px-2 text-right tabular-nums">{num(row.paid)}</td>
      <td className="py-1 pl-2 text-right tabular-nums">
        {percent(row.paid, row.leads)}
      </td>
    </tr>
  );
}
