import { useCurrency } from "../../../context/CurrencyContext";

export default function OverviewTab({ recentOrders = [] }: { recentOrders?: any[] }) {
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Recent Bulk Orders</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent orders found.</div>
        ) : (
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
              {recentOrders.map((order: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">{order.orderId || order.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.clientName || order.client}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.itemsCount || order.items}</td>
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">{formatPrice(order.amount)}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.statusLabel === 'Delivered' || order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.statusLabel === 'Processing' || order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      order.statusLabel === 'Shipped' || order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.statusLabel || order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

