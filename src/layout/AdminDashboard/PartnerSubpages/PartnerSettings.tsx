import { useState } from "react"
import { ArrowLeft, Save, Lock, AlertTriangle, Trash2 } from "lucide-react"

interface PartnerSettingsProps {
  partnerId: string;
  onBack: () => void;
}

export default function PartnerSettings({ partnerId, onBack }: PartnerSettingsProps) {
  const [commission, setCommission] = useState("15");
  const [payoutFrequency, setPayoutFrequency] = useState("Daily");
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 bg-theme-surface border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>Partner Settings</h1>
          <p className="text-gray-500 mt-1">Manage access, commissions, and critical settings for <span className="font-bold text-theme-text">Spicy Kitchen</span></p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Financial Configuration Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Financial Configuration</h2>
          <p className="text-sm text-gray-500 mb-6">Configure commission rates and payout terms.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-theme-text mb-2">Commission Rate (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Platform fee deducted from each order.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-theme-text mb-2">Payout Frequency</label>
              <select 
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
                className="w-full bg-theme-surface border border-gray-200 text-theme-text text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-50">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Access Control Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-600" style={{ fontFamily: 'serif' }}>Access Control</h2>
              <p className="text-sm text-gray-500">Manage login permissions and account status.</p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-theme-text">Block Partner Access</h3>
              <p className="text-xs text-gray-500 mt-0.5">Prevent this partner from logging into their dashboard.</p>
            </div>
            
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isBlocked} 
                onChange={(e) => setIsBlocked(e.target.checked)} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold" style={{ fontFamily: 'serif' }}>Danger Zone</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Permanently delete this partner and all associated data. This action cannot be undone.
          </p>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-theme-surface text-red-600 border border-red-200 text-sm font-medium rounded-lg shadow-sm hover:bg-red-50 transition">
            <Trash2 size={16} />
            Delete Partner Account
          </button>
        </div>

      </div>
    </div>
  )
}
