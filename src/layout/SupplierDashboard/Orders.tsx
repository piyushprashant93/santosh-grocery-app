import { Search, Download, Truck, PackageCheck, Clock, Box, MoreHorizontal, Filter, Package, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const stats = [
  { label: "Pending", value: 12, color: "bg-blue-100 text-blue-600", icon: Clock },
  { label: "Processing", value: 8, color: "bg-yellow-100 text-yellow-600", icon: Box },
  { label: "In Transit", value: 24, color: "bg-indigo-100 text-indigo-600", icon: Truck },
  { label: "Completed", value: 156, color: "bg-green-100 text-green-600", icon: PackageCheck }
]

export default function Orders({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/orders`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrdersData(data.data?.orders || data.orders || data.data || []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/supplier/orders/${id}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        setOpenStatusMenu(null);
      } else {
        alert("Failed to update order status");
      }
    } catch(err) { 
        console.error(err); 
        alert("An error occurred while updating order status.");
    }
  };


  const statusStyles: any = {
    Processing: "bg-yellow-100 text-yellow-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    New: "bg-purple-100 text-purple-700",
    Pending: "bg-gray-100 text-gray-600",
    Cancelled: "bg-red-100 text-red-600"
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Order Management
          </h1>

          <p className="text-[#64748B] mt-2">
            Track and fulfill bulk orders from your clients.
          </p>
        </div>

        <div className="flex gap-3">

          <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Download size={16} />
            Export
          </button>

          <button onClick={()=>setActiveTab("create-manifest")} className="bg-[#155DFC] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm ">
            <Package size={16} />
            Create Manifest
          </button>

        </div>

      </div>


      <div className="grid lg:grid-cols-4 gap-4">

        {stats.map((s, i) => {

          const Icon = s.icon

          return (

            <div key={i} className="border border-[#E5E7EB] rounded-lg lg:rounded-xl p-4 flex items-center gap-4">

              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${s.color}`}>
                <Icon size={20} />
              </div>

              <div>
                <p className="text-[#64748B]">{s.label}</p>
                <p className="text-xl font-semibold">{s.value}</p>
              </div>

            </div>

          )

        })}

      </div>


      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">

        <div className="flex gap-3 mb-6">

          <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 flex-1">
            <Search size={18} className="text-[#64748B]" />
            <input placeholder="Search by Order ID, Client, or Status..." className="w-full px-3 py-2 outline-none text-sm" />
          </div>

          <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
            <Filter size={16} />
            All Filters
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b text-[#64748B] text-sm">

              <tr>
                <th className="py-3">ORDER ID</th>
                <th className="py-3">CLIENT</th>
                <th className="py-3">DETAILS</th>
                <th className="py-3">AMOUNT</th>
                <th className="py-3">SHIPPING</th>
                <th className="py-3">STATUS</th>
                <th className="py-3 text-center">Action</th>
              </tr>

            </thead>

            <tbody>

              {ordersData.length > 0 ? ordersData.map((o, i) => (
                <tr key={o._id || i} className="border-b last:border-none">
                  <td className="py-5">

                    <div>
                      <p className="font-medium">{o.id || o.orderId || o._id?.substring(0,8)}</p>
                      <p className="text-sm text-[#64748B]">{o.date ? new Date(o.date).toLocaleDateString() : (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "")}</p>
                    </div>

                  </td>


                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <img src={o.img || o.client?.image || o.restaurant?.image || "https://picsum.photos/40?1"} className="w-10 h-10 rounded-full object-cover" />

                      <div>
                        <p className="font-medium">{o.client || o.client?.name || o.restaurant?.name || "Unknown Client"}</p>
                        <p className="text-sm text-[#64748B]">{o.type || o.client?.type || "Retailer/Restaurant"}</p>
                      </div>

                    </div>

                  </td>


                  <td className="py-5">

                    <div>
                      <p>{o.items || o.totalItems || o.items?.length || 0} Items</p>
                      <p className="text-sm text-[#64748B]">{o.weight || o.totalWeight || ""}</p>
                    </div>

                  </td>


                  <td className="py-5">

                    <div>
                      <p className="font-medium">${typeof o.amount === "number" ? o.amount.toFixed(2) : (o.total ? o.total.toFixed(2) : o.amount)}</p>
                      <p className={`text-sm ${o.payment === "Paid" || o.paymentStatus === "Paid" ? "text-green-600" : "text-orange-500"}`}>
                        {o.payment || o.paymentStatus || "Unpaid"}
                      </p>
                    </div>

                  </td>


                  <td className="py-5">

                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                      {o.shipping || o.shippingMethod || "Standard"}
                    </span>

                  </td>


                  <td className="py-5 relative">
                    <button onClick={() => setOpenStatusMenu(openStatusMenu === (o._id || i) ? null : (o._id || i))} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusStyles[o.status || "New"] || "bg-gray-100"}`}>
                      {o.status || "New"}
                      <ChevronDown size={14} />
                    </button>
                    {openStatusMenu === (o._id || i) && (
                      <div className="absolute top-12 left-6 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 w-32 py-1">
                        {["New", "Pending", "Processing", "In Transit", "Delivered", "Cancelled"].map(s => (
                          <button key={s} onClick={() => updateOrderStatus(o._id, s)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{s}</button>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="text-center">
                    <MoreHorizontal size={20} className="mx-auto cursor-pointer"/>
                  </td>

                </tr>

              )) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No orders found</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}