import { useState } from "react"
import { Shield, Users, Activity, FileText } from "lucide-react"
import RolesAndPermissionsTab from "./RolesAndPermissionsTab"
import AdminUsersTab from "./AdminUsersTab"
import AuditLogsTab from "./AuditLogsTab"
import RoleForm, { RoleData } from "./RoleForm"

export default function AccessControlLayout() {
  const [activeTab, setActiveTab] = useState("roles");
  const [editingRole, setEditingRole] = useState<RoleData | 'New Role' | null>(null);

  const tabs = [
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'users', label: 'Admin Users', icon: Users },
    { id: 'logs', label: 'Audit Logs', icon: FileText },
  ];

  // If we are editing or adding a role, show the form instead of tabs
  if (editingRole !== null) {
    return (
      <div className="w-full h-full p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
        <RoleForm 
          roleData={editingRole === 'New Role' ? null : editingRole} 
          onCancel={() => setEditingRole(null)} 
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Access Control</h1>
            <p className="text-gray-500 mt-1">Manage admin roles, permissions, and security settings.</p>
          </div>
          <button 
            onClick={() => setEditingRole("New Role")}
            className="px-5 py-2.5 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition"
          >
            + Add New Role
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 flex px-4 pt-2 overflow-x-auto scroll-hide">
          <div className="flex gap-8 whitespace-nowrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 pt-2 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className={activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Router */}
        <div className="flex-1 mt-2">
          {activeTab === 'roles' && <RolesAndPermissionsTab onEditRole={setEditingRole} />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'logs' && <AuditLogsTab />}
        </div>

      </div>
    </div>
  )
}
