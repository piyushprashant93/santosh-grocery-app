import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "../../../lib/apiFetch";

export default function OffersTab() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/retailer-panel/offers?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setOffers(data.data?.data || []);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch offers", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Offers & Coupons</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Coupon Code</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Discount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Used / Limit</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && offers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No offers found.</td>
              </tr>
            ) : (
              offers.map((offer, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">{offer.code}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{offer.usedCount || 0} / {offer.usageLimit || '∞'}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      offer.status === 'Active' || offer.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {offer.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Prev
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
