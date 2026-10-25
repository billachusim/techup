import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  listOutstandingBalances,
  markBalancePaid,
} from "@/lib/enrollment-payments.functions";
import { formatIntakeDate, lagosToday } from "@/lib/intakes";

const money = (currency: string | null, amount: number | null) =>
  `${currency === "USD" ? "$" : "₦"}${Number(amount ?? 0).toLocaleString()}`;

/**
 * Admin list of instalment plans with a balance left. Card balances clear on
 * their own when the student pays from their dashboard; mark bank, cash or
 * WhatsApp payments here. Hidden while nobody owes anything.
 */
export function OutstandingBalances() {
  const list = useServerFn(listOutstandingBalances);
  const markPaid = useServerFn(markBalancePaid);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof list>>>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    try {
      setRows(await list());
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mark = async (r: (typeof rows)[number]) => {
    if (
      !window.confirm(
        `Mark the ${money(r.currency, r.balance_due)} balance from ${r.student_name} as received by bank transfer?`,
      )
    )
      return;
    setSaving(r.id);
    try {
      await markPaid({ data: { id: r.id, method: "bank" } });
      toast.success("Balance marked paid");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  if (rows.length === 0) return null;
  const today = lagosToday();

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Instalment balances</h2>
      {rows.map((r) => {
        const overdue = r.balance_due_by != null && r.balance_due_by < today;
        return (
          <Card key={r.id}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="font-semibold">
                  {r.student_name} · {r.plan_name}
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  {[r.faculty_id, r.student_email, r.student_phone]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Paid {money(r.currency, r.amount_due)} of{" "}
                  {money(r.currency, r.instalment_total)} ·{" "}
                  {money(r.currency, r.balance_due)} left
                  {r.balance_due_by
                    ? ` · due ${formatIntakeDate(r.balance_due_by)}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {overdue && <Badge variant="destructive">Overdue</Badge>}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving === r.id}
                  onClick={() => mark(r)}
                >
                  {saving === r.id && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Mark received
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
