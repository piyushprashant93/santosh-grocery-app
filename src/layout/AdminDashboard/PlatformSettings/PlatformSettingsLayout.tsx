import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { Settings, Shield, Bell, CreditCard } from "lucide-react"

import GeneralSettingsTab from "./GeneralSettingsTab"
import LegalSettingsTab from "./LegalSettingsTab"
import NotificationSettingsTab from "./NotificationSettingsTab"
import PaymentSettingsTab from "./PaymentSettingsTab"; // Force TS re-evaluation

export default function PlatformSettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathParts = location.pathname.replace(/\/$/, '').split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const currentTab = lastPart === 'settings' ? 'general' : lastPart;

  const tabs = [
    { id: 'general', label: 'General', path: '/admin/dashboard/settings', icon: Settings },
    { id: 'legal', label: 'Legal & Policies', path: '/admin/dashboard/settings/legal', icon: Shield },
    { id: 'notifications', label: 'Notifications', path: '/admin/dashboard/settings/notifications', icon: Bell },
    { id: 'payments', label: 'Payment Gateways', path: '/admin/dashboard/settings/payments', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure global application preferences.</p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition">
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 flex px-4 pt-2 overflow-x-auto scroll-hide">
        <div className="flex gap-8 whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
                  currentTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className={currentTab === tab.id ? 'text-orange-500' : 'text-gray-400'} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Router */}
      <div className="flex-1 mt-2">
        <Routes>
          <Route path="settings" element={<GeneralSettingsTab />} />
          <Route path="settings/legal" element={<LegalSettingsTab />} />
          <Route path="settings/notifications" element={<NotificationSettingsTab />} />
          <Route path="settings/payments" element={<PaymentSettingsTab />} />
        </Routes>
      </div>

    </div>
  )
}
