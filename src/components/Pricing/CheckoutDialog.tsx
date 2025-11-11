import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (method: 'email' | 'whatsapp') => void;
  totalAmount: number;
  isLoading?: boolean;
}

export const CheckoutDialog = ({ open, onOpenChange, onSubmit, totalAmount, isLoading }: CheckoutDialogProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp'>('whatsapp');

  const handleSubmit = () => {
    onSubmit(deliveryMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Enrollment Request</DialogTitle>
          <DialogDescription>
            Choose how you'd like to receive your enrollment confirmation
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
          </div>

          <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as 'email' | 'whatsapp')}>
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="flex items-center space-x-2 cursor-pointer flex-1">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Instant confirmation via WhatsApp</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center space-x-2 cursor-pointer flex-1">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">Detailed confirmation via email</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
