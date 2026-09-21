import { useState, useEffect } from "react"
import { Package, AlertTriangle, DollarSign, Truck, Info, CheckCircle, Clock, Trash2, Bell } from "lucide-react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/notifications`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        } else if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(console.error);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PUT",
        headers: authHeaders()
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch(err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(`${API_BASE}/notifications/clear-all`, {
        method: "DELETE",
        headers: authHeaders()
      });
      setNotifications([]);
    } catch(err) {
      console.error(err);
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success": return { icon: CheckCircle, color: "#16A34A", bg: "bg-[#ECFDF5]" };
      case "warning": return { icon: AlertTriangle, color: "#F97316", bg: "bg-[#FFF7ED]" };
      case "info": return { icon: Info, color: "#64748B", bg: "bg-[#F1F5F9]" };
      case "order": return { icon: Package, color: "#2563EB", bg: "bg-[#EFF6FF]" };
      case "finance": return { icon: DollarSign, color: "#10B981", bg: "bg-[#ECFDF5]" };
      case "delivery": return { icon: Truck, color: "#6366F1", bg: "bg-[#EEF2FF]" };
      default: return { icon: Bell, color: "#2563EB", bg: "bg-[#EFF6FF]" };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filters = [
    { label: "All Notifications" },
    { label: "Unread", count: unreadCount > 0 ? unreadCount : undefined },
    { label: "Orders" },
    { label: "Alerts & Stock" },
    { label: "Finance" }
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start flex-wrap gap-5">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Notifications
          </h1>
          <p className="text-theme-muted mt-2">
            Stay updated with important alerts and activities.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={markAllAsRead} className="border border-theme-border px-4 py-2 rounded-lg bg-theme-surface shadow-sm hover:bg-gray-50 transition">
            Mark all as read
          </button>
          <button onClick={clearAll} className="flex items-center gap-2 text-theme-muted hover:text-red-500 transition">
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start">
        <div className="border border-theme-border bg-theme-surface rounded-xl p-4 shadow-sm space-y-2">
          {filters.map((f, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer ${i === 0
                  ? "bg-[#EEF2FF] text-[#2563EB]"
                  : "hover:bg-[#F8FAFC]"
                }`}
            >
              <span>{f.label}</span>
              {f.count !== undefined && (
                <span className="bg-[#DBEAFE] text-[#2563EB] text-xs px-2 py-0.5 rounded-full">
                  {f.count}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {notifications.length === 0 && (
              <p className="text-center text-theme-muted py-8">No notifications to show.</p>
          )}
          {notifications.map((n, i) => {
            const { icon: Icon, color, bg } = getIcon(n.type);
            const unread = !n.isRead;
            return (
              <div
                key={i}
                className={`border rounded-xl p-5 shadow-sm flex gap-4 items-start ${unread ? "bg-[#EFF6FF4D] border-[#DBEAFE]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-playfair text-lg font-medium">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-theme-muted">
                      <Clock size={14} />
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}
                      {unread && (
                        <span className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-theme-muted mt-1">
                    {n.message || n.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}