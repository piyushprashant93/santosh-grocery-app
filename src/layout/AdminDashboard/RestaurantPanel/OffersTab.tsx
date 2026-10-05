import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import api from "../../../lib/api"

export default function OffersTab() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/partners/restaurants');
        const partners = res.data?.data?.data || res.data?.data || res.data || [];
        const id = Array.isArray(partners) && partners.length > 0 ? (partners[0]._id || partners[0].id) : null;
        if (id) {
          const offersRes = await api.get(`/admin/partners/restaurants/${id}/offers`);
          const rawData = offersRes.data?.data?.data || offersRes.data?.data || offersRes.data || [];
          setOffers(rawData.map((o: any) => ({
            id: o._id || o.id || 'OFF-000',
            code: o.code || o.title || 'UNKNOWN',
            discount: o.discountType === 'percentage' ? `${o.discountValue}%` : `$${(o.discountValue || 0).toFixed(2)}`,
            status: o.isActive ? 'Active' : 'Inactive',
            expiry: o.expiryDate ? new Date(o.expiryDate).toLocaleDateString() : 'N/A'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search offers..."
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offers.map((o, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-theme-text">{o.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-theme-text">{o.discount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      o.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{o.expiry}</span>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No offers found.
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
