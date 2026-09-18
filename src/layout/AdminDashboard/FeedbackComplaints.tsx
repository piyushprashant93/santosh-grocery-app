import { useState, useEffect } from "react"
import { 
  Download, 
  Search, 
  Filter, 
  BarChart2, 
  Search as SearchIcon,
  CheckSquare,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import api from "../../lib/api"

interface Complaint {
  _id: string;
  complaintId?: string;
  orderId?: string;
  customerName?: string;
  vendorName?: string;
  type?: string;
  category?: string;
  description?: string;
  createdAt: string;
  status: string;
}

export default function FeedbackComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0
  })

  useEffect(() => {
    fetchComplaints()
  }, [page, searchQuery])

  const fetchComplaints = async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page: page.toString() })
      if (searchQuery) params.append("search", searchQuery)

      const response = await api.get(`/api/v1/admin/complaints?${params.toString()}`)
      const result = response.data

      let fetchedData: Complaint[] = []
      
      if (result.data && Array.isArray(result.data.data)) {
        fetchedData = result.data.data
        setTotalPages(result.data.pagination?.totalPages || 1)
        setStats({
          total: result.data.pagination?.totalItems || fetchedData.length,
          open: result.data.stats?.open || 0,
          inReview: result.data.stats?.inReview || 0,
          resolved: result.data.stats?.resolved || 0,
          rejected: result.data.stats?.rejected || 0
        })
      } else if (result.data && Array.isArray(result.data)) {
        fetchedData = result.data
        setTotalPages(1)
        setStats({
          total: fetchedData.length,
          open: fetchedData.filter(c => c.status?.toLowerCase() === 'open').length,
          inReview: fetchedData.filter(c => c.status?.toLowerCase() === 'in review').length,
          resolved: fetchedData.filter(c => c.status?.toLowerCase() === 'resolved').length,
          rejected: fetchedData.filter(c => c.status?.toLowerCase() === 'rejected').length
        })
      } else {
        fetchedData = []
        setTotalPages(1)
      }
      
      setComplaints(fetchedData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while fetching complaints")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    const s = (status || 'Unknown').toLowerCase();
    switch (s) {
      case 'open':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'in review':
      case 'investigation':
        return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium capitalize">{status || 'Unknown'}</span>;
    }
  }

  const getTypeBadge = (type?: string) => {
    const t = (type || 'Unknown').toLowerCase();
    if (t === 'complaint') {
      return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-medium capitalize">{type}</span>;
    }
    return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-medium capitalize">{type || 'Feedback'}</span>;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  const formatId = (id?: string, prefix = 'COMP') => {
    if (!id) return "N/A";
    const str = id.toString();
    if (str.length > 10) {
      return `${prefix}-${str.substring(0, 4)}...`;
    }
    if (str.startsWith(prefix)) return str;
    return `${prefix}-${str}`;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Feedback & Complaints</h1>
          <p className="text-gray-500 mt-1">Review customer feedback and resolve complaints efficiently</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Total Cases</p>
            <BarChart2 size={18} className="text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Open</p>
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.open.toLocaleString()}</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">In Review</p>
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.inReview.toLocaleString()}</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Resolved</p>
            <CheckSquare size={18} className="text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.resolved.toLocaleString()}</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Rejected</p>
            <X size={18} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.rejected.toLocaleString()}</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative min-h-[400px]">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white z-10">
          <div className="relative w-full sm:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Complaint ID, Order ID, Customer, Vendor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 text-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center pt-16">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
            <p className="text-sm text-gray-500 font-medium">Loading complaints...</p>
          </div>
        )}
        {!loading && error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchComplaints} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Retry</button>
          </div>
        )}
        {!loading && !error && complaints.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 p-6 text-center text-gray-500">
            <p>No complaints found matching your criteria.</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Complaint ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 text-sm block max-w-[80px]">
                      {formatId(item.complaintId || item._id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="block max-w-[70px]">
                      {formatId(item.orderId, 'ORD')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 text-sm">{item.customerName || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-500 text-sm">{item.vendorName || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(item.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600 text-sm">{item.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm truncate block max-w-[200px]" title={item.description || ''}>
                      {item.description || 'No description provided'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="block max-w-[80px]">
                      {formatDate(item.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && complaints.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
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
