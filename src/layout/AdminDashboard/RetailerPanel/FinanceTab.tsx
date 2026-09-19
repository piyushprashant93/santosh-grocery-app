export default function FinanceTab() {
  const transactions = [
    { title: "Order Payment Received", date: "Feb 18, 2026", amount: "+$156", type: "positive" },
    { title: "Withdrawal to Bank", date: "Feb 15, 2026", amount: "-$5,000", type: "negative" },
  ];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Finance Management</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Wallet Balance</p>
          <h3 className="text-2xl font-bold text-gray-900">$8,450</h3>
        </div>
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Pending Withdrawals</p>
          <h3 className="text-2xl font-bold text-gray-900">$2,300</h3>
        </div>
        <div className="bg-pink-50/50 rounded-xl p-5 border border-pink-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Withdrawn</p>
          <h3 className="text-2xl font-bold text-gray-900">$35,690</h3>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
        <div className="flex flex-col gap-4">
          {transactions.map((tx, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
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
