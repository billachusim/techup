import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

export const CurrencyToggle = () => {
  const { currencyCode, toggleCurrency } = useCurrency();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCurrency}
      className="text-xs font-semibold gap-1 px-2"
      title="Toggle currency"
    >
      {currencyCode === "NGN" ? "🇳🇬" : "🌍"} {currencyCode}
    </Button>
  );
};
