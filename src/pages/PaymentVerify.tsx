import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      
      if (!pidx) {
        setStatus("error");
        setErrorMessage("Missing payment parameters.");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        setStatus("error");
        setErrorMessage("You must be logged in to verify payment.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/payment/khalti/verify?pidx=${pidx}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          // Optionally clear checkout cart here if backend doesn't do it automatically
          localStorage.removeItem("checkout_cart");
        } else {
          throw new Error(data?.message || "Payment verification failed.");
        }
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "An error occurred during verification.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#020618] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0F172B] border border-[#1E293B] rounded-2xl p-8 text-center text-white shadow-xl">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-[#00BC7D]" />
            <h2 className="text-2xl font-playfair font-medium">Verifying Payment</h2>
            <p className="text-[#94A3B8]">Please wait while we confirm your payment with Khalti...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle size={56} className="text-[#00BC7D]" />
            <h2 className="text-2xl font-playfair font-medium text-white">Payment Successful!</h2>
            <p className="text-[#94A3B8]">Your order has been placed successfully.</p>
            <button
              onClick={() => {
                localStorage.setItem("activeTab", "orders");
                navigate("/customer/dashboard");
              }}
              className="mt-6 bg-[#009966] text-white px-6 py-3 rounded-lg font-medium w-full hover:bg-[#007A52] transition-colors"
            >
              View My Orders
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle size={56} className="text-red-500" />
            <h2 className="text-2xl font-playfair font-medium text-white">Payment Failed</h2>
            <p className="text-[#94A3B8]">{errorMessage}</p>
            <button
              onClick={() => navigate("/customer/dashboard/checkout")}
              className="mt-6 bg-[#1E293B] text-white px-6 py-3 rounded-lg font-medium w-full hover:bg-[#334155] transition-colors"
            >
              Return to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
