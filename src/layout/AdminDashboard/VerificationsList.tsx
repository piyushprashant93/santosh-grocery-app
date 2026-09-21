import { useState, useEffect } from "react";
import { Loader2, Eye, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function VerificationsList() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/admin/verifications?type=');
      const data = res.data?.data || res.data || [];
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[300px] relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading documents...</p>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchVerifications} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Retry</button>
        </div>
      )}
      {!loading && !error && documents.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-gray-500">
          <p>No pending verifications.</p>
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((doc, idx) => {
            const partnerId = doc.partnerId || doc.restaurantId || doc.retailerId || doc.partner?._id || '';
            const partnerName = doc.partnerName || doc.partner?.businessName || doc.partner?.name || 'Unknown';
            return (
            <tr key={doc._id || idx} className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900">{partnerName}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                {doc.partnerType || 'Restaurant'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                {doc.documentType || doc.type || 'Document'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/50 text-amber-700 border border-amber-200/50">
                  {doc.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  onClick={() => navigate(`/admin/dashboard/partner-management/${partnerId}/documents`)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 font-medium text-sm rounded-lg hover:bg-emerald-100 transition"
                >
                  Review
                </button>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
