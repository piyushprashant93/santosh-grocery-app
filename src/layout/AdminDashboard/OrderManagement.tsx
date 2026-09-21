import { useState, useEffect } from "react"
import { 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import api from "../../lib/api"

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
  };
  vendor?: {
    name?: string;
    type?: string;
  };
  totalAmount?: number;
  orderStatus?: string;
  orderType?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // We might not have aggregated stats from this endpoint, so we'll use placeholder or calculated values 
  // if the backend doesn't provide them. Ideally, we would fetch these from an analytics endpoint.
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [page, searchQuery])

  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page: page.toString() })
      if (searchQuery) params.append("search", searchQuery)

      const response = await api.get(`/api/v1/admin/orders?${params.toString()}`)
      const result = response.data

      let fetchedOrders: Order[] = []
      
      if (result.data && Array.isArray(result.data.data)) {
        fetchedOrders = result.data.data
        setTotalPages(result.data.pagination?.totalPages || 1)
        setStats({
          total: result.data.pagination?.totalItems || fetchedOrders.length,
          processing: result.data.stats?.processing || 0,
          completed: result.data.stats?.completed || 0,
          cancelled: result.data.stats?.cancelled || 0
        })
      } else if (result.data && Array.isArray(result.data)) {
        fetchedOrders = result.data
        setTotalPages(1)
        setStats({
          total: fetchedOrders.length,
          processing: fetchedOrders.filter(o => o.orderStatus?.toLowerCase() === 'processing').length,
          completed: fetchedOrders.filter(o => o.orderStatus?.toLowerCase() === 'completed' || o.orderStatus?.toLowerCase() === 'delivered').length,
          cancelled: fetchedOrders.filter(o => o.orderStatus?.toLowerCase() === 'cancelled').length
        })
      } else {
        fetchedOrders = []
        setTotalPages(1)
      }
      
      setOrders(fetchedOrders)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    const s = (status || 'Unknown').toLowerCase();
    switch (s) {
      case 'processing':
      case 'pending':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'delivered':
      case 'completed':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'shipped':
        return <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">{status || 'Unknown'}</span>;
    }
  }

  const getTypeBadge = (type?: string) => {
    const t = (type || 'Unknown').toLowerCase();
    if (t.includes('restaurant')) {
      return <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium capitalize">{type}</span>;
    }
    return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-medium capitalize">{type || 'Retail'}</span>;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return { date: "N/A", time: "" };
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: dateStr, time: "" };
    }
  }

  const formatId = (id?: string) => {
    if (!id) return "N/A";
    const str = id.toString();
    if (str.length > 10) {
      return `${str.substring(0, 6)}...`;
    }
    return str;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all customer orders across the platform.</p>
        </div>
        <button className="px-4 py-2 bg-theme-surface border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
          <Download size={18} />
          Export Orders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-blue-600 font-medium text-sm">Total Orders</p>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString()}</h3>
        </div>

        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-orange-600 font-medium text-sm">Processing</p>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-orange-600">{stats.processing.toLocaleString()}</h3>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-emerald-600 font-medium text-sm">Completed</p>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-emerald-600">{stats.completed.toLocaleString()}</h3>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-red-600 font-medium text-sm">Cancelled</p>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-red-600">{stats.cancelled.toLocaleString()}</h3>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative min-h-[400px]">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-theme-surface z-10">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer, or Vendor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 text-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center pt-16">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
            <p className="text-sm text-gray-500 font-medium">Loading orders...</p>
          </div>
        )}
        {!loading && error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-orange-500 text-theme-text rounded-lg">Retry</button>
          </div>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 p-6 text-center text-gray-500">
            <p>No orders found matching your criteria.</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => {
                const { date, time } = formatDate(order.createdAt);
                const customerName = order.customer?.fullName || 
                                     (order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName || ''}`.trim() : 'Guest');
                const vendorName = order.vendor?.name || 'N/A';
                
                return (
                  <tr key={order._id || index} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-theme-text text-sm">
                        {formatId(order.orderId || order._id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{date}</span>
                        <span>{time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-theme-text text-sm">{customerName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500 text-sm">{vendorName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(order.vendor?.type || order.orderType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-theme-text">${(order.totalAmount || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition inline-flex">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium text-theme-text">{page}</span> of <span className="font-medium text-theme-text">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
