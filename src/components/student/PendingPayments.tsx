import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listPendingEnrollments, decidePendingEnrollment } from "@/lib/enrollment-payments.functions";

/**
 * Admin list of paid plans waiting on payment. Card payments confirm on their
 * own; WhatsApp, email and bank payments are marked received here.
 */
export function PendingPayments() {
  const list = useServerFn(listPendingEnrollments);
  const decide = useServerFn(decidePendingEnrollment);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof list>>>([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    try {
      setRows(await list());
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (id: string, decision: "paid" | "cancel") => {
    if (decision === "cancel" && !window.confirm("Cancel this enrolment request?")) return;
    setSaving(id);
    try {
      await decide({ data: { id, decision } });
      toast.success(decision === "paid" ? "Marked paid — the student's plan is now active" : "Enrolment request cancelled");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-bold">Payments to confirm</h2>
        <p className="text-sm text-muted-foreground">
          Paid plans only open once payment is confirmed. Card payments confirm automatically; mark WhatsApp, email and bank payments here once the money arrives.
        </p>
      </div>
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments waiting.</p>
      ) : rows.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">{r.student_name} · {r.plan_name}</p>
              <p className="text-xs text-muted-foreground break-all">
                {r.faculty_id} · {[r.student_email, r.student_phone].filter(Boolean).join(" · ")} · {new Date(r.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {r.tx_ref ? `Card checkout started (${r.currency} ${r.amount_due}) — not confirmed by Flutterwave` : "WhatsApp / email request"}
                {r.coupon_code ? ` · code ${r.coupon_code}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={saving === r.id} onClick={() => act(r.id, "paid")}>
                {saving === r.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Mark paid
              </Button>
              <Button size="sm" variant="outline" disabled={saving === r.id} onClick={() => act(r.id, "cancel")}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
