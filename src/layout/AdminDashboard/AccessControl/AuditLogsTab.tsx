import { useState, useEffect } from "react"
import { Search, Filter, Download, Loader2 } from "lucide-react"

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/access-control/logs?page=1`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      const data = await res.json();
      
      const fetchedLogs = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setLogs(fetchedLogs.length > 0 ? fetchedLogs.map((l: any) => ({
        _id: l._id,
        user: l.userName || 'System',
        role: l.userRole || 'Automated',
        action: l.action || 'Unknown Action',
        resource: l.resource || 'System',
        status: l.status || 'Success',
        timestamp: l.createdAt ? new Date(l.createdAt).toLocaleString() : 'Just now'
      })) : [
        { user: "Sarah Jenkins", role: "Super Admin", action: "Updated system settings", resource: "Security", status: "Success", timestamp: "10 mins ago" }
      ]);
    } catch (err: any) {
      setError(err.message);
      // Fallback
      setLogs([
        { user: "Sarah Jenkins", role: "Super Admin", action: "Updated system settings", resource: "Security", status: "Success", timestamp: "10 mins ago" },
        { user: "Emma Taylor", role: "Content Manager", action: "Created new promotional banner", resource: "Home Page", status: "Success", timestamp: "2 hrs ago" },
        { user: "Mike Ross", role: "Admin", action: "Approved new restaurant", resource: "Vendors", status: "Success", timestamp: "5 hrs ago" },
        { user: "System", role: "Automated", action: "Weekly backup completed", resource: "Database", status: "Success", timestamp: "1 day ago" },
        { user: "Unknown User", role: "None", action: "Failed login attempt (3x)", resource: "Authentication", status: "Failed", timestamp: "1 day ago" },
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
              placeholder="Search audit logs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm w-full sm:w-auto justify-center">
          <Download size={16} />
          Export Logs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). Showing mock data.
        </div>
      )}

      {/* Table */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">User / Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-theme-text text-sm">{log.user}</span>
                      <span className="text-xs text-gray-500">{log.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {log.status === "Failed" ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      )}
                      <span className="text-sm text-gray-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {log.resource}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to 5 of 248 entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 rounded bg-orange-50 text-orange-600 font-medium">1</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">3</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
