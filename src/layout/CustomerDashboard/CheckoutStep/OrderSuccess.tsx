import { useEffect, useState } from "react";
import { Check, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ORDER_STORAGE_KEY = "checkout_order";

interface OrderData {
  orderId: string;
  estimatedDelivery: string;
  total: number;
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
  }, []);

  const formattedDelivery = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleString(undefined, {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Estimated soon";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center lg:px-6 px-3 py-10">
      <div className="w-24 h-24 rounded-full bg-[#043D34] flex items-center justify-center mb-6">
        <div className="w-14 h-14 rounded-full border-2 border-[#00BC7D] flex items-center justify-center">
          <Check size={26} className="text-[#00BC7D]" />
        </div>
      </div>

      <h1 className="font-playfair text-4xl text-theme-text mb-3">
        Order Confirmed!
      </h1>

      <p className="text-theme-muted mb-8">
        Your order{" "}
        <span className="text-theme-text">#{order?.orderId || "—"}</span> has been
        placed successfully.
      </p>

      <div className="w-full max-w-[520px] border border-theme-border rounded-lg lg:rounded-2xl lg:p-6 p-3 bg-theme-surface text-left mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Truck className="text-[#60A5FA]" size={20} />

          <div>
            <p className="text-theme-text">Estimated Delivery</p>

            <p className="text-theme-muted text-sm">{formattedDelivery}</p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-theme-surface rounded-full mb-4">
          <div className="w-[35%] h-full bg-[#00BC7D] rounded-full" />
        </div>

        <p className="text-theme-muted text-sm">
          We've sent a confirmation email to your inbox.
        </p>
      </div>

      <button
        onClick={() => navigate("/customer/dashboard/orders")}
        className="w-full max-w-[520px] bg-[#009966] text-white py-4 rounded-lg lg:rounded-xl text-lg font-medium mb-6"
      >
        Track Order
      </button>

      <button
        onClick={() => navigate("/customer/dashboard")}
        className="text-theme-muted"
      >
        Back to Home
      </button>
    </div>
  );
}