import { useEffect, useState } from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import { Plus, Loader2, Wallet, Banknote, CreditCard as CardIcon } from "lucide-react";
import AddCardModal from "../AddCardModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const PAYMENT_STORAGE_KEY = "checkout_payment";

interface CardApi {
  cardId: string;
  last4: string;
  brand: string;
  display: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface AvailableMethod {
  id: "wallet" | "card" | "cash" | "esewa" | "khalti";
  label: string;
  description: string;
  available: boolean;
}

interface CardFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolder: string;
  brand: string;
  isDefault: boolean;
}

const EMPTY_CARD_FORM: CardFormData = {
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cardHolder: "",
  brand: "Visa",
  isDefault: false,
};

// What gets persisted to localStorage for Checkout.tsx / ConfirmStep to read
type SelectedPayment = {
  method: "wallet" | "card" | "cash" | "esewa" | "khalti";
  cardId?: string;
  brand?: string;
  last4?: string;
  display: string;
};

export function PaymentStep() {
  const { formatPrice } = useCurrency();
  const [walletBalance, setWalletBalance] = useState(0);
  const [cards, setCards] = useState<CardApi[]>([]);
  const [availableMethods, setAvailableMethods] = useState<AvailableMethod[]>(
    [],
  );

  const [methodType, setMethodType] = useState<"wallet" | "card" | "cash" | "esewa" | "khalti">(
    "wallet",
  );
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [openAddCardModal, setOpenAddCardModal] = useState(false);
  const [cardForm, setCardForm] = useState<CardFormData>(EMPTY_CARD_FORM);
  const [cardError, setCardError] = useState("");
  const [cardSaving, setCardSaving] = useState(false);

  const getToken = () => localStorage.getItem("authToken") || "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const persistSelection = (
    method: "wallet" | "card" | "cash" | "esewa" | "khalti",
    card?: CardApi,
  ) => {
    let selection: SelectedPayment;

    if (method === "wallet") {
      selection = { method: "wallet", display: "Wallet Balance" };
    } else if (method === "cash") {
      selection = { method: "cash", display: "Cash on Delivery" };
    } else if (method === "esewa") {
      selection = { method: "esewa", display: "eSewa" };
    } else if (method === "khalti") {
      selection = { method: "khalti", display: "Khalti" };
    } else {
      selection = {
        method: "card",
        cardId: card?.cardId,
        brand: card?.brand,
        last4: card?.last4,
        display: card ? `${card.brand} •••• ${card.last4}` : "Card",
      };
    }

    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(selection));
  };

  // ---------- GET payment methods (wallet + cards + cash) ----------
  const fetchPaymentMethods = async () => {
    setLoading(true);
    setFetchError("");

    try {
      const res = await fetch(`${API_BASE}/payment/methods`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load payment methods.");
      }

      let { walletBalance: balance, savedCards, availableMethods: methods } =
        data.data;

      // Ensure Khalti and eSewa are always present for testing/integration if missing from API
      methods = methods || [];
      if (!methods.find((m: any) => m.id === "khalti")) {
        methods.push({
          id: "khalti",
          label: "Khalti",
          description: "Pay securely via Khalti",
          available: true,
        });
      }
      if (!methods.find((m: any) => m.id === "esewa")) {
        methods.push({
          id: "esewa",
          label: "eSewa",
          description: "Pay securely via eSewa",
          available: true,
        });
      }

      setWalletBalance(balance ?? 0);
      setCards(savedCards ?? []);
      setAvailableMethods(methods);

      // Default selection: default card if any, else wallet, else first
      // available method.
      const defaultCard = (savedCards ?? []).find((c: CardApi) => c.isDefault);

      if (defaultCard) {
        setMethodType("card");
        setSelectedCardId(defaultCard.cardId);
        persistSelection("card", defaultCard);
      } else {
        const walletMethod = methods.find(
          (m: AvailableMethod) => m.id === "wallet" && m.available,
        );
        const fallback = walletMethod?.id || methods[0]?.id || "wallet";
        setMethodType(fallback);
        persistSelection(fallback);
      }
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error
          ? err.message
          : "Unable to load payment methods.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectMethodType = (method: "wallet" | "card" | "cash" | "esewa" | "khalti") => {
    setMethodType(method);

    if (method === "card") {
      const card = cards.find((c) => c.cardId === selectedCardId) || cards[0];
      if (card) {
        setSelectedCardId(card.cardId);
        persistSelection("card", card);
      }
    } else {
      persistSelection(method);
    }
  };

  const handleSelectCard = (card: CardApi) => {
    setMethodType("card");
    setSelectedCardId(card.cardId);
    persistSelection("card", card);
  };

  // ---------- POST add card ----------
  const handleSaveCard = async () => {
    setCardSaving(true);
    setCardError("");

    try {
      const res = await fetch(`${API_BASE}/wallet/cards`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(cardForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to add card.");
      }

      const newCard: CardApi = data?.data?.card;

      setCards((prev) => {
        const updated = newCard.isDefault
          ? prev.map((c) => ({ ...c, isDefault: false }))
          : prev;
        return [...updated, newCard];
      });

      handleSelectCard(newCard);

      setOpenAddCardModal(false);
      setCardForm(EMPTY_CARD_FORM);
      setCardError("");
    } catch (err: unknown) {
      setCardError(err instanceof Error ? err.message : "Unable to add card.");
    } finally {
      setCardSaving(false);
    }
  };

  const updateCardForm = (
    field: keyof CardFormData,
    value: string | boolean,
  ) => {
    setCardForm((prev) => ({ ...prev, [field]: value }));
  };

const methodMeta: Record<
  string,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
  }
> = {
  wallet: {
    icon: Wallet,
    iconBg: "bg-theme-bg",
    iconColor: "text-[#00BC7D]",
  },
  card: {
    icon: CardIcon,
    iconBg: "bg-theme-bg",
    iconColor: "text-[#60A5FA]",
  },
  cash: {
    icon: Banknote,
    iconBg: "bg-theme-bg",
    iconColor: "text-[#F59E0B]",
  },
  esewa: {
    icon: Wallet,
    iconBg: "bg-theme-bg",
    iconColor: "text-[#60a917]", // eSewa green
  },
  khalti: {
    icon: Wallet,
    iconBg: "bg-theme-bg",
    iconColor: "text-[#5C2D91]", // Khalti purple
  },
};

  return (
    <div className="border border-theme-border rounded-lg lg:rounded-2xl lg:p-6 p-3 bg-theme-surface">
      <h2 className="font-playfair text-2xl mb-6 text-theme-text">Payment Method</h2>

      {fetchError && <p className="text-red-400 text-sm mb-4">{fetchError}</p>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-theme-muted py-10">
          <Loader2 size={20} className="animate-spin" />
          Loading payment methods...
        </div>
      ) : (
        <div className="space-y-4">
          {availableMethods.map((method) => {
            if (!method.available) return null;

            const active = methodType === method.id;
            const meta = methodMeta[method.id] || methodMeta.cash;
            const Icon = meta.icon;

            const description =
              method.id === "wallet"
                ? `Available: ${formatPrice(walletBalance)}`
                : method.description;

            return (
              <div key={method.id}>
                <div
                  onClick={() => handleSelectMethodType(method.id)}
                  className={`flex items-center justify-between lg:p-5 p-3 rounded-lg lg:rounded-xl border cursor-pointer transition
                  ${
                    active
                      ? "border-[#00BC7D] bg-[#00BC7D]/10"
                      : "border-theme-border hover:border-gray-400 dark:hover:border-theme-muted"
                  }`}
                >
                  <div className="flex items-center lg:gap-4 gap-2">
                    <div
                      className={`lg:w-12 w-8 lg:h-12 h-8 rounded-full flex items-center justify-center ${
                        active ? "bg-[#00BC7D]/20" : meta.iconBg
                      }`}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-[#00BC7D]" : meta.iconColor}
                      />
                    </div>

                    <div>
                      <p className="text-theme-text lg:text-lg text-sm">
                        {method.label}
                      </p>
                      <p className="text-theme-muted sm:text-base text-sm">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center
                    ${active ? "border-[#00BC7D]" : "border-[#475569]"}`}
                  >
                    {active && (
                      <div className="w-3 h-3 rounded-full bg-[#00BC7D]" />
                    )}
                  </div>
                </div>

                {/* Saved cards list — shown only when "card" method is selected */}
                {method.id === "card" && active && (
                  <div className="ml-4 mt-3 space-y-3 border-l border-theme-border pl-4">
                    {cards.length === 0 ? (
                      <p className="text-theme-muted text-sm py-2">
                        No saved cards yet. Add one below.
                      </p>
                    ) : (
                      cards.map((card) => {
                        const cardActive = selectedCardId === card.cardId;

                        return (
                          <div
                            key={card.cardId}
                            onClick={() => handleSelectCard(card)}
                            className={`flex items-center relative justify-between lg:p-4 p-3 rounded-lg border cursor-pointer transition
                            ${
                              cardActive
                                ? "border-[#00BC7D] bg-[#00BC7D]/10"
                                : "border-theme-border hover:border-gray-400 dark:hover:border-theme-muted"
                            }`}
                          >
                            <div className="flex items-center lg:gap-4 gap-2">
                              <div className="w-14 h-10 bg-theme-surface rounded-md flex items-center justify-center text-sm font-semibold">
                                {card.brand === "Visa" ? (
                                  <span className="text-blue-400">VISA</span>
                                ) : (
                                  <div className="flex gap-1">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                    <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-2"></div>
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-3">
                                  <p className="text-theme-text text-sm">
                                    {card.brand} •••• {card.last4}
                                  </p>

                                  {card.isDefault && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-theme-surface text-theme-muted">
                                      Primary
                                    </span>
                                  )}
                                </div>

                                <p className="text-theme-muted text-xs">
                                  Expires {card.expiryMonth}/{card.expiryYear}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center
                              ${
                                cardActive
                                  ? "border-[#00BC7D]"
                                  : "border-[#475569]"
                              }`}
                            >
                              {cardActive && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00BC7D]" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => {
          setCardForm(EMPTY_CARD_FORM);
          setCardError("");
          setOpenAddCardModal(true);
        }}
        className="mt-6 w-full bg-[#E5E7EB] text-black py-4 rounded-xl flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add New Card
      </button>

      <AddCardModal
        open={openAddCardModal}
        onClose={() => setOpenAddCardModal(false)}
        cardNumber={cardForm.cardNumber}
        setCardNumber={(value) => updateCardForm("cardNumber", value)}
        expiryMonth={cardForm.expiryMonth}
        setExpiryMonth={(value) => updateCardForm("expiryMonth", value)}
        expiryYear={cardForm.expiryYear}
        setExpiryYear={(value) => updateCardForm("expiryYear", value)}
        cardHolder={cardForm.cardHolder}
        setCardHolder={(value) => updateCardForm("cardHolder", value)}
        cardBrand={cardForm.brand}
        setCardBrand={(value) => updateCardForm("brand", value)}
        cardIsDefault={cardForm.isDefault}
        setCardIsDefault={(value) => updateCardForm("isDefault", value)}
        brands={["Visa", "Mastercard"]}
        loading={cardSaving}
        error={cardError}
        formatCardNumber={(value) => value.replace(/(\d{4})(?=\d)/g, "$1 ")}
        onSubmit={handleSaveCard}
      />
    </div>
  );
}