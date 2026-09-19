import { Search, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import EmptyTableState from "../../components/common/EmptyTableState"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const coupons = [
  {
    code: "SUMMER20",
    discount: "20%",
    type: "Percentage",
    valid: "Oct 31, 2023",
    usage: 45,
    status: "Active"
  },
  {
    code: "WELCOME10",
    discount: "10%",
    type: "Percentage",
    valid: "Dec 31, 2023",
    usage: 120,
    status: "Active"
  },
  {
    code: "FLAT50",
    discount: "$50",
    type: "Fixed Amount",
    valid: "Sep 30, 2023",
    usage: 89,
    status: "Expired"
  },
  {
    code: "FREESHIP",
    discount: "Free Shipping",
    type: "Shipping",
    valid: "Nov 15, 2023",
    usage: 12,
    status: "Active"
  }
]

const statusStyles: any = {
  Active: "bg-green-100 text-green-700",
  Expired: "bg-gray-200 text-gray-600"
}

export default function OffersCoupons({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [offersData, setOffersData] = useState<any[]>([]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/offers`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (payload.offers || []));
        setOffersData(Array.isArray(arr) ? arr : []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const deleteOffer = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/retailer/offers/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) {
        fetchOffers();
        setOpenIndex(null);
      }
    } catch(err) { console.error(err); }
  };
  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Offers & Coupons
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Create and manage discount codes for your customers.
          </p>
        </div>

        <button onClick={() => setActiveTab("createoffer")} className="bg-[#F54900] text-white rounded-lg px-5 py-2.5 shadow-sm">
          + Create New Offer
        </button>

      </div>



      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[320px]">
            <Search size={18} className="text-theme-muted" />
            <input
              placeholder="Search coupons..."
              className="w-full px-3 py-2 outline-none text-sm"
            />
          </div>

          <button className="border border-theme-border bg-theme-surface px-4 py-2 rounded-lg shadow-sm">
            Active Only
          </button>

        </div>



        <div className="">

          <table className="w-full text-left">

            <thead className="border-b text-theme-muted text-sm">

              <tr>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  COUPON CODE
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  DISCOUNT
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  TYPE
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  VALID UNTIL
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  USAGE
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  STATUS
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E] text-center">
                  ACTIONS
                </th>

              </tr>

            </thead>



            <tbody>

              {offersData.length > 0 ? offersData.map((c, i) => (
                <tr key={c._id || i} className="border-b last:border-none">

                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <span className="px-3 py-1.5 rounded-md bg-orange-50 text-[#F54900] text-sm border border-[#FFD6A7] font-medium">
                        {c.code}
                      </span>

                      <Copy size={16} className="text-theme-muted cursor-pointer" />

                    </div>

                  </td>

                  <td className="py-5 font-semibold text-theme-text">
                    {c.discount || c.discountValue || c.value}
                  </td>
                  <td className="py-5 text-[#374151]">
                    {c.type || c.discountType}
                  </td>
                  <td className="py-5 text-[#374151]">
                    {c.valid || (c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "") || (c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "")}
                  </td>
                  <td className="py-5 text-theme-text">
                    {c.usage || c.usageCount || 0}
                  </td>

                  <td className="py-5">

                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[c.status || "Active"] || "bg-gray-100"}`}>
                      {c.status || "Active"}
                    </span>

                  </td>

                  <td className="py-5 text-center relative">

                    <button onClick={() =>
                      setOpenIndex(openIndex === (c._id || i) ? null : (c._id || i))
                    } className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                    {openIndex === (c._id || i) && (
                      <div className="absolute bottom-12 right-10 mt-2 w-[180px] bg-theme-surface rounded-xl shadow-lg border border-theme-border overflow-hidden z-50">

                        <button
                          onClick={() => setOpenIndex(null)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-[#334155]"
                        >
                          <Pencil size={18} />
                          Edit Details
                        </button>

                        <button
                          onClick={() => deleteOffer(c._id)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 text-red-600"
                        >
                          <Trash2 size={18} />
                          Deactivate
                        </button>

                      </div>
                    )}

                  </td>

                </tr>

              )) : null}

              {offersData.length === 0 && (
                <EmptyTableState colSpan={7} message="No offers found." />
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}