import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface ManagePermissionsProps {
  user: {
    id: string;
    fullName: string;
    role?: string;
  };
  onBack: () => void;
}

export default function ManagePermissions({ user, onBack }: ManagePermissionsProps) {
  const [role, setRole] = useState(user.role || 'customer');
  const [canPlaceOrders, setCanPlaceOrders] = useState(true);
  const [canReviewProducts, setCanReviewProducts] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Manage Permissions</h1>
          <p className="text-gray-500 mt-1">Security settings for <span className="font-semibold text-gray-900">{user.fullName}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
        
        {/* Left Column (Roles and Features) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Role Assignment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Role Assignment</h2>
            <p className="text-sm text-gray-500 mb-6">Determine what this user can access within the platform.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              >
                <option value="customer">Customer (Standard)</option>
                <option value="restaurant">Restaurant Manager</option>
                <option value="retailer">Retail Vendor</option>
                <option value="support">Support Agent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <p className="text-xs text-gray-400">* Changing this to "Administrator" grants full access to the system.</p>
          </div>

          {/* Feature Access Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Feature Access</h2>
            <p className="text-sm text-gray-500 mb-6">Granular permission controls.</p>
            
            <div className="flex flex-col gap-6">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Can Place Orders</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Allow user to purchase items</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={canPlaceOrders} onChange={(e) => setCanPlaceOrders(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Can Review Products</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Allow user to leave ratings/comments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={canReviewProducts} onChange={(e) => setCanReviewProducts(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Beta Features</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Access to experimental features</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={betaFeatures} onChange={(e) => setBetaFeatures(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Danger Zone) */}
        <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 lg:p-8">
          <div className="flex items-center gap-2 text-red-600 mb-6">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold" style={{ fontFamily: 'serif' }}>Danger Zone</h2>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-red-800">Block User</h3>
            <p className="text-xs text-red-600/80 mt-0.5 mb-3">Prevent this user from logging in.</p>
            <button className="w-full py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-600 transition">
              Block Access
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-red-800">Delete Account</h3>
            <p className="text-xs text-red-600/80 mt-0.5 mb-3">Permanently remove all user data.</p>
            <button className="w-full py-2.5 bg-white text-red-600 border border-red-200 text-sm font-medium rounded-lg shadow-sm hover:bg-red-50 transition">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
