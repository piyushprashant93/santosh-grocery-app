export default function FinanceTab() {
  const transactions = [
    { title: "Payment from Urban Mart", date: "Feb 18, 2026", amount: "+$2,450", type: "positive" },
    { title: "Payment from Mega Store", date: "Feb 17, 2026", amount: "+$3,120", type: "positive" },
  ];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Supplier Finance</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900">$89,240</h3>
        </div>
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
          <h3 className="text-2xl font-bold text-gray-900">$12,450</h3>
        </div>
        <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Settled This Month</p>
          <h3 className="text-2xl font-bold text-gray-900">$76,790</h3>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="flex flex-col gap-4">
          {transactions.map((tx, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 bg-gray-50/30 px-4 rounded-xl border">
              <div>
                <p className="font-medium text-gray-900">{tx.title}</p>
                <p className="text-sm text-gray-500 mt-1">{tx.date}</p>
              </div>
              <div className={`font-bold ${tx.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
