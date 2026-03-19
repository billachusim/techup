import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CurrencyContextType {
  symbol: string;
  currencyCode: string;
  isNigeria: boolean;
  convertPrice: (ngnAmount: number) => number;
  formatPrice: (ngnAmount: number) => string;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  symbol: "₦",
  currencyCode: "NGN",
  isNigeria: true,
  convertPrice: (amount) => amount,
  formatPrice: (amount) => `₦${amount.toLocaleString()}`,
  toggleCurrency: () => {},
});

const NGN_TO_USD_RATE = 1400;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [isNigeria, setIsNigeria] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    if (manualOverride) return;
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        if (data.country_code && data.country_code !== "NG") {
          setIsNigeria(false);
        }
      } catch {
        setIsNigeria(true);
      }
    };
    detectCountry();
  }, [manualOverride]);

  const toggleCurrency = () => {
    setManualOverride(true);
    setIsNigeria((prev) => !prev);
  };

  const convertPrice = (ngnAmount: number): number => {
    if (isNigeria || ngnAmount === 0) return ngnAmount;
    return Math.round(ngnAmount / NGN_TO_USD_RATE);
  };

  const formatPrice = (ngnAmount: number): string => {
    if (ngnAmount === 0) return isNigeria ? "₦0" : "$0";
    if (isNigeria) return `₦${ngnAmount.toLocaleString()}`;
    const usd = Math.round(ngnAmount / NGN_TO_USD_RATE);
    return `$${usd.toLocaleString()}`;
  };

  const symbol = isNigeria ? "₦" : "$";
  const currencyCode = isNigeria ? "NGN" : "USD";

  return (
    <CurrencyContext.Provider value={{ symbol, currencyCode, isNigeria, convertPrice, formatPrice, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
