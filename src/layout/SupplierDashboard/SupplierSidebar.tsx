import {
  Wallet,
  Settings,
  LogOut,
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Truck,
  LucideHouse,
  NotepadText,
  LayoutDashboard,
} from "lucide-react"

import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"



const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products Catalog", icon: Package },
  { id: "orders", label: "Bulk Orders", icon: NotepadText },
  { id: "warehouse", label: "Warehouse", icon: LucideHouse },
  { id: "clients", label: "Clients", icon: Users },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: MessageSquare },
]

export default function SupplierSidebar({
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
        <Truck size={22} className="text-[#155DFC]" />
        Supplier Panel
      </div>

      <div className="flex-1 px-4 space-y-1 flex flex-col justify-between gap-1 h-full">

        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon

            const tabMap: Record<string, string> = {
              "new-shipment": "dashboard",
              "shipment-history": "dashboard",
              "add-product": "products",
              "create-manifest": "orders",
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
                    ? "bg-[#EFF6FF] text-[#155DFC] font-medium"
                    : "text-[#64748B] hover:bg-[#EFF6FF]"
                  }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-[#155DFC]" : "text-[#94A3B8]"}
                />

                {item.label}
              </button>
            )
          })}
        </div>


        <button onClick={() => {
            localStorage.clear();
          navigate("/sign-in")
        }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

    </div>
  )
}