import {
  Home,
  Wallet,
  Settings,
  ShoppingBag,
  LogOut,
  Package,
  Users,
  Tag,
  RotateCcw,
  BarChart3,
  MessageSquare,
  Store,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const menu = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "supplier-marketplace", label: "Supplier Marketplace", icon: Store },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "refunds", label: "Refunds", icon: RotateCcw },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "support", label: "Support", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings }
]

export default function RetailerSidebar({
  activeTab,
  setActiveTab,
  setSidebarOpen
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
}) {
  const navigate = useNavigate()
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
        <Store size={22} className="text-[#F54900]" />
        Reatiler Panel
      </div>

      <div className="flex-1 px-4 space-y-1 flex flex-col justify-between gap-1 h-full">

        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon

            const tabMap: Record<string, string> = {
              createoffer: "offers",
              addproduct: "products"
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
                    ? "bg-[#F3EDE6] text-[#F54900] font-medium"
                    : "text-[#64748B] hover:bg-gray-100"
                  }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-[#F54900]" : "text-[#94A3B8]"}
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