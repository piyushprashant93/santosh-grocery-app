import { useEffect, useState } from "react";
import { Gift, Loader2 } from "lucide-react";

interface VoucherSectionProps {
  orderTotal?: number;
  authToken?: string;
  orderType?: string;
  onVoucherApplied?: (data: any) => void;
}

const STATIC_VOUCHERS = [
  { code: "WELCOME50", label: "Expires in 2 days" },
  { code: "FREESHIP", label: "Active" },
];

const API_URL =
  "https://mr-santosh-grocery-backend.onrender.com/api/v1/wallet/apply-voucher";

export default function VoucherSection({
  orderTotal,
  authToken,
  orderType,
  onVoucherApplied,
}: VoucherSectionProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);

  const applyVoucher = async (voucherCode: string) => {
    if (!voucherCode.trim()) {
      setError("Please enter a voucher code");
      return;
    }

    setLoading(true);
    setError(null);

        const authToken = localStorage.getItem("authToken");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          code: voucherCode,
          orderTotal,
          orderType: orderType || "delivery",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to apply voucher");
      }

      setAppliedVoucher(data);
      setCode(voucherCode);
      onVoucherApplied?.(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong while applying voucher");
      setAppliedVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    applyVoucher(code);
  };

  const handleStaticVoucherClick = (voucherCode: string) => {
    setCode(voucherCode);
    applyVoucher(voucherCode);
  };

    useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError(null);
  }, 2000);

  return () => clearTimeout(timer);
}, [error]);

  return (
    <div className="border border-theme-border lg:rounded-2xl rounded-lg lg:p-6 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
      <div className="flex items-center gap-2 mb-5">
        <Gift size={18} />
        <h3 className="font-playfair text-xl text-theme-text">Vouchers</h3>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="Enter code"
          className="flex-1 border w-full border-theme-border rounded-lg px-3 py-2 outline-none"
          disabled={loading}
        />

        <button
          onClick={handleApplyClick}
          disabled={loading}
          className="bg-theme-surface text-theme-text px-4 rounded-lg flex items-center justify-center min-w-[80px] disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {appliedVoucher && !error && (
        <p className="text-[#009966] text-sm mb-3">
          Voucher applied successfully!
        </p>
      )}

      {STATIC_VOUCHERS.map((voucher) => (
        <button
          key={voucher.code}
          onClick={() => handleStaticVoucherClick(voucher.code)}
          disabled={loading}
          className="w-full bg-[#F1F5F9] rounded-lg p-3 flex gap-2 flex-wrap items-center justify-between mb-3 last:mb-0 text-left hover:bg-[#E5E7EB] transition-colors disabled:opacity-60"
        >
          <span className="text-[#009966] font-semibold">{voucher.code}</span>
          <span className="text-theme-muted text-sm">{voucher.label}</span>
        </button>
      ))}
    </div>
  );
}