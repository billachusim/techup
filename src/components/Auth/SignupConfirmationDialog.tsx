import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

interface SignupConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    name: string;
    email: string;
    phone: string;
    facultyId: string;
  };
}

export const SignupConfirmationDialog = ({
  open,
  onOpenChange,
  userData,
}: SignupConfirmationDialogProps) => {
  const message = `Hi! I've registered for Tech Faculty.

*My Details:*
Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone}

*My Faculty ID: ${userData.facultyId}*`;

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/2347065238418?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onOpenChange(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Tech Faculty Registration Confirmation");
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:hello@techfaculty.ng?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
          >
            <MessageCircle className="h-5 w-5" />
            Send via WhatsApp
          </Button>
          
          <Button
            onClick={handleEmail}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <Mail className="h-5 w-5" />
            Send via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
