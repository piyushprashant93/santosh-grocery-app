import { useState, useEffect } from "react"
import { Check, Trash2, Store, AlertTriangle, Info, AlertCircle, ShieldAlert, Loader2, Clock } from "lucide-react"
import toast from "react-hot-toast"
import { formatTimeAgo } from "../../lib/formatTimeAgo"

interface NotificationItem {
  id: string;
  type: 'partner' | 'alert' | 'info' | 'error' | 'security' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'partner' | 'system'>('all');
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
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/notifications`, { headers });
      
      if (!res.ok) throw new Error("Failed to fetch notifications");
      
      const responseData = await res.json();
      
      let rawData = [];
      if (Array.isArray(responseData?.data?.data)) {
        rawData = responseData.data.data;
      } else if (Array.isArray(responseData?.data)) {
        rawData = responseData.data;
      } else if (Array.isArray(responseData)) {
        rawData = responseData;
      }
      
      const formattedNotifications = rawData.map((n: any) => ({
        id: n._id || n.id || Math.random().toString(),
        type: n.type || 'info',
        title: n.title || n.subject || 'Notification',
        description: n.message || n.description || '',
        timestamp: n.createdAt || n.timestamp ? formatTimeAgo(n.createdAt || n.timestamp) : "Just now",
        isRead: n.isRead || false
      }));
      
      setNotifications(formattedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching notifications");
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'partner') return n.type === 'partner';
    if (activeFilter === 'system') return n.type === 'alert' || n.type === 'error' || n.type === 'security' || n.type === 'info';
    return true;
  });

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/notifications/read-all`, { 
        method: "PUT",
        headers 
      });
      
      if (!res.ok) throw new Error("Failed to mark notifications as read");
      
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIconConfig = (type: NotificationItem['type']) => {
    switch (type) {
      case 'partner': return { icon: <Store size={20} />, bg: 'bg-emerald-100', color: 'text-emerald-600' };
      case 'alert': return { icon: <AlertTriangle size={20} />, bg: 'bg-amber-100', color: 'text-amber-600' };
      case 'info': 
      case 'system': return { icon: <Info size={20} />, bg: 'bg-blue-100', color: 'text-blue-600' };
      case 'error': return { icon: <AlertCircle size={20} />, bg: 'bg-red-100', color: 'text-red-600' };
      case 'security': return { icon: <ShieldAlert size={20} />, bg: 'bg-purple-100', color: 'text-purple-600' };
      default: return { icon: <Info size={20} />, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchNotifications} className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Notifications</h1>
          <p className="text-gray-500 mt-1">System alerts, partner requests, and important updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllRead}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2 text-sm"
          >
            <Check size={16} />
            Mark all read
          </button>
          <button 
            onClick={clearAll}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg shadow-sm hover:bg-red-50 transition flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${
              activeFilter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Notifications
            <span className={`px-2.5 py-0.5 rounded-full text-xs ${activeFilter === 'all' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
              {notifications.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${
              activeFilter === 'unread' ? 'bg-gray-900 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread Only
            {unreadCount > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${activeFilter === 'unread' ? 'bg-orange-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                {unreadCount}
              </span>
            )}
          </button>
          
          <div className="h-px bg-gray-200 my-2"></div>
          
          <button 
            onClick={() => setActiveFilter('partner')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${
              activeFilter === 'partner' ? 'bg-gray-900 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            Partner Requests
          </button>
          <button 
            onClick={() => setActiveFilter('system')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${
              activeFilter === 'system' ? 'bg-gray-900 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            System Alerts
          </button>
        </div>

        {/* Right Feed */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <Check className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500">You don't have any notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const iconConfig = getIconConfig(notification.type);
              return (
                <div 
                  key={notification.id} 
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md flex gap-4 ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 border-t-gray-100 border-r-gray-100 border-b-gray-100' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${iconConfig.bg} ${iconConfig.color}`}>
                    {iconConfig.icon}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                        <Clock size={12} />
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 mb-3">{notification.description}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-100 transition">
                        View Details
                      </button>
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-700 text-xs font-medium transition"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  )
}
