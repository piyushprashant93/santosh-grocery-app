import { useState, useEffect } from "react"
import { Plus, MoreVertical, Loader2, X, UploadCloud, Trash2 } from "lucide-react"
import { getImageUrl } from "../../../utils/dataHelper"
import { apiFetch } from "../../../lib/apiFetch"

export default function BannersTab() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [placement, setPlacement] = useState("Home Top Slider")
  const [status, setStatus] = useState("Active")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/admin/marketing/banners`)
      if (res.ok) {
        const json = await res.json()
        setBanners(json.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch banners", err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (banner?: any) => {
    if (banner) {
      setEditingBanner(banner)
      setTitle(banner.title || "")
      setPlacement(banner.placement || "Home Top Slider")
      setStatus(banner.status || "Active")
      setImagePreview(banner.image ? getImageUrl(banner.image) : "")
      setImageFile(null)
    } else {
      setEditingBanner(null)
      setTitle("")
      setPlacement("Home Top Slider")
      setStatus("Active")
      setImagePreview("")
      setImageFile(null)
    }
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let uploadedImageUrl = editingBanner?.image || ""

      if (imageFile) {
        const formData = new FormData()
        formData.append("image", imageFile)
        const uploadRes = await apiFetch(`/admin/marketing/banners/upload`, {
          method: "POST",
          body: formData
        })
        if (!uploadRes.ok) throw new Error("Image upload failed")
        const uploadJson = await uploadRes.json()
        uploadedImageUrl = uploadJson.data?.url || uploadJson.url
      }

      const payload = {
        title,
        placement,
        status,
        image: uploadedImageUrl
      }

      let res
      if (editingBanner) {
        res = await apiFetch(`/admin/marketing/banners/${editingBanner._id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        })
      } else {
        res = await apiFetch(`/admin/marketing/banners`, {
          method: "POST",
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        setIsModalOpen(false)
        fetchBanners()
      } else {
        const errJson = await res.json()
        alert(errJson.message || "Failed to save banner")
      }
    } catch (err) {
      console.error(err)
      alert("Error saving banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (banner: any) => {
    const newStatus = banner.status === 'Active' ? 'Inactive' : 'Active'
    try {
      const res = await apiFetch(`/admin/marketing/banners/${banner._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, status: newStatus } : b))
      }
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await apiFetch(`/admin/marketing/banners/${bannerId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchBanners()
      }
    } catch (err) {
      console.error("Failed to delete banner", err)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {banners.map((banner) => (
          <div key={banner._id || banner.id} className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
            <div className="h-36 w-full relative">
              <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                  banner.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-gray-900/70 text-white'
                }`}>
                  {banner.status}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-theme-text line-clamp-1 flex-1 cursor-pointer hover:underline" onClick={() => openModal(banner)} title={banner.title}>{banner.title}</h4>
                <button onClick={() => handleDelete(banner._id)} className="text-gray-400 hover:text-red-500 -mr-2 -mt-1 p-1 rounded-md transition ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4 flex-1">Placement: {banner.placement}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-600">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={banner.status === 'Active'} onChange={() => handleToggleStatus(banner)} />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Card */}
        <div onClick={() => openModal()} className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition text-gray-500 min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-theme-surface shadow-sm flex items-center justify-center mb-3 text-orange-500">
            <Plus size={24} />
          </div>
          <h3 className="font-medium text-theme-text">Add New Banner</h3>
          <p className="text-xs text-center max-w-[150px] mt-1 text-gray-500">Upload a new promotional banner</p>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-theme-surface rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-theme-text">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                <select 
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Home Top Slider">Home Top Slider</option>
                  <option value="Home Middle Banner">Home Middle Banner</option>
                  <option value="Category Top">Category Top</option>
                  <option value="Checkout Offers">Checkout Offers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                {imagePreview ? (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <label className="cursor-pointer px-4 py-2 bg-white text-gray-800 rounded-lg font-medium text-sm flex items-center gap-2">
                        <UploadCloud size={16} /> Change Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="h-40 w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-orange-300 transition text-gray-500">
                    <UploadCloud size={24} className="mb-2 text-gray-400" />
                    <span className="text-sm font-medium text-theme-text">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required={!editingBanner} />
                  </label>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
