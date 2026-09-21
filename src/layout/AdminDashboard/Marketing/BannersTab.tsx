import { Plus, MoreVertical } from "lucide-react"
import { getImageUrl } from "../../../utils/dataHelper";


export default function BannersTab() {
  const banners = [
    {
      id: 1,
      title: "Fresh vegetables discount",
      status: "Active",
      placement: "Home Top Slider",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300&h=150"
    },
    {
      id: 2,
      title: "Restaurant discounts",
      status: "Active",
      placement: "Home Middle Banner",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300&h=150"
    },
    {
      id: 3,
      title: "Summer Drinks",
      status: "Inactive",
      placement: "Category Top",
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=300&h=150"
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {banners.map((banner) => (
          <div key={banner.id} className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
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
                <h4 className="font-bold text-theme-text line-clamp-1" title={banner.title}>{banner.title}</h4>
                <button className="text-gray-400 hover:text-theme-text -mr-2 -mt-1 p-1 rounded-md">
                  <MoreVertical size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4 flex-1">Placement: {banner.placement}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-600">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={banner.status === 'Active'} />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Card */}
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition text-gray-500 min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-theme-surface shadow-sm flex items-center justify-center mb-3 text-orange-500">
            <Plus size={24} />
          </div>
          <h3 className="font-medium text-theme-text">Add New Banner</h3>
          <p className="text-xs text-center max-w-[150px] mt-1 text-gray-500">Upload a new promotional banner</p>
        </div>

      </div>
    </div>
  )
}
