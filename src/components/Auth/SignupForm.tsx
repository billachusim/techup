import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GoogleAuthButton } from "@/components/Auth/GoogleAuthButton";

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim() || !emailRegex.test(formData.email.trim())) {
      toast({
        title: "Check your details",
        description: "Please enter your name and a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Weak password", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: formData.name.trim() },
        },
      });

      if (error) throw error;

      if (data.session) {
        toast({ title: "Welcome to Tech Faculty!", description: "Your account is ready." });
        onSuccess();
        return;
      }

      setEmailSent(true);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Could not create your account",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-center">
        <p className="font-medium text-foreground">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to {formData.email.trim()}. Click it to finish creating your account, then sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleAuthButton label="Sign up with Google" onSuccess={onSuccess} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            maxLength={100}
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            maxLength={255}
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimum 6 characters"
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-xs text-muted-foreground">
          You only need these details to get in. We ask for more when you build a talent profile or send a hiring brief.
        </p>
      </form>
    </div>
  );
};
