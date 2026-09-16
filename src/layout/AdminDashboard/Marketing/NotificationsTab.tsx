import { Search, Filter, Send, MoreVertical, CheckCircle2, Clock } from "lucide-react"

export default function NotificationsTab() {
  const notifications = [
    {
      id: 1,
      title: "Weekend Special: 50% Off Stores!",
      message: "Shop from our exclusive weekend special stores and get flat 50% off.",
      status: "Sent",
      audience: "All Users",
      sentAt: "2024-06-15 10:00 AM",
      clicks: 3420,
    },
    {
      id: 2,
      title: "Your cart is missing you 🛒",
      message: "You left some items in your cart. Complete your purchase now!",
      status: "Sent",
      audience: "Cart Abandoners",
      sentAt: "2024-06-14 02:30 PM",
      clicks: 890,
    },
    {
      id: 3,
      title: "New Restaurant Alert: Burger King",
      message: "Burger King is now delivering to your area. Order now!",
      status: "Scheduled",
      audience: "Users in ZIP 10001",
      sentAt: "2024-06-20 12:00 PM",
      clicks: null,
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto justify-center">
          <Send size={16} />
          New Push Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Notification Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Target Audience</th>
                <th className="p-4">Time</th>
                <th className="p-4">Engagement</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 max-w-[300px]">
                    <p className="font-bold text-gray-900 truncate" title={notif.title}>{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={notif.message}>{notif.message}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {notif.status === 'Sent' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Clock size={16} className="text-blue-500" />
                      )}
                      <span className={`text-sm font-medium ${notif.status === 'Sent' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {notif.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700">{notif.audience}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900">{notif.sentAt}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{notif.clicks !== null ? `${notif.clicks} clicks` : '-'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                        <MoreVertical size={18} />
                      </button>
                    </div>
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
