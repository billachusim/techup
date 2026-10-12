import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/lib/router-compat";
import { useIsStaff } from "@/hooks/useIsStaff";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import AdminNav from "@/components/admin/AdminNav";
import {
  REFERRAL_DISCOUNT_PERCENT,
  REFERRER_REWARD_PERCENT,
} from "../../supabase/functions/_shared/pricing.ts";

type Row = Database["public"]["Functions"]["admin_list_referrals"]["Returns"][number];

const STATUS: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Checkout started", variant: "outline" },
  earned: { label: "Reward due", variant: "default" },
  paid_out: { label: "Reward paid", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const money = (currency: string, amount: number) =>
  `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;

/** Admin: who referred whom, and the graduate rewards waiting to be paid. */
export default function AdminReferrals() {
  const { loading, isAdmin } = useIsStaff();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("admin_list_referrals");
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  const markPaid = async (r: Row) => {
    if (!window.confirm(`Mark ${money(r.currency, r.reward_amount)} as paid to ${r.referrer_name || "this graduate"}?`)) return;
    setSaving(r.id);
    const { error } = await supabase.rpc("admin_mark_referral_paid", { _id: r.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Reward marked paid");
      await load();
    }
    setSaving(null);
  };

  const due = rows.filter((r) => r.status === "earned");
  const dueTotals = Object.entries(
    due.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.currency]: (acc[r.currency] ?? 0) + Number(r.reward_amount) }), {}),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Referrals</h1>
          <p className="text-sm text-muted-foreground">
            New students who used a graduate's code save {REFERRAL_DISCOUNT_PERCENT}%. When their payment is confirmed,
            the graduate earns {REFERRER_REWARD_PERCENT}% of what they paid. Pay it, then mark it paid here.
          </p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This page is for Tech Faculty admins.</p>
            <Link to="/login?next=/admin/referrals">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No referrals yet.</p>
        ) : (
          <>
            {dueTotals.length > 0 && (
              <p className="text-sm">
                <span className="font-semibold">{dueTotals.map(([c, n]) => money(c, n)).join(" + ")}</span> in rewards to pay
                across {due.length} referral{due.length === 1 ? "" : "s"}.
              </p>
            )}
            <div className="space-y-3">
              {rows.map((r) => {
                const status = STATUS[r.status] ?? { label: r.status, variant: "outline" as const };
                return (
                  <Card key={r.id}>
                    <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold">
                          {r.referrer_name || "Graduate"} referred {r.referred_name || "a student"}
                          {r.plan_name ? ` · ${r.plan_name}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground break-all">
                          Code {r.code} · referrer {[r.referrer_faculty_id, r.referrer_email, r.referrer_phone].filter(Boolean).join(" · ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          New student {r.referred_faculty_id || ""} saved {money(r.currency, r.discount_amount)} · reward{" "}
                          {money(r.currency, r.reward_amount)} · {new Date(r.created_at).toLocaleDateString()}
                          {r.paid_out_at ? ` · paid ${new Date(r.paid_out_at).toLocaleDateString()}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {r.status === "earned" && (
                          <Button size="sm" disabled={saving === r.id} onClick={() => markPaid(r)}>
                            {saving === r.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Mark reward paid
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
