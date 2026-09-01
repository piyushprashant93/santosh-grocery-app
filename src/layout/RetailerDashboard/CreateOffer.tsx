import { useState } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function CreateOffer({ setActiveTab }: { setActiveTab: (tab: string) => void }) {

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    validFrom: "",
    validUntil: "",
    usageLimit: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/offers`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Offer created successfully!");
        setActiveTab("offers");
      } else {
        alert("Failed to create offer");
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div>

      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Create New Offer
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Set up a new discount for your products.
          </p>
        </div>

        <button onClick={() => setActiveTab("offers")} className="px-5 py-2 bg-[#FACC15] rounded-lg text-[#1F2937] font-medium">
          Cancel
        </button>

      </div>



      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="text-[#374151] font-medium">
              Coupon Code
            </label>

            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="E.G. SUMMERSALE"
              className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
            />

            <p className="text-[#6A7282] text-sm mt-2">
              Customers will enter this code at checkout.
            </p>
          </div>



          <div>
            <label className="text-[#374151] font-medium">
              Discount Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
            >
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount</option>
              <option value="shipping">Free Shipping</option>
            </select>
          </div>



          <div>
            <label className="text-[#374151] font-medium">
              Discount Value
            </label>

            <div className="relative mt-2">
              <input
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="20"
                className="w-full border border-[#E5E7EB] outline-none rounded-lg px-4 py-3 pr-10"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                %
              </span>
            </div>
          </div>



          <div>
            <label className="text-[#374151] font-medium">
              Minimum Purchase Amount
            </label>

            <input
              name="minPurchase"
              value={form.minPurchase}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
            />
          </div>



          <div>
            <label className="text-[#374151] font-medium">
              Valid From
            </label>

            <input
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
            />
          </div>



          <div>
            <label className="text-[#374151] font-medium">
              Valid Until
            </label>

            <input
              type="date"
              name="validUntil"
              value={form.validUntil}
              onChange={handleChange}
              className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
            />
          </div>

        </div>



        <div className="mt-6">
          <label className="text-[#374151] font-medium">
            Usage Limit
          </label>

          <input
            name="usageLimit"
            value={form.usageLimit}
            onChange={handleChange}
            placeholder="Total number of times this coupon can be used"
            className="w-full mt-2 border border-[#E5E7EB] outline-none rounded-lg px-4 py-3"
          />
        </div>



        <div className="border-t mt-8 pt-6 flex justify-end gap-3">

          <button onClick={() => setActiveTab("offers")} className="px-5 py-2 border border-[#E5E7EB] rounded-lg bg-white">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#F54900] text-white rounded-lg"
          >
            Create Offer
          </button>

        </div>

      </div>

    </div>
  )
}