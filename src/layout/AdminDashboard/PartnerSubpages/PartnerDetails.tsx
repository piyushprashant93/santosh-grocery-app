import { ArrowLeft, ShoppingBag, DollarSign, Star, Store, Phone, MapPin, ExternalLink, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../../../lib/api"

interface PartnerDetailsProps {
  partner: any; // Using any for now since we're rendering static layout, but in reality this would be the Partner interface
  onBack: () => void;
}

export default function PartnerDetails({ partner, onBack }: PartnerDetailsProps) {
  const navigate = useNavigate();
  const [partnerData, setPartnerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        // Since we don't strictly know if it's a restaurant or retailer here, we'll assume restaurant for now
        // based on the document or try both if one fails.
        const res = await api.get(`/api/v1/admin/partners/restaurants/${partner.id}`);
        setPartnerData(res.data?.data || res.data || {});
      } catch (err: any) {
        // if not found, maybe it's a retailer? Let's just catch and show error for now
        setError(err.response?.data?.message || "Failed to load partner details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [partner.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
        <p className="text-gray-500">Loading partner details...</p>
      </div>
    );
  }

  if (error || !partnerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error || "Partner not found"}</p>
        <button onClick={onBack} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  const name = partnerData.restaurantName || partnerData.businessName || partnerData.name || "Partner";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-theme-surface border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>
                  {name}
                </h1>
                {partnerData.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Partner ID: {partner.id} • Joined {new Date(partnerData.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/dashboard/partner-management/${partner.id}/documents`)}
            className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Verify Documents
          </button>
          <button 
            onClick={() => navigate(`/admin/dashboard/partner-management/${partner.id}/settings`)}
            className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-theme-text mt-0.5">{partnerData.totalOrders || 0}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-theme-text mt-0.5">${(partnerData.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rating</p>
            <p className="text-2xl font-bold text-theme-text mt-0.5">{partnerData.rating || "N/A"}</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-50 text-fuchsia-500 flex items-center justify-center shrink-0">
            <Store size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Outlets / Locations</p>
            <p className="text-2xl font-bold text-theme-text mt-0.5">{partnerData.outletsCount || 1}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
        
        {/* Left Column (Main Info & Orders) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Business Information Card */}
          <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Owner Name</p>
                <p className="text-theme-text font-medium">{partnerData.ownerName || partnerData.firstName + ' ' + partnerData.lastName || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-theme-text font-medium">{partnerData.category || "Restaurant"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-theme-text font-medium truncate">{partnerData.email || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-theme-text font-medium flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  {partnerData.phone || partnerData.phoneNumber || "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-theme-text font-medium flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  {partnerData.address || "No address provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Recent Orders</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">View All</button>
            </div>

            <div className="flex flex-col gap-5">
              {[2041, 2042, 2043, 2044].map((orderNum) => (
                <div key={orderNum} className="flex items-center justify-between pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400">#{orderNum}</span>
                    <div>
                      <p className="text-sm font-bold text-theme-text">Order #{orderNum}</p>
                      <p className="text-xs text-gray-500 mt-0.5">2 items • $45.00</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-500 mb-1">
                      Delivered
                    </span>
                    <span className="text-xs text-gray-400">Today, 12:30 PM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Cards) */}
        <div className="flex flex-col gap-6">
          
          {/* Commission Rate Dark Card */}
          <div className="bg-theme-surface rounded-2xl p-6 lg:p-8 text-theme-text relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'serif' }}>Commission Rate</h2>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-bold text-emerald-400">{partnerData.commissionRate || 15}%</span>
              <span className="text-gray-400 text-sm">per order</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Current Plan</span>
                <span className="font-semibold">{partnerData.subscriptionPlan || "Standard"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Next Payout</span>
                <span className="font-semibold">{partnerData.nextPayoutDate ? new Date(partnerData.nextPayoutDate).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Current Status</h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Store Status</span>
                {partnerData.isOpen ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    Open Now
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                    Closed
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium text-theme-text">Recently</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Verification</span>
                <span className={`font-medium flex items-center gap-1.5 ${partnerData.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {partnerData.isVerified ? 'Verified' : 'Pending'}
                  <ExternalLink size={14} />
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
