import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ShoppingBag, DollarSign, Clock, Users } from "lucide-react"

import OverviewTab from "./OverviewTab"
import OrdersTab from "./OrdersTab"
import MenuManagementTab from "./MenuManagementTab"
import InventoryTab from "./InventoryTab"
import FinanceTab from "./FinanceTab"
import SettingsTab from "./SettingsTab"

export default function RestaurantPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathParts = location.pathname.replace(/\/$/, '').split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const currentTab = lastPart === 'restaurant-panel' ? 'overview' : lastPart;

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/admin/dashboard/restaurant-panel' },
    { id: 'orders', label: 'Orders', path: '/admin/dashboard/restaurant-panel/orders' },
    { id: 'menu', label: 'Menu Management', path: '/admin/dashboard/restaurant-panel/menu' },
    { id: 'inventory', label: 'Inventory & Stock', path: '/admin/dashboard/restaurant-panel/inventory' },
    { id: 'finance', label: 'Finance & Settlements', path: '/admin/dashboard/restaurant-panel/finance' },
    { id: 'settings', label: 'Details & Settings', path: '/admin/dashboard/restaurant-panel/settings' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Restaurant Panel</h1>
          <p className="text-gray-500 mt-1">Manage restaurant details, orders, and operations.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">1,456</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">+12% from last week</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">$12,345</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">+8% from last week</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg. Prep Time</p>
            <h3 className="text-2xl font-bold text-gray-900">12 mins</h3>
            <p className="text-xs text-red-600 font-medium mt-1">+2 mins from last week</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">2,800</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">+15% from last week</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex px-4 pt-2 overflow-x-auto scroll-hide">
        <div className="flex gap-8 whitespace-nowrap">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
                currentTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Router */}
      <div className="flex-1 mt-2">
        <Routes>
          <Route path="restaurant-panel" element={<OverviewTab />} />
          <Route path="restaurant-panel/orders" element={<OrdersTab />} />
          <Route path="restaurant-panel/menu" element={<MenuManagementTab />} />
          <Route path="restaurant-panel/inventory" element={<InventoryTab />} />
          <Route path="restaurant-panel/finance" element={<FinanceTab />} />
          <Route path="restaurant-panel/settings" element={<SettingsTab />} />
        </Routes>
      </div>

    </div>
  )
}
