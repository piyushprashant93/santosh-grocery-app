import { useState, useEffect } from "react"
import { Shield, Users, Edit, Loader2 } from "lucide-react"

export default function RolesAndPermissionsTab({ onEditRole }: { onEditRole: (role: any) => void }) {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/access-control/roles`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      
      const fetchedRoles = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      // Map API data or fallback to some defaults if empty for visual purposes while testing
      setRoles(fetchedRoles.length > 0 ? fetchedRoles.map((r: any, idx: number) => ({
        _id: r._id,
        name: r.name || 'Unnamed Role',
        type: r.isSystemDefault ? 'System Default' : 'Custom',
        admins: r.adminCount || 0,
        description: r.description || 'No description provided.',
        score: r.securityScore || null,
        iconColor: idx % 2 === 0 ? "text-emerald-500" : "text-sky-500",
        iconBg: idx % 2 === 0 ? "bg-emerald-50" : "bg-sky-50",
      })) : [
        { name: "Super Admin", type: "System Default", admins: 1, description: "Full system access and security controls.", score: 100, iconColor: "text-purple-500", iconBg: "bg-purple-50" },
        { name: "Admin", type: "System Default", admins: 3, description: "Manage users, partners, and analytics.", score: 95, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" }
      ]);
    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data on error so UI doesn't look broken during development without backend
      setRoles([
        { name: "Super Admin", type: "System Default", admins: 1, description: "Full system access and security controls.", score: 100, iconColor: "text-purple-500", iconBg: "bg-purple-50" },
        { name: "Admin", type: "System Default", admins: 3, description: "Manage users, partners, and analytics.", score: 95, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Metrics Row (Optional based on some screenshots) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Roles</p>
              <h4 className="text-xl font-bold text-gray-900">{roles.length}</h4>
            </div>
          </div>
        </div>
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Active Admins</p>
              <h4 className="text-xl font-bold text-gray-900">{roles.reduce((acc, r) => acc + (r.admins || 0), 0)}</h4>
            </div>
          </div>
        </div>
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">Security Score</p>
              <h4 className="text-xl font-bold text-gray-900">92%</h4>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). Showing mock data.
        </div>
      )}

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role, idx) => (
          <div key={idx} className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.iconBg} ${role.iconColor}`}>
                  <Shield size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{role.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                      {role.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{role.admins} Active Admins</p>
                </div>
              </div>
              {role.score && (
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    Security: {role.score}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-6">{role.description}</p>
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => onEditRole(role)}
                className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                <Edit size={16} />
                Edit Permissions
              </button>
            </div>
          </div>
        ))}
        
        {/* Create New Role Card */}
        <div 
          onClick={() => onEditRole("New Role")}
          className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition text-gray-500 min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-theme-surface shadow-sm flex items-center justify-center mb-3">
            <span className="text-2xl font-light">+</span>
          </div>
          <h3 className="font-medium text-gray-900">Create New Role</h3>
          <p className="text-sm text-center max-w-[200px] mt-1">Define customized access levels for specific people.</p>
        </div>
      </div>

      {/* Global Security Settings */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Global Security Settings</h3>
            <p className="text-sm text-gray-500 mt-0.5">Require 2FA (Two-Factor Authentication) for all Admin accounts.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
            Manage Security
          </button>
        </div>
      </div>

    </div>
  )
}
