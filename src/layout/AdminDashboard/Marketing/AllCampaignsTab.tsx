import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Loader2, Plus, Trash2, X } from "lucide-react"

export default function AllCampaignsTab() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/marketing/campaigns`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      
      const fetchedCampaigns = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setCampaigns(fetchedCampaigns.length > 0 ? fetchedCampaigns.map((c: any) => ({
        _id: c._id,
        name: c.name || c.title || 'Unnamed Campaign',
        status: c.status || (c.endDate && new Date(c.endDate) < new Date() ? 'Ended' : 'Active'),
        target: c.targetAudience || c.target || 'All Users',
        start: c.startDate ? new Date(c.startDate).toLocaleDateString() : 'N/A',
        end: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'N/A',
        clicks: c.clicks || 0,
        conversions: c.conversions || 0,
      })) : []);
    } catch (err: any) {
      setError(err.message);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      
      const payload = {
        title,
        discountType,
        discountValue: Number(discountValue)
      };

      const res = await fetch(`${baseUrl}/api/v1/admin/marketing/campaigns`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create campaign");
      
      fetchCampaigns();
      setIsModalOpen(false);
      setTitle("");
      setDiscountValue("");
    } catch (err: any) {
      alert("Error creating campaign: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const res = await fetch(`${baseUrl}/api/v1/admin/marketing/campaigns/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchCampaigns();
    } catch (err: any) {
      alert("Error deleting campaign: " + err.message);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-600';
      case 'scheduled': return 'bg-blue-50 text-blue-600';
      case 'ended': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
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
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Create Campaign
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). No data to display.
        </div>
      )}

      {/* Table */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Target Audience</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Conversions</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((camp, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{camp.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">ID: {camp._id.substring(0, 8)}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700">{camp.target}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900">{camp.start}</p>
                    <p className="text-xs text-gray-500 mt-0.5">to {camp.end}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{camp.clicks}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{camp.conversions}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleDelete(camp._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {campaigns.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No campaigns found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-theme-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Create New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCampaign} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Summer Sale"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select 
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
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
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-theme-text rounded-lg text-sm font-medium transition"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
