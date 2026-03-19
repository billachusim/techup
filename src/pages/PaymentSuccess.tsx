import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LayoutDashboard, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const facultyId = searchParams.get("faculty_id") || "";
  const plan = searchParams.get("plan") || "";
  const txRef = searchParams.get("tx_ref") || "";
  const transactionId = searchParams.get("transaction_id") || "";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Payment Successful — Tech Faculty</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">Payment Successful! 🎉</h1>
                <p className="text-muted-foreground">
                  Your enrollment has been confirmed and activated.
                </p>
              </div>

              {facultyId && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Your Faculty ID</p>
                  <p className="text-xl font-bold text-primary">{facultyId}</p>
                </div>
              )}

              {plan && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Enrolled Plan</p>
                  <p className="text-lg font-semibold">{plan}</p>
                </div>
              )}

              <div className="space-y-3 text-left text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                <p className="font-semibold text-foreground">What's Next?</p>
                <ul className="space-y-2">
                  <li>✅ Your enrollment is now <span className="font-semibold text-primary">active</span></li>
                  <li>📧 You'll receive a confirmation email shortly</li>
                  <li>💬 Join your cohort's WhatsApp group from your dashboard</li>
                  <li>📚 Start accessing your courses immediately</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard" className="flex-1">
                  <Button className="w-full gap-2">
                    <LayoutDashboard size={18} />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    Home <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
