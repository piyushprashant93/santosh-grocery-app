export default function RefundsTab() {
  const refunds = [
    { id: "REF-234", customer: "John Smith", amount: 45, reason: "Product damaged", status: "Pending Review" },
    { id: "REF-233", customer: "Mike Davis", amount: 28, reason: "Wrong item", status: "Pending Review" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Refund Requests</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Refund ID</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Customer</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Amount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Reason</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{refund.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{refund.customer}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">${refund.amount}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{refund.reason}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    refund.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {refund.status}
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
