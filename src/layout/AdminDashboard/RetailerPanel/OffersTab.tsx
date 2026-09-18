export default function OffersTab() {
  const offers = [
    { code: "SAVE20", discount: "20%", used: 45, limit: 100, status: "Active" },
    { code: "SUMMER10", discount: "10%", used: 89, limit: 100, status: "Active" },
    { code: "WELCOME", discount: "$5", used: 156, limit: 200, status: "Active" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Offers & Coupons</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Coupon Code</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Discount</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Used / Limit</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{offer.code}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{offer.discount}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{offer.used} / {offer.limit}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    offer.status === 'Active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {offer.status}
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
