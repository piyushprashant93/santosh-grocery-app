import { useState, useEffect } from "react"
import { Search, Filter, Send, MoreVertical, CheckCircle2, Clock, Plus, X, Loader2 } from "lucide-react"

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      
      const fetchedNotifs = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setNotifications(fetchedNotifs.length > 0 ? fetchedNotifs.map((n: any) => ({
        id: n._id || n.id,
        title: n.title || "Notification",
        message: n.message || n.body || "",
        status: n.status || (n.isRead ? "Read" : "Unread"),
        audience: n.audience || n.targetRole || "N/A",
        sentAt: n.createdAt ? new Date(n.createdAt).toLocaleString() : "N/A",
        clicks: n.clicks !== undefined ? n.clicks : null
      })) : []);
    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data
      setNotifications([
        {
          id: 1,
          title: "Weekend Special: 50% Off Stores!",
          message: "Shop from our exclusive weekend special stores and get flat 50% off.",
          status: "Sent",
          audience: "All Users",
          sentAt: "2024-06-15 10:00 AM",
          clicks: 3420,
        },
        {
          id: 2,
          title: "Your cart is missing you 🛒",
          message: "You left some items in your cart. Complete your purchase now!",
          status: "Sent",
          audience: "Cart Abandoners",
          sentAt: "2024-06-14 02:30 PM",
          clicks: 890,
        },
        {
          id: 3,
          title: "New Restaurant Alert: Burger King",
          message: "Burger King is now delivering to your area. Order now!",
          status: "Scheduled",
          audience: "Users in ZIP 10001",
          sentAt: "2024-06-20 12:00 PM",
          clicks: null,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("customer");

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      
      const payload = {
        title,
        message,
        targetRole
      };

      const res = await fetch(`${baseUrl}/api/v1/admin/marketing/notifications/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to send push notification");
      
      // Update mock list for UI feedback
      setNotifications([{
        id: Date.now(),
        title,
        message,
        status: "Sent",
        audience: targetRole,
        sentAt: new Date().toLocaleString(),
        clicks: 0
      }, ...notifications]);
      
      setIsModalOpen(false);
      setTitle("");
      setMessage("");
      setTargetRole("customer");
    } catch (err: any) {
      alert("Error sending push notification: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto justify-center"
          >
            <Send size={16} />
            New Push Notification
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
                <th className="p-4">Notification Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Target Audience</th>
                <th className="p-4">Time</th>
                <th className="p-4">Engagement</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 max-w-[300px]">
                    <p className="font-bold text-theme-text truncate" title={notif.title}>{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={notif.message}>{notif.message}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {notif.status === 'Sent' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Clock size={16} className="text-blue-500" />
                      )}
                      <span className={`text-sm font-medium ${notif.status === 'Sent' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {notif.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700 capitalize">{notif.audience}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-theme-text">{notif.sentAt}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-theme-text">{notif.clicks !== null ? `${notif.clicks} clicks` : '-'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button className="p-2 text-gray-400 hover:text-theme-text hover:bg-gray-100 rounded-lg transition">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Push Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-theme-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-theme-text">Send Push Notification</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendPush} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Flash Sale!"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your push notification message..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select 
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                >
                  <option value="customer">Customers</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="delivery">Delivery Drivers</option>
                  <option value="all">All Users</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Send Push
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
