import FinanceWallet from "./FinanceWallet"
import Notifications from "./Notifications"
import Inventory from "./Inventory"
import ReportsAnalytics from "./ReportsAnalytics"
import SupportCenter from "./SupportCenter"
import SalesManagement from "./SalesManagement"
import RestaurantBackendDashboard from "./RestaurantBackendDashboard"
import RestaurantBackendSettings from "./RestaurantBackendSettings"
import TeamManagement from "./TeamManagement"
import SupplierMarketplace from "../../components/SupplierMarketplace/SupplierMarketplace"


export default function RestaurantBackendChild({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  if (activeTab === "dashboard") {
    return (
      <RestaurantBackendDashboard setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "notifications") {
    return (
      <Notifications />
    )
  }

  if (activeTab === "inventory") {
    return (
      <Inventory  setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "sales-management") {
    return (
      <SalesManagement activeTab={activeTab} setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "team") {
    return (
      <TeamManagement activeTab={activeTab} setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "finance") { return (<FinanceWallet />) }
  if (activeTab === "reports") { return (<ReportsAnalytics />) }
  if (activeTab === "support") { return (<SupportCenter />) }
  if (activeTab === "settings") { return (<RestaurantBackendSettings activeTab={activeTab} setActiveTab={setActiveTab} />) }
  if (activeTab === "supplier-marketplace") { return (<SupplierMarketplace role="restaurant-panel" />) }

  return null
}