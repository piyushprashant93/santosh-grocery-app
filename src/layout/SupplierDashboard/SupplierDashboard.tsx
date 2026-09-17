import { DollarSign, Package, Users, AlertTriangle, Truck } from "lucide-react";
import mapImage from "../../assets/images/dashboardmap.jpg";

const stats = [
  {
    title: "Total Revenue",
    value: "$124,592",
    change: "+12.5%",
    icon: DollarSign,
    iconBg: "bg-blue-100",
    iconColor: "text-[#155DFC]",
    trend: "up"
  },
  {
    title: "Active Orders",
    value: "48",
    change: "+4",
    icon: Package,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    trend: "up"
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "-2",
    icon: AlertTriangle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    trend: "down"
  },
  {
    title: "Active Clients",
    value: "156",
    change: "+8",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    trend: "up"
  }
]

const orders = [
  {
    id: "#ORD-7782",
    client: "Fresh Market NYC",
    item: "Organic Avocados (50 crates)",
    amount: "$4,250",
    image: "https://picsum.photos/40?1"
  },
  {
    id: "#ORD-7781",
    client: "Bistro 55",
    item: "Premium Steak Cuts (200kg)",
    amount: "$8,900",
    image: "https://picsum.photos/40?2"
  },
  {
    id: "#ORD-7780",
    client: "Green Grocers",
    item: "Seasonal Fruits Mix",
    amount: "$1,200",
    image: "https://picsum.photos/40?3"
  },
  {
    id: "#ORD-7779",
    client: "Sushi Zen",
    item: "Fresh Salmon (Imported)",
    amount: "$12,400",
    image: "https://picsum.photos/40?4"
  },
  {
    id: "#ORD-7778",
    client: "Daily Mart",
    item: "Dairy Products Bulk",
    amount: "$3,150",
    image: "https://picsum.photos/40?5"
  }
]

import { useState, useEffect } from "react";

