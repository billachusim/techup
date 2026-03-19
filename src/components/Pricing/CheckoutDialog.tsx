import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, CreditCard } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (method: 'email' | 'whatsapp' | 'card') => void;
  totalAmount: number;
  isLoading?: boolean;
}

export const CheckoutDialog = ({ open, onOpenChange, onSubmit, totalAmount, isLoading }: CheckoutDialogProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'card' | 'whatsapp' | 'email'>('card');
  const { formatPrice } = useCurrency();

  const handleSubmit = () => {
    onSubmit(deliveryMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Enrollment</DialogTitle>
          <DialogDescription>
            Choose your preferred payment or enrollment method
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</p>
          </div>

          <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as 'card' | 'whatsapp' | 'email')}>
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Pay with Card</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Bank Transfer, USSD, Mobile Money</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="flex items-center space-x-2 cursor-pointer flex-1">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-foreground">Enroll via WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Send enrollment details & pay via bank transfer</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center space-x-2 cursor-pointer flex-1">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Enroll via Email</p>
                  <p className="text-xs text-muted-foreground">Detailed enrollment request via email</p>
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
            {isLoading ? 'Processing...' : deliveryMethod === 'card' ? 'Pay Now' : 'Submit Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
