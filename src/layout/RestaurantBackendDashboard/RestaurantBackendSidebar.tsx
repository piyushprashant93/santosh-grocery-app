import {
  Wallet,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
  Store,
  Users,
  DollarSign,
  ChefHat,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "supplier-marketplace", label: "Supplier Marketplace", icon: Store },
  { id: "inventory", label: "Inventory & Recipes", icon: ChefHat },
  { id: "finance", label: "Expenses", icon: Wallet },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "sales-management", label: "Sales & Closing", icon: DollarSign },
  { id: "team", label: "Team Management", icon: Users },
  { id: "support", label: "Support", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function RestaurantBackendSidebar({
  activeTab,
  setActiveTab,
  setSidebarOpen
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
}) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  )

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
    }

    window.addEventListener("storage", handleStorage)

    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <div className="w-[288px] flex flex-col h-full pb-5">

      <div className="px-6 py-6 flex items-center gap-2 font-bold text-[21px] text-[#0F172B]">
        <Store size={22} className="text-[#009966]" />
        Restaurant Panel
      </div>

      <div className="flex-1 px-4 space-y-1 flex flex-col justify-between gap-1 h-full">

        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon

            const tabMap: Record<string, string> = {
              "add-item": "dashboard",
            }

            const active =
              activeTab === item.id || tabMap[activeTab] === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] transition ${active
                  ? "bg-[#ECFDF5] text-[#009966] font-medium"
                  : "text-[#64748B] hover:bg-[#ECFDF5]"
                  }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-[#009966]" : "text-[#94A3B8]"}
                />

                {item.label}
              </button>
            )
          })}
        </div>


        <button onClick={() => {
            localStorage.clear();
          navigate("/sign-in")
        }}  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

    </div>
  )
}