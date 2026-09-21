import { Download, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function FinanceTab() {
  const payouts = [
    { id: '#PAY-001', date: 'Oct 24, 2026', amount: '$1,250.00', status: 'Completed' },
    { id: '#PAY-002', date: 'Oct 17, 2026', amount: '$980.50', status: 'Completed' },
    { id: '#PAY-003', date: 'Oct 10, 2026', amount: '$1,100.00', status: 'Completed' },
    { id: '#PAY-004', date: 'Oct 03, 2026', amount: '$850.25', status: 'Failed' },
    { id: '#PAY-005', date: 'Sep 26, 2026', amount: '$1,400.00', status: 'Completed' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Finance Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Financial Overview</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Revenue (This Month)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-theme-text">$12,345.00</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 mb-1">
              <ArrowUpRight size={16} /> 12%
            </span>
          </div>
        </div>
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-2">Pending Payout</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-theme-text">$850.00</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-red-600 mb-1">
              <ArrowDownRight size={16} /> 2%
            </span>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Recent Settlements</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payout ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-theme-text">{payout.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{payout.date}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-theme-text">{payout.amount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    payout.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payout.status}
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
