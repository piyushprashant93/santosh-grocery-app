import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ShoppingBag, Utensils } from "lucide-react"

export default function ProductFoodList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("restaurant");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const items = [
    { id: "1", name: "Spicy Chicken Burger", category: "Fast Food", vendor: "Burger King Clone", price: 12.99, status: "Active" },
    { id: "2", name: "Pad Thai", category: "Asian", vendor: "Spicy Kitchen", price: 14.50, status: "Active" },
    { id: "3", name: "Chocolate Lava Cake", category: "Dessert", vendor: "Spicy Kitchen", price: 8.00, status: "Inactive" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Product & Food Management</h1>
          <p className="text-gray-500 mt-1">Manage global catalog, approval requests, and categorization.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/dashboard/product-food/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} />
          Add Menu Item
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 p-2 gap-2">
          <button 
            onClick={() => setActiveTab("retail")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
              activeTab === "retail" ? "text-gray-900 bg-gray-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShoppingBag size={16} />
            Retail Products
          </button>
          <button 
            onClick={() => setActiveTab("restaurant")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
              activeTab === "restaurant" ? "text-gray-900 bg-gray-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
              placeholder="Search food..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
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
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-white shadow-sm inline-block text-center min-w-[70px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{item.vendor}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right relative">
                    <button 
                      onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {/* Actions Dropdown */}
                    {menuOpenId === item.id && (
                      <div className="absolute right-6 top-10 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit size={14} className="text-gray-400" />
                          Edit Details
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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

      </div>
    </div>
  )
}
