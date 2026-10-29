import { useEffect, useState } from "react";
import { useSearchParams, Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabase } from "@/integrations/supabase/lazy";

// The pay link in a balance reminder email (/pay-balance?t=<token>). It opens a
// Flutterwave checkout for the balance straight away, without signing in;
// payment-success then confirms it like any other balance payment.
const PayBalance = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") || "";
  const [error, setError] = useState(
    token ? "" : "This payment link is incomplete.",
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const supabase = await getSupabase();
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: { balancePayToken: token },
        },
      );
      const url = data?.url?.trim();
      if (cancelled) return;
      if (fnError || !url || !/^https?:\/\//i.test(url)) {
        let message = data?.error as string | undefined;
        // functions.invoke hides the JSON body of a 4xx in error.context.
        const ctx = (fnError as { context?: Response } | null)?.context;
        if (!message && ctx?.json)
          message = (await ctx.json().catch(() => null))?.error;
        setError(
          message || "We couldn't open the payment page. Please try again.",
        );
        return;
      }
      window.location.assign(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  {error ? (
                    <Wallet className="w-10 h-10 text-primary" />
                  ) : (
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {error ? "Pay your balance" : "Opening the payment page…"}
                </h1>
                <p className="text-muted-foreground">
                  {error ||
                    "You'll be taken to Flutterwave to pay by card or bank transfer."}
                </p>
              </div>
              {error && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/dashboard" className="flex-1">
                    <Button className="w-full">Pay from your dashboard</Button>
                  </Link>
                  <a href="https://wa.me/2348068597140" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Message us on WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PayBalance;
