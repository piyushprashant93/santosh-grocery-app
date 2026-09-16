import { AlertTriangle, Plus, RotateCcw } from "lucide-react"

export default function InventoryTab() {
  const lowStock = [
    { item: 'Olive Oil', current: '2 Liters', threshold: '5 Liters' },
    { item: 'Chicken Breast', current: '5 KG', threshold: '10 KG' },
    { item: 'Tomatoes', current: '3 KG', threshold: '15 KG' },
  ];

  const inventoryCategories = [
    {
      name: 'Beverage Management',
      items: [
        { name: 'Coca Cola', stock: '45 Units' },
        { name: 'Sprite', stock: '32 Units' },
      ]
    },
    {
      name: 'General Inventory (Spices)',
      items: [
        { name: 'Black Pepper', stock: '2.5 KG' },
        { name: 'Salt', stock: '8 KG' },
        { name: 'Paprika', stock: '1.2 KG' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold" style={{ fontFamily: 'serif' }}>Low Stock Alerts</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStock.map((stock, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                <p className="font-bold text-gray-900">{stock.item}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600 font-medium">{stock.current}</span>
                  <span className="text-gray-400">/ {stock.threshold}</span>
                </div>
                <button className="w-full mt-2 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                  <RotateCcw size={14} />
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inventoryCategories.map((category, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>{category.name}</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {category.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <span className="text-sm font-bold text-gray-500">{item.stock}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
