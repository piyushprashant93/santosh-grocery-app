import { useState, useEffect } from "react"
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react"

export default function AdminUsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/access-control/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch admin users");
      const data = await res.json();
      
      const fetchedUsers = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setUsers(fetchedUsers.length > 0 ? fetchedUsers.map((u: any) => ({
        _id: u._id,
        name: u.name || 'Unknown',
        email: u.email || 'N/A',
        role: u.role || 'Admin',
        status: u.isBlocked ? 'Inactive' : 'Active',
        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'
      })) : [
        { name: "Sarah Jenkins", email: "sarah@hubnepa.com", role: "Super Admin", status: "Active", lastLogin: "2 hours ago" },
        { name: "Mike Ross", email: "mike@hubnepa.com", role: "Admin", status: "Active", lastLogin: "5 hrs ago" }
      ]);
    } catch (err: any) {
      setError(err.message);
      // Fallback
      setUsers([
        { name: "Sarah Jenkins", email: "sarah@hubnepa.com", role: "Super Admin", status: "Active", lastLogin: "2 hours ago" },
        { name: "Mike Ross", email: "mike@hubnepa.com", role: "Admin", status: "Active", lastLogin: "5 hrs ago" },
        { name: "Emma Taylor", email: "emma@hubnepa.com", role: "Content Manager", status: "Active", lastLogin: "1 day ago" },
        { name: "James Specter", email: "james@hubnepa.com", role: "Support Staff", status: "Inactive", lastLogin: "2 days ago" },
        { name: "Rachel Zane", email: "rachel@hubnepa.com", role: "Support Staff", status: "Active", lastLogin: "3 days ago" },
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
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search admin users..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter By Role
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm w-full sm:w-auto justify-center">
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). Showing mock data.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm font-medium ${user.status === 'Active' ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
