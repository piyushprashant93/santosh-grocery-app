import { useState } from "react"
import { 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Eye
} from "lucide-react"

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const orders = [
    {
      id: "ORD-9921",
      date: "Feb 12, 10:30 AM",
      customer: "John Doe",
      vendor: "Spicy Kitchen",
      type: "Restaurant",
      status: "Processing",
      amount: "$45.50"
    },
    {
      id: "ORD-9922",
      date: "Feb 12, 09:15 AM",
      customer: "Sarah Connor",
      vendor: "Fresh Mart",
      type: "Retail",
      status: "Delivered",
      amount: "$120.00"
    },
    {
      id: "ORD-9923",
      date: "Feb 11, 08:45 PM",
      customer: "Mike Ross",
      vendor: "Burger King Clone",
      type: "Restaurant",
      status: "Cancelled",
      amount: "$22.00"
    },
    {
      id: "ORD-9924",
      date: "Feb 11, 04:30 PM",
      customer: "Jessica Pearson",
      vendor: "Tech Gadgets",
      type: "Retail",
      status: "Shipped",
      amount: "$899.00"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processing':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Processing</span>;
      case 'Delivered':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium">Delivered</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Cancelled</span>;
      case 'Shipped':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Shipped</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status}</span>;
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === 'Restaurant') {
      return <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium">Restaurant</span>;
    }
    return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-medium">Retail</span>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all customer orders across the platform.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
          <Download size={18} />
          Export Orders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-blue-600 font-medium text-sm">Total Orders</p>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-blue-600">85,200</h3>
        </div>

        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-orange-600 font-medium text-sm">Processing</p>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-orange-600">145</h3>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-emerald-600 font-medium text-sm">Completed</p>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-emerald-600">84,500</h3>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <p className="text-red-600 font-medium text-sm">Cancelled</p>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-red-600">555</h3>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer, or Vendor..."
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900 text-sm">
                      {order.id.split('-')[0]}-<br/>{order.id.split('-')[1]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{order.date.split(',')[0]},</span>
                      <span>{order.date.split(',')[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 text-sm">{order.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-500 text-sm">{order.vendor}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(order.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">{order.amount}</span>
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
    </div>
  )
}
