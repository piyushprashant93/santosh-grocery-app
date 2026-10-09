import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "../../../lib/apiFetch";

export default function LogisticsTab() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogistics();
  }, [page]);

  const fetchLogistics = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/supplier-panel/logistics?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setShipments(data.data?.data || []);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch logistics", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Logistics & Fleet</h2>
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
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Shipment ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Destination</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Driver</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && shipments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No shipments found.</td>
              </tr>
            ) : (
              shipments.map((shipment, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">{shipment.shipmentId || shipment._id || shipment.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{shipment.destination || '-'}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{shipment.driverName || shipment.driver || '-'}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      shipment.status === 'in-transit' || shipment.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      shipment.status === 'loading' || shipment.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {shipment.status || 'pending'}
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
