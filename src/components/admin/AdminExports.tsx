import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportPayments, exportStudents } from "@/lib/admin-exports.functions";
import { csvFilename, downloadCsv, toCsv } from "@/lib/csv";

type PaymentStatus = "all" | "paid" | "pending" | "cancelled";
const PAYMENT_STATUS: { v: PaymentStatus; label: string }[] = [
  { v: "all", label: "All payments" },
  { v: "paid", label: "Paid" },
  { v: "pending", label: "Waiting on payment" },
  { v: "cancelled", label: "Cancelled" },
];

const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-NG") : "";

/** Admin: download students and payments as CSV, limited by date and payment status. */
export function AdminExports() {
  const students = useServerFn(exportStudents);
  const payments = useServerFn(exportPayments);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("all");
  const [busy, setBusy] = useState<"students" | "payments" | null>(null);

  const range = { from: from || undefined, to: to || undefined };
  const suffix = [from, to].some(Boolean)
    ? `-${from || "start"}-to-${to || "today"}`
    : "";

  const run = async (kind: "students" | "payments") => {
    setBusy(kind);
    try {
      if (kind === "students") {
        const rows = await students({ data: range });
        const csv = toCsv(rows, [
          { header: "Joined", value: (r) => date(r.created_at) },
          { header: "Faculty ID", value: (r) => r.faculty_id },
          { header: "Name", value: (r) => r.name },
          { header: "Email", value: (r) => r.email },
          { header: "Phone", value: (r) => r.phone },
          { header: "Department", value: (r) => r.department },
          { header: "Learning mode", value: (r) => r.learning_mode },
          {
            header: "Cohort",
            value: (r) =>
              r.cohort_year
                ? `${r.cohort_year}-${String(r.cohort_month ?? "").padStart(2, "0")}`
                : "",
          },
          { header: "Latest plan", value: (r) => r.latest_plan },
          { header: "Latest plan status", value: (r) => r.latest_plan_status },
          { header: "Enrolments", value: (r) => r.enrolments },
          { header: "Joined Slack", value: (r) => date(r.slack_joined_at) },
        ]);
        downloadCsv(csvFilename(`students${suffix}`), csv);
        toast.success(
          `Downloaded ${rows.length} student${rows.length === 1 ? "" : "s"}`,
        );
      } else {
        const rows = await payments({ data: { ...range, status } });
        const csv = toCsv(rows, [
          { header: "Started", value: (r) => date(r.created_at) },
          { header: "Paid at", value: (r) => date(r.paid_at) },
          { header: "Status", value: (r) => r.status },
          { header: "Method", value: (r) => r.method },
          { header: "Faculty ID", value: (r) => r.faculty_id },
          { header: "Name", value: (r) => r.student_name },
          { header: "Email", value: (r) => r.student_email },
          { header: "Phone", value: (r) => r.student_phone },
          { header: "Plan", value: (r) => r.plan_name },
          { header: "Learning mode", value: (r) => r.learning_mode },
          { header: "Currency", value: (r) => r.currency },
          { header: "Amount due", value: (r) => r.amount_due },
          { header: "Coupon", value: (r) => r.coupon_code },
          { header: "Flutterwave tx_ref", value: (r) => r.tx_ref },
          { header: "Payment reference", value: (r) => r.payment_reference },
        ]);
        downloadCsv(
          csvFilename(
            `payments${status === "all" ? "" : `-${status}`}${suffix}`,
          ),
          csv,
        );
        toast.success(
          `Downloaded ${rows.length} payment${rows.length === 1 ? "" : "s"}`,
        );
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-bold">Download CSV</h2>
        <p className="text-sm text-muted-foreground">
          Opens in Excel or Google Sheets. Dates filter students by sign-up and
          payments by when checkout started; leave them empty for everything.
        </p>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="export-from">From</Label>
              <Input
                id="export-from"
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="export-to">To</Label>
              <Input
                id="export-to"
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={busy !== null}
              onClick={() => run("students")}
            >
              {busy === "students" ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              Students
            </Button>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as PaymentStatus)}
            >
              <SelectTrigger
                className="h-9 w-48"
                aria-label="Payment status to export"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS.map((s) => (
                  <SelectItem key={s.v} value={s.v}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              disabled={busy !== null}
              onClick={() => run("payments")}
            >
              {busy === "payments" ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
