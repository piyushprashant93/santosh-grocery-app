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
    const rate = rates[currency] || 1;
    const converted = priceInUSD * rate;
    
    let locale = undefined;
    if (currency === "INR") locale = "en-IN";
    else if (currency === "NPR") locale = "en-NP";
    else if (currency === "USD") locale = "en-US";
    else if (currency === "EUR") locale = "en-IE"; // fallback for Euro

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
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
