export default function ClientsTab() {
  const clients = [
    { name: "Urban Mart", spend: 45680, orders: 128, status: "Active" },
    { name: "Mega Store", spend: 38920, orders: 95, status: "Active" },
    { name: "Quick Shop", spend: 29340, orders: 76, status: "Active" },
    { name: "Fresh Market", spend: 52100, orders: 142, status: "Active" },
  ];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Client Management</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Client Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Total Spend</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Orders</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                <td className="py-4 px-4 text-sm text-gray-600">${client.spend.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{client.orders}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === 'Active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {client.status}
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
