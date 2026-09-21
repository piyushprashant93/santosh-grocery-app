import { useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, Flame, Image as ImageIcon, Plus } from "lucide-react"

export default function AddMenuItem() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto w-full pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-theme-text tracking-tight" style={{ fontFamily: 'serif' }}>Add Menu Item</h1>
            <p className="text-gray-500 mt-1">Create a new dish for a restaurant partner.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition bg-theme-surface"
          >
            Discard
          </button>
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-theme-text rounded-lg font-medium transition flex items-center gap-2">
            Publish Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Dish Information */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-1" style={{ fontFamily: 'serif' }}>Dish Information</h2>
            <p className="text-sm text-gray-500 mb-6">Basic details about the menu item.</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Dish Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Signature Truffle Burger"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Description</label>
                <textarea 
                  placeholder="Describe the taste, texture, and key ingredients..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Ingredients List</label>
                <input 
                  type="text" 
                  placeholder="e.g. Beef patty, truffle aioli, brioche bun, arugula..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface"
                />
                <p className="text-xs text-gray-500 mt-1.5">Separated by commas.</p>
              </div>
            </div>
          </div>

          {/* Preparation & Nutrition */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Preparation & Nutrition</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Prep Time (mins)</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="15"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Calories (kcal)</label>
                <div className="relative">
                  <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="650"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Spiciness</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface appearance-none">
                  <option>None</option>
                  <option>Mild</option>
                  <option>Medium</option>
                  <option>Hot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-3">Dietary Tags</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm text-gray-700">Vegan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm text-gray-700">Gluten Free</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm text-gray-700">Halal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing & Variations */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Pricing & Variations</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-theme-text mb-1.5">Base Price</label>
              <div className="relative w-1/2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input 
                  type="text" 
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-100 rounded-xl p-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Add-ons / Modifiers</h3>
                <button className="px-3 py-1.5 bg-theme-surface border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5">
                  <Plus size={16} />
                  Add Group
                </button>
              </div>
              <div className="text-center py-6 text-gray-400 text-sm">
                No modifier groups added yet.
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-6">
          
          {/* Restaurant */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Restaurant</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Select Restaurant</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface appearance-none text-gray-500">
                  <option>Select partner</option>
                  <option>Burger King Clone</option>
                  <option>Spicy Kitchen</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1.5">Menu Category</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-theme-surface appearance-none text-theme-text">
                  <option>Main Course</option>
                  <option>Appetizers</option>
                  <option>Desserts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Availability</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-theme-text mb-1.5">Available for Order</label>
              {/* Optional toggle switch or just a label if it matches design exactly */}
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-3">Serving Times</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-gray-700">Breakfast</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-gray-700">Lunch</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-gray-700">Dinner</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dish Photo */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Dish Photo</h2>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
              <div className="p-3 bg-theme-surface rounded-lg shadow-sm border border-gray-100 mb-3">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600">Upload Photo</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
