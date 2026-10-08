import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { Loader2, RefreshCw } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/lazy";

interface Money { currency: string; amount: number }
interface Labelled { label: string; count: number }

/** Shape returned by the admin_dashboard_metrics database function. */
export interface DashboardMetrics {
  generated_at: string;
  period_days: number;
  students: {
    total: number;
    new_in_period: number;
    with_access: number;
    paying: number;
    by_learning_mode: Labelled[];
    by_department: Labelled[];
    signups_by_month: { month: string; count: number }[];
  };
  payments: {
    confirmed: number;
    confirmed_in_period: number;
    online: number;
    manual: number;
    without_amount: number;
    pending: number;
    cancelled: number;
    pending_value: Money[];
  };
  revenue: {
    total: Money[];
    in_period: Money[];
    by_month: (Money & { month: string })[];
    top_plans: { plan: string; count: number; amount: number | null }[];
  };
  learning: {
    awaiting_review: number;
    needs_changes: number;
    accepted: number;
    submitted_in_period: number;
    average_score: number | null;
    certificates: number;
    certificates_in_period: number;
  };
  talent: {
    profiles: number;
    vetted: number;
    public: number;
    new_profiles_in_period: number;
    published_roles: number;
    applications: number;
    applications_in_period: number;
    active_engagements: number;
    weekly_payroll: Money[];
    new_interest_requests: number;
    new_business_briefs: number;
  };
  leads: { total: number; in_period: number; by_interest: Labelled[] };
}

const PERIODS = [7, 30, 90, 365];

const num = (n: number) => n.toLocaleString();

function money(list: Money[]) {
  if (list.length === 0) return "—";
  return list
    .map(({ currency, amount }) => {
      try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
      } catch {
        return `${currency} ${num(Math.round(amount))}`;
      }
    })
    .join(" + ");
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "short" });
}

