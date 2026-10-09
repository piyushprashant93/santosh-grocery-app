import { useState, useEffect } from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import { apiFetch } from "../../../lib/apiFetch";
import { Loader2, Search, Filter } from "lucide-react";

export default function OrdersTab() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, status, paymentStatus, dateFrom, dateTo]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) fetchOrders();
      else setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo })
      });
      
      const res = await apiFetch(`/admin/retailer-panel/orders?${query}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data?.data || []);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-text">Order Management</h2>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full shrink-0">
          View Only - Admin Access
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
          />
        </div>
        
        <select 
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 transition"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select 
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 transition"
        >
          <option value="">All Payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
        
        <input 
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 transition"
        />
        <input 
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 transition"
        />
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        )}
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Date</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Order ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Customer</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Items</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Amount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Payment</th>
            </tr>
          </thead>
          <tbody>
            {!loading && orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-theme-text whitespace-nowrap">{order.orderId || order._id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.customerName || order.customer?.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.items || order.itemsCount || 0}</td>
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">{formatPrice(order.amount || order.totalAmount)}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status || 'unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap capitalize ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      order.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.paymentStatus || 'unpaid'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Prev
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
