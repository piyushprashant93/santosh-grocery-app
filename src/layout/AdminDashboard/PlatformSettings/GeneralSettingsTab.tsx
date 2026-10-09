import { useState, useEffect, useRef } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
import { apiFetch } from "../../../lib/apiFetch"

export default function GeneralSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState({
    platformName: "HubNepa",
    supportEmail: "support@hubnepa.com",
    timeZone: "(UTC -05:00) Eastern Time",
    currency: "USD - US Dollar",
    country: "United States",
    city: "New York",
    address: "123 Main St, New York, NY 10001",
    status: "Active",
    maintenanceMessage: "",
    logoUrl: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiFetch('/admin/settings/general')
      if (res.ok) {
        const json = await res.json()
        const data = json.data || {}
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch general settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await apiFetch('/admin/settings/general', {
        method: 'PUT',
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error("Failed to save settings")
      alert("Settings saved successfully")
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("logo", file)

    try {
      // Mock upload endpoint
      const res = await apiFetch('/admin/settings/general/logo', {
        method: "POST",
        body: formData
      }) // Using FormData
      if (res.ok) {
        const json = await res.json()
        setSettings(prev => ({ ...prev, logoUrl: json.data?.logoUrl || URL.createObjectURL(file) }))
      }
    } catch (err) {
      console.error(err)
      // fallback for UI
      setSettings(prev => ({ ...prev, logoUrl: URL.createObjectURL(file) }))
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          
          {/* Platform Details */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-2" style={{ fontFamily: 'serif' }}>Platform Details</h2>
            <p className="text-sm text-gray-500 mb-6">Configure core details for your app.</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div 
                  className="w-20 h-20 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 relative overflow-hidden group cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud size={24} />
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-theme-text">Upload Logo</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 256x256px.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={e => handleChange('platformName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Support Email</label>
                <input 
                  type="email" 
                  value={settings.supportEmail}
                  onChange={e => handleChange('supportEmail', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-2" style={{ fontFamily: 'serif' }}>Localization</h2>
            <p className="text-sm text-gray-500 mb-6">Set time zones and formats.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Time Zone</label>
                <select 
                  value={settings.timeZone}
                  onChange={e => handleChange('timeZone', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                >
                  <option>(UTC -05:00) Eastern Time</option>
                  <option>(UTC -08:00) Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Default Currency</label>
                <select 
                  value={settings.currency}
                  onChange={e => handleChange('currency', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                >
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
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-2" style={{ fontFamily: 'serif' }}>Global Information</h2>
            <p className="text-sm text-gray-500 mb-6">Location details for the platform.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-theme-text mb-2">Country</label>
                  <select 
                    value={settings.country}
                    onChange={e => handleChange('country', e.target.value)}
                    className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-text mb-2">City</label>
                  <input 
                    type="text" 
                    value={settings.city}
                    onChange={e => handleChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Address</label>
                <textarea 
                  rows={3} 
                  value={settings.address}
                  onChange={e => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-theme-text mb-2" style={{ fontFamily: 'serif' }}>Platform Status</h2>
            <p className="text-sm text-gray-500 mb-6">Manage operational status of the platform.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Status</label>
                <select 
                  value={settings.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                >
                  <option>Active</option>
                  <option>Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Maintenance Message (Optional)</label>
                <textarea 
                  rows={3} 
                  value={settings.maintenanceMessage}
                  onChange={e => handleChange('maintenanceMessage', e.target.value)}
                  placeholder="We'll be right back..." 
                  className="w-full px-4 py-2.5 bg-theme-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition shadow-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 pt-6 mt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Save All Changes
        </button>
      </div>
    </div>
  )
}
