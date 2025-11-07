import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const [facultyId, setFacultyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facultyId.trim()) {
      toast({
        title: "Faculty ID Required",
        description: "Please enter your Faculty ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Fetch profile by faculty_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("faculty_id", facultyId.trim())
        .single();

      if (profileError || !profile) {
        toast({
          title: "Invalid Faculty ID",
          description: "No account found with this Faculty ID. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in with your email and password first.",
          variant: "destructive",
        });
        return;
      }

      // Verify the profile belongs to the authenticated user
      if (profile.id !== user.id) {
        toast({
          title: "Access Denied",
          description: "This Faculty ID does not match your account.",
          variant: "destructive",
        });
        return;
      }

      login(user, profile);
      onSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error.message || "Unable to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="facultyId">Faculty ID</Label>
        <Input
          id="facultyId"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          placeholder="TF-XXXXX-XXXX"
          className="font-mono"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Accessing Profile..." : "Access Profile"}
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={onForgotPassword}
      >
        Forgot your Faculty ID?
      </Button>
    </form>
  );
};
