import { useState, useEffect } from "react"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

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
    fetch(`${API_BASE}/retailer/notifications`, { headers: authHeaders() })
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
      await fetch(`${API_BASE}/retailer/notifications/read-all`, {
        method: "PUT",
        headers: authHeaders()
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch(err) {
      console.error(err);
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success": return { icon: CheckCircle, color: "#009966", bg: "bg-[#ECFDF5]" };
      case "warning": return { icon: AlertCircle, color: "#F97316", bg: "bg-[#FFF7ED]" };
      case "info": return { icon: Info, color: "#64748B", bg: "bg-[#F1F5F9]" };
      default: return { icon: Bell, color: "#2563EB", bg: "bg-[#EFF6FF]" };
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Notifications
          </h1>
          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Stay updated with important alerts.
          </p>
        </div>
        <button onClick={markAllAsRead} className="px-4 py-2 border border-theme-border rounded-lg shadow-sm bg-theme-surface">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
            <p className="text-center text-theme-muted py-8">No notifications to show.</p>
        )}
        {notifications.map((item, i) => {
          const { icon: Icon, color, bg } = getIcon(item.type);
          const unread = !item.isRead;
          const highlight = unread;
          return (
            <div
              key={i}
              className={`rounded-lg lg:rounded-xl p-3 lg:p-6 border flex gap-4 items-start shadow-sm
              ${highlight ? "border-[#FDBA74] bg-[#FFF7ED]" : "border-[#E5E7EB] bg-white"}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={22} style={{ color }} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-medium">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-theme-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                    {unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                    )}
                  </div>
                </div>
                <p className="text-theme-muted mt-1">
                  {item.message || item.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-theme-muted mt-8">
        Showing recent notifications from the last 30 days.
      </p>
    </div>
  )
}