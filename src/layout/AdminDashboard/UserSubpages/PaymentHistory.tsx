import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface PaymentHistoryProps {
  user: { id: string; fullName: string; } | null;
  onBack: () => void;
}

const mockTransactions = [
  { id: "TXN-8821", date: "Feb 12, 2024", type: "Payment", method: "Visa •••• 4242", status: "Success", amount: "-$28.50" },
  { id: "TXN-8820", date: "Feb 10, 2024", type: "Payment", method: "Mastercard •••• 8899", status: "Success", amount: "-$15.20" },
  { id: "TXN-8819", date: "Feb 08, 2024", type: "Refund", method: "Wallet", status: "Completed", amount: "+$12.00" },
  { id: "TXN-8818", date: "Feb 05, 2024", type: "Payment", method: "Visa •••• 4242", status: "Failed", amount: "-$45.00" },
];

export default function PaymentHistory({ user, onBack }: PaymentHistoryProps) {
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Payment History</h1>
          <p className="text-gray-500 mt-1">
            Transaction log for <span className="font-semibold text-gray-900">{user.fullName}</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">Active</div>
          <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">$1,250.00</h3>
          <p className="text-gray-400 text-sm">Total Lifetime Spend</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-gray-500 font-medium">$</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">$45.00</h3>
          <p className="text-gray-500 text-sm">Average Order Value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mb-4">
            <CreditCardIcon />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">2 Cards</h3>
          <p className="text-gray-500 text-sm">Saved Payment Methods</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        
        {/* Header & Download */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
            <Download size={16} />
            Download Statement
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{txn.date}</span>
                      <span className="text-xs text-gray-400">2024</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {txn.type === 'Payment' ? (
                        <ArrowUpRight size={16} className="text-gray-400" />
                      ) : (
                        <ArrowDownLeft size={16} className="text-emerald-500" />
                      )}
                      {txn.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{txn.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txn.status === 'Success' || txn.status === 'Completed' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200 text-emerald-600 bg-emerald-50">
                        {txn.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-red-200 text-red-600 bg-red-50">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${txn.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {txn.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
  )
}
