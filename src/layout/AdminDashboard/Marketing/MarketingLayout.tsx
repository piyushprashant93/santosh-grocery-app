import { useState } from "react"
import { BarChart3, ListOrdered, Image as ImageIcon, Ticket, Bell } from "lucide-react"
import OverviewTab from "./OverviewTab"
import AllCampaignsTab from "./AllCampaignsTab"
import BannersTab from "./BannersTab"
import CouponsTab from "./CouponsTab"
import NotificationsTab from "./NotificationsTab"

export default function MarketingLayout() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'All Campaigns', icon: ListOrdered },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="w-full h-full p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Marketing & Content</h1>
            <p className="text-gray-500 mt-1">Manage banners, campaigns, push notifications, and SEO.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm flex-1 sm:flex-none text-center">
              SEO Settings
            </button>
            <button className="px-5 py-2 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition flex-1 sm:flex-none text-center">
              + Create Campaign
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 flex px-4 pt-2 overflow-x-auto scroll-hide">
          <div className="flex gap-8 whitespace-nowrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className={activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Router */}
        <div className="flex-1 mt-2">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'campaigns' && <AllCampaignsTab />}
          {activeTab === 'banners' && <BannersTab />}
          {activeTab === 'coupons' && <CouponsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>

      </div>
    </div>
  )
}
