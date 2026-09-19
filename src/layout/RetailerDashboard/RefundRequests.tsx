import { Search, Filter, MoreHorizontal, XCircle, CheckCircle2, Eye } from "lucide-react"
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
const refunds = [
  {
    refundId: "REF-3321",
    orderId: "ORD-7349",
    customer: "Emily Davis",
    reason: "Damaged Item",
    amount: "$67.25",
    status: "Pending"
  },
  {
    refundId: "REF-3320",
    orderId: "ORD-7312",
    customer: "John Smith",
    reason: "Late Delivery",
    amount: "$15.50",
    status: "Approved"
  },
  {
    refundId: "REF-3319",
    orderId: "ORD-7290",
    customer: "Mike Johnson",
    reason: "Change of Mind",
    amount: "$32.00",
    status: "Rejected"
  }
]

const statusStyles: any = {
  Pending: "bg-yellow-100 text-yellow-700 border border-[#FFF085]",
  Approved: "bg-green-100 text-green-700 border border-[#A4F4CF]",
  Rejected: "bg-red-100 text-red-600 border border-[#FFC9C9]"
}

export default function RefundRequests() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [refundsData, setRefundsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchRefunds = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/refunds`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (payload.refunds || []));
        setRefundsData(Array.isArray(arr) ? arr : []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const filteredRefunds = refundsData.filter(r => {
    const rId = r.refundId || r._id || "";
    const oId = r.orderId || r.order?.id || r.order?._id || "";
    
    const matchesSearch = 
      rId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      oId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || (r.status || "Pending") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateRefundStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/retailer/refunds/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRefunds();
        setOpenIndex(null);
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
          Refund Requests
        </h1>

        <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
          Manage and process customer refund claims.
        </p>
      </div>



      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[320px]">
            <Search size={18} className="text-theme-muted" />
            <input
              placeholder="Search by Refund ID or Order ID..."
              className="w-full px-3 py-2 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="border border-theme-border rounded-lg px-4 py-2 bg-theme-surface shadow-sm text-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>



        <div className="">

          <table className="w-full text-left">

            <thead className="border-b text-theme-muted text-sm">

              <tr>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  REFUND ID
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  ORDER ID
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  CUSTOMER
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  REASON
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  AMOUNT
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

              {filteredRefunds.length > 0 ? filteredRefunds.map((r, i) => (
                <tr key={r._id || i} className="border-b last:border-none">

                  <td className="py-5 font-medium text-theme-text">
                    {r.refundId || r._id?.substring(0, 8)}
                  </td>
                  <td className="py-5 text-[#62748E]">
                    {r.orderId || r.order?.id || r.order?._id?.substring(0, 8)}
                  </td>
                  <td className="py-5 text-[#374151]">
                    {r.customer || r.order?.customer?.name || "Unknown"}
                  </td>
                  <td className="py-5 text-[#374151]">
                    {r.reason}
                  </td>
                  <td className="py-5 font-medium">
                    ${typeof r.amount === "number" ? r.amount.toFixed(2) : r.amount}
                  </td>

                  <td className="py-5">

                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[r.status || "Pending"] || "bg-gray-100"}`}>
                      {r.status || "Pending"}
                    </span>

                  </td>

                  <td className="py-5 text-center relative">

                    <button onClick={() =>
                      setOpenIndex(openIndex === (r._id || i) ? null : (r._id || i))
                    } className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                    {openIndex === (r._id || i) && (
                      <div className="absolute bottom-12 right-10 mt-2 w-[180px] bg-theme-surface rounded-xl shadow-lg border border-theme-border overflow-hidden z-50">

                        <button
                          onClick={() => setOpenIndex(null)}
                          className="flex items-center gap-3 text-sm w-full px-4 py-3 text-left hover:bg-gray-50 text-[#334155]"
                        >
                          <Eye size={18} />
                          View Details
                        </button>
                        <button
                          onClick={() => updateRefundStatus(r._id, "Approved")}
                          className="flex items-center gap-3 text-sm w-full px-4 py-3 text-left hover:bg-green-50 text-green-600"
                        >
                          <CheckCircle2 size={18} />
                          Approve Refund
                        </button>

                        <button
                          onClick={() => updateRefundStatus(r._id, "Rejected")}
                          className="flex items-center gap-3 text-sm w-full px-4 py-3 text-left hover:bg-red-50 text-red-600"
                        >
                          <XCircle size={18} />
                          Reject Refund
                        </button>

                      </div>
                    )}
                  </td>

                </tr>

              )) : null}
              
              {filteredRefunds.length === 0 && (
                <EmptyTableState colSpan={6} message="No refund requests found." />
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}