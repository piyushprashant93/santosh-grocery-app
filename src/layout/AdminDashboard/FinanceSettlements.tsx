import { useState } from "react"
import { 
  FileText, 
  CreditCard,
  Wallet,
  Clock,
  Percent,
  Search,
  Filter,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
  ArrowUpRight
} from "lucide-react"

export default function FinanceSettlements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Settlements")
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)

  const settlements = [
    {
      id: "SET-1023",
      recipient: "Spicy Kitchen",
      type: "Restaurant",
      method: "Bank Transfer",
      date: "Feb 12, 2024",
      status: "Pending",
      amount: "$1,240.50"
    },
    {
      id: "SET-1022",
      recipient: "Fresh Mart",
      type: "Retailer",
      method: "PayPal",
      date: "Feb 11, 2024",
      status: "Completed",
      amount: "$850.00"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
          <CheckCircle2 size={14} />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
        Pending
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Finance & Settlements</h1>
          <p className="text-gray-500 mt-1">Manage partner payouts, refunds, and financial reporting.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
            <FileText size={18} />
            Download Reports
          </button>
          <button 
            onClick={() => setIsPayoutModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
          >
            <CreditCard size={18} />
            Process Payouts
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#1a2332] rounded-2xl p-6 flex flex-col justify-between h-[160px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              +12% <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#233044] text-emerald-400 flex items-center justify-center mb-4">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-gray-400 font-medium text-sm mb-1">Total Revenue (YTD)</p>
            <h3 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'serif' }}>$425,000.00</h3>
          </div>
        </div>

        {/* Pending Settlements */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between h-[160px] shadow-sm relative">
          <div className="absolute top-0 right-0 p-6">
            <span className="text-gray-400 text-sm font-medium">
              4 Pending
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 border border-orange-100">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Pending Settlements</p>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>$12,450.00</h3>
          </div>
        </div>

        {/* Total Commissions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between h-[160px] shadow-sm relative">
          <div className="absolute top-0 right-0 p-6">
            <span className="text-emerald-500 text-sm font-medium">
              +5%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-100">
            <Percent size={20} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Total Commissions</p>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>$48,200.00</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-px">
        {['Settlements', 'Refunds', 'Commissions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab
                ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900 relative translate-y-px'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-l border-r border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Partner Payouts</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">124 Total</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 text-sm"
              />
            </div>
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 text-sm shrink-0">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Settlement ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {settlements.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-400 text-sm">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{item.recipient}</span>
                      <span className="text-gray-500 text-xs">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{item.date.split(',')[0]},</span>
                      <span>{item.date.split(',')[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900 text-lg">{item.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition inline-flex">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 flex justify-between items-start border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Process Weekly Payouts</h3>
                <p className="text-sm text-gray-500 mt-1">This will initiate bank transfers for all pending settlements.</p>
              </div>
              <button 
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Total Partners</span>
                <span className="text-gray-900 font-bold text-lg">4</span>
              </div>
              
              <div className="flex justify-between items-center py-4 px-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-medium">Total Amount</span>
                <span className="text-emerald-600 font-bold text-2xl tracking-tight">$12,450.00</span>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-orange-700 items-start">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Transactions cannot be reversed once initiated. Please verify the amount before proceeding.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsPayoutModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // process payouts
                  setIsPayoutModalOpen(false)
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
              >
                <CreditCard size={18} />
                Confirm Payouts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
