export default function LogisticsTab() {
  const shipments = [
    { id: "SHP-789", destination: "Urban Mart - Downtown", driver: "John Davis", status: "in-transit" },
    { id: "SHP-788", destination: "Mega Store - North", driver: "Sarah Wilson", status: "loading" },
    { id: "SHP-787", destination: "Quick Shop - East", driver: "Mike Johnson", status: "delivered" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Logistics & Fleet</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Shipment ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Destination</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Driver</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{shipment.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{shipment.destination}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{shipment.driver}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                    shipment.status === 'loading' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {shipment.status}
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
