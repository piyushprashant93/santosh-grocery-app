import AdminDashboard from "./AdminDashboard"
import UserManagement from "./UserManagement"

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
