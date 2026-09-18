import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Package, ShoppingBag, Users, Tag, RefreshCw, Wallet, BarChart2 } from "lucide-react"

import OverviewTab from "./OverviewTab"
import ProductsTab from "./ProductsTab"
import OrdersTab from "./OrdersTab"
import CustomersTab from "./CustomersTab"
import OffersTab from "./OffersTab"
import RefundsTab from "./RefundsTab"
import FinanceTab from "./FinanceTab"
import ReportsTab from "./ReportsTab"

export default function RetailerPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathParts = location.pathname.replace(/\/$/, '').split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const currentTab = lastPart === 'retailer-panel' ? 'overview' : lastPart;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShoppingCart, path: '/admin/dashboard/retailer-panel' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/dashboard/retailer-panel/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/dashboard/retailer-panel/orders' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/admin/dashboard/retailer-panel/customers' },
    { id: 'offers', label: 'Offers', icon: Tag, path: '/admin/dashboard/retailer-panel/offers' },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw, path: '/admin/dashboard/retailer-panel/refunds' },
    { id: 'finance', label: 'Finance', icon: Wallet, path: '/admin/dashboard/retailer-panel/finance' },
    { id: 'reports', label: 'Reports', icon: BarChart2, path: '/admin/dashboard/retailer-panel/reports' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Retailer Panel</h1>
          <p className="text-gray-500 mt-1">Manage products, orders, and customer relationships</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">$45,890</h3>
          </div>
          <div className="flex items-center text-emerald-500 font-medium text-sm gap-1">
            <ArrowUpRight size={16} />
            +14%
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">568</h3>
          </div>
          <div className="flex items-center text-emerald-500 font-medium text-sm gap-1">
            <ArrowUpRight size={16} />
            +9%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Payments</p>
            <h3 className="text-3xl font-bold text-gray-900">32</h3>
          </div>
          <div className="flex items-center text-red-500 font-medium text-sm gap-1">
            <ArrowDownRight size={16} />
            +3%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Alerts</p>
            <h3 className="text-3xl font-bold text-gray-900">12</h3>
          </div>
          <div className="flex items-center text-emerald-500 font-medium text-sm gap-1">
            <ArrowUpRight size={16} />
            -8%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 overflow-x-auto scroll-hide">
        <div className="flex gap-2 whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
                  isActive ? 'bg-orange-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Router */}
      <div className="flex-1 mt-2">
        <Routes>
          <Route path="" element={<OverviewTab />} />
          <Route path="products" element={<ProductsTab />} />
          <Route path="orders" element={<OrdersTab />} />
          <Route path="customers" element={<CustomersTab />} />
          <Route path="offers" element={<OffersTab />} />
          <Route path="refunds" element={<RefundsTab />} />
          <Route path="finance" element={<FinanceTab />} />
          <Route path="reports" element={<ReportsTab />} />
        </Routes>
      </div>

    </div>
  )
}
