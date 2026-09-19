import React, { createContext, useContext, useEffect, useState } from "react";

type Rates = Record<string, number>;

interface CurrencyContextType {
  currency: string;
  rates: Rates;
  setCurrency: (currency: string) => void;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("NPR");
  const [rates, setRates] = useState<Rates>({});

  // Fetch exchange rates once on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (response.ok) {
          const data = await response.json();
          setRates(data.rates);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
      }
    };
    void fetchRates();
  }, []);

  // Fetch user preference on mount
  useEffect(() => {
    const fetchPreference = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/users/preferences", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data?.preferences?.currency) {
            setCurrencyState(data.data.preferences.currency);
          }
        }
      } catch (err) {
        console.error("Failed to fetch currency preference:", err);
      }
    };
    void fetchPreference();
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  const formatPrice = (priceInUSD: number) => {
    if (priceInUSD === undefined || priceInUSD === null || isNaN(priceInUSD)) return "";
    // Enforce fallback to USD if a different currency got stuck
    const safeCurrency = currency === "NPR" ? "NPR" : "USD";
    const rate = rates[safeCurrency] || 1;
    const converted = priceInUSD * rate;
    
    let locale = "en-US";
    if (safeCurrency === "NPR") locale = "en-NP";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
