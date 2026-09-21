import {
  LayoutDashboard,
  Users,
  UserPlus,
  Utensils,
  Store,
  Truck,
  Package,
  ShoppingBag,
  MessageSquare,
  Wallet,
  BarChart3,
  Megaphone,
  Shield,
  Settings,
  Activity,
  LogOut,
  X
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "user-management", label: "User Management", icon: Users },
  { id: "partner-management", label: "Partner Management", icon: UserPlus },
  { id: "restaurant-panel", label: "Restaurant Panel", icon: Utensils },
  { id: "retailer-panel", label: "Retailer Panel", icon: Store },
  { id: "supplier-panel", label: "Supplier Panel", icon: Truck },
  { id: "product-food", label: "Product & Food", icon: Package },
  { id: "order-management", label: "Order Management", icon: ShoppingBag },
  { id: "feedback", label: "Feedback & Complaints", icon: MessageSquare },
  { id: "finance", label: "Finance & Settlements", icon: Wallet },
  { id: "sales-analytics", label: "Sales & Analytics", icon: BarChart3 },
  { id: "marketing", label: "Marketing & Content", icon: Megaphone },
  { id: "access-control", label: "Access Control", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  setSidebarOpen
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
}) {
  const navigate = useNavigate();

  return (
    <div className="w-[288px] flex flex-col h-full pb-5 bg-gray-900 text-gray-300">

      <div className="px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-[21px] text-theme-text">
          <Shield size={24} className="text-orange-500" />
          <span>HUBNEPA <span className="text-orange-500 text-sm ml-1">ADMIN</span></span>
        </div>
        <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 px-4 overflow-y-auto scroll-hide">
        <div className="space-y-1 pb-4">
          {menu.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id || (activeTab === 'system-health' && item.id === 'dashboard') || (activeTab === 'notifications' && item.id === 'dashboard')

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] transition ${
                  active
                    ? "bg-orange-500 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-gray-400"}
                />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 mt-auto border-t border-gray-800 shrink-0">
        <button 
          onClick={() => {
            localStorage.clear();
            navigate("/admin")
          }}  
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] text-gray-400 hover:bg-gray-800 hover:text-theme-text transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}
