export default function OrdersTab() {
  const orders = [
    { id: "ORD-5678", customer: "John Smith", items: 3, amount: 156, status: "Paid" },
    { id: "ORD-5677", customer: "Sarah Johnson", items: 5, amount: 289, status: "Paid" },
    { id: "ORD-5676", customer: "Mike Davis", items: 2, amount: 78, status: "Paid" },
    { id: "ORD-5675", customer: "Emily Brown", items: 4, amount: 215, status: "Paid" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Order ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Customer</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Items</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Amount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.customer}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.items}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">${order.amount}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
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
