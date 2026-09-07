import { useState, useEffect, useRef } from "react"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"
import AdminChild from "./AdminChild"
import { useNavigate, useLocation } from "react-router-dom"

const adminTabToPath = (tab: string) => {
  if (tab === "dashboard") return ""
  return `/${tab}`
}

const adminPathToTab = (pathname: string) => {
  const parts = pathname.replace("/admin/dashboard", "").split("/").filter(Boolean)
  const last = parts[parts.length - 1]
  return last || "dashboard"
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState(() => {
    const routeTab = adminPathToTab(window.location.pathname)
    return routeTab || localStorage.getItem("adminActiveTab") || "dashboard"
  })

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tab: string) => {
    localStorage.setItem("adminActiveTab", tab)
    navigate(`/admin/dashboard${adminTabToPath(tab)}`)
  }

  useEffect(() => {
    const routeTab = adminPathToTab(location.pathname)
    if (routeTab !== activeTab) {
      setActiveTab(routeTab)
    }
  }, [location.pathname, activeTab])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
      <div
        ref={sidebarRef}
        className={`fixed lg:static z-40 h-full min-h-svh bg-gray-900 border-r border-gray-800 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <AdminSidebar setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openSidebar={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto scroll-hide lg:p-8 p-4">
          <AdminChild setActiveTab={handleTabChange} activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
