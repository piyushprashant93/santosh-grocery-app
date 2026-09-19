import { useState, useEffect } from "react"
import { Search, Filter, Percent, DollarSign, Tag, Loader2, Plus, Trash2, X } from "lucide-react"

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/vouchers`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch vouchers");
      const data = await res.json();
      
      const fetchedCoupons = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setCoupons(fetchedCoupons.length > 0 ? fetchedCoupons.map((c: any) => ({
        _id: c._id,
        code: c.code || 'UNKNOWN',
        type: c.discountType === 'percentage' ? '%' : 'flat',
        discount: c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`,
        status: c.isActive ? 'Active' : 'Inactive',
        uses: c.usageCount || 0,
        maxUses: c.maxUses || c.usageLimit || '∞',
        validUntil: c.validUntil ? new Date(c.validUntil).toLocaleDateString() : 'No expiry',
      })) : []);
    } catch (err: any) {
      setError(err.message);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      
      const payload = {
        code,
        discountType,
        discountValue: Number(discountValue),
        maxUses: maxUses ? Number(maxUses) : 1000
      };

      const res = await fetch(`${baseUrl}/api/v1/admin/vouchers`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create voucher");
      
      // Refresh list
      fetchCoupons();
      setIsModalOpen(false);
      setCode("");
      setDiscountValue("");
      setMaxUses("");
    } catch (err: any) {
      alert("Error creating coupon: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/vouchers/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchCoupons();
    } catch (err: any) {
      alert("Error deleting coupon: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search coupons..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). No data to display.
        </div>
      )}

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Create New Coupon */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-50 rounded-2xl border border-orange-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 hover:border-orange-300 transition text-orange-600 min-h-[160px]"
        >
          <Plus size={32} className="mb-2" />
          <h3 className="font-bold text-lg">Create Coupon</h3>
          <p className="text-xs text-orange-500 mt-1">Add new discount codes</p>
        </div>

        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-[3px] border-dashed border-gray-200"></div>
            
            <div className="flex justify-between items-start mb-3 ml-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  coupon.type === '%' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {coupon.type === '%' ? <Percent size={14} /> : <Tag size={14} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Discount Code</p>
                  <h3 className="font-bold text-lg text-gray-900 tracking-tight">{coupon.code}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {coupon.status}
                </span>
                <button 
                  onClick={() => handleDelete(coupon._id)}
                  className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-4 ml-2">
              <span className="text-2xl font-black text-gray-900" style={{ fontFamily: 'serif' }}>{coupon.discount}</span>
              <span className="text-xs text-gray-500 font-medium">OFF</span>
            </div>
            
            <div className="flex flex-col gap-2 mt-auto ml-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Validity:</span>
                <span className="font-medium text-gray-900">{coupon.validUntil}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Usage:</span>
                <span className="font-medium text-gray-900">{coupon.uses} / {coupon.maxUses}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-theme-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium uppercase"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select 
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? "20" : "10"}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Optional)</label>
                <input 
                  type="number" 
                  value={maxUses}
                  onChange={e => setMaxUses(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-theme-text rounded-lg text-sm font-medium transition"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
