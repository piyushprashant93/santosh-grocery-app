import { Search, Filter, Download, Eye, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import EmptyTableState from "../../components/common/EmptyTableState"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function Orders() {

  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/orders`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (payload.orders || []));
        setOrdersData(Array.isArray(arr) ? arr : []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/retailer/orders/${id}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        setOpenStatusMenu(null);
      } else {
        toast.error("Failed to update order status");
      }
    } catch(err) { 
        console.error(err); 
        toast.error("An error occurred while updating order status.");
    }
  };

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Exporting orders...");
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE}/retailer/orders/export`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `retailer-orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Export successful", { id: toastId });
      } else {
        toast.error("Export failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  const statusStyles: any = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Orders
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Track and manage customer orders.
          </p>
        </div>

      </div>


      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[340px]">
            <Search size={18} className="text-theme-muted" />
            <input
              placeholder="Search by Order ID or Customer..."
              className="w-full px-3 py-2 outline-none text-sm"
            />
          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 shadow-sm bg-theme-surface">
              <Filter size={16} />
              Status: All
            </button>

            <button onClick={handleExport} className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 shadow-sm bg-theme-surface">
              <Download size={16} />
              Export CSV
            </button>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b text-theme-muted text-sm">

              <tr>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  ORDER ID
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  CUSTOMER
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  DATE
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  TOTAL
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  PAYMENT
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  DELIVERY STATUS
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E] text-center">
                  ACTION
                </th>

              </tr>

            </thead>

            <tbody>

              {ordersData.map((o, i) => (
                <tr key={o._id || i} className="border-b last:border-none">

                  <td className="py-6 font-medium text-theme-text">
                    {o.id || o.orderId || o._id?.substring(0, 8)}
                  </td>
                  <td className="py-6">
                    <div>
                      <p className="text-theme-text font-medium">
                        {(typeof o.name === 'string' && o.name) || (typeof o.customer === 'object' && o.customer !== null ? (o.customer.name || o.customer.fullName || `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim()) : o.customer) || "Unknown"}
                      </p>
                      <p className="text-sm text-theme-muted">
                        {o.email || o.customer?.email || "Unknown"}
                      </p>
                    </div>
                  </td>

                  <td className="py-6 text-[#374151]">
                    <p>{o.date ? new Date(o.date).toLocaleDateString() : o.date}</p>
                    <p className="text-sm text-theme-muted">at {o.time || (o.date ? new Date(o.date).toLocaleTimeString() : "")}</p>
                  </td>
                  <td className="py-6 font-medium text-theme-text">
                    ${typeof o.total === "number" ? o.total.toFixed(2) : o.total}
                  </td>
                  <td className="py-6 text-[#374151]">
                    {o.payment || o.paymentStatus || "Paid"} <br /> {o.paymentmethod || o.paymentMethod || ""}
                  </td>

                  <td className="py-6 relative">
                    <button onClick={() => setOpenStatusMenu(openStatusMenu === (o._id || i) ? null : (o._id || i))} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusStyles[o.status || "Pending"] || "bg-gray-100"}`}>
                      {o.status || "Pending"}
                      <ChevronDown size={14} />
                    </button>
                    {openStatusMenu === (o._id || i) && (
                      <div className="absolute top-12 left-6 bg-theme-surface border border-theme-border rounded-lg shadow-lg z-10 w-32 py-1">
                        {["Pending", "Processing", "Delivered", "Cancelled"].map(s => (
                          <button key={s} onClick={() => updateOrderStatus(o._id, s)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{s}</button>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="py-6 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye size={18} className="text-theme-muted" />
                    </button>
                  </td>

                </tr>

              ))}
              
              {ordersData.length === 0 && (
                <EmptyTableState colSpan={7} message="No orders found." />
              )}

            </tbody>

          </table>

        </div>


        <div className="flex items-center justify-between mt-6 text-sm text-theme-muted">

          <p>
            Showing 4 of 124 orders
          </p>

          <div className="flex gap-3">

            <button className="border border-theme-border px-4 py-1.5 rounded-lg bg-gray-100">
              Previous
            </button>

            <button className="border border-theme-border px-4 py-1.5 rounded-lg bg-theme-surface">
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}