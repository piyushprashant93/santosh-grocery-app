import { useState, useRef, useEffect } from "react"
import { useNavigate, Routes, Route, useParams } from "react-router-dom"
import { Search, Filter, MoreHorizontal, Eye, FileText, CheckCircle2, Ban, AlertTriangle, Store, ShoppingBag } from "lucide-react"
import PartnerDetails from "./PartnerSubpages/PartnerDetails"
import PartnerDocuments from "./PartnerSubpages/PartnerDocuments"

interface Partner {
  id: string;
  businessName: string;
  owner: string;
  category: string;
  status: 'Pending' | 'Active' | 'Blocked';
  verification: 'Pending Review' | 'Verified' | 'Rejected';
}

const mockPartners: Partner[] = [
  {
    id: "RES-001",
    businessName: "Spicy Kitchen",
    owner: "Michael Chen",
    category: "Asian",
    status: "Pending",
    verification: "Pending Review",
  },
  {
    id: "RES-002",
    businessName: "Burger King Clone",
    owner: "Sarah Connor",
    category: "Fast Food",
    status: "Active",
    verification: "Verified",
  }
];

function PartnerManagementList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'retailers'>('restaurants');
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
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

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Partner Management</h1>
          <p className="text-gray-500 mt-1">Onboard, verify, and manage restaurants and retailers.</p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition">
          Add New Partner
        </button>
      </div>

      {/* Tabs Container */}
      <div className="flex gap-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('restaurants')}
          className={`pb-4 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === 'restaurants' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Store size={18} />
          Restaurants
        </button>
        <button 
          onClick={() => setActiveTab('retailers')}
          className={`pb-4 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === 'retailers' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ShoppingBag size={18} />
          Retailers (Vendors)
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col mt-2">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <input 
              type="text"
              placeholder="Search restaurants..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[300px]">
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
                <tr key={partner.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{partner.businessName}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{partner.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{partner.owner}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{partner.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partner.status === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/50 text-amber-700 border border-amber-200/50">
                        Pending
                      </span>
                    )}
                    {partner.status === 'Active' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100/50 text-emerald-700 border border-emerald-200/50">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partner.verification === 'Pending Review' && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                        <AlertTriangle size={16} />
                        Pending Review
                      </span>
                    )}
                    {partner.verification === 'Verified' && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <CheckCircle2 size={16} />
                        Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === partner.id ? null : partner.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Manage Dropdown Menu */}
                    {activeDropdown === partner.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-12 w-52 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-20 flex flex-col items-start text-left"
                      >
                        <div className="px-4 py-2 text-xs font-bold text-gray-900 w-full mb-1">
                          Manage
                        </div>
                        <button 
                          onClick={() => { navigate(`/admin/dashboard/partner-management/${partner.id}`); setActiveDropdown(null); }}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <Eye size={16} className="text-gray-400" />
                          View Details
                        </button>
                        <button 
                          onClick={() => { navigate(`/admin/dashboard/partner-management/${partner.id}/documents`); setActiveDropdown(null); }}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <FileText size={16} className="text-gray-400" />
                          Verify Documents
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-3 transition text-left font-medium">
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition text-left font-medium">
                          <Ban size={16} />
                          Block Access
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

    </div>
  )
}

function PartnerDetailsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the partner using the ID extracted natively by React Router
  const selectedPartner = mockPartners.find(p => p.id === id);

  if (!selectedPartner) {
    return <div className="p-8 text-center text-gray-500">Partner not found</div>;
  }

  return <PartnerDetails partner={selectedPartner} onBack={() => navigate('/admin/dashboard/partner-management')} />
}

function PartnerDocumentsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <PartnerDocuments partnerId={id || ''} onBack={() => navigate(`/admin/dashboard/partner-management/${id}`)} />
}

export default function PartnerManagement() {
  return (
    <Routes>
      <Route path="partner-management" element={<PartnerManagementList />} />
      <Route path="partner-management/:id" element={<PartnerDetailsRoute />} />
      <Route path="partner-management/:id/documents" element={<PartnerDocumentsRoute />} />
    </Routes>
  )
}
