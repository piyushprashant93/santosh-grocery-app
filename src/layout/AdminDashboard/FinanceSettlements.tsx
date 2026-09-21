import { useState, useEffect } from "react"
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
  ArrowUpRight,
  Loader2,
  Download
} from "lucide-react"
import api from "../../lib/api"

interface Settlement {
  _id: string;
  recipientName?: string;
  recipientType?: string;
  method?: string;
  createdAt: string;
  status: string;
  amount: number;
}

export default function FinanceSettlements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Settlements")
  
  // Modal states
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Data states
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingSettlementsCount: 0,
    pendingSettlementsAmount: 0,
    totalCommissions: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError("")
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get('/api/v1/admin/finance'),
        api.get('/api/v1/admin/payments').catch(err => {
          console.warn('Failed to fetch payment history', err);
          return { data: { data: [] } };
        })
      ]);
      
      const result = statsRes.data?.data || statsRes.data || {}
      const historyData = historyRes.data?.data || historyRes.data || [];
      
      setStats({
        totalRevenue: result.totalRevenue || 0,
        pendingSettlementsCount: result.pendingSettlementsCount || 0,
        pendingSettlementsAmount: result.pendingSettlementsAmount || 0,
        totalCommissions: result.totalCommissions || 0
      })

      if (Array.isArray(historyData)) {
        setSettlements(historyData);
      } else if (historyData.data && Array.isArray(historyData.data)) {
        setSettlements(historyData.data);
      } else if (Array.isArray(result.settlements)) {
        setSettlements(result.settlements)
      } else if (Array.isArray(result.payouts)) {
        setSettlements(result.payouts)
      } else {
        setSettlements([])
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch finance data")
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayouts = async () => {
    setIsProcessing(true)
    try {
      await api.post('/api/v1/admin/finance/process-payouts', {})
      // refetch after successful payout processing
      await fetchData()
      setIsPayoutModalOpen(false)
      alert("Payouts processed successfully.")
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to process payouts")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || 'Unknown').toLowerCase();
    if (s === 'completed' || s === 'paid' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200 capitalize">
          <CheckCircle2 size={14} />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200 capitalize">
        {status || 'Pending'}
      </span>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return { date: "N/A", time: "" };
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: dateStr, time: "" };
    }
  }

  const formatId = (id?: string) => {
    if (!id) return "N/A";
    const str = id.toString();
    if (str.length > 10) {
      return `SET-${str.substring(0, 4)}...`;
    }
    return `SET-${str}`;
  }

  // Filter based on search query
  const filteredSettlements = settlements.filter(s => {
    const query = searchQuery.toLowerCase();
    return (
      s._id?.toLowerCase().includes(query) ||
      s.recipientName?.toLowerCase().includes(query) ||
      s.status?.toLowerCase().includes(query)
    );
  })

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

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading finance data...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Retry</button>
        </div>
      ) : (
        <>
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
                <h3 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'serif' }}>
                  ${(stats.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </h3>
              </div>
            </div>

            {/* Pending Settlements */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between h-[160px] shadow-sm relative">
              <div className="absolute top-0 right-0 p-6">
                <span className="text-gray-400 text-sm font-medium">
                  {stats.pendingSettlementsCount} Pending
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 border border-orange-100">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm mb-1">Pending Settlements</p>
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>
                  ${(stats.pendingSettlementsAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </h3>
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
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>
                  ${(stats.totalCommissions || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </h3>
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
          {activeTab === 'Settlements' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[300px]">
            {/* Table Controls */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Partner Payouts</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{settlements.length} Total</span>
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

            {filteredSettlements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
                <p>No settlements found.</p>
              </div>
            ) : (
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
                    {filteredSettlements.map((item, index) => {
                      const { date, time } = formatDate(item.createdAt);
                      return (
                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-400 text-sm">
                              {formatId(item._id)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{item.recipientName || 'Unknown'}</span>
                              <span className="text-gray-500 text-xs capitalize">{item.recipientType || 'Partner'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.method || 'Bank Transfer'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span>{date},</span>
                              <span>{time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-gray-900 text-lg">${(item.amount || 0).toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition inline-flex">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

          {activeTab === 'Refunds' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[300px]">
              {/* Table Controls */}
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Customer Refunds</h2>
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">2 Pending Action</span>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search order or customer..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Refund ID</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer & Order</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-400 text-sm">RF-8821</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">John Doe</span>
                          <span className="text-blue-500 text-xs mt-0.5">ORD-9921</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Item missing
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>Feb 12,</span>
                          <span>2024</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 text-lg">$12.50</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-400 text-sm">RF-8822</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">Sarah Smith</span>
                          <span className="text-blue-500 text-xs mt-0.5">ORD-9925</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Food cold
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>Feb 12,</span>
                          <span>2024</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 text-lg">$24.00</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="px-4 py-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm font-medium transition">
                          Approve
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Commissions' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[300px]">
              {/* Table Controls */}
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Platform Commissions</h2>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 text-sm shadow-sm">
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Commission ID</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Partner</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Source Order</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order Value</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Fee Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-400 text-sm">COM-4421</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-sm">Spicy Kitchen</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-500 text-sm hover:underline cursor-pointer">ORD-9921</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        $125.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        15%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          Collected
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold text-emerald-600 text-lg">+$18.75</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-400 text-sm">COM-4422</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-sm">Fresh Mart</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-500 text-sm hover:underline cursor-pointer">ORD-9922</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        $85.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        10%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          Collected
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold text-emerald-600 text-lg">+$8.50</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 flex justify-between items-start border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Process Weekly Payouts</h3>
                <p className="text-sm text-gray-500 mt-1">This will initiate bank transfers for all pending settlements.</p>
              </div>
              <button 
                onClick={() => !isProcessing && setIsPayoutModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
                disabled={isProcessing}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Total Partners</span>
                <span className="text-gray-900 font-bold text-lg">{stats.pendingSettlementsCount}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 px-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-medium">Total Amount</span>
                <span className="text-emerald-600 font-bold text-2xl tracking-tight">
                  ${(stats.pendingSettlementsAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
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
                disabled={isProcessing}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcessPayouts}
                disabled={isProcessing || stats.pendingSettlementsCount === 0}
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CreditCard size={18} />
                )}
                {isProcessing ? "Processing..." : "Confirm Payouts"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
