import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface LearningMode {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface LearningModeSelectorProps {
  modes: LearningMode[];
  selectedMode: string;
  onSelectMode: (modeId: string) => void;
}

export const LearningModeSelector = ({ modes, selectedMode, onSelectMode }: LearningModeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <span className="font-semibold text-foreground">Learning Mode</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <RadioGroup value={selectedMode} onValueChange={onSelectMode} className="space-y-3">
          {modes.map((mode) => (
            <div key={mode.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={mode.id} id={mode.id} />
                <div>
                  <Label htmlFor={mode.id} className="text-sm font-medium cursor-pointer text-foreground">
                    {mode.name}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">
                {mode.price === 0 ? 'Included' : `₦${mode.price.toLocaleString()}`}
              </span>
            </div>
          ))}
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};
