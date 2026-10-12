import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  REFERRAL_DISCOUNT_PERCENT,
  REFERRER_REWARD_PERCENT,
} from "../../../supabase/functions/_shared/pricing.ts";

interface MyReferral {
  eligible: boolean;
  code?: string;
  joined?: number;
  rewards?: { currency: string; earned: number; paid_out: number }[];
}

const money = (currency: string, amount: number) =>
  `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;

/** A student's alumni referral code, with how many friends joined and rewards earned. */
export function ReferralCard() {
  const [info, setInfo] = useState<MyReferral | null>(null);

  useEffect(() => {
    supabase.rpc("get_my_referral").then(({ data, error }) => {
      if (error) console.error("Could not load referral code:", error);
      else setInfo(data as unknown as MyReferral);
    });
  }, []);

  if (!info) return null;

  if (!info.eligible || !info.code) {
    return (
      <Card>
        <CardContent className="p-6 space-y-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="text-primary" size={20} />Refer a friend
          </h3>
          <p className="text-sm text-muted-foreground">
            Once you graduate or your paid plan is confirmed, you'll get a referral code here. Friends who
            join with it save {REFERRAL_DISCOUNT_PERCENT}%, and you earn a reward for each one.
          </p>
        </CardContent>
      </Card>
    );
  }

  const shareUrl = `https://techfaculty.ng/?ref=${encodeURIComponent(info.code)}#pricing`;
  const shareText = `Join me at Tech Faculty NG. Use my referral code ${info.code} to save ${REFERRAL_DISCOUNT_PERCENT}% on your plan: ${shareUrl}`;
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${what} copied`);
    } catch {
      toast.error("Couldn't copy. Select it and copy by hand.");
    }
  };
  const earned = (info.rewards ?? []).filter((r) => r.earned > 0);
  const paid = (info.rewards ?? []).filter((r) => r.paid_out > 0);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="text-primary" size={20} />Refer a friend
          </h3>
          <p className="text-sm text-muted-foreground">
            Friends who join with your code save {REFERRAL_DISCOUNT_PERCENT}% on their plan. Once they've paid,
            you earn {REFERRER_REWARD_PERCENT}% of what they paid, and Tech Faculty pays it to you.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-md border bg-muted px-3 py-2 text-lg font-bold tracking-wider">{info.code}</code>
          <Button variant="outline" size="sm" onClick={() => copy(info.code!, "Code")}>
            <Copy className="mr-2 h-4 w-4" />Copy code
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
              <Share2 className="mr-2 h-4 w-4" />Share on WhatsApp
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => copy(shareUrl, "Link")}>Copy link</Button>
        </div>
        <p className="text-sm">
          <span className="font-medium">{info.joined ?? 0}</span> friend{info.joined === 1 ? "" : "s"} joined with your code
          {earned.length > 0 && <> · <span className="font-medium">{earned.map((r) => money(r.currency, r.earned)).join(" + ")}</span> reward due to you</>}
          {paid.length > 0 && <> · {paid.map((r) => money(r.currency, r.paid_out)).join(" + ")} paid out</>}
        </p>
      </CardContent>
    </Card>
  );
}
