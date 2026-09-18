import AdminDashboard from "./AdminDashboard"
import UserManagement from "./UserManagement"
import Notifications from "./Notifications"
import SystemHealth from "./SystemHealth"
import PartnerManagement from "./PartnerManagement"
import RestaurantPanelLayout from "./RestaurantPanel/RestaurantPanelLayout"
import RetailerPanelLayout from "./RetailerPanel/RetailerPanelLayout"
import SupplierPanelLayout from "./SupplierPanel/SupplierPanelLayout"
import PlatformSettingsLayout from "./PlatformSettings/PlatformSettingsLayout"
import SalesAndAnalytics from "./SalesAndAnalytics"
import AccessControlLayout from "./AccessControl/AccessControlLayout"
import MarketingLayout from "./Marketing/MarketingLayout"

export default function AdminChild({
  activeTab,
  setActiveTab
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  if (activeTab === "dashboard") {
    return <AdminDashboard setActiveTab={setActiveTab} />
  }

  if (activeTab === "user-management") {
    return <UserManagement />
  }

  if (activeTab === "notifications") {
    return <Notifications />
  }

  if (activeTab === "system-health") {
    return <SystemHealth />
  }

  if (activeTab === "partner-management") {
    return <PartnerManagement />
  }

  if (activeTab === "restaurant-panel") {
    return <RestaurantPanelLayout />
  }

  if (activeTab === "retailer-panel") {
    return <RetailerPanelLayout />
  }

  if (activeTab === "supplier-panel") {
    return <SupplierPanelLayout />
  }

  if (activeTab === "settings") {
    return <PlatformSettingsLayout />
  }

  if (activeTab === "sales-analytics") {
    return <SalesAndAnalytics />
  }

  if (activeTab === "access-control") {
    return <AccessControlLayout />
  }

  if (activeTab === "marketing") {
    return <MarketingLayout />
  }

  // Fallback for other tabs not yet implemented
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
        <p>This module is currently under development.</p>
      </div>
    </div>
  )
}
