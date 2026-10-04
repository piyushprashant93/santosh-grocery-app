import FinanceWallet from "./FinanceWallet"

import Notifications from "./Notifications"

import Clients from "./Clients"

import Orders from "./Orders"

import ProductsTable from "./ProductsTable"

import Logistics from "./Logistics"

import ReportsAnalytics from "./ReportsAnalytics"

import SupplierDashboard from "./SupplierDashboard"

import SupplierSettings from "./SupplierSettings"

import SupportCenter from "./SupportCenter"

import Warehouse from "./Warehouse"

import ShipmentHistory from "./ShipmentHistory"

import CreateShipment from "./NewShipment"

import AddProduct from "./AddProduct"

import CreateManifest from "./CreateManifest"




export default function SupplierChild({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  if (activeTab === "dashboard") {
    return (
      <SupplierDashboard setActiveTab={setActiveTab} />
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

  if (activeTab === "add-product") {
    return (
      <AddProduct setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "orders") {
    return (
      <Orders  setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "create-manifest") {
    return (
      <CreateManifest  setActiveTab={setActiveTab}/>
    )
  }

  if (activeTab === "warehouse") {
    return (
      <Warehouse />
    )
  }

  if (activeTab === "shipment-history") {
    return (
      <ShipmentHistory setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "new-shipment") {
    return (
      <CreateShipment setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "clients") { return (<Clients setActiveTab={setActiveTab} />) }
  if (activeTab === "finance") { return (<FinanceWallet />) }
  if (activeTab === "logistics") { return (<Logistics />) }
  if (activeTab === "reports") { return (<ReportsAnalytics />) }
  if (activeTab === "support") { return (<SupportCenter />) }
  if (activeTab === "settings") { return (<SupplierSettings />) }

  return null
}