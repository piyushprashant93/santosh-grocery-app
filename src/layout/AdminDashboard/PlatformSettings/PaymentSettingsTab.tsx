import { AlertCircle, Settings as SettingsIcon } from "lucide-react"

export default function PaymentSettingsTab() {
  const ToggleSwitch = ({ defaultChecked }: { defaultChecked?: boolean }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
    </label>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Payment Gateways</h2>
        <p className="text-sm text-gray-500 mb-6">Configure payment options for your platform.</p>

        <div className="space-y-4">
          
          {/* Stripe Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-xl bg-gray-50/50">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">Stripe</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Default</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Credit/Debit Cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch defaultChecked />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                <SettingsIcon size={16} />
                Configure
              </button>
            </div>
          </div>

          {/* PayPal Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-[#00457C] text-white flex items-center justify-center font-bold text-xl">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">PayPal</h3>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">PayPal Balance, Bank Transfers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                <SettingsIcon size={16} />
                Configure
              </button>
            </div>
          </div>

          {/* Razorpay Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-lg bg-[#02042B] text-white flex items-center justify-center font-bold text-xl">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">Razorpay</h3>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">UPI, Netbanking, Wallets (India focus)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <ToggleSwitch />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
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
