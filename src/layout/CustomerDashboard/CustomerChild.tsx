import Overview from "./Overview"

import Notifications from "./Notifications"

import SearchTab from "./SearchTab"

import InviteFriends from "./InviteFriends"

import ProductDetails from "./ProductDetails"

import OrderHistory from "./OrderHistory"

import WalletPayments from "./WalletPayments"

import SavedItems from "./SavedItems"

import AccountSettings from "./AccountSettings"

import HelpCenter from "./HelpCenter"

import RestaurantDetails from "./RestaurantDetails"




export default function CustomerChild({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  if (activeTab === "overview") {
    return (
      <Overview setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "notifications") {
    return (
      <Notifications />
    )
  }

  if (activeTab === "restaurant-details") {
    return (
      <RestaurantDetails />
    )
  }

  if (activeTab === "search") {
    return (
      <SearchTab />
    )
  }

  if (activeTab === "invite") {
    return (
      <InviteFriends />
    )
  }

  if (activeTab === "product-details") {
    return (
      <ProductDetails setActiveTab={setActiveTab} />
    )
  }

  if (activeTab === "orders") {return (<OrderHistory />)}
  if (activeTab === "wallet") {return (<WalletPayments />)}
  if (activeTab === "saved") {return (<SavedItems />)}
  if (activeTab === "profile") {return (<AccountSettings />)}
  if (activeTab === "support") {return (<HelpCenter />)}

  return null
}