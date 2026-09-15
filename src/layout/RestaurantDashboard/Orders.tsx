import { Search, Download, Clock, MoreHorizontal, Filter, ChevronDown, Calendar, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};



const statusStyles: any = {
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  Refunded: "bg-orange-100 text-orange-600"
}

export default function Orders({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [tab, setTab] = useState("live");
  const [openStatus, setOpenStatus] = useState(false)
  const [openDate, setOpenDate] = useState(false)
  const [status, setStatus] = useState("All Status")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [types, setTypes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [historyOrders, setHistoryOrders] = useState<any[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [historyLoading, setHistoryLoading] = useState(false)

  const toggleType = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type))
    } else {
      setTypes([...types, type])
    }
  }
  const [newOrders, setNewOrders] = useState<any[]>([])
  const [cooking, setCooking] = useState<any[]>([])
  const [ready, setReady] = useState<any[]>([])

  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, status: string, callback?: () => void) => {
    if (!orderId) {
      toast.error("Invalid Order ID");
      return;
    }
    setLoadingOrderId(orderId);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        if (callback) callback();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const acceptOrder = (order: any, index: number) => {
    updateOrderStatus(order._id || order.id || order.orderId, "preparing", () => {
      setNewOrders(prev => prev.filter((_, i) => i !== index))
      setCooking(prev => [...prev, { ...order, status: "preparing" }])
    });
  }

  const [acceptingAll, setAcceptingAll] = useState(false);

  const acceptAllOrders = async () => {
    setAcceptingAll(true);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/orders/accept-all`, {
        method: "PUT",
        headers: authHeaders()
      });
      if (res.ok) {
        toast.success("All new orders accepted");
        setCooking(prev => [...prev, ...newOrders.map(o => ({ ...o, status: "preparing" }))])
        setNewOrders([])
      } else {
        toast.error("Failed to accept all orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setAcceptingAll(false);
    }
  }

  const markReady = (order: any, index: number) => {
    updateOrderStatus(order._id || order.id || order.orderId, "ready", () => {
      setCooking(prev => prev.filter((_, i) => i !== index))
      setReady(prev => [...prev, { ...order, status: "ready" }])
    });
  }

  const completeOrder = (order: any, index: number) => {
    updateOrderStatus(order._id || order.id || order.orderId, "delivered", () => {
      setReady(prev => prev.filter((_, i) => i !== index))
    });
  }

  const fetchLiveOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/orders/live`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const live = data.data?.orders || data.orders || data.data || [];
        setNewOrders(live.filter((o: any) => o.status === "pending" || o.status === "New" || o.status === "confirmed"));
        setCooking(live.filter((o: any) => o.status === "cooking" || o.status === "Cooking" || o.status === "preparing"));
        setReady(live.filter((o: any) => o.status === "ready" || o.status === "Ready"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistoryOrders = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (status && status !== "All Status") queryParams.append("status", status.toLowerCase());
      if (start) queryParams.append("dateFrom", start);
      if (end) queryParams.append("dateTo", end);
      if (searchQuery) queryParams.append("search", searchQuery);
      if (types.length > 0) queryParams.append("type", types.join(","));

      const res = await fetch(`${API_BASE}/restaurant-panel/orders/history?${queryParams.toString()}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const historyList = data.data?.orders || data.orders || [];
        setHistoryOrders(historyList);
        setHistoryTotal(data.data?.total || data.total || 0);
      }
    } catch (err) {
      console.error(err);
      setHistoryOrders([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  useEffect(() => {
    if (tab === "history") {
      const delayDebounceFn = setTimeout(() => {
        fetchHistoryOrders(historyPage);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [tab, historyPage, status, start, end, searchQuery]);

  const Card = ({ order, action, actionLabel, color, isLoading }: { order: any, action?: () => void, actionLabel?: string, color?: string, isLoading?: boolean }) => (
    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm">

      <div className="flex justify-between items-start">

        <h3 className="font-playfair text-lg">{order.id || order._id || `#ORD-8800`}</h3>

        <MoreHorizontal size={18} className="text-[#94A3B8]" />

      </div>

      <p className="text-sm text-[#64748B] flex items-center gap-2 mt-1">
        <Clock size={14} />
        {order.time || "Just now"} • {order.type || "Pickup"}
      </p>

      <p className="font-medium text-[#0F172A] mt-4">
        {order.name || order.customer || "Walk-in Customer"}
      </p>

      <ul className="mt-3 space-y-1 text-[#64748B]">

        {Array.isArray(order.items) ? order.items.map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
            {item}
          </li>
        )) : typeof order.items === 'string' ? order.items.split(',').map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
            {item.trim()}
          </li>
        )) : null}

      </ul>

      <div className="flex justify-between items-center mt-5">

        <p className="font-semibold text-lg">
          {order.price || order.total || "$0.00"}
        </p>

        {action && (
          <button
            onClick={action}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${color} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {actionLabel}
          </button>
        )}

      </div>

    </div>
  )

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (status && status !== "All Status") queryParams.append("status", status.toLowerCase());
      if (start) queryParams.append("dateFrom", start);
      if (end) queryParams.append("dateTo", end);
      if (searchQuery) queryParams.append("search", searchQuery);
      if (types.length > 0) queryParams.append("type", types.join(","));

      const res = await fetch(`${API_BASE}/restaurant-panel/orders/history/export?${queryParams.toString()}`, { 
        headers: authHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Export successful!");
      } else {
        toast.error("Failed to export orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error exporting orders");
    }
  };

  const handleViewReceipt = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/orders/${encodeURIComponent(id)}/invoice?download=true`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to download receipt");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error downloading receipt");
    }
  };

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Order Management
          </h1>

          <p className="text-[#64748B] mt-2">
            Track and manage your restaurant orders in real-time.
          </p>
        </div>

        <div className="flex gap-3">
          {
            tab === "live" ? <>
              <div className="relative">

                <button onClick={() => setOpenFilter(prev => !prev)} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                  <Filter size={16} />
                  Filter
                </button>
                {openFilter && (<>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpenFilter(false)}></div>
                  <div
                    className="absolute right-0 top-12 z-50"
                    onClick={() => setOpenFilter(false)}
                  >

                    <div
                      className="bg-white w-[320px] rounded-xl p-6 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >

                      <h3 className="font-playfair text-xl mb-6">
                        Filter Orders
                      </h3>


                      <p className="text-sm text-[#64748B] mb-3 tracking-wider">
                        ORDER TYPE
                      </p>


                      <div className="space-y-3">

                        {["Delivery", "Pickup", "Dine-in"].map(type => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer">

                            <input
                              type="checkbox"
                              checked={types.includes(type)}
                              onChange={() => toggleType(type)}
                              className="w-5 h-5 rounded border-[#CBD5E1] accent-[#009966]"
                            />

                            <span className="text-lg">
                              {type}
                            </span>

                          </label>
                        ))}

                      </div>


                      <div className="flex items-center justify-between mt-8">

                        <button
                          onClick={() => setTypes([])}
                          className="text-[#64748B]"
                        >
                          Clear
                        </button>

                        <button
                          onClick={() => setOpenFilter(false)}
                          className="bg-[#059669] text-white px-5 py-2 rounded-lg shadow"
                        >
                          Apply
                        </button>

                      </div>

                    </div>

                  </div>
                </>


                )}
              </div>

              <button onClick={acceptAllOrders} disabled={acceptingAll} className={`bg-[#009966] text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow-sm ${acceptingAll ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {acceptingAll && <Loader2 size={16} className="animate-spin" />}
                Accept All New
              </button>

            </> : <>
              <button onClick={handleExport} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-gray-50">
                <Download size={16} />
                Export History
              </button>
            </>
          }


        </div>

      </div>


      <div>

        <div className="flex gap-3 mb-6 bg-[#F1F5F9] p-1 rounded-lg w-fit">

          <button
            onClick={() => setTab("live")}
            className={`px-4 py-2 rounded-lg ${tab === "live"
              ? "bg-white shadow text-[#0F172A]"
              : "text-[#64748B]"
              }`}
          >
            Live Orders
          </button>

          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 rounded-lg ${tab === "history"
              ? "bg-white shadow text-[#0F172A]"
              : "text-[#64748B]"
              }`}
          >
            Order History
          </button>

        </div>



        {tab === "live" && (
          <div className="grid lg:grid-cols-3 gap-6">

            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4">

              <h3 className="font-playfair text-lg mb-4 text-[#1E40AF]">
                ● New Orders ({newOrders.length})
              </h3>

              <div className="space-y-4">

                {newOrders.map((o, i) => (
                  <Card
                    key={i}
                    order={o}
                    action={() => acceptOrder(o, i)}
                    actionLabel="Accept Order"
                    color="bg-[#2563EB]"
                    isLoading={loadingOrderId === ((o as any)._id || o.id)}
                  />
                ))}

              </div>

            </div>



            <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4">

              <h3 className="font-playfair text-lg mb-4 text-[#C2410C]">
                ● Cooking ({cooking.length})
              </h3>

              <div className="space-y-4">

                {cooking.map((o, i) => (
                  <Card
                    key={i}
                    order={o}
                    action={() => markReady(o, i)}
                    actionLabel="Mark Ready"
                    color="bg-[#EA580C]"
                    isLoading={loadingOrderId === ((o as any)._id || o.id)}
                  />
                ))}

              </div>

            </div>



            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">

              <h3 className="font-playfair text-lg mb-4 text-[#15803D]">
                ● Ready for Pickup ({ready.length})
              </h3>

              <div className="space-y-4">

                {ready.map((o, i) => (
                  <Card
                    key={i}
                    order={o}
                    action={() => completeOrder(o, i)}
                    actionLabel="Complete"
                    color="bg-[#16A34A]"
                    isLoading={loadingOrderId === ((o as any)._id || o.id)}
                  />
                ))}

              </div>

            </div>

          </div>
        )}

        {tab === "history" && (
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl overflow-hidden">

            <div className="flex flex-wrap gap-4 items-center justify-between p-4">

              <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 h-11 w-[320px]">

                <Search size={16} className="text-[#94A3B8]" />

                <input
                  placeholder="Search by Order ID or Customer..."
                  className="outline-none w-full bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

              </div>

              <div className="flex gap-3">

                <div className="relative">

                  <button
                    onClick={() => setOpenStatus(v => !v)}
                    className="flex items-center gap-2 border border-[#E5E7EB] px-4 h-11 rounded-lg bg-white"
                  >
                    {status}
                    <ChevronDown size={16} />
                  </button>

                  {openStatus && (

                    <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow z-20">

                      {["All Status", "Completed", "Cancelled", "Refunded"].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatus(s)
                            setOpenStatus(false)
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-[#F8FAFC]"
                        >
                          {s}
                        </button>
                      ))}

                    </div>

                  )}

                </div>



                <div className="relative">

                  <button
                    onClick={() => setOpenDate(v => !v)}
                    className="flex items-center gap-2 border border-[#E5E7EB] px-4 h-11 rounded-lg bg-white whitespace-nowrap"
                  >
                    <Calendar size={16} />
                    {start && end ? `${start} to ${end}` : "Date Range"}
                  </button>

                  {openDate && (

                    <div className="absolute right-0 mt-2 w-[280px] bg-white border border-[#E5E7EB] rounded-xl p-4 shadow z-20">

                      <div className="space-y-3">

                        <input
                          type="date"
                          value={start}
                          onChange={(e) => setStart(e.target.value)}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 h-10"
                        />

                        <input
                          type="date"
                          value={end}
                          onChange={(e) => setEnd(e.target.value)}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 h-10"
                        />

                        <button
                          onClick={() => setOpenDate(false)}
                          className="w-full bg-[#2563EB] text-white py-2 rounded-lg"
                        >
                          Apply
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>



            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead className="border-y bg-[#F8FAFC] text-sm text-[#64748B]">

                  <tr>

                    <th className="py-4 px-4 font-medium">ORDER ID</th>
                    <th className="py-4 px-4 font-medium">DATE & TIME</th>
                    <th className="py-4 px-4 font-medium">CUSTOMER</th>
                    <th className="py-4 px-4 font-medium">TYPE</th>
                    <th className="py-4 px-4 font-medium">ITEMS</th>
                    <th className="py-4 px-4 font-medium">TOTAL</th>
                    <th className="py-4 px-4 font-medium">STATUS</th>
                    <th className="py-4 px-4 font-medium">ACTION</th>

                  </tr>

                </thead>



                <tbody>

                  {historyLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#64748B]">Loading history...</td>
                    </tr>
                  ) : historyOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#64748B]">
                        No order history found.
                      </td>
                    </tr>
                  ) : historyOrders.map((o, i) => (

                    <tr key={i} className="border-b last:border-none">

                      <td className="py-5 px-4 text-[#334155]">
                        {o.id || o._id}
                      </td>

                      <td className="py-5 px-4 text-[#64748B]">
                        {o.date || new Date(o.createdAt || Date.now()).toLocaleString()}
                      </td>

                      <td className="py-5 px-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-sm font-medium uppercase">
                            {o.customer?.name?.[0] || o.initial || "C"}
                          </div>

                          <p className="font-medium text-[#0F172A]">
                            {o.customer?.name || o.customer || "Customer"}
                          </p>

                        </div>

                      </td>

                      <td className="py-5 px-4">

                        <span className="px-3 py-1 text-sm rounded-full border border-[#E5E7EB] bg-[#F8FAFC]">
                          {o.orderType || o.type || "Delivery"}
                        </span>

                      </td>

                      <td className="py-5 px-4 text-[#64748B] max-w-[240px]">
                        {Array.isArray(o.items) ? o.items.map((it:any) => `${it.quantity}x ${it.name || it.menuItem?.name}`).join(", ") : o.items}
                      </td>

                      <td className="py-5 px-4 font-semibold text-[#0F172A]">
                        ${o.totalAmount || (o.total && o.total.replace ? o.total.replace('$', '') : o.total)}
                      </td>

                      <td className="py-5 px-4">

                        <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[o.status] || "bg-gray-100 text-gray-600 capitalize"}`}>
                          {o.status}
                        </span>

                      </td>

                      <td 
                        className="py-5 px-4 text-blue-500 cursor-pointer hover:text-blue-700 font-medium"
                        onClick={() => handleViewReceipt(o.id || o._id)}
                      >
                        View Receipt
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>



            <div className="flex items-center justify-between p-4 text-sm text-[#64748B] border-t">

              <p>
                Showing <b>{(historyPage - 1) * 10 + 1}-{Math.min(historyPage * 10, historyTotal)}</b> of <b>{historyTotal}</b> orders
              </p>

              <div className="flex gap-2">

                <button 
                  onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                  disabled={historyPage === 1}
                  className="border border-[#E5E7EB] px-3 py-1.5 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>

                <button 
                  onClick={() => setHistoryPage(p => p + 1)}
                  disabled={historyPage * 10 >= historyTotal}
                  className="border border-[#E5E7EB] px-3 py-1.5 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  )
}