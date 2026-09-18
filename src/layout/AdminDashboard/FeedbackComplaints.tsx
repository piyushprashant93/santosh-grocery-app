import { useState } from "react"
import { 
  Download, 
  Search, 
  Filter, 
  BarChart2, 
  Circle,
  Search as SearchIcon,
  CheckSquare,
  X,
  Eye
} from "lucide-react"

export default function FeedbackComplaints() {
  const [searchQuery, setSearchQuery] = useState("")

  const complaints = [
    {
      id: "COMP-001",
      orderId: "ORD-9921",
      customer: "John Doe",
      vendor: "Spicy Kitchen",
      type: "Complaint",
      category: "Late Delivery",
      description: "Order was delayed by 45 mins",
      date: "Feb 18, 2026",
      status: "Open"
    },
    {
      id: "COMP-002",
      orderId: "ORD-9856",
      customer: "Sarah Connor",
      vendor: "Fresh Mart",
      type: "Complaint",
      category: "Wrong Item",
      description: "Received incorrect items in th...",
      date: "Feb 18, 2026",
      status: "In Review"
    },
    {
      id: "COMP-003",
      orderId: "ORD-9745",
      customer: "Mike Ross",
      vendor: "Burger King Clone",
      type: "Feedback",
      category: "Excellent Service",
      description: "Amazing service! Food arrived...",
      date: "Feb 17, 2026",
      status: "Resolved"
    },
    {
      id: "COMP-004",
      orderId: "ORD-9632",
      customer: "Emily Davis",
      vendor: "Pizza Paradise",
      type: "Complaint",
      category: "Food Quality",
      description: "The pizza was undercooked a...",
      date: "Feb 17, 2026",
      status: "Investigation"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Open</span>;
      case 'In Review':
        return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">In Review</span>;
      case 'Resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Resolved</span>;
      case 'Investigation':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Investigation</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status}</span>;
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === 'Complaint') {
      return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-medium">Complaint</span>;
    }
    return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-medium">Feedback</span>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Feedback & Complaints</h1>
          <p className="text-gray-500 mt-1">Review customer feedback and resolve complaints efficiently</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Total Cases</p>
            <BarChart2 size={18} className="text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Open</p>
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">89</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">In Review</p>
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">156</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Resolved</p>
            <CheckSquare size={18} className="text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">982</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Rejected</p>
            <X size={18} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">21</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Complaint ID, Order ID, Customer, Vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 text-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Complaint ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 text-sm block max-w-[80px]">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="block max-w-[70px]">
                      {item.orderId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 text-sm">{item.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-500 text-sm">{item.vendor}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(item.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600 text-sm">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm truncate block max-w-[200px]" title={item.description}>
                      {item.description}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="block max-w-[80px]">
                      {item.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(item.status)}
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
