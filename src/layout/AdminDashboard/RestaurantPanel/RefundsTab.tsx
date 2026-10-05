import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import api from "../../../lib/api"

export default function RefundsTab() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/partners/restaurants');
        const partners = res.data?.data?.data || res.data?.data || res.data || [];
        const id = Array.isArray(partners) && partners.length > 0 ? (partners[0]._id || partners[0].id) : null;
        if (id) {
          const refundsRes = await api.get(`/admin/partners/restaurants/${id}/refunds`);
          const rawData = refundsRes.data?.data?.data || refundsRes.data?.data || refundsRes.data || [];
          setRefunds(rawData.map((r: any) => ({
            id: r._id || r.id || 'REF-000',
            orderId: r.orderId || r.order?.id || 'N/A',
            customer: r.customer?.fullName || r.customer?.firstName || 'Unknown',
            amount: `$${(r.amount || r.refundAmount || 0).toFixed(2)}`,
            status: r.status || 'Pending',
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch refunds", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search refunds..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Refund ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refunds.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-theme-text">{r.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-theme-text">{r.orderId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{r.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-theme-text">{r.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      r.status === 'Processed' || r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{r.date}</span>
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No refunds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
