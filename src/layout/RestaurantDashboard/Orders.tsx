import { Search, Download, Clock, MoreHorizontal, Filter, ChevronDown, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const orders = [
  {
    id: "#ORD-8821",
    date: "Today, 10:30 AM",
    customer: "John Doe",
    initial: "J",
    type: "Delivery",
    items: "2x Chicken Burger, 1x Coke",
    total: "$24.50",
    status: "Completed"
  },
  {
    id: "#ORD-8820",
    date: "Yesterday, 8:15 PM",
    customer: "Alice Johnson",
    initial: "A",
    type: "Dine-in",
    items: "1x Caesar Salad, 1x Water",
    total: "$14.00",
    status: "Completed"
  },
  {
    id: "#ORD-8819",
    date: "Yesterday, 7:45 PM",
    customer: "Robert Smith",
    initial: "R",
    type: "Dine-in",
    items: "2x Steak, 1x Red Wine",
    total: "$85.00",
    status: "Completed"
  },
  {
    id: "#ORD-8818",
    date: "Yesterday, 6:30 PM",
    customer: "Emily Davis",
    initial: "E",
    type: "Pickup",
    items: "1x Veggie Pizza",
    total: "$16.00",
    status: "Cancelled"
  },
  {
    id: "#ORD-8817",
    date: "Yesterday, 1:00 PM",
    customer: "Michael Wilson",
    initial: "M",
    type: "Delivery",
    items: "3x Tacos, 2x Soda",
    total: "$22.50",
    status: "Completed"
  },
  {
    id: "#ORD-8816",
    date: "Feb 10, 12:30 PM",
    customer: "Sarah Brown",
    initial: "S",
    type: "Dine-in",
    items: "1x Pasta Alfredo",
    total: "$18.50",
    status: "Completed"
  },
  {
    id: "#ORD-8815",
    date: "Feb 10, 11:45 AM",
    customer: "David Miller",
    initial: "D",
    type: "Delivery",
    items: "1x Burger Meal",
    total: "$15.00",
    status: "Refunded"
  },
  {
    id: "#ORD-8814",
    date: "Feb 09, 8:15 PM",
    customer: "Jennifer Wu",
    initial: "J",
    type: "Delivery",
    items: "1x Sushi Platter, 2x Miso Soup",
    total: "$42.00",
    status: "Completed"
  },
  {
    id: "#ORD-8813",
    date: "Feb 09, 7:30 PM",
    customer: "Tom Harris",
    initial: "T",
    type: "Pickup",
    items: "1x Pepperoni Pizza, 1x Coke",
    total: "$21.00",
    status: "Completed"
  },
  {
    id: "#ORD-8812",
    date: "Feb 09, 1:15 PM",
    customer: "Emma Wilson",
    initial: "E",
    type: "Delivery",
    items: "2x Vegan Wrap, 1x Smoothie",
    total: "$28.50",
    status: "Completed"
  }
]

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

  const toggleType = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type))
    } else {
      setTypes([...types, type])
    }
  }
  const [newOrders, setNewOrders] = useState([
    {
      id: "#ORD-8825",
      time: "Just now",
      type: "Delivery",
      name: "Michael Brown",
      items: ["2x Beef Burger", "1x French Fries", "2x Coke"],
      price: "$32.50"
    },
    {
      id: "#ORD-8824",
      time: "5 min ago",
      type: "Pickup",
      name: "Sarah Connor",
      items: ["1x Margherita Pizza", "1x Garlic Bread"],
      price: "$18.00"
    }
  ])

  const [cooking, setCooking] = useState([
    {
      id: "#ORD-8823",
      time: "15 min ago",
      type: "Dine-in",
      name: "James Wilson",
      items: ["3x Chicken Wings", "2x Beer"],
      price: "$45.00"
    }
  ])

  const [ready, setReady] = useState([
    {
      id: "#ORD-8822",
      time: "25 min ago",
      type: "Delivery",
      name: "Emily Clark",
      items: ["1x Pasta Carbonara"],
      price: "$16.50"
    }
  ])

  const acceptOrder = (order: any, index: number) => {
    setNewOrders(prev => prev.filter((_, i) => i !== index))
    setCooking(prev => [...prev, order])
  }

  const acceptAllOrders = () => {
    setCooking(prev => [...prev, ...newOrders])
    setNewOrders([])
  }

  const markReady = (order: any, index: number) => {
    setCooking(prev => prev.filter((_, i) => i !== index))
    setReady(prev => [...prev, order])
  }

  const completeOrder = async (index: number) => {
    // Ideally we'd hit /orders/:id/status here
    setReady(prev => prev.filter((_, i) => i !== index))
  }

  const fetchLiveOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/orders/live`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const live = data.data?.orders || data.orders || data.data || [];
        if (live.length > 0) {
          setNewOrders(live.filter((o: any) => o.status === "pending" || o.status === "New"));
          setCooking(live.filter((o: any) => o.status === "cooking" || o.status === "Cooking"));
          setReady(live.filter((o: any) => o.status === "ready" || o.status === "Ready"));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  const Card = ({ order, action, actionLabel, color }: { order: any, action?: () => void, actionLabel?: string, color?: string }) => (
    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm">

      <div className="flex justify-between items-start">

        <h3 className="font-playfair text-lg">{order.id}</h3>

        <MoreHorizontal size={18} className="text-[#94A3B8]" />

      </div>

      <p className="text-sm text-[#64748B] flex items-center gap-2 mt-1">
        <Clock size={14} />
        {order.time} • {order.type}
      </p>

      <p className="font-medium text-[#0F172A] mt-4">
        {order.name}
      </p>

      <ul className="mt-3 space-y-1 text-[#64748B]">

        {order.items.map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
            {item}
          </li>
        ))}

      </ul>

      <div className="flex justify-between items-center mt-5">

        <p className="font-semibold text-lg">
          {order.price}
        </p>

        {action && (
          <button
            onClick={action}
            className={`px-4 py-2 rounded-lg text-white ${color}`}
          >
            {actionLabel}
          </button>
        )}

      </div>

    </div>
  )

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

              <button onClick={acceptAllOrders} className="bg-[#009966] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm ">
                Accept All New
              </button>

            </> : <>
              <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
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
                    color="bg-[#F54900]"
                  />
                ))}

              </div>

            </div>



            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4">

              <h3 className="font-playfair text-lg mb-4 text-[#065F46]">
                ● Ready for Pickup ({ready.length})
              </h3>

              <div className="space-y-4">

                {ready.map((o, i) => (
                  <Card
                    key={i}
                    order={o}
                    action={() => { }}
                    actionLabel="Complete"
                    color="bg-[#059669]"
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
                  className="outline-none w-full"
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
                    className="flex items-center gap-2 border border-[#E5E7EB] px-4 h-11 rounded-lg bg-white"
                  >
                    <Calendar size={16} />
                    Date Range
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

                  {orders.map((o, i) => (

                    <tr key={i} className="border-b last:border-none">

                      <td className="py-5 px-4 text-[#334155]">
                        {o.id}
                      </td>

                      <td className="py-5 px-4 text-[#64748B]">
                        {o.date}
                      </td>

                      <td className="py-5 px-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-sm font-medium">
                            {o.initial}
                          </div>

                          <p className="font-medium text-[#0F172A]">
                            {o.customer}
                          </p>

                        </div>

                      </td>

                      <td className="py-5 px-4">

                        <span className="px-3 py-1 text-sm rounded-full border border-[#E5E7EB] bg-[#F8FAFC]">
                          {o.type}
                        </span>

                      </td>

                      <td className="py-5 px-4 text-[#64748B] max-w-[240px]">
                        {o.items}
                      </td>

                      <td className="py-5 px-4 font-semibold text-[#0F172A]">
                        {o.total}
                      </td>

                      <td className="py-5 px-4">

                        <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[o.status]}`}>
                          {o.status}
                        </span>

                      </td>

                      <td className="py-5 px-4 text-gray-500 cursor-pointer">
                        View Receipt
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>



            <div className="flex items-center justify-between p-4 text-sm text-[#64748B] border-t">

              <p>
                Showing <b>1-7</b> of <b>10</b> orders
              </p>

              <div className="flex gap-2">

                <button className="border border-[#E5E7EB] px-3 py-1.5 rounded-lg">
                  Previous
                </button>

                <button className="border border-[#E5E7EB] px-3 py-1.5 rounded-lg">
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