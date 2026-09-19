import {
  Wallet,
  Plus,
  ArrowUpRight,
  CreditCard,
  Gift,
  Clock,
  ArrowUpRight as Out,
  ArrowDownLeft,
  Star,
  Crown,
  Loader2,
  X,
  Trash2,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import VoucherSection from "./VoucherSection";
import AddCardModal from "./AddCardModal";

type WalletData = {
  balance: number;
  rewardPoints: number;
  membershipTier: string;
};

type Transaction = {
  _id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: string;
  transactionId: string;
  createdAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Card = {
  _id: string;
  cardId: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolder: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const PAGE_LIMIT = 10;

const PAYMENT_METHODS = [
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const BRANDS = ["Visa", "Mastercard", "Amex", "RuPay"];

export default function WalletPayments() {
  const { formatPrice, currency, rates } = useCurrency();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  // Top up modal state
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState("card");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState("");

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  // Cards state
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Add card modal state
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa");
  const [cardIsDefault, setCardIsDefault] = useState(false);
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [addCardError, setAddCardError] = useState("");

  const [activeTab, setActiveTab] = useState<"wallet" | "payment">("wallet");

  const [payments, setPayments] = useState([]);
  const [paymentPagination, setPaymentPagination] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState("");

  const fetchPaymentHistory = async (page = 1) => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    setPaymentsLoading(true);
    setPaymentsError("");

    try {
      const response = await fetch(`${API_BASE}/payment/history?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load payment history.");
      }

      setPayments(data.data.payments ?? []);
      setPaymentPagination(data.data.pagination ?? null);
    } catch (err) {
      setPaymentsError(
        err instanceof Error ? err.message : "Unable to load payment history.",
      );
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "payment") {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  const activeClass =
    "px-4 py-2 text-xs flex-1 rounded-lg bg-[#009966] text-white font-medium transition-colors";

  const normalClass =
    "px-4 py-2 text-xs flex-1 rounded-lg border border-[#E5E7EB] bg-white text-[#6A7282] hover:bg-[#F9FAFB] font-medium transition-colors";

  const fetchWallet = async () => {
    setWalletLoading(true);
    setWalletError("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setWalletError("Authentication token not found.");
      setWalletLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load wallet.");
      }

      setWallet(data?.data ?? null);
    } catch (err) {
      setWalletError(
        err instanceof Error ? err.message : "Unable to load wallet.",
      );
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    void fetchWallet();
  }, []);

  const fetchTransactions = async (page: number, append: boolean) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setTransactionsError("Authentication token not found.");
      setTransactionsLoading(false);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setTransactionsLoading(true);
    }
    setTransactionsError("");

    try {
      const response = await fetch(
        `${API_BASE}/wallet/transactions?page=${page}&limit=${PAGE_LIMIT}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load transactions.");
      }

      const items: Transaction[] = data?.data?.data ?? [];
      const pageInfo: Pagination | null = data?.data?.pagination ?? null;

      setTransactions((prev) => (append ? [...prev, ...items] : items));
      setPagination(pageInfo);
    } catch (err) {
      setTransactionsError(
        err instanceof Error ? err.message : "Unable to load transactions.",
      );
    } finally {
      setTransactionsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void fetchTransactions(1, false);
  }, []);

  const fetchCards = async () => {
    setCardsLoading(true);
    setCardsError("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setCardsError("Authentication token not found.");
      setCardsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/wallet/cards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load cards.");
      }

      const list: Card[] = data?.data?.cards ?? data?.data ?? [];
      setCards(Array.isArray(list) ? list : []);
    } catch (err) {
      setCardsError(
        err instanceof Error ? err.message : "Unable to load cards.",
      );
    } finally {
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCards();
  }, []);

  const formattedBalance = walletLoading
    ? "—"
    : `${formatPrice((wallet?.balance ?? 0))}`;

  // "top_up" and "refund" style types read as credits (money in);
  // everything else (withdrawal, payment, etc.) reads as a debit (money out).
  const isCredit = (t: Transaction) => t.amount > 0;

  const formatAmount = (t: Transaction) => {
    const sign = t.amount > 0 ? "+" : "-";
    return `${sign}${formatPrice(Math.abs(t.amount))}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "") // Only digits
      .slice(0, 16) // Max 16 digits
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatType = (type: string) =>
    type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const canLoadMore = !!pagination?.hasNextPage && !loadingMore;

  const handleLoadMore = () => {
    if (!pagination) return;
    void fetchTransactions(pagination.page + 1, true);
  };

  // Refresh both balance and the first page of transactions after a
  // successful top-up/withdrawal so the new entry shows up immediately.
  const refreshAfterTransaction = async () => {
    await Promise.all([fetchWallet(), fetchTransactions(1, false)]);
  };

  const openTopUpModal = () => {
    setTopUpAmount("");
    setTopUpMethod("card");
    setTopUpError("");
    setShowTopUpModal(true);
  };

  const openWithdrawModal = () => {
    setWithdrawAmount("");
    setWithdrawError("");
    setShowWithdrawModal(true);
  };

  const handleTopUp = async () => {
    setTopUpError("");

    const amount = Number(topUpAmount);

    if (!topUpAmount.trim() || Number.isNaN(amount) || amount <= 0) {
      setTopUpError("Enter a valid amount greater than 0.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      setTopUpError("Authentication token not found.");
      return;
    }

    setTopUpLoading(true);

    try {
      const rate = rates[currency] || 1;
      // Round to 2 decimal places to avoid floating point precision issues on the backend
      const amountInUSD = Math.round((amount / rate) * 100) / 100;

      const response = await fetch(`${API_BASE}/wallet/top-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountInUSD,
          paymentMethod: topUpMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") || data.message || "Top up failed.",
        );
      }

      setShowTopUpModal(false);
      await refreshAfterTransaction();
    } catch (err) {
      setTopUpError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawError("");

    const amount = Number(withdrawAmount);

    if (!withdrawAmount.trim() || Number.isNaN(amount) || amount <= 0) {
      setWithdrawError("Enter a valid amount greater than 0.");
      return;
    }

    const rate = rates[currency] || 1;
    // Round to 2 decimal places to avoid floating point precision issues on the backend
    const amountInUSD = Math.round((amount / rate) * 100) / 100;

    if (wallet && (amountInUSD - wallet.balance) > 0.0001) {
      setWithdrawError("Amount exceeds your available balance.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      setWithdrawError("Authentication token not found.");
      return;
    }

    setWithdrawLoading(true);

    try {
      const response = await fetch(`${API_BASE}/wallet/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountInUSD }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") || data.message || "Withdrawal failed.",
        );
      }

      setShowWithdrawModal(false);
      await refreshAfterTransaction();
    } catch (err) {
      setWithdrawError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  const openAddCardModal = () => {
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCardHolder("");
    setCardBrand("Visa");
    setCardIsDefault(cards.length === 0);
    setAddCardError("");
    setShowAddCardModal(true);
  };

  const validateCardForm = () => {
    if (!/^\d{13,19}$/.test(cardNumber.trim())) {
      setAddCardError("Enter a valid card number.");
      return false;
    }

    if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth.trim())) {
      setAddCardError("Enter a valid expiry month (01-12).");
      return false;
    }

    if (!/^\d{4}$/.test(expiryYear.trim())) {
      setAddCardError("Enter a valid 4-digit expiry year.");
      return false;
    }

    if (!cardHolder.trim()) {
      setAddCardError("Card holder name is required.");
      return false;
    }

    return true;
  };

  const handleAddCard = async () => {
    setAddCardError("");

    if (!validateCardForm()) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setAddCardError("Authentication token not found.");
      return;
    }

    setAddCardLoading(true);

    try {
      const response = await fetch(`${API_BASE}/wallet/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardNumber: cardNumber.trim(),
          expiryMonth: expiryMonth.trim(),
          expiryYear: expiryYear.trim(),
          cardHolder: cardHolder.trim(),
          brand: cardBrand,
          isDefault: cardIsDefault,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") || data.message || "Failed to add card.",
        );
      }

      setShowAddCardModal(false);
      await fetchCards();
    } catch (err) {
      setAddCardError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setAddCardLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    setDeletingCardId(cardId);

    const previous = cards;

    // Optimistic removal
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));

    try {
      const response = await fetch(`${API_BASE}/wallet/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete card.");
      }
    } catch (err) {
      console.log(err);
      setCards(previous);
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    setSettingDefaultId(cardId);

    const previous = cards;

    // Optimistic update
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.cardId === cardId,
      })),
    );

    try {
      const response = await fetch(
        `${API_BASE}/wallet/cards/${cardId}/default`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to set default card.");
      }
    } catch (err) {
      console.log(err);
      setCards(previous);
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="lg:text-[34px] text-[24px] font-playfair font-medium text-theme-text">
          Wallet & Payments
        </h1>
        <p className="text-theme-muted mt-1 lg:text-lg text-base">
          Manage payment methods, view balance, and track transactions.
        </p>
      </div>

      {walletError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {walletError}
        </p>
      )}

      <div className="grid xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4">
          <div className="border border-[#D1FAE5] bg-gradient-to-br from-white to-[#ECFDF580] lg:rounded-2xl rounded-lg lg:p-6 p-3 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] flex justify-between items-start">
            <div>
              <p className="text-[#009966] tracking-widest text-sm mb-3">
                HUBNEPA BALANCE
              </p>

              <h2 className="font-playfair text-[32px] lg:text-[52px] text-theme-text">
                {formattedBalance}
              </h2>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-theme-muted">
                  <Star size={14} className="text-[#F59E0B]" />
                  {walletLoading ? "—" : (wallet?.rewardPoints ?? 0)} reward
                  points
                </span>

                <span className="flex items-center gap-1.5 text-sm text-theme-muted">
                  <Crown size={14} className="text-[#009966]" />
                  {walletLoading
                    ? "—"
                    : (wallet?.membershipTier ?? "Free")}{" "}
                  tier
                </span>
              </div>

              <div className="flex lg:gap-4 gap-2 mt-6">
                <button
                  onClick={openTopUpModal}
                  className="flex items-center gap-2 lg:px-5 px-3 lg:text-base text-sm min-w-max lg:py-3 py-1.5 bg-[#009966] text-white rounded-lg shadow-sm"
                >
                  <Plus size={18} />
                  Top Up Wallet
                </button>

                <button
                  onClick={openWithdrawModal}
                  className="flex items-center gap-2 lg:px-5 px-3 lg:text-base text-sm lg:py-3 py-1.5 border border-[#D1FAE5] text-[#009966] rounded-lg shadow-sm"
                >
                  <ArrowUpRight size={18} />
                  Withdraw
                </button>
              </div>
            </div>

            <div className="w-14 h-14 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
              <Wallet className="text-[#009966]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-theme-border lg:rounded-2xl rounded-lg lg:p-6 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} />
                <h3 className="font-playfair text-xl text-theme-text">
                  Saved Cards
                </h3>
              </div>

              {cardsLoading ? (
                <div className="flex items-center justify-center gap-2 text-theme-muted py-6">
                  <Loader2 size={16} className="animate-spin" />
                  Loading cards...
                </div>
              ) : cardsError ? (
                <div className="text-center py-6">
                  <p className="text-sm text-red-500">{cardsError}</p>
                  <button
                    onClick={fetchCards}
                    className="mt-2 text-sm border border-theme-border rounded-lg px-4 py-2"
                  >
                    Retry
                  </button>
                </div>
              ) : cards.length === 0 ? (
                <p className="text-sm text-theme-muted text-center py-11">
                  No saved cards yet.
                </p>
              ) : (
                cards.map((card) => (
                  <div
                    key={card._id}
                    className={`border rounded-lg p-3 flex items-center justify-between mb-3 ${
                      card.isDefault ? "border-[#D1FAE5]" : "border-[#E5E7EB]"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">
                        {card.brand?.toUpperCase()}
                      </span>

                      <span
                        className={
                          card.isDefault ? "text-[#0F172A]" : "text-[#6A7282]"
                        }
                      >
                        •••• {card.last4}
                      </span>

                      {card.isDefault && (
                        <span className="text-xs bg-[#D1FAE5] text-[#009966] px-2 py-1 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefaultCard(card.cardId)}
                          disabled={settingDefaultId === card.cardId}
                          className="text-xs text-[#009966] hover:underline disabled:opacity-50"
                        >
                          {settingDefaultId === card._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Set default"
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteCard(card.cardId)}
                        disabled={deletingCardId === card.cardId}
                        className="text-theme-muted hover:text-red-500 disabled:opacity-50"
                        aria-label="Delete card"
                      >
                        {deletingCardId === card._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={openAddCardModal}
                className="w-full border border-theme-border rounded-lg py-3 text-theme-muted mt-1"
              >
                + Add New Card
              </button>
            </div>

            <VoucherSection />
          </div>
        </div>

        <div className="border border-theme-border lg:rounded-2xl rounded-lg lg:p-6 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} />
            <h3 className="font-playfair text-xl text-theme-text">
              Recent Activity
            </h3>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("wallet")}
              className={activeTab === "wallet" ? activeClass : normalClass}
            >
              Wallet Transactions
            </button>

            <button
              onClick={() => setActiveTab("payment")}
              className={activeTab === "payment" ? activeClass : normalClass}
            >
              Payment History
            </button>
          </div>

         {activeTab === "wallet" ? (
  transactionsLoading ? (
    <div className="flex items-center justify-center gap-2 text-theme-muted py-10">
      <Loader2 size={16} className="animate-spin" />
      Loading transactions...
    </div>
  ) : transactionsError ? (
    <div className="text-center py-10">
      <p className="text-sm text-red-500">{transactionsError}</p>

      <button
        onClick={() => fetchTransactions(1, false)}
        className="mt-3 text-sm border border-theme-border rounded-lg px-4 py-2"
      >
        Retry
      </button>
    </div>
  ) : transactions.length === 0 ? (
    <p className="text-sm text-theme-muted text-center py-10">
      No transactions yet.
    </p>
  ) : (
    <>
      <div className="space-y-6">
        {transactions.map((t) => {
          const credit = isCredit(t);

          return (
            <div
              key={t._id}
              className="flex justify-between items-center gap-3"
            >
              <div className="flex gap-3 items-center min-w-0">
                <div
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                    credit
                      ? "bg-green-50 text-[#009966]"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {credit ? (
                    <ArrowDownLeft size={18} />
                  ) : (
                    <Out size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-theme-text truncate">
                    {t.description || formatType(t.type)}
                  </p>

                  <p className="text-sm text-theme-muted">
                    {formatDate(t.createdAt)}
                  </p>
                </div>
              </div>

              <span
                className={`font-semibold ${
                  credit ? "text-[#009966]" : "text-[#0F172A]"
                }`}
              >
                {formatAmount(t)}
              </span>
            </div>
          );
        })}
      </div>

      {canLoadMore && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="text-theme-muted mt-6 disabled:opacity-60"
        >
          {loadingMore ? "Loading..." : "View Full History"}
        </button>
      )}
    </>
  )
) : paymentsLoading ? (
  <div className="flex items-center justify-center gap-2 text-theme-muted py-10">
    <Loader2 size={16} className="animate-spin" />
    Loading payment history...
  </div>
) : paymentsError ? (
  <div className="text-center py-10">
    <p className="text-sm text-red-500">{paymentsError}</p>
  </div>
) : payments.length === 0 ? (
  <p className="text-sm text-theme-muted text-center py-10">
    No payment history found.
  </p>
) : (
  <div className="space-y-6">
    {payments.map((payment: any) => (
      <div
        key={payment._id}
        className="flex justify-between items-center gap-3"
      >
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard size={18} />
          </div>

          <div>
            <p className="text-theme-text">
              {payment.items?.[0]?.name || "Order Payment"}
            </p>

            <p className="text-sm text-theme-muted">
              {payment.orderId}
            </p>

            <p className="text-xs text-theme-muted capitalize">
              {payment.paymentMethod} • {payment.paymentStatus}
            </p>

            <p className="text-xs text-theme-muted">
              {formatDate(payment.createdAt)}
            </p>
          </div>
        </div>

        <span className="font-semibold text-theme-text">
          {formatPrice(payment.total)}
        </span>
      </div>
    ))}
  </div>
)}
        </div>
      </div>

      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 !mt-0 px-4">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-xl text-theme-text">
                Top Up Wallet
              </h2>

              <button
                onClick={() => setShowTopUpModal(false)}
                disabled={topUpLoading}
                className="text-theme-muted hover:text-theme-text"
              >
                <X size={20} />
              </button>
            </div>

            <label className="text-sm text-theme-muted">Amount</label>

            <div className="mt-1 mb-4 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted text-xs font-semibold">
                {currency}
              </span>

              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full bg-theme-bg border border-theme-border rounded-lg pl-14 pr-4 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
              />
            </div>

            <label className="text-sm text-theme-muted">Payment Method</label>

            <select
              value={topUpMethod}
              onChange={(e) => setTopUpMethod(e.target.value)}
              className="mt-1 w-full bg-theme-bg border border-theme-border rounded-lg px-4 py-3 text-theme-text outline-none focus:border-[#009966]"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value} className="bg-theme-bg">
                  {m.label}
                </option>
              ))}
            </select>

            {topUpError && (
              <p className="mt-3 text-sm text-red-400">{topUpError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTopUpModal(false)}
                disabled={topUpLoading}
                className="border border-theme-border text-theme-muted hover:bg-theme-surface px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleTopUp}
                disabled={topUpLoading}
                className="bg-[#009966] hover:bg-[#00b377] text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {topUpLoading ? "Processing..." : "Top Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 !mt-0 px-4">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-xl text-theme-text">
                Withdraw Funds
              </h2>

              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawLoading}
                className="text-theme-muted hover:text-theme-text"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-theme-muted mb-4">
              Available balance:{" "}
              <span className="font-medium text-theme-text">{formattedBalance}</span>
            </p>

            <label className="text-sm text-theme-muted">Amount</label>

            <div className="mt-1 mb-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted text-xs font-semibold">
                {currency}
              </span>

              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-theme-bg border border-theme-border rounded-lg pl-14 pr-4 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
              />
            </div>

            {withdrawError && (
              <p className="mt-3 text-sm text-red-400">{withdrawError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawLoading}
                className="border border-theme-border text-theme-muted hover:bg-theme-surface px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className="bg-[#009966] hover:bg-[#00b377] text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {withdrawLoading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCardModal
        open={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        expiryMonth={expiryMonth}
        setExpiryMonth={setExpiryMonth}
        expiryYear={expiryYear}
        setExpiryYear={setExpiryYear}
        cardHolder={cardHolder}
        setCardHolder={setCardHolder}
        cardBrand={cardBrand}
        setCardBrand={setCardBrand}
        cardIsDefault={cardIsDefault}
        setCardIsDefault={setCardIsDefault}
        brands={BRANDS}
        loading={addCardLoading}
        error={addCardError}
        formatCardNumber={formatCardNumber}
        onSubmit={handleAddCard}
      />
    </div>
  );
}
