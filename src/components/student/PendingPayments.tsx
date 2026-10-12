import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listPendingEnrollments, decidePendingEnrollment } from "@/lib/enrollment-payments.functions";

const METHODS = [
  { value: "bank", label: "Bank transfer" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card (outside checkout)" },
  { value: "other", label: "Other" },
] as const;
type Method = (typeof METHODS)[number]["value"];
type Currency = "NGN" | "USD";

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
  const [marking, setMarking] = useState<Awaited<ReturnType<typeof list>>[number] | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [method, setMethod] = useState<Method | "">("");

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

  const openMarkPaid = (r: Awaited<ReturnType<typeof list>>[number]) => {
    setMarking(r);
    setAmount(r.amount_due != null ? String(r.amount_due) : "");
    setCurrency(r.currency?.toUpperCase() === "USD" ? "USD" : "NGN");
    setMethod(r.tx_ref ? "card" : "");
  };

  const markPaid = async () => {
    if (!marking) return;
    const value = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter the amount received");
      return;
    }
    if (!method) {
      toast.error("Choose how it was paid");
      return;
    }
    setSaving(marking.id);
    try {
      await decide({ data: { id: marking.id, decision: "paid", amount: value, currency, method } });
      toast.success("Marked paid — the student's plan is now active");
      setMarking(null);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this enrolment request?")) return;
    setSaving(id);
    try {
      await decide({ data: { id, decision: "cancel" } });
      toast.success("Enrolment request cancelled");
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
              <Button size="sm" disabled={saving === r.id} onClick={() => openMarkPaid(r)}>Mark paid</Button>
              <Button size="sm" variant="outline" disabled={saving === r.id} onClick={() => cancel(r.id)}>
                {saving === r.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={!!marking} onOpenChange={(open) => { if (!open && !saving) setMarking(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark paid</DialogTitle>
            <DialogDescription>
              {marking ? `${marking.student_name} · ${marking.plan_name}. ` : ""}Record what came in so it counts as revenue on the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paid-amount">Amount received</Label>
              <div className="flex gap-2">
                <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="paid-amount" inputMode="decimal" placeholder="e.g. 100000" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paid-method">Paid by</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
                <SelectTrigger id="paid-method"><SelectValue placeholder="Choose how it was paid" /></SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={!!saving} onClick={() => setMarking(null)}>Back</Button>
            <Button disabled={!!saving} onClick={markPaid}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Mark paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
