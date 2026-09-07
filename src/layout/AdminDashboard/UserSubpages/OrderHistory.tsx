import { ArrowLeft, Search, Filter } from "lucide-react"

interface OrderHistoryProps {
  user: { id: string; fullName: string; } | null;
  onBack: () => void;
}

const mockOrders = [
  { id: "ORD-5521", restaurant: "Burger King Clone", date: "Feb 12, 2024", items: "Spicy Chicken Burger x 2", total: "$28.50", status: "Delivered" },
  { id: "ORD-5520", restaurant: "Fresh Mart", date: "Feb 10, 2024", items: "Organic Bananas, Milk, Bread", total: "$15.20", status: "Delivered" },
  { id: "ORD-5490", restaurant: "Sushi Palace", date: "Feb 05, 2024", items: "Sushi Platter Large", total: "$45.00", status: "Cancelled" },
  { id: "ORD-5488", restaurant: "Spicy Kitchen", date: "Jan 28, 2024", items: "Pad Thai, Spring Rolls", total: "$22.00", status: "Delivered" },
];

export default function OrderHistory({ user, onBack }: OrderHistoryProps) {
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Order History</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            User: <span className="font-semibold text-gray-900">{user.fullName}</span> 
            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-600 border border-gray-200">ID: {user.id.slice(-6).toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 shadow-sm">
          <p className="text-blue-600 font-medium text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-blue-900">45</h3>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <p className="text-emerald-600 font-medium text-sm mb-1">Completed</p>
          <h3 className="text-3xl font-bold text-emerald-900">42</h3>
        </div>
        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 shadow-sm">
          <p className="text-red-600 font-medium text-sm mb-1">Cancelled</p>
          <h3 className="text-3xl font-bold text-red-900">3</h3>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        
        {/* Search & Filter */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Restaurant/Store</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.restaurant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'Delivered' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Cancelled
                      </span>
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
