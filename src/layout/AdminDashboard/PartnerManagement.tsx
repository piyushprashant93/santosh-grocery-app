import { useState, useRef, useEffect } from "react"
import { useNavigate, Routes, Route, useParams } from "react-router-dom"
import { Search, Filter, MoreHorizontal, Eye, FileText, CheckCircle2, Ban, AlertTriangle, Store, ShoppingBag, Loader2 } from "lucide-react"
import PartnerDetails from "./PartnerSubpages/PartnerDetails"
import PartnerDocuments from "./PartnerSubpages/PartnerDocuments"
import PartnerSettings from "./PartnerSubpages/PartnerSettings"
import AddPartnerWizard from "./PartnerSubpages/AddPartnerWizard"
import api from "../../lib/api"

function PartnerManagementList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'retailers'>('restaurants');
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [activeTab]);

  const fetchPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = activeTab === 'restaurants' ? '/api/v1/admin/partners/restaurants' : '/api/v1/admin/partners/retailers';
      const res = await api.get(endpoint);
      const data = res.data?.data?.data || res.data?.data || res.data || [];
      const partnersList = Array.isArray(data) ? data : (data.partners || []);
      setPartners(partnersList);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (partnerId: string, action: 'approve' | 'reject' | 'suspend') => {
    try {
      const type = activeTab === 'restaurants' ? 'restaurants' : 'retailers';
      await api.put(`/api/v1/admin/partners/${type}/${partnerId}/${action}`);
      fetchPartners();
      setActiveDropdown(null);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || `Failed to ${action} partner`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Partner Management</h1>
          <p className="text-gray-500 mt-1">Onboard, verify, and manage restaurants and retailers.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard/partner-management/new')}
          className="px-5 py-2.5 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition"
        >
          Add New Partner
        </button>
      </div>

      {/* Tabs Container */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 flex px-4 pt-2">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
              activeTab === 'restaurants' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Store size={18} />
            Restaurants
          </button>
          <button 
            onClick={() => setActiveTab('retailers')}
            className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
              activeTab === 'retailers' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag size={18} />
            Retailers (Vendors)
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search partners..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition justify-center">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[300px] relative">
        
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
            <p className="text-sm text-gray-500 font-medium">Loading partners...</p>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchPartners} className="px-4 py-2 bg-orange-500 text-theme-text rounded-lg">Retry</button>
          </div>
        )}

        {!loading && !error && partners.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-gray-500">
            <p>No partners found.</p>
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((partner) => (
              <tr key={partner._id || partner.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{partner.businessName || partner.name || 'N/A'}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{(partner._id || partner.id || '').slice(-8).toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {typeof partner.owner === 'object' && partner.owner !== null 
                      ? (partner.owner.fullName || `${partner.owner.firstName || ''} ${partner.owner.lastName || ''}`.trim() || 'N/A')
                      : (partner.owner || partner.ownerName || 'N/A')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{partner.category || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.status === 'Pending' || partner.status === 'pending' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/50 text-amber-700 border border-amber-200/50">
                      Pending
                    </span>
                  ) : partner.status === 'Active' || partner.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100/50 text-emerald-700 border border-emerald-200/50">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {partner.status || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.verification === 'Pending Review' || partner.verification === 'pending' || !partner.isVerified ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                      <AlertTriangle size={16} />
                      Pending Review
                    </span>
                  ) : partner.verification === 'Verified' || partner.isVerified ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircle2 size={16} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                      {partner.verification || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === (partner._id || partner.id) ? null : (partner._id || partner.id))}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {/* Manage Dropdown Menu */}
                  {activeDropdown === (partner._id || partner.id) && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-8 top-12 w-52 bg-theme-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-20 flex flex-col items-start text-left"
                    >
                      <div className="px-4 py-2 text-xs font-bold text-gray-900 w-full mb-1">
                        Manage
                      </div>
                      <button 
                        onClick={() => { navigate(`/admin/dashboard/partner-management/${partner._id || partner.id}`); setActiveDropdown(null); }}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                      >
                        <Eye size={16} className="text-gray-400" />
                        View Details
                      </button>
                      <button 
                        onClick={() => { navigate(`/admin/dashboard/partner-management/${partner._id || partner.id}/documents`); setActiveDropdown(null); }}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                      >
                        <FileText size={16} className="text-gray-400" />
                        Verify Documents
                      </button>
                      <button 
                        onClick={() => handleAction(partner._id || partner.id, 'approve')}
                        className="w-full px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-3 transition text-left font-medium"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(partner._id || partner.id, 'reject')}
                        className="w-full px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-3 transition text-left font-medium"
                      >
                        <AlertTriangle size={16} />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(partner._id || partner.id, 'suspend')}
                        className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition text-left font-medium"
                      >
                        <Ban size={16} />
                        Suspend Access
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PartnerDetailsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <PartnerDetails partner={{ id }} onBack={() => navigate('/admin/dashboard/partner-management')} />
}

function PartnerDocumentsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <PartnerDocuments partnerId={id || ''} onBack={() => navigate(`/admin/dashboard/partner-management/${id}`)} />
}

function PartnerSettingsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <PartnerSettings partnerId={id || ''} onBack={() => navigate(`/admin/dashboard/partner-management/${id}`)} />
}

export default function PartnerManagement() {
  return (
    <Routes>
      <Route path="partner-management" element={<PartnerManagementList />} />
      <Route path="partner-management/new" element={<AddPartnerWizard />} />
      <Route path="partner-management/:id" element={<PartnerDetailsRoute />} />
      <Route path="partner-management/:id/documents" element={<PartnerDocumentsRoute />} />
      <Route path="partner-management/:id/settings" element={<PartnerSettingsRoute />} />
    </Routes>
  )
}
