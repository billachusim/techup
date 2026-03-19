import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "@/components/Auth/SignupForm";
import { LoginForm } from "@/components/Auth/LoginForm";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, userData, logout } = useUser();

  const handleSignupSuccess = async () => {
    await supabase.auth.signOut();
    setActiveTab("login");
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail.trim()) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail.trim(), {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      toast({ title: "Password Reset Email Sent", description: "Check your email for a password reset link." });
      setShowForgotPasswordDialog(false);
      setForgotPasswordEmail("");
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message || "Unable to send password reset email.", variant: "destructive" });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <section id="get-started" className="py-24 px-4 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto max-w-6xl">
        {isLoggedIn ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome Back, {userData?.name}!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Head to your dashboard to track progress, view upcoming classes, and access your certificates.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90 gap-2">
                <LayoutDashboard size={20} />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Join the{" "}
                <span className="bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent">
                  Faculty
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create your account to access courses, track your progress, join communities, and start your tech career journey. Already a member? Log in below.
              </p>
            </div>

            <Card className="bg-card border-border max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "signup")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6">
                    <LoginForm
                      onSuccess={() => {
                        toast({ title: "Welcome Back!", description: "You've been logged in successfully." });
                      }}
                      onForgotPassword={() => setShowForgotPasswordDialog(true)}
                    />
                  </TabsContent>
                  <TabsContent value="signup" className="mt-6">
                    <SignupForm onSuccess={handleSignupSuccess} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}

        {/* Forgot Password Dialog */}
        <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Reset Your Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-password-email">Email Address</Label>
                <Input
                  id="forgot-password-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
              <Button
                onClick={handleForgotPasswordSubmit}
                className="w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90"
                size="lg"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GetStarted;
