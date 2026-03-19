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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, Mail } from "lucide-react";
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
  onSuccess: (facultyId: string) => void;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFacultyId, setPendingFacultyId] = useState("");
  const { toast } = useToast();
  const { login } = useUser();

  const generateFacultyId = async (department: string = "General Tech", learningMode: string = "online-only") => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const { data, error } = await (supabase.rpc as any)('generate_faculty_id', {
      dept_name: department,
      learn_mode: learningMode,
      cohort_mo: currentMonth,
      cohort_yr: currentYear
    });
    
    if (error) {
      console.error('Error generating faculty ID:', error);
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
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const newFacultyId = await generateFacultyId();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

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

      await supabase.from("enrollments").insert({
        faculty_id: newFacultyId,
        plan_name: "Bootcamp Starter",
        status: "active",
        learning_mode: "online-only",
      });

      setPendingFacultyId(newFacultyId);
      setShowConfirmModal(true);

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

  const handleConfirmMethod = (method: 'whatsapp' | 'email') => {
    const message = `Welcome to Tech Faculty! 🎓

*Registration Confirmed*

Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Phone: ${formData.phone.trim()}
Faculty ID: ${pendingFacultyId}

Thank you for joining Tech Faculty. Your account has been created successfully.

Next Steps:
1. Log in with your email and password
2. Explore courses in the Pricing section
3. Join your cohort's WhatsApp group

Questions? We're here to help!`;

    if (method === 'whatsapp') {
      const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      const subject = `Registration Confirmed - ${pendingFacultyId}`;
      const body = message.replace(/\*/g, '');
      const mailtoUrl = `mailto:thetechfaculty@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }

    toast({
      title: "Registration Successful!",
      description: `Your Faculty ID is ${pendingFacultyId}. Welcome to Tech Faculty!`,
    });

    setShowConfirmModal(false);
    onSuccess(pendingFacultyId);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Your phone number"
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

      {/* Post-signup confirmation modal - non-dismissible */}
      <Dialog open={showConfirmModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Registration Successful! 🎉</DialogTitle>
            <DialogDescription>
              Your Faculty ID is <span className="font-bold text-primary">{pendingFacultyId}</span>.
              Choose how to receive your welcome confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => handleConfirmMethod('whatsapp')}
              className="w-full justify-start gap-3 h-14"
              variant="outline"
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Confirm via WhatsApp</p>
                <p className="text-xs text-muted-foreground">Instant confirmation message</p>
              </div>
            </Button>
            <Button
              onClick={() => handleConfirmMethod('email')}
              className="w-full justify-start gap-3 h-14"
              variant="outline"
            >
              <Mail className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Confirm via Email</p>
                <p className="text-xs text-muted-foreground">Detailed confirmation email</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
