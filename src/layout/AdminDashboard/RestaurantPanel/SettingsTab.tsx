import { Save } from "lucide-react"

export default function SettingsTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <h2 className="text-xl font-bold text-theme-text mb-6" style={{ fontFamily: 'serif' }}>Restaurant Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-theme-text mb-2">Restaurant Name</label>
            <input type="text" defaultValue="Spicy Kitchen" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-theme-text mb-2">Email Address</label>
            <input type="email" defaultValue="contact@spicykitchen.com" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-theme-text mb-2">Phone Number</label>
            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-theme-text mb-2">Street Address</label>
            <input type="text" defaultValue="123 Flavor Street" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-theme-text mb-2">Operating Hours (Open)</label>
            <input type="time" defaultValue="09:00" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-theme-text mb-2">Operating Hours (Close)</label>
            <input type="time" defaultValue="22:00" className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

    </div>
  )
}
