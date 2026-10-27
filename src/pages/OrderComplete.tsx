import { useEffect, useState } from "react";
import { useSearchParams, Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, FileDown, Loader2, MessageCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabase } from "@/integrations/supabase/lazy";
import { trackPurchase } from "@/lib/analytics";
import { VIRTUAL_SIWES } from "@/data/virtualSiwes";
import { PRODUCTS, successKitDownloadPath, type ProductId } from "../../supabase/functions/_shared/products.ts";

type OrderState = "checking" | "paid" | "pending" | "failed";

const RETRIES = 5;
const RETRY_MS = 3000;

/** Flutterwave sends the buyer here after paying for Virtual SIWES, the logbook service or the Success Kit. */
const OrderComplete = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get("tx_ref") || "";
  const redirectStatus = searchParams.get("status") || "";
  const [items, setItems] = useState<ProductId[]>([]);
  const [state, setState] = useState<OrderState>(
    !txRef || redirectStatus === "cancelled" || redirectStatus === "failed" ? "failed" : "checking",
  );

  useEffect(() => {
    if (state !== "checking") return;
    let cancelled = false;
    (async () => {
      const supabase = await getSupabase();
      for (let attempt = 0; attempt < RETRIES && !cancelled; attempt++) {
        const { data } = await supabase.functions.invoke("verify-payment", { body: { txRef } });
        const status = data?.status;
        if (status === "paid") {
          // Sends the receipt now rather than at the next 30-minute re-check. Safe to repeat.
          void fetch("/api/payment-followups", { method: "POST" }).catch(() => undefined);
          const bought = ((data.items ?? []) as string[]).filter((id): id is ProductId => id in PRODUCTS);
          trackPurchase(txRef, bought.map((id) => PRODUCTS[id].name).join(" + "));
          if (!cancelled) {
            setItems(bought);
            setState("paid");
          }
          return;
        }
        if (status === "failed" || status === "not_found") {
          if (!cancelled) setState("failed");
          return;
        }
        await new Promise((r) => setTimeout(r, RETRY_MS));
      }
      if (!cancelled) setState("pending");
    })();
    return () => {
      cancelled = true;
    };
  }, [state, txRef]);

  const heading = {
    checking: "Confirming your payment…",
    paid: "Payment confirmed",
    pending: "Payment is still processing",
    failed: "Payment not completed",
  }[state];
  const subheading = {
    checking: "This takes a few seconds. Please keep this page open.",
    paid: "Thank you. Your receipt is on its way to your email.",
    pending:
      "We haven't received confirmation from the payment provider yet. We check again automatically and email you as soon as it lands, usually within 30 minutes.",
    failed:
      "We couldn't confirm a payment for this order. If you were charged, message us on WhatsApp with the reference below and we will sort it out.",
  }[state];
  const StatusIcon = { checking: Loader2, paid: CheckCircle, pending: Clock, failed: XCircle }[state];
  const whatsappHref = `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(
    `Hello Tech Faculty NG, I just paid online. My payment reference is ${txRef}.`,
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <StatusIcon className={`w-10 h-10 text-primary ${state === "checking" ? "animate-spin" : ""}`} />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">{heading}</h1>
                <p className="text-muted-foreground">{subheading}</p>
              </div>

              {state === "paid" && items.length > 0 && (
                <ul className="space-y-3 text-left text-sm bg-muted/50 rounded-lg p-4">
                  {items.map((id) => (
                    <li key={id}>
                      <p className="font-semibold">{PRODUCTS[id].name}</p>
                      <p className="text-muted-foreground mt-1">{id === "success_kit" ? "Your SIWES Success Kit is ready to download below. We have also emailed you the link." : PRODUCTS[id].nextStep}</p>
                    </li>
                  ))}
                </ul>
              )}

              {state === "paid" && items.includes("success_kit") && (
                <Button asChild className="w-full">
                  <a href={successKitDownloadPath(txRef)} download>
                    <FileDown size={18} className="mr-2" /> Download the SIWES Success Kit
                  </a>
                </Button>
              )}

              {txRef && <p className="text-xs text-muted-foreground break-all">Payment reference: {txRef}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant={state === "paid" ? "outline" : "default"} className="flex-1" asChild>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} className="mr-2" /> WhatsApp us
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/virtual-siwes">Back to Virtual SIWES</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderComplete;
