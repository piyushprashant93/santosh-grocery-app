import { useState } from "react"

export default function NotificationSettings({ prefs, onChange }: { prefs?: any, onChange?: (p: any) => void }) {

  const toggles = prefs || {
    newOrder: { email: true, sms: false },
    orderCancelled: { email: true, sms: false },
    payoutProcessed: { email: true, sms: true }
  };

  const toggle = (key: string) => {
    if (onChange) {
      onChange({
        ...toggles,
        [key]: {
          ...toggles[key],
          email: !toggles[key]?.email
        }
      });
    }
  }

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-12 p-0.5 flex items-center rounded-full transition ${
        active ? "bg-[#F54900] justify-end" : "bg-[#CBD5E1] justify-start"
      }`}
    >
      <span className="w-5 h-5 bg-white rounded-full shadow" />
    </button>
  )

  return (
    <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

      <div className="mb-8">
        <h3 className="font-playfair text-2xl">
          Notification Preferences
        </h3>

        <p className="text-[#6A7282] mt-1">
          Choose how you want to be notified.
        </p>
      </div>



      <p className="text-[#64748B] tracking-widest text-sm mb-4">
        ORDER ALERTS
      </p>



      <div className="space-y-6">

        <div className="flex items-center justify-between pb-6 border-b">

          <div>
            <p className="text-lg font-medium text-[#111827]">
              New Order Received
            </p>

            <p className="text-[#6A7282] text-sm">
              Get notified when a customer places an order.
            </p>
          </div>

          <Toggle
            active={toggles.newOrder?.email}
            onClick={() => toggle("newOrder")}
          />

        </div>



        <div className="flex items-center justify-between pb-6 border-b">

          <div>
            <p className="text-lg font-medium text-[#111827]">
              Order Cancelled
            </p>

            <p className="text-[#6A7282] text-sm">
              Get notified when a customer cancels an order.
            </p>
          </div>

          <Toggle
            active={toggles.orderCancelled?.email}
            onClick={() => toggle("orderCancelled")}
          />

        </div>

      </div>



      <p className="text-[#64748B] tracking-widest text-sm mt-10 mb-4">
        FINANCIAL ALERTS
      </p>



      <div className="flex items-center justify-between">

        <div>
          <p className="text-lg font-medium text-[#111827]">
            Payout Processed
          </p>

          <p className="text-[#6A7282] text-sm">
            Get notified when funds are sent to your account.
          </p>
        </div>

          <Toggle
            active={toggles.payoutProcessed?.email}
            onClick={() => toggle("payoutProcessed")}
          />

      </div>

    </div>
  )
}