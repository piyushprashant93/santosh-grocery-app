import { UploadCloud } from "lucide-react"

export default function GeneralSettingsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        
        {/* Platform Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Platform Details</h2>
          <p className="text-sm text-gray-500 mb-6">Configure core details for your app.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 relative overflow-hidden group cursor-pointer hover:bg-gray-100 transition">
                <UploadCloud size={24} />
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Upload Logo</p>
                <p className="text-xs text-gray-500 mt-1">Recommended size: 256x256px.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Name</label>
              <input type="text" defaultValue="HubNepa" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
              <input type="email" defaultValue="support@hubnepa.com" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Localization</h2>
          <p className="text-sm text-gray-500 mb-6">Set time zones and formats.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Time Zone</label>
              <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm">
                <option>(UTC -05:00) Eastern Time</option>
                <option>(UTC -08:00) Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Default Currency</label>
              <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        
        {/* Global Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Global Information</h2>
          <p className="text-sm text-gray-500 mb-6">Location details for the platform.</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
                <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm">
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                <input type="text" defaultValue="New York" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
              <textarea rows={3} defaultValue="123 Main St, New York, NY 10001" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Platform Status</h2>
          <p className="text-sm text-gray-500 mb-6">Manage operational status of the platform.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm">
                <option>Active</option>
                <option>Under Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Maintenance Message (Optional)</label>
              <textarea rows={3} placeholder="We'll be right back..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
