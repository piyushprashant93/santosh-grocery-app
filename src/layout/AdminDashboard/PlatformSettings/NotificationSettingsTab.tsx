export default function NotificationSettingsTab() {
  const ToggleSwitch = ({ defaultChecked }: { defaultChecked?: boolean }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
    </label>
  );

  const events = [
    { name: 'Order Placed', desc: 'When a new order is received.', email: true, sms: true, push: true },
    { name: 'Driver Assigned', desc: 'When a driver accepts an order.', email: false, sms: true, push: true },
    { name: 'Delivery Completed', desc: 'When an order is marked delivered.', email: true, sms: false, push: true },
    { name: 'Payout Initiated', desc: 'When a vendor payout begins.', email: true, sms: false, push: false },
    { name: 'Payout Failed', desc: 'When a vendor payout fails.', email: true, sms: true, push: true },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Left Column (1 span) */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        
        {/* Channels */}
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Notification Channels</h2>
          <p className="text-sm text-gray-500 mb-6">Select how users receive updates.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Send updates via email.</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">SMS Notifications</p>
                <p className="text-xs text-gray-500">Send updates via text message.</p>
              </div>
              <ToggleSwitch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Send updates to mobile app.</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
          </div>
        </div>

        {/* Admin Alerts */}
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Admin Alerts</h2>
          <p className="text-sm text-gray-500 mb-6">Notify admin on critical events.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">System Errors</p>
                <p className="text-xs text-gray-500">Alert on critical failures.</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Large Transactions</p>
                <p className="text-xs text-gray-500">Alert on orders over $500.</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (2 spans) */}
      <div className="lg:col-span-2">
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Event Configuration</h2>
            <p className="text-sm text-gray-500">Configure notifications for specific events.</p>
          </div>
          
          <table className="w-full text-left border-collapse overflow-x-auto block sm:table">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">SMS</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap sm:whitespace-normal">
                    <p className="font-semibold text-gray-900 text-sm">{event.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{event.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ToggleSwitch defaultChecked={event.email} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ToggleSwitch defaultChecked={event.sms} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ToggleSwitch defaultChecked={event.push} />
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
