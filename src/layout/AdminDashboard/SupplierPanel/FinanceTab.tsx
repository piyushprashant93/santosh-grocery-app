import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useCurrency } from "../../../context/CurrencyContext";
import { apiFetch } from "../../../lib/apiFetch";

export default function FinanceTab() {
  const { formatPrice } = useCurrency();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/supplier-panel/finance`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch finance", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data?.totalRevenue || 0;
  const pendingPayments = data?.pendingPayments || 0;
  const settledThisMonth = data?.settledThisMonth || 0;
  const transactions = data?.transactions || [];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300 relative">
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Supplier Finance</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-theme-text">{formatPrice(totalRevenue)}</h3>
        </div>
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
          <h3 className="text-2xl font-bold text-theme-text">{formatPrice(pendingPayments)}</h3>
        </div>
        <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Settled This Month</p>
          <h3 className="text-2xl font-bold text-theme-text">{formatPrice(settledThisMonth)}</h3>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-theme-text mb-4">Recent Transactions</h3>
        <div className="flex flex-col gap-4">
          {!loading && transactions.length === 0 ? (
            <p className="text-gray-500 py-4">No transactions found.</p>
          ) : (
            transactions.map((tx: any, idx: number) => {
              const isPositive = tx.type === 'positive' || tx.type === 'credit' || tx.amount > 0;
              return (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 bg-gray-50/30 px-4 rounded-xl border hover:bg-gray-50/50 transition">
                  <div>
                    <p className="font-medium text-theme-text">{tx.title || tx.description || 'Transaction'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-')}
                    </p>
                  </div>
                  <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatPrice(tx.amount)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  )
}
