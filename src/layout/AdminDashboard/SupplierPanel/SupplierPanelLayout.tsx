import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, Truck, Database, Users, Tag, Navigation, Wallet, BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useCurrency } from "../../../context/CurrencyContext"
import { apiFetch } from "../../../lib/apiFetch"

import OverviewTab from "./OverviewTab"
import ProductCatalogTab from "./ProductCatalogTab"
import BulkOrdersTab from "./BulkOrdersTab"
import WarehouseTab from "./WarehouseTab"
import ClientsTab from "./ClientsTab"
import LogisticsTab from "./LogisticsTab"
import FinanceTab from "./FinanceTab"
import ReportsTab from "./ReportsTab"

export default function SupplierPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pathParts = location.pathname.replace(/\/$/, '').split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const currentTab = lastPart === 'supplier-panel' ? 'overview' : lastPart;

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/supplier-panel/overview');
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch supplier overview", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard/supplier-panel' },
    { id: 'catalog', label: 'Product Catalog', icon: Package, path: '/admin/dashboard/supplier-panel/catalog' },
    { id: 'orders', label: 'Bulk Orders', icon: Database, path: '/admin/dashboard/supplier-panel/orders' },
    { id: 'warehouse', label: 'Warehouse', icon: Truck, path: '/admin/dashboard/supplier-panel/warehouse' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/admin/dashboard/supplier-panel/clients' },
    { id: 'logistics', label: 'Logistics', icon: Navigation, path: '/admin/dashboard/supplier-panel/logistics' },
    { id: 'finance', label: 'Finance', icon: Wallet, path: '/admin/dashboard/supplier-panel/finance' },
    { id: 'reports', label: 'Reports', icon: BarChart2, path: '/admin/dashboard/supplier-panel/reports' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight">Supplier Panel</h1>
          <p className="text-gray-500 mt-1">Manage bulk orders, inventory, and logistics</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-theme-text">
              {loading ? "..." : formatPrice(overviewData?.stats?.totalRevenue || 0)}
            </h3>
          </div>
          {overviewData?.stats?.revenueChangePct !== undefined && (
            <div className={`flex items-center font-medium text-sm gap-1 ${overviewData.stats.revenueChangePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {overviewData.stats.revenueChangePct >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {overviewData.stats.revenueChangePct > 0 && '+'}{overviewData.stats.revenueChangePct}%
            </div>
          )}
        </div>
        
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Bulk Orders</p>
            <h3 className="text-3xl font-bold text-theme-text">{loading ? "..." : (overviewData?.stats?.activeOrders || 0)}</h3>
          </div>
          {overviewData?.stats?.ordersChangePct !== undefined && (
            <div className={`flex items-center font-medium text-sm gap-1 ${overviewData.stats.ordersChangePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {overviewData.stats.ordersChangePct >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {overviewData.stats.ordersChangePct > 0 && '+'}{overviewData.stats.ordersChangePct}%
            </div>
          )}
        </div>

        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
            <h3 className="text-3xl font-bold text-theme-text">{loading ? "..." : (overviewData?.stats?.lowStockItems || 0)}</h3>
          </div>
        </div>

        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-[120px]">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Clients</p>
            <h3 className="text-3xl font-bold text-theme-text">{loading ? "..." : (overviewData?.stats?.activeClients || 0)}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-2 overflow-x-auto scroll-hide">
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
          <Route path="*" element={<OverviewTab recentOrders={overviewData?.recentOrders || []} />} />
          <Route path="supplier-panel" element={<OverviewTab recentOrders={overviewData?.recentOrders || []} />} />
          <Route path="supplier-panel/catalog" element={<ProductCatalogTab />} />
          <Route path="supplier-panel/orders" element={<BulkOrdersTab />} />
          <Route path="supplier-panel/warehouse" element={<WarehouseTab />} />
          <Route path="supplier-panel/clients" element={<ClientsTab />} />
          <Route path="supplier-panel/logistics" element={<LogisticsTab />} />
          <Route path="supplier-panel/finance" element={<FinanceTab />} />
          <Route path="supplier-panel/reports" element={<ReportsTab />} />
        </Routes>
      </div>

    </div>
  )
}
