import { ArrowLeft, Search, Filter, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import api from "../../../lib/api"

interface OrderHistoryProps {
  user: { id: string; fullName: string; } | null;
  onBack: () => void;
}

export default function OrderHistory({ user, onBack }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      // The API uses pagination and filtering. We pass userId to get orders for this specific user.
      const res = await api.get(`/api/v1/admin/orders`, {
        params: { userId: user?.id, search }
      });
      const data = res.data?.data?.data || res.data?.data || res.data || [];
      const orderList = Array.isArray(data) ? data : (data.orders || []);
      
      setOrders(orderList);
      
      const total = orderList.length;
      const completed = orderList.filter((o: any) => o.status === 'Delivered' || o.orderStatus === 'Delivered' || o.status === 'Completed').length;
      const cancelled = orderList.filter((o: any) => o.status === 'Cancelled' || o.orderStatus === 'Cancelled').length;
      
      setStats({ total, completed, cancelled });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (user?.id && !loading && orders.length > 0) fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-theme-text hover:bg-theme-surface rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>Order History</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            User: <span className="font-semibold text-theme-text">{user.fullName}</span> 
            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-600 border border-gray-200">ID: {user.id.slice(-6).toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 shadow-sm">
          <p className="text-blue-600 font-medium text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-blue-900">{stats.total}</h3>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <p className="text-emerald-600 font-medium text-sm mb-1">Completed</p>
          <h3 className="text-3xl font-bold text-emerald-900">{stats.completed}</h3>
        </div>
        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 shadow-sm">
          <p className="text-red-600 font-medium text-sm mb-1">Cancelled</p>
          <h3 className="text-3xl font-bold text-red-900">{stats.cancelled}</h3>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px] relative">
        
        {/* Search & Filter */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="absolute inset-0 top-[80px] bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
            <p className="text-sm text-gray-500 font-medium">Loading orders...</p>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 top-[80px] z-10 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-orange-500 text-theme-text rounded-lg">Retry</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="absolute inset-0 top-[80px] z-10 flex flex-col items-center justify-center p-6 text-center text-gray-500">
            <p>No orders found for this user.</p>
          </div>
        )}

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Restaurant/Store</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-text">{(order._id || order.id || "").slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-theme-text">{order.restaurant?.name || order.store?.name || order.restaurant || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt || order.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-theme-text">${(order.totalAmount || order.total || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'Delivered' || order.orderStatus === 'Delivered' || order.status === 'Completed' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Delivered
                      </span>
                    ) : order.status === 'Cancelled' || order.orderStatus === 'Cancelled' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        {order.status || order.orderStatus || 'Pending'}
                      </span>
                    )}
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
