import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ShoppingBag, Utensils, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import api from "../../../lib/api"

export default function ProductFoodList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("retail");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchData()
  }, [activeTab, page, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    setError("")
    setMenuOpenId(null)
    try {
      const params = new URLSearchParams({ page: page.toString() })
      if (searchQuery) params.append("search", searchQuery)

      const endpoint = activeTab === "retail" ? "/api/v1/admin/products" : "/api/v1/admin/menu-items"
      const response = await api.get(`${endpoint}?${params.toString()}`)
      const result = response.data

      let fetchedData: any[] = []
      
      if (result.data && Array.isArray(result.data.data)) {
        fetchedData = result.data.data
        setTotalPages(result.data.pagination?.totalPages || 1)
      } else if (result.data && Array.isArray(result.data)) {
        fetchedData = result.data
        setTotalPages(1)
      } else if (Array.isArray(result)) {
        fetchedData = result
        setTotalPages(1)
      }
      
      setItems(fetchedData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    const s = (status || 'Unknown').toLowerCase();
    switch(s) {
      case 'active':
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'inactive':
      case 'rejected':
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium capitalize">{status}</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium capitalize">{status}</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium capitalize">{status || 'Unknown'}</span>;
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative min-h-[500px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>Product & Food Management</h1>
          <p className="text-gray-500 mt-1">Manage global catalog, approval requests, and categorization.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/dashboard/product-food/add")}
          className="bg-orange-500 hover:bg-orange-600 text-theme-text px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Add Menu Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative min-h-[400px]">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 p-2 gap-2">
          <button 
            onClick={() => {
              setActiveTab("retail")
              setPage(1)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
              activeTab === "retail" ? "text-theme-text bg-gray-50" : "text-gray-500 hover:bg-gray-50 hover:text-theme-text"
            }`}
          >
            <ShoppingBag size={16} />
            Retail Products
          </button>
          <button 
            onClick={() => {
              setActiveTab("restaurant")
              setPage(1)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
              activeTab === "restaurant" ? "text-theme-text bg-gray-50" : "text-gray-500 hover:bg-gray-50 hover:text-theme-text"
            }`}
          >
            <Utensils size={16} />
            Restaurant Menu Items
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'retail' ? 'products' : 'menu items'}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center shadow-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 top-[120px] bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !error && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500 min-h-[300px]">
            <p>No {activeTab === 'retail' ? 'products' : 'menu items'} found.</p>
          </div>
        )}

        {/* Table */}
        {!error && items.length > 0 && (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor/Restaurant</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item._id || item.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                    <td className="py-4 px-6 text-sm font-medium text-theme-text">
                      {item.name || item.itemName || 'Unnamed Item'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-theme-surface shadow-sm inline-block text-center min-w-[70px]">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {item.vendor?.name || item.vendorName || item.restaurant?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-theme-text">
                      ${Number(item.price || item.basePrice || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {getStatusBadge(item.status || item.isActive ? 'Active' : 'Inactive')}
                    </td>
                    <td className="py-4 px-6 text-sm text-right relative">
                      <button 
                        onClick={() => setMenuOpenId(menuOpenId === (item._id || item.id) ? null : (item._id || item.id))}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Actions Dropdown */}
                      {menuOpenId === (item._id || item.id) && (
                        <div className="absolute right-6 top-10 w-36 bg-theme-surface rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                            <Edit size={14} className="text-gray-400" />
                            Edit Details
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition">
                            <Trash2 size={14} className="text-red-400" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-auto bg-theme-surface">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium text-theme-text">{page}</span> of <span className="font-medium text-theme-text">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
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
