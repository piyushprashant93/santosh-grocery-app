import { Star } from "lucide-react"

export default function CustomersTab() {
  const customers = [
    { name: "John Smith", orders: 24, spent: 1450, lastOrder: "2 days ago", rating: 4.5 },
    { name: "Sarah Johnson", orders: 18, spent: 980, lastOrder: "1 day ago", rating: 4.5 },
    { name: "Mike Davis", orders: 31, spent: 2120, lastOrder: "3 hours ago", rating: 4.5 },
    { name: "Emily Brown", orders: 12, spent: 720, lastOrder: "1 week ago", rating: 4.5 },
  ];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Customer Management</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Customer Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Total Orders</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Total Spent</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Last Order</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Rating</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-theme-text">{customer.name}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{customer.orders}</td>
                <td className="py-4 px-4 text-sm font-medium text-theme-text">${customer.spent.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{customer.lastOrder}</td>
                <td className="py-4 px-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-700 font-medium">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {customer.rating}
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