export default function SupplierDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/supplier/dashboard", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const json = await res.json();
        if (res.ok) {
          let data = json.data || json;
          if (!data.recentOrders || data.recentOrders.length === 0) {
            // Fallback to fetch pending orders
            const ordersRes = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/supplier/orders?page=1", {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              }
            });
            if (ordersRes.ok) {
              const ordersJson = await ordersRes.json();
              const recentOrds = ordersJson.data?.orders || (Array.isArray(ordersJson.data) ? ordersJson.data : []);
              data.recentOrders = (Array.isArray(recentOrds) ? recentOrds : []).slice(0, 5);
            }
          }
          setDashboardData(data);
        } else {
          setError(json.message || "Failed to load dashboard.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error occurred.");
      }
    };
    fetchDashboard();
  }, []);

  const activeStats = [
    {
      title: "Total Revenue",
      value: dashboardData?.totalRevenue ? `$${dashboardData.totalRevenue.toLocaleString()}` : "$0",
      change: dashboardData?.revenueChange || "+0%",
      icon: DollarSign,
      iconBg: "bg-blue-100",
      iconColor: "text-[#155DFC]",
      trend: dashboardData?.revenueTrend || "up"
    },
    {
      title: "Active Orders",
      value: dashboardData?.activeOrders || "0",
      change: dashboardData?.ordersChange || "+0",
      icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: dashboardData?.ordersTrend || "up"
    },
    {
      title: "Low Stock Items",
      value: dashboardData?.lowStock || "0",
      change: dashboardData?.stockChange || "-0",
      icon: AlertTriangle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: dashboardData?.stockTrend || "down"
    },
    {
      title: "Active Clients",
      value: dashboardData?.activeClients || "0",
      change: dashboardData?.clientsChange || "+0",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: dashboardData?.clientsTrend || "up"
    }
  ];

  const activeOrders = dashboardData?.recentOrders || [];

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl lg:text-[34px] font-semibold font-playfair">
            Dashboard
          </h1>
          <p className="text-[#64748B]">
            Overview of your supply chain operations
          </p>
        </div>

        <div className="flex gap-3">

          <button onClick={() => setActiveTab("shipment-history")} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2">
            History
          </button>

          <button onClick={() => setActiveTab("new-shipment")} className="bg-[#155DFC] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow">
            New Shipment
          </button>

        </div>

      </div>


      <div className="">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-5">

          {activeStats.map((s, i) => {

            const Icon = s.icon

            return (

              <div
                key={i}
                className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
              >

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-[#64748B]">
                      {s.title}
                    </p>

                    <h3 className="text-xl font-semibold mt-2">
                      {s.value}
                    </h3>

                  </div>

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                    <Icon className={s.iconColor} size={18} />
                  </div>

                </div>

                <p className={`text-sm mt-3 text-gray-400`}>
                  <span className={`text-sm mt-3 ${s.trend === "up" ? "text-green-600" : "text-red-600"}`}>{s.change}</span> vs last month
                </p>

              </div>

            )
          })}

        </div>

        <div className="grid lg:grid-cols-3 gap-5 grid-cols-1">
          <div className="lg:col-span-2">
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 mb-5">

              <div className="flex justify-between items-center mb-6">

                <div>
                  <h3 className="text-xl font-playfair">
                    Recent Bulk Orders
                  </h3>

                  <p className="text-sm text-[#64748B]">
                    Orders from restaurants and retailers
                  </p>
                </div>

                <button className="text-[#155DFC] font-medium">
                  View All
                </button>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="text-sm text-[#94A3B8] border-b">

                    <tr>
                      <th className="py-3 font-medium">ORDER ID</th>
                      <th className="py-3 font-medium">CLIENT</th>
                      <th className="py-3 font-medium">ITEMS</th>
                      <th className="py-3 font-medium">AMOUNT</th>
                    </tr>

                  </thead>

                  <tbody>

                    {activeOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-[#64748B]">
                          No recent orders found.
                        </td>
                      </tr>
                    ) : (
                      activeOrders.map((o: any, i: number) => {

                        const idString = o.id || o.orderId || o._id || `#ORD-88${20-i}`;
                        const orderPrefix = idString.includes("-") ? idString.split("-")[0] + "-" : "#ORD-";
                        const orderNumber = idString.includes("-") ? idString.split("-")[1] : idString.substring(0, 4);

                        return (

                        <tr
                          key={i}
                          className="border-b border-[#F1F5F9] last:border-none"
                        >

                          <td className="py-5 font-medium text-[#0F172A]">

                            <div className="leading-5">
                              <p>{orderPrefix}</p>
                              <p>{orderNumber}</p>
                            </div>

                          </td>


                          <td className="py-5">

                            <div className="flex items-center gap-3">

                              <img
                                src={o.image || o.img || o.client?.image || o.restaurant?.image || "https://picsum.photos/40?1"}
                                className="w-10 h-10 min-w-10 rounded-full object-cover"
                              />

                              <p className="font-medium text-[#334155]">
                                {o.client?.name || o.restaurant?.name || o.client || "Unknown Client"}
                              </p>

                            </div>

                          </td>


                          <td className="py-5 text-[#64748B] max-w-[220px]">
                            {typeof o.item === "object" ? o.item?.name || o.item?.productName || "Item N/A" : o.item || (Array.isArray(o.items) ? o.items.map((it: any) => typeof it === "string" ? it : it.name || it.productName).join(", ") : (o.items?.length ? `${o.items.length} Items` : (o.totalItems ? `${o.totalItems} Items` : "Items N/A")))}
                          </td>


                          <td className="py-5 font-semibold text-[#0F172A]">
                            {typeof o.amount === "number" ? `$${o.amount.toFixed(2)}` : (o.total ? `$${o.total.toFixed(2)}` : (o.totalAmount ? `$${o.totalAmount.toFixed(2)}` : (o.total_amount ? `$${o.total_amount.toFixed(2)}` : o.amount || "$0.00")))}
                          </td>

                        </tr>

                      );
                    })
                    )}
                  </tbody>

                </table>

              </div>

            </div>

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">

              <h3 className="text-xl font-playfair mb-4">
                Live Fleet Tracking
              </h3>

              <div className="relative">

                <img
                  src={mapImage}
                  className="rounded-lg w-full h-[300px] object-cover"
                />

                <div className="absolute right-4 top-4 bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
                  <Truck size={16} />
                  <span className="text-sm">12 Vehicles Active</span>
                </div>

              </div>

            </div>

          </div>
          <div className="space-y-5">

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">

              <h3 className="text-xl font-playfair mb-5">
                Low Stock Alerts
              </h3>

              <div className="space-y-4">

                {(dashboardData?.lowStockItems || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-[#F3F4F6] rounded-xl p-3">

                    <div className="flex items-center gap-3">

                      <img
                        src={item.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200"}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-medium">{item.name || item.productName}</p>
                        <p className="text-sm text-[#64748B]">
                          {item.stock} units remaining
                        </p>
                      </div>

                    </div>

                    <span className={`text-xs px-2 py-1 rounded-md ${item.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.stock <= 5 ? "Critical" : "Low"}
                    </span>

                  </div>
                ))}

                {(!dashboardData?.lowStockItems || dashboardData.lowStockItems.length === 0) && (
                  <p className="text-[#64748B] text-sm py-4">No low stock items.</p>
                )}

              </div>

              <button className="mt-5 w-full border border-[#D1D5DB] rounded-lg py-2 text-[#155DFC] font-medium">
                Manage Inventory
              </button>

            </div>



            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">

              <h3 className="text-xl font-playfair mb-5">
                Top Clients
              </h3>

              <div className="space-y-5">

                {(dashboardData?.topClients || []).map((client: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 bg-[#E5EDFF] text-[#155DFC] flex items-center justify-center rounded-full font-medium">
                        {(client.name || "C").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium">
                          {client.name}
                        </p>
                        <p className="text-sm text-[#64748B]">
                          Vol: {client.volume || "$0/mo"}
                        </p>
                      </div>

                    </div>

                    <span className={`${client.growth && client.growth.startsWith("-") ? 'text-red-500' : 'text-green-600'} text-sm font-medium`}>
                      {client.growth || "+0%"}
                    </span>

                  </div>
                ))}

                {(!dashboardData?.topClients || dashboardData.topClients.length === 0) && (
                  <p className="text-[#64748B] text-sm py-2">No top clients data available.</p>
                )}

              </div>

              <button className="mt-5 text-[#155DFC] text-sm font-medium">
                View All Clients
              </button>

            </div>

          </div>
        </div>

      </div>

    </div>

  )
}