import { useState, useEffect } from "react"
import { AlertCircle, Settings as SettingsIcon, Loader2 } from "lucide-react"
import { apiFetch } from "../../../lib/apiFetch"

export default function PaymentSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gateways, setGateways] = useState({
    stripe: true,
    paypal: false,
    razorpay: false
  })

  useEffect(() => {
    fetchGateways()
  }, [])

  const fetchGateways = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/admin/settings/payment-gateways')
      if (res.ok) {
        const json = await res.json()
        const data = json.data || {}
        setGateways({
          stripe: data.stripe?.isActive ?? true,
          paypal: data.paypal?.isActive ?? false,
          razorpay: data.razorpay?.isActive ?? false
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        stripe: { isActive: gateways.stripe },
        paypal: { isActive: gateways.paypal },
        razorpay: { isActive: gateways.razorpay }
      }
      const res = await apiFetch('/admin/settings/payment-gateways', {
        method: "PUT",
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert("Payment settings saved successfully")
      } else {
        throw new Error("Failed to save")
      }
    } catch (err) {
      console.error(err)
      alert("Error saving payment settings")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (gateway: keyof typeof gateways) => {
    setGateways(prev => ({ ...prev, [gateway]: !prev[gateway] }))
  }

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
    </label>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header Info */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-theme-text mb-2" style={{ fontFamily: 'serif' }}>Payment Gateways</h2>
            <p className="text-sm text-gray-500">Configure payment options for your platform.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-theme-text font-medium rounded-lg shadow-sm transition"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Stripe Card */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border rounded-xl transition ${gateways.stripe ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-theme-text">Stripe</h3>
                  {gateways.stripe && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Active</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Credit/Debit Cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch checked={gateways.stripe} onChange={() => handleToggle('stripe')} />
              <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                <SettingsIcon size={16} />
                Configure
              </button>
            </div>
          </div>

          {/* PayPal Card */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border rounded-xl transition ${gateways.paypal ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-[#00457C] text-white flex items-center justify-center font-bold text-xl">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-theme-text">PayPal</h3>
                  {gateways.paypal && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Active</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">PayPal Balance, Bank Transfers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch checked={gateways.paypal} onChange={() => handleToggle('paypal')} />
              <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                <SettingsIcon size={16} />
                Configure
              </button>
            </div>
          </div>

          {/* Razorpay Card */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border rounded-xl transition ${gateways.razorpay ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-[#02042B] text-white flex items-center justify-center font-bold text-xl">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-theme-text">Razorpay</h3>
                  {gateways.razorpay && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Active</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">UPI, Netbanking, Wallets (India focus)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch checked={gateways.razorpay} onChange={() => handleToggle('razorpay')} />
              <button className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                <SettingsIcon size={16} />
                Configure
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Security Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Security Notice</h4>
          <p className="text-xs text-amber-700 mt-1">
            Never share your Secret Keys or Webhook Secrets in plain text. Store them securely in your environment variables. 
            If you suspect your keys have been compromised, rotate them immediately in your gateway provider's dashboard.
          </p>
        </div>
      </div>

    </div>
  )
}
