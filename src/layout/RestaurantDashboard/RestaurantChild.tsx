import FinanceWallet from "./FinanceWallet"
import Notifications from "./Notifications"
import Orders from "./Orders"
import ReportsAnalytics from "./ReportsAnalytics"
import SupportCenter from "./SupportCenter"
import MenuManagement from "./MenuManagement"
import RestaurantDashboard from "./RestaurantDashboard"
import RestaurantSettings from "./RestaurantSettings"
import AddMenuItem from "./AddMenuItem"
import Reviews from "./Reviews"


export default function RestaurantChild({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  if (activeTab === "dashboard") {
    return (
      <RestaurantDashboard setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "notifications") {
    return (
      <Notifications />
    )
  }

  if (activeTab === "orders") {
    return (
      <Orders  setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "menu-management") {
    return (
      <MenuManagement activeTab={activeTab} setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "add-item") {
    return (
      <AddMenuItem activeTab={activeTab} setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "finance") { return (<FinanceWallet />) }
  if (activeTab === "reports") { return (<ReportsAnalytics />) }
  if (activeTab === "support") { return (<SupportCenter />) }
  if (activeTab === "reviews") { return (<Reviews />) }
  if (activeTab === "settings") { return (<RestaurantSettings activeTab={activeTab} setActiveTab={setActiveTab} />) }

  return null
}