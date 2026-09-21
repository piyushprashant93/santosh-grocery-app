import { BarChart2, Package } from "lucide-react"

export default function ReportsTab() {
  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Reports & Analytics</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sales Report */}
        <div className="border border-gray-100 rounded-xl p-5 bg-theme-surface shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-orange-500">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-theme-text">Sales Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">View detailed sales analytics</p>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">Total Sales</span>
              <span className="font-bold text-theme-text">$89,240</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">Bulk Orders</span>
              <span className="font-bold text-theme-text">127 orders</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-bold text-green-600">+18%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Avg Order Value</span>
              <span className="font-bold text-theme-text">$702.36</span>
            </div>
          </div>
        </div>

        {/* Inventory Report */}
        <div className="border border-gray-100 rounded-xl p-5 bg-theme-surface shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-orange-500">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-theme-text">Inventory Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Stock levels and movements</p>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">Total Products</span>
              <span className="font-bold text-theme-text">342 items</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">In Stock</span>
              <span className="font-bold text-green-600">324 items</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-600">Low Stock</span>
              <span className="font-bold text-red-600">18 items</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Stock Turnover</span>
              <span className="font-bold text-theme-text">92%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
