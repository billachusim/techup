import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Benefit {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface BenefitSelectorProps {
  benefits: Benefit[];
  selectedBenefits: string[];
  onToggleBenefit: (benefitId: string) => void;
}

export const BenefitSelector = ({ benefits, selectedBenefits, onToggleBenefit }: BenefitSelectorProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <span className="font-semibold text-foreground">Career Benefits</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-3">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={benefit.id}
                checked={selectedBenefits.includes(benefit.id)}
                onCheckedChange={() => onToggleBenefit(benefit.id)}
              />
              <div>
                <Label htmlFor={benefit.id} className="text-sm font-medium cursor-pointer text-foreground">
                  {benefit.name}
                </Label>
                {benefit.description && (
                  <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">
              {benefit.price === 0 ? 'Free' : `₦${benefit.price.toLocaleString()}`}
            </span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
