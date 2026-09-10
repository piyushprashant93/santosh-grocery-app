import { useState, useEffect } from "react"
import { AlertTriangle, Bell, Info, CheckCircle, Clock, Trash2, Package, DollarSign, Truck } from "lucide-react"

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

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      setNotifications(notifications.filter(n => n.id !== id && n._id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success": return { icon: CheckCircle, color: "#16A34A", bg: "bg-[#DCFCE7]" };
      case "warning": return { icon: AlertTriangle, color: "#DC2626", bg: "bg-[#FEE2E2]" };
      case "info": return { icon: Info, color: "#475569", bg: "bg-[#F1F5F9]" };
      case "order": return { icon: Package, color: "#2563EB", bg: "bg-[#DBEAFE]" };
      case "finance": return { icon: DollarSign, color: "#16A34A", bg: "bg-[#DCFCE7]" };
      case "delivery": return { icon: Truck, color: "#6366F1", bg: "bg-[#EEF2FF]" };
      default: return { icon: Bell, color: "#2563EB", bg: "bg-[#DBEAFE]" };
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-5">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Notifications
          </h1>
          <p className="text-[#6A7282] mt-2">
            Stay updated with your restaurant activities.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={markAllAsRead} className="border border-[#E5E7EB] px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="">
       <div className="space-y-5">
          {notifications.length === 0 && (
              <p className="text-center text-[#94A3B8] py-8">No notifications to show.</p>
          )}
          {notifications.map((n, i) => {
            const { icon: Icon, color, bg } = getIcon(n.type);
            const unread = !n.isRead;
            return (
              <div
                key={i}
                className={`border bg-white rounded-xl p-5 shadow-sm flex gap-4 items-start ${unread ? "bg-[#EFF6FF4D] border-[#DBEAFE]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-playfair text-lg text-[#0F172A]">
                        {n.title}
                      </h3>
                      <p className="text-[#64748B] mt-1">
                        {n.message || n.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <Clock size={14}/>
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}
                        {unread && (
                          <span className="w-2.5 h-2.5 bg-[#2563EB] rounded-full ml-1" />
                        )}
                      </div>
                      <button onClick={() => deleteNotification(n.id || n._id)} className="text-[#94A3B8] hover:text-red-500 transition">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}