import { Search, Bell, Menu } from "lucide-react"
import ProfileMenu from "./ProfileMenu";

export default function RetailerHeader({ activeTab, setActiveTab, openSidebar }: { activeTab: string; setActiveTab: (tab: string) => void; openSidebar: () => void }) {
  return (
    <div className="flex items-center justify-between lg:px-8 px-4 h-[72px] bg-theme-surface border-b border-theme-border">

      <div className="cursor-pointer lg:hidden" onClick={openSidebar}>
        <Menu />
      </div>

      <div className="flex items-center justify-between sm:gap-4 gap-1 flex-1">
        <div className="relative sm:max-w-[250px] max-w-[150px] w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
          />

          <input
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F1F5F9] text-sm outline-none text-black"
          />
        </div>

        <div className="flex items-center gap-5 ">
          <button onClick={() => setActiveTab("notifications")} className=" relative w-10 min-w-10 h-10 flex items-center justify-center rounded-lg border border-theme-border">
            <Bell size={18} className="text-theme-muted" />

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <ProfileMenu setActiveTab={setActiveTab} />
        </div>




      </div>

    </div>
  )
}