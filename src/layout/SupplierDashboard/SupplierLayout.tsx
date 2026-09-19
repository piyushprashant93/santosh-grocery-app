import { useState, useEffect, useRef } from "react"
import SupplierSidebar from "./SupplierSidebar"
import SupplierHeader from "./SupplierHeader"
import SupplierChild from "./SupplierChild"
import { useNavigate, useLocation } from "react-router-dom"

const supplierTabToPath = (tab: string) => {
  if (tab === "dashboard") return ""
  return `/${tab}`
}

const supplierPathToTab = (pathname: string) => {
  const parts = pathname.replace("/supplier/dashboard", "").split("/").filter(Boolean)
  const last = parts[parts.length - 1]
  return last || "dashboard"
}

export default function SupplierLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState(() => {
    const routeTab = supplierPathToTab(window.location.pathname)
    return routeTab || localStorage.getItem("activeTab") || "dashboard"
  })

  const [sidebarOpen,setSidebarOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tab:string)=>{
    localStorage.setItem("activeTab",tab)
    navigate(`/supplier/dashboard${supplierTabToPath(tab)}`)
  }

  useEffect(() => {
    const routeTab = supplierPathToTab(location.pathname)
    if (routeTab !== activeTab) {
      setActiveTab(routeTab)
    }
  }, [location.pathname, activeTab])

  useEffect(()=>{
    const handleClickOutside = (e:MouseEvent)=>{
      if(sidebarRef.current && !sidebarRef.current.contains(e.target as Node)){
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown",handleClickOutside)
    return ()=> document.removeEventListener("mousedown",handleClickOutside)
  },[])

  return (
    <div className="flex h-screen bg-theme-bg relative">
      {sidebarOpen && (
        <div
          onClick={()=>setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
      <div
        ref={sidebarRef}
        className={`fixed lg:static z-40 h-full min-h-svh bg-white border-r border-[#E5E7EB] transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >

        <SupplierSidebar setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>


      <div className="flex flex-col flex-1 overflow-hidden">

        <SupplierHeader
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openSidebar={()=>setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto scroll-hide lg:p-8 p-4">
          <SupplierChild setActiveTab={handleTabChange} activeTab={activeTab}/>
        </div>

      </div>

    </div>
  )
}