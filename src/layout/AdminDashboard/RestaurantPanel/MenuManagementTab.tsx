import { Search, Filter, Plus, Edit2, Trash2 } from "lucide-react"

export default function MenuManagementTab() {
  const menuItems = [
    { id: 'ITM-001', name: 'Spicy Chicken Wings', category: 'Appetizers', price: '$12.99', status: 'Active' },
    { id: 'ITM-002', name: 'Classic Burger', category: 'Mains', price: '$14.50', status: 'Active' },
    { id: 'ITM-003', name: 'Margherita Pizza', category: 'Mains', price: '$16.00', status: 'Active' },
    { id: 'ITM-004', name: 'Truffle Fries', category: 'Sides', price: '$8.50', status: 'Active' },
    { id: 'ITM-005', name: 'Caesar Salad', category: 'Salads', price: '$10.00', status: 'Inactive' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition justify-center shadow-sm">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-theme-text text-sm font-medium rounded-lg hover:bg-emerald-700 transition justify-center shadow-sm">
            <Plus size={16} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-gray-900">{item.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600">{item.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">{item.price}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.status === 'Active'} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center justify-center">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition inline-flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
