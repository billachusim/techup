import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

const hearAboutUs = [
  "Social Media",
  "Friend/Colleague",
  "Google Search",
  "University/School",
  "Tech Event",
  "Other",
];

interface SignupFormProps {
  onSuccess: (userData: { name: string; email: string; phone: string; facultyId: string }) => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    hearAbout: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useUser();

  const generateFacultyId = async (department: string = "General Tech", learningMode: string = "online-only") => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Call the database function to generate ID
    const { data, error } = await (supabase.rpc as any)('generate_faculty_id', {
      dept_name: department,
      learn_mode: learningMode,
      cohort_mo: currentMonth,
      cohort_yr: currentYear
    });
    
    if (error) {
      console.error('Error generating faculty ID:', error);
      // Fallback to simple format if function fails
      return `TF-GEN-ONL-${String(currentMonth).padStart(2, '0')}${String(currentYear).slice(-2)}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    }
    
    return data as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.password.trim() || !formData.hearAbout) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate faculty ID with default values (will be updated on enrollment)
      const newFacultyId = await generateFacultyId();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          faculty_id: newFacultyId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          learning_mode: 'online-only',
          cohort_month: new Date().getMonth() + 1,
          cohort_year: new Date().getFullYear(),
        });

      if (profileError) throw profileError;

      // Create faculty_ids record
      await supabase.from("faculty_ids").insert({
        faculty_id: newFacultyId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course_interest: "Not selected",
        hear_about_us: formData.hearAbout,
        status: "active",
        department: "General Tech",
      });

      // Create initial enrollment for free bootcamp
      await supabase.from("enrollments").insert({
        faculty_id: newFacultyId,
        plan_name: "Bootcamp Starter",
        status: "active",
        learning_mode: "online-only",
      });

      toast({
        title: "Registration Successful!",
        description: `Your Faculty ID is ${newFacultyId}. Please choose how to complete your onboarding.`,
      });

      // Store registration data and show confirmation dialog
      console.log("SignupForm: calling onSuccess with userData", { facultyId: newFacultyId });
      
      // Call onSuccess with user data - parent will handle confirmation dialog
      onSuccess({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        facultyId: newFacultyId,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "Unable to complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">{/* ... keep existing code */}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+234 800 000 0000"
          maxLength={20}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Minimum 6 characters"
          minLength={6}
        />
      </div>

      <div>
        <Label htmlFor="hearAbout">How did you hear about us?</Label>
        <Select
          value={formData.hearAbout}
          onValueChange={(value) => setFormData({ ...formData, hearAbout: value })}
        >
          <SelectTrigger id="hearAbout">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {hearAboutUs.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};
