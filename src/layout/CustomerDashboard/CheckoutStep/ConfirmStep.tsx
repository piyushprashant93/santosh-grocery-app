import { useEffect, useState } from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import { PackageX } from "lucide-react";
import { getImageUrl } from "../../../utils/dataHelper";


const CART_STORAGE_KEY = "checkout_cart";
const PAYMENT_STORAGE_KEY = "checkout_payment";
const SCHEDULE_STORAGE_KEY = "checkout_schedule";
const ADDRESS_STORAGE_KEY = "checkout_address";

interface CartItem {
  _id: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

// Matches the shape PaymentStep now persists: { method, display, ... }
interface PaymentData {
  method: "wallet" | "card" | "cash";
  display: string;
}

interface ScheduleData {
  title: string;
  time: string;
  price: string;
}

interface AddressData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function readFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function ConfirmStep() {
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState<CartData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  useEffect(() => {
    setCart(readFromStorage<CartData>(CART_STORAGE_KEY));
    setPayment(readFromStorage<PaymentData>(PAYMENT_STORAGE_KEY));
    setSchedule(readFromStorage<ScheduleData>(SCHEDULE_STORAGE_KEY));
    setAddress(readFromStorage<AddressData>(ADDRESS_STORAGE_KEY));
  }, []);

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="border border-theme-border rounded-lg lg:rounded-2xl lg:p-6 p-3 bg-theme-surface">
        <h2 className="font-playfair text-2xl mb-6 text-theme-text">
          Review Order
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <PackageX size={32} className="text-theme-muted" />
          <p className="text-theme-muted text-sm">
            No items found in your cart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-theme-border rounded-lg lg:rounded-2xl lg:p-6 p-3 bg-theme-surface">
      <h2 className="font-playfair text-2xl mb-6 text-theme-text">
        Review Order
      </h2>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item._id} className="flex items-start justify-between">
            <div className="flex gap-4">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-theme-surface flex items-center justify-center text-theme-muted text-xs">
                  No Img
                </div>
              )}

              <div>
                <p className="text-theme-text text-lg font-playfair">
                  {item.name}
                </p>
                <p className="text-theme-muted">Qty: {item.quantity}</p>
              </div>
            </div>

            <span className="text-theme-text text-xl">
              {formatPrice(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-theme-border my-6"></div>

      <div className="flex justify-between mb-6">
        <p className="text-theme-muted">Payment</p>
        <p className="text-theme-text">
          {payment ? payment.display : "Not selected"}
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <p className="text-theme-muted">Delivery</p>
        <p className="text-theme-text">
          {schedule ? `${schedule.title} • ${schedule.time}` : "Not selected"}
        </p>
      </div>

      <div className="flex justify-between">
        <p className="text-theme-muted">Deliver to</p>

        <div className="text-right text-theme-text">
          {address ? (
            <>
              <p>{address.fullName}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
            </>
          ) : (
            <p className="text-theme-muted">No address selected</p>
          )}
        </div>
      </div>
    </div>
  );
}