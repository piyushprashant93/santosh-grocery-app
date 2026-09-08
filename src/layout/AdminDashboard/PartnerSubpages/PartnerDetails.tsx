import { ArrowLeft, ShoppingBag, DollarSign, Star, Store, Phone, MapPin, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PartnerDetailsProps {
  partner: any; // Using any for now since we're rendering static layout, but in reality this would be the Partner interface
  onBack: () => void;
}

export default function PartnerDetails({ partner, onBack }: PartnerDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center text-xl font-bold">
              SK
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Spicy Kitchen
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100/50 text-emerald-700 border border-emerald-200/50">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Partner ID: RES-001 • Joined Feb 2023</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/dashboard/partner-management/${partner.id}/documents`)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Verify Documents
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition">
            Settings
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">1,245</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">$45,230</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rating</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">4.8</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
            <Store size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Outlets</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">2</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
        
        {/* Left Column (Main Info & Orders) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Business Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'serif' }}>Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Owner Name</p>
                <p className="text-gray-900 font-medium">Michael Chen</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-gray-900 font-medium">Asian Cuisine • Restaurant</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-gray-900 font-medium truncate">michael.chen@spicykitchen.com</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  +1 (555) 123-4567
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  123 Culinary Ave, Suite 100, Scranton, PA 18503
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Recent Orders</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">View All</button>
            </div>

            <div className="flex flex-col gap-5">
              {[2041, 2042, 2043, 2044].map((orderNum) => (
                <div key={orderNum} className="flex items-center justify-between pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400">#{orderNum}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Order #{orderNum}</p>
                      <p className="text-xs text-gray-500 mt-0.5">2 items • $45.00</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 mb-1">
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
          <div className="bg-[#0F172B] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'serif' }}>Commission Rate</h2>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-bold text-emerald-400">15%</span>
              <span className="text-gray-400 text-sm">per order</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Current Plan</span>
                <span className="font-semibold">Professional</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Next Payout</span>
                <span className="font-semibold">Feb 15, 2026</span>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'serif' }}>Current Status</h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Store Status</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  Open Now
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium text-gray-900">5 mins ago</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Verification</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                  Verified
                  <ExternalLink size={14} />
                </span>
              </div>
            </div>
          </div>

          {/* Store Performance Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'serif' }}>Store Performance</h2>
            
            <div className="flex flex-col gap-6">
              {/* Progress 1 */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Order Acceptance</span>
                  <span className="font-bold text-gray-900">98%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              {/* Progress 2 */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">On-Time Delivery</span>
                  <span className="font-bold text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              {/* Progress 3 */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Customer Satisfaction</span>
                  <span className="font-bold text-gray-900">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
