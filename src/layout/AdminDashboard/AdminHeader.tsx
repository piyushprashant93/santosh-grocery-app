import { Menu, Search, Bell } from "lucide-react"

export default function AdminHeader({
  openSidebar,
  setActiveTab
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  openSidebar: () => void
}) {
  return (
    <div className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={openSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg max-w-[400px] w-full border border-gray-100">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Global search (Users, Orders, IDs)..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition"
        >
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="hidden sm:block w-[1px] h-8 bg-gray-200"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-full transition">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-gray-800">Super Admin</span>
            <span className="text-xs text-gray-500">System Owner</span>
          </div>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
