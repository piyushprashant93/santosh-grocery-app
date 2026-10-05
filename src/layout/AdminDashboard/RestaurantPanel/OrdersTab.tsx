import { useState, useEffect } from "react"
import { Search, Filter, Eye, Loader2 } from "lucide-react"
import api from "../../../lib/api"

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/partners/restaurants');
        const partners = res.data?.data?.data || res.data?.data || res.data || [];
        const id = Array.isArray(partners) && partners.length > 0 ? (partners[0]._id || partners[0].id) : null;
        if (id) {
          const ordersRes = await api.get(`/admin/partners/restaurants/${id}/orders`);
          const rawOrders = ordersRes.data?.data?.data || ordersRes.data?.data || ordersRes.data || [];
          setOrders(rawOrders.map((o: any) => ({
            id: o._id || o.id || '#ORD-000',
            customer: o.customer?.fullName || o.customer?.firstName || o.customerName || 'Unknown Customer',
            items: Array.isArray(o.items) ? o.items.length : (o.itemCount || 0),
            total: `$${(o.totalAmount || o.total || 0).toFixed(2)}`,
            status: o.status || 'Pending',
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Filters */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition justify-center w-full sm:w-auto">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-theme-text">{order.id}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{order.time}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-theme-text">{order.customer}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{order.items} items</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-theme-text">{order.total}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition inline-flex items-center justify-center">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
