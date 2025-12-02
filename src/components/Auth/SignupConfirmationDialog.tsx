import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignupConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    hearAbout: string;
  };
  onComplete: (facultyId: string) => void;
}

export const SignupConfirmationDialog = ({
  open,
  onOpenChange,
  userData,
  onComplete,
}: SignupConfirmationDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

  const createAccount = async () => {
    setIsProcessing(true);
    try {
      // Generate faculty ID
      const newFacultyId = await generateFacultyId();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          faculty_id: newFacultyId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          learning_mode: 'online-only',
          cohort_month: new Date().getMonth() + 1,
          cohort_year: new Date().getFullYear(),
        });

      if (profileError) throw profileError;

      // Create faculty_ids record
      await supabase.from("faculty_ids").insert({
        faculty_id: newFacultyId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        course_interest: "Not selected",
        hear_about_us: userData.hearAbout,
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

      return newFacultyId;
    } catch (error: any) {
      console.error("Account creation error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "Unable to complete registration. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      throw error;
    }
  };

  const handleWhatsApp = async () => {
    try {
      const newFacultyId = await createAccount();
      
      const message = `Hi! I've registered for Tech Faculty.

*My Details:*
Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone}

*My Faculty ID: ${newFacultyId}*`;

      const whatsappUrl = `https://wa.me/2347065238418?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      
      toast({
        title: "Registration Successful!",
        description: `Your Faculty ID is ${newFacultyId}. Complete your onboarding on WhatsApp.`,
      });
      
      onComplete(newFacultyId);
      onOpenChange(false);
    } catch (error) {
      // Error already handled in createAccount
    }
  };

  const handleEmail = async () => {
    try {
      const newFacultyId = await createAccount();
      
      const message = `Hi! I've registered for Tech Faculty.

*My Details:*
Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone}

*My Faculty ID: ${newFacultyId}*`;

      const subject = encodeURIComponent("Tech Faculty Registration Confirmation");
      const body = encodeURIComponent(message);
      const mailtoUrl = `mailto:thetechfaculty@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
      
      toast({
        title: "Registration Successful!",
        description: `Your Faculty ID is ${newFacultyId}. Complete your onboarding via email.`,
      });
      
      onComplete(newFacultyId);
      onOpenChange(false);
    } catch (error) {
      // Error already handled in createAccount
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Send Registration Confirmation</DialogTitle>
          <DialogDescription>
            Choose how you'd like to send your registration details to Tech Faculty.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleWhatsApp}
            className="w-full gap-2"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Send via WhatsApp
              </>
            )}
          </Button>
          
          <Button
            onClick={handleEmail}
            variant="outline"
            className="w-full gap-2"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Send via Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
