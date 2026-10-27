import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatDay, lagosToday } from "@/lib/dates";

const money = (currency: string | null, amount: number) =>
  `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;

/** For a student on an instalment plan: what is left to pay, and a button to pay it. */
export function BalanceDue({
  enrollment,
}: {
  enrollment: Tables<"enrollments">;
}) {
  const [busy, setBusy] = useState(false);
  const balance = Number(enrollment.balance_due ?? 0);
  if (!(balance > 0) || !["active", "confirmed"].includes(enrollment.status))
    return null;

  const pay = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            balanceForEnrollmentId: enrollment.id,
            successUrl: `${window.location.origin}/payment-success`,
          },
        },
      );
      const url = data?.url?.trim();
      if (error || !url || !/^https?:\/\//i.test(url))
        throw new Error(
          data?.error || error?.message || "Could not start the payment",
        );
      window.location.assign(url);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  };

  const overdue =
    enrollment.balance_due_by &&
    enrollment.balance_due_by < lagosToday();

  return (
    <Card className={overdue ? "border-destructive/50" : "border-primary/40"}>
      <CardContent className="p-6 space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" /> Balance to pay
        </h3>
        <p className="text-2xl font-bold">
          {money(enrollment.currency, balance)}
        </p>
        <p className="text-sm text-muted-foreground">
          The rest of your {enrollment.plan_name} plan
          {enrollment.balance_due_by
            ? `, ${overdue ? "was due" : "due"} by ${formatDay(enrollment.balance_due_by)}`
            : ""}
          .
        </p>
        <Button onClick={pay} disabled={busy} className="w-full">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Pay balance
        </Button>
      </CardContent>
    </Card>
  );
}