function last12Months() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function Stat({ label, value, hint, to }: { label: string; value: string; hint?: string; to?: string }) {
  const body = (
    <Card className={`h-full ${to ? "transition-colors hover:border-primary/50" : ""}`}>
      <CardContent className="p-4 space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg sm:text-2xl font-bold tabular-nums leading-tight">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

/** One-series monthly bar chart. Each bar shows its exact value on hover and in the label row. */
function MonthBars({ title, points, format }: { title: string; points: { month: string; value: number }[]; format: (n: number) => string }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const total = points.reduce((s, p) => s + p.value, 0);
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">12 months: {format(total)}</p>
        </div>
        <div className="flex h-36 items-end gap-[2px] border-b border-border" role="img" aria-label={`${title}, last 12 months`}>
          {points.map((p) => (
            <div key={p.month} className="group relative flex h-full flex-1 items-end" title={`${monthLabel(p.month)} ${p.month.slice(0, 4)}: ${format(p.value)}`}>
              <div
                className="w-full rounded-t-[4px] bg-primary/80 group-hover:bg-primary"
                style={{ height: p.value > 0 ? `max(2px, ${(p.value / max) * 100}%)` : 0 }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-[2px] text-[10px] text-muted-foreground">
          {points.map((p) => (
            <span key={p.month} className="flex-1 text-center">{monthLabel(p.month).slice(0, 1)}</span>
          ))}
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Show as table</summary>
          <table className="mt-2 w-full">
            <tbody>
              {points.map((p) => (
                <tr key={p.month} className="border-t border-border">
                  <td className="py-1">{monthLabel(p.month)} {p.month.slice(0, 4)}</td>
                  <td className="py-1 text-right tabular-nums">{format(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </CardContent>
    </Card>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Labelled[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <p className="font-semibold text-sm">{title}</p>
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nothing yet.</p>
        ) : (
          rows.map((r) => (
            <div key={r.label} className="space-y-1">
              <div className="flex justify-between gap-2 text-xs">
                <span className="truncate">{r.label}</span>
                <span className="tabular-nums text-muted-foreground">{num(r.count)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary/80" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/** Admin-only overview of students, payments, revenue, learning and talent. */
export function AdminMetrics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const load = async (period: number) => {
    setBusy(true);
    setError(null);
    try {
      const supabase = await getSupabase();
      // The database function checks the admin role itself and refuses everyone else.
      const rpc = supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
      const { data: result, error: rpcError } = await rpc.call(supabase, "admin_dashboard_metrics", { _days: period });
      if (rpcError) throw new Error(rpcError.message);
      setData(result as unknown as DashboardMetrics);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load(days);
  }, [days]);

  const months = last12Months();
  // Chart the main currency; any others appear in the revenue tiles.
  const mainCurrency = data?.revenue.total[0]?.currency ?? "NGN";
  const revenuePoints = months.map((month) => ({
    month,
    value: data?.revenue.by_month.filter((r) => r.month === month && r.currency === mainCurrency).reduce((s, r) => s + r.amount, 0) ?? 0,
  }));
  const signupPoints = months.map((month) => ({
    month,
    value: data?.students.signups_by_month.find((s) => s.month === month)?.count ?? 0,
  }));
  const formatMain = (n: number) => money([{ currency: mainCurrency, amount: n }]);
  const period = `last ${days} days`;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <Button key={p} size="sm" variant={days === p ? "default" : "outline"} onClick={() => setDays(p)}>
              {p === 365 ? "1 year" : `${p} days`}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => void load(days)} disabled={busy} aria-label="Refresh">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">Couldn't load the numbers: {error}</p>
      ) : !data ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className={`space-y-6 ${busy ? "opacity-60" : ""}`}>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Revenue and payments</h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Stat label={`Revenue, ${period}`} value={money(data.revenue.in_period)} />
              <Stat label="Revenue, all time" value={money(data.revenue.total)} hint={data.payments.without_amount ? `${num(data.payments.without_amount)} paid plans have no amount recorded` : undefined} />
              <Stat label={`Payments confirmed, ${period}`} value={num(data.payments.confirmed_in_period)} hint={`${num(data.payments.online)} online · ${num(data.payments.manual)} marked by admin · ${num(data.payments.confirmed)} total`} />
              <Stat label="Waiting on payment" value={num(data.payments.pending)} hint={data.payments.pending_value.length ? `Worth ${money(data.payments.pending_value)}` : `${num(data.payments.cancelled)} cancelled`} to="/admin/students" />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <MonthBars title={`Revenue by month (${mainCurrency})`} points={revenuePoints} format={formatMain} />
            <MonthBars title="New students by month" points={signupPoints} format={num} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Students</h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Stat label="Students" value={num(data.students.total)} hint="With a Faculty ID" />
              <Stat label={`New students, ${period}`} value={num(data.students.new_in_period)} />
              <Stat label="With course access" value={num(data.students.with_access)} hint="Free or paid-up plan" />
              <Stat label="Paying students" value={num(data.students.paying)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Breakdown title="Top paid plans" rows={data.revenue.top_plans.map((p) => ({ label: p.plan, count: p.count }))} />
            <Breakdown title="Students by department" rows={data.students.by_department} />
            <Breakdown title="Students by learning mode" rows={data.students.by_learning_mode} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Learning</h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Stat label="Work awaiting review" value={num(data.learning.awaiting_review)} hint={`${num(data.learning.needs_changes)} sent back for changes`} to="/admin/students" />
              <Stat label={`Work submitted, ${period}`} value={num(data.learning.submitted_in_period)} hint={`${num(data.learning.accepted)} accepted all time`} />
              <Stat label="Average score" value={data.learning.average_score != null ? `${data.learning.average_score}%` : "—"} />
              <Stat label="Certificates issued" value={num(data.learning.certificates)} hint={`${num(data.learning.certificates_in_period)} in the ${period}`} to="/admin/certificates" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Talent and hiring</h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Stat label="Talent profiles" value={num(data.talent.profiles)} hint={`${num(data.talent.vetted)} vetted · ${num(data.talent.public)} public · ${num(data.talent.new_profiles_in_period)} new`} to="/admin/talent" />
              <Stat label="Open roles" value={num(data.talent.published_roles)} hint={`${num(data.talent.applications_in_period)} applications in the ${period}`} to="/admin/talent" />
              <Stat label="Active engagements" value={num(data.talent.active_engagements)} hint={data.talent.weekly_payroll.length ? `${money(data.talent.weekly_payroll)} a week` : undefined} to="/admin/talent" />
              <Stat label="New requests to handle" value={num(data.talent.new_interest_requests + data.talent.new_business_briefs)} hint={`${num(data.talent.new_interest_requests)} talent intros · ${num(data.talent.new_business_briefs)} business briefs`} to="/admin/talent" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Stat label={`Leads, ${period}`} value={num(data.leads.in_period)} hint={`${num(data.leads.total)} all time`} />
            <div className="md:col-span-2">
              <Breakdown title={`Lead interests, ${period}`} rows={data.leads.by_interest} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Updated {new Date(data.generated_at).toLocaleString()}. Revenue counts confirmed paid plans with a recorded amount.
          </p>
        </div>
      )}
    </section>
  );
}
