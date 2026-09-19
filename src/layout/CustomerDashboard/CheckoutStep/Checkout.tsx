import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Tag,
  Check,
  X,
} from "lucide-react";
import { ScheduleStep } from "./ScheduleStep";
import { PaymentStep } from "./PaymentStep";
import { ConfirmStep } from "./ConfirmStep";
import AddressStep from "./AddressStep";
import OrderSuccess from "./OrderSuccess";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../CurrencyContext";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const CART_STORAGE_KEY = "checkout_cart";
const ADDRESS_STORAGE_KEY = "checkout_address";
const PAYMENT_STORAGE_KEY = "checkout_payment";
const SCHEDULE_STORAGE_KEY = "checkout_schedule";
const ORDER_STORAGE_KEY = "checkout_order";

interface PricingData {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  discount?: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { formatPrice } = useCurrency();

  const [pricing, setPricing] = useState<PricingData>({
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    discount: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Place order state
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState("");

  const getToken = () => localStorage.getItem("authToken") || "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // ---------- GET checkout summary ----------
  const fetchCheckoutSummary = async () => {
    setSummaryLoading(true);
    setSummaryError("");

    try {
      const res = await fetch(`${API_BASE}/payment/checkout-summary`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load checkout summary.");
      }

      const { cart, pricing: pricingData } = data.data;

      setPricing({
        subtotal: pricingData.subtotal ?? 0,
        deliveryFee: pricingData.deliveryFee ?? 0,
        tax: pricingData.tax ?? 0,
        total: pricingData.total ?? 0,
        discount: 0,
      });

      // Store cart in the same shape ConfirmStep expects, so the review
      // step keeps working without changes.
      const cartForStorage = {
        items: (cart?.items || []).map((item: any) => ({
          _id: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        itemCount: cart?.itemCount ?? 0,
        subtotal: cart?.subtotal ?? 0,
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartForStorage));
    } catch (err: unknown) {
      setSummaryError(
        err instanceof Error ? err.message : "Unable to load checkout summary.",
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Apply promo code ----------
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Enter a promo code.");
      return;
    }

    setPromoApplying(true);
    setPromoError("");

    try {
      const res = await fetch(`${API_BASE}/payment/apply-promo`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          code: promoCode.trim(),
          orderTotal: pricing.subtotal,
          orderType: "delivery",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Invalid or expired promo code.");
      }

      const discount = data?.data?.discount ?? 0;
      const newTotal = data?.data?.total ?? pricing.total - discount;

      setPricing((prev) => ({
        ...prev,
        discount,
        total: newTotal,
      }));
      setAppliedPromo(promoCode.trim().toUpperCase());
      setPromoError("");
    } catch (err: unknown) {
      setPromoError(
        err instanceof Error ? err.message : "Unable to apply promo code.",
      );
      setAppliedPromo(null);
    } finally {
      setPromoApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
    setPricing((prev) => ({
      ...prev,
      discount: 0,
      total: prev.subtotal + prev.deliveryFee + prev.tax,
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      const rawAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
      const address = rawAddress ? JSON.parse(rawAddress) : null;
      if (!address?._id) {
        setPlaceOrderError("Please add or select a delivery address to continue.");
        return;
      }
      setPlaceOrderError(""); // Clear any previous error
    }

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    void handlePlaceOrder();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ---------- Initiate + Confirm payment (place order) ----------
  const handlePlaceOrder = async () => {
    setPlaceOrderError("");

    const rawAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
    const rawPayment = localStorage.getItem(PAYMENT_STORAGE_KEY);
    const rawSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);

    const address = rawAddress ? JSON.parse(rawAddress) : null;
    const payment = rawPayment ? JSON.parse(rawPayment) : null;
    const schedule = rawSchedule ? JSON.parse(rawSchedule) : null;

    if (!address?._id) {
      setPlaceOrderError("Please select a delivery address.");
      setStep(1);
      return;
    }

    if (!payment?.method) {
      setPlaceOrderError("Please select a payment method.");
      setStep(3);
      return;
    }

    setPlacingOrder(true);

    try {
      // Step 1: initiate
      const initiatePayload: any = {
        paymentMethod: payment.method,
        deliveryAddressId: address._id,
        deliveryAddress: address._id,
      };
      if (payment.method === "card" && payment.cardId) {
        initiatePayload.cardId = payment.cardId;
      }

      const initiateRes = await fetch(`${API_BASE}/payment/initiate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(initiatePayload),
      });
      const initiateData = await initiateRes.json();

      if (!initiateRes.ok || !initiateData.success) {
        throw new Error(
          initiateData?.message || "Failed to initiate payment.",
        );
      }

      // Step 2: confirm
      const confirmPayload: any = {
        paymentMethod: payment.method,
        deliveryAddressId: address._id,
        deliveryAddress: address._id,
        notes: schedule?.title
          ? `${schedule.title} (${schedule.time})`
          : "",
      };
      if (payment.method === "card" && payment.cardId) {
        confirmPayload.cardId = payment.cardId;
      }

      const confirmRes = await fetch(`${API_BASE}/payment/confirm`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(confirmPayload),
      });
      const confirmData = await confirmRes.json();

      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData?.message || "Failed to place order.");
      }

      const order = confirmData.data.order;
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));

      // Step 3: Handle Gateway Redirects (e.g., Khalti)
      if (payment.method === "khalti") {
        const khaltiRes = await fetch(`${API_BASE}/payment/khalti/initiate`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ 
            orderId: order._id,
            return_url: `${window.location.origin}/customer/dashboard`
          }),
        });
        const khaltiData = await khaltiRes.json();

        if (!khaltiRes.ok || !khaltiData.success) {
          throw new Error(khaltiData?.message || "Failed to initiate Khalti payment.");
        }

        const paymentUrl = khaltiData.data?.payment_url || khaltiData.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        } else {
          throw new Error("Payment URL not found in Khalti response.");
        }
      }

      // If not a gateway that requires redirect (e.g., Cash, Wallet), proceed to success step
      setStep(5);
    } catch (err: unknown) {
      setPlaceOrderError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const steps = [
    { id: 1, label: "Address", icon: MapPin },
    { id: 2, label: "Schedule", icon: Clock },
    { id: 3, label: "Payment", icon: CreditCard },
    { id: 4, label: "Confirm", icon: CheckCircle },
  ];

  const { subtotal, deliveryFee, tax, total, discount = 0 } = pricing;

  return (
    <div className="bg-theme-bg min-h-svh">
      <div className="border-b border-theme-border">
        <div className="flex items-center justify-between lg:px-6 px-3 py-4 max-w-[1265px] mx-auto flex-wrap gap-3">
          <div className="flex items-center gap-5 text-sm text-theme-muted">
            <span
              className="cursor-pointer"
              onClick={() => {
                localStorage.setItem("activeTab", "product-details");
                navigate("/customer/dashboard");
              }}
            >
              HubNepa
            </span>

            <span className="text-theme-muted">›</span>

            <span className="text-theme-text font-medium">Checkout</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="bg-[#fff] text-black px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 w-full"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {step === 5 ? (
        <OrderSuccess />
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 py-20 text-theme-text lg:px-6 px-3 max-w-[1265px] mx-auto">
          <div>
            <button
              onClick={prevStep}
              className="flex items-center gap-2 mb-8 text-theme-muted"
            >
              {step != 1 && <ArrowLeft size={18} />}
              <h1 className="text-3xl font-playfair text-theme-text">Checkout</h1>
            </button>

            <div className="flex items-center justify-between mb-10">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = step >= s.id;

                return (
                  <div key={s.id} className="flex flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                          active
                            ? "bg-[#009966] border-[#009966]"
                            : "border-[#1E293B]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="text-sm mt-2">{s.label}</span>
                    </div>

                    {i < 3 && (
                      <div
                        className={`flex-1 h-[2px] relative top-5 ${
                          step > s.id ? "bg-[#009966]" : "bg-[#1E293B]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {step === 1 && <AddressStep />}
            {step === 2 && <ScheduleStep />}
            {step === 3 && <PaymentStep />}
            {step === 4 && <ConfirmStep />}
          </div>

          <div className="border border-theme-border rounded-lg lg:rounded-xl bg-theme-surface lg:p-6 p-3 h-fit">
            <h3 className="font-playfair text-xl mb-6">Order Summary</h3>

            {summaryLoading ? (
              <div className="flex items-center justify-center gap-2 text-theme-muted py-10">
                <Loader2 size={18} className="animate-spin" />
                Loading summary...
              </div>
            ) : summaryError ? (
              <p className="text-red-400 text-sm py-4">{summaryError}</p>
            ) : (
              <>
                <div className="space-y-3 text-theme-muted">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#00BC7D]">
                      <span>Promo Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                {/* Promo code section — new UI */}
                <div className="mt-5">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#00BC7D0D] border border-[#00BC7D33] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2 text-[#00BC7D] text-sm">
                        <Check size={14} />
                        <span className="font-medium">{appliedPromo}</span>
                        applied
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-theme-muted hover:text-theme-text"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                        />
                        <input
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError("");
                          }}
                          placeholder="Promo code"
                          className="w-full h-10 pl-9 pr-3 rounded-lg bg-theme-bg border border-theme-border text-sm text-theme-text outline-none focus:border-[#009966]"
                        />
                      </div>

                      <button
                        onClick={handleApplyPromo}
                        disabled={promoApplying}
                        className="px-4 h-10 rounded-lg bg-theme-surface border border-theme-border text-sm text-theme-text hover:bg-theme-bg dark:hover:bg-[#334155] disabled:opacity-60"
                      >
                        {promoApplying ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-red-400 text-xs mt-2">{promoError}</p>
                  )}
                </div>

                <div className="border-t border-theme-border mt-4 pt-4 flex justify-between items-center">
                  <span>Total</span>

                  <span className="text-[#00BC7D] text-[24px] font-playfair">
                    {formatPrice(total)}
                  </span>
                </div>

                {placeOrderError && (
                  <p className="text-red-400 text-sm mt-4">
                    {placeOrderError}
                  </p>
                )}

                <button
                  onClick={nextStep}
                  disabled={placingOrder}
                  className="mt-6 bg-[#009966] px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full disabled:opacity-60"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      {step === 4 ? "Place Order" : "Continue"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-xs text-[#62748E] mt-5">
                  By placing an order, you agree to our Terms of Service.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}