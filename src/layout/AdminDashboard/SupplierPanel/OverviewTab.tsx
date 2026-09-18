export default function OverviewTab() {
  const recentOrders = [
    { id: "BO-1245", client: "Urban Mart", items: 48, amount: 2450, status: "Processing" },
    { id: "BO-1244", client: "Mega Store", items: 62, amount: 3120, status: "Shipped" },
    { id: "BO-1243", client: "Quick Shop", items: 35, amount: 1890, status: "Delivered" },
    { id: "BO-1242", client: "Fresh Market", items: 58, amount: 2780, status: "Processing" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Bulk Orders</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Order ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Client</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Items</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Amount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.client}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.items}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">${order.amount.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
