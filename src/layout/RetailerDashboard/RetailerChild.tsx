import AddProduct from "./AddProduct"
import CreateOffer from "./CreateOffer"
import CustomersandReviews from "./Customers&Reviews"
import FinanceWallet from "./FinanceWallet"
import Notifications from "./Notifications"
import OffersCoupons from "./OffersCoupons"
import Orders from "./Orders"
import ProductsTable from "./ProductsTable"
import RefundRequests from "./RefundRequests"
import ReportsAnalytics from "./ReportsAnalytics"
import RetailerDashboard from "./RetailerDashboard"
import RetailerSettings from "./RetailerSettings"
import SupportCenter from "./SupportCenter"
import SupplierMarketplace from "../../components/SupplierMarketplace/SupplierMarketplace"


export default function RetailerChild({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  if (activeTab === "dashboard") {
    return (
      <RetailerDashboard setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "notifications") {
    return (
      <Notifications />
    )
  }

  if (activeTab === "products") {
    return (
      <ProductsTable setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "orders") {
    return (
      <Orders />
    )
  }

  if (activeTab === "createoffer") {
    return (
      <CreateOffer setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "addproduct") {
    return (
      <AddProduct setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "customers") {
    return (
      <CustomersandReviews />
    )
  }

  if (activeTab === "offers") {return (<OffersCoupons setActiveTab={setActiveTab} />)}
  if (activeTab === "finance") {return (<FinanceWallet />)}
  if (activeTab === "refunds") {return (<RefundRequests />)}
  if (activeTab === "reports") {return (<ReportsAnalytics />)}
  if (activeTab === "support") {return (<SupportCenter />)}
  if (activeTab === "settings") {return (<RetailerSettings />)}
  if (activeTab === "supplier-marketplace") {return (<SupplierMarketplace role="retailer" />)}

  return null
}