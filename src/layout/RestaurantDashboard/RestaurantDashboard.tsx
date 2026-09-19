import { DollarSign, Package, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/dataHelper";


const statusStyles: any = {
  New: "bg-blue-100 text-blue-600",
  Cooking: "bg-orange-100 text-orange-600",
  Ready: "bg-purple-100 text-purple-600",
  Delivered: "bg-green-100 text-green-600"
}

export default function RestaurantDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/restaurant-panel/dashboard", {
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
            const ordersRes = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/restaurant-panel/orders?status=pending", {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              }
            });
            if (ordersRes.ok) {
              const ordersJson = await ordersRes.json();
              const arr = ordersJson.data?.orders || ordersJson.data;
              data.recentOrders = (Array.isArray(arr) ? arr : []).slice(0, 5);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
        <div className="bg-theme-surface p-8 rounded-xl shadow-sm border border-theme-border max-w-md w-full">
          <h2 className="text-2xl font-playfair font-bold text-red-600 mb-2">Setup Required</h2>
          <p className="text-theme-muted mb-6">{error}</p>
          <button 
            onClick={() => setActiveTab("settings")}
            className="bg-[#009966] text-white px-6 py-2.5 rounded-lg font-medium w-full"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  const activeStats = [
    {
      title: "Total Orders",
      value: dashboardData?.totalOrders ? dashboardData.totalOrders.toLocaleString() : "0",
      change: dashboardData?.ordersChange || "0%",
      icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: dashboardData?.ordersTrend || "up"
    },
    {
      title: "Total Revenue",
      value: dashboardData?.totalRevenue ? `$${dashboardData.totalRevenue.toLocaleString()}` : "$0",
      change: dashboardData?.revenueChange || "0%",
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: dashboardData?.revenueTrend || "up"
    },
    {
      title: "Active Customers",
      value: dashboardData?.activeCustomers ? dashboardData.activeCustomers.toLocaleString() : "0",
      change: dashboardData?.customersChange || "0%",
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: dashboardData?.customersTrend || "up"
    },
    {
      title: "Avg Prep Time",
      value: dashboardData?.avgPrepTime || "0m",
      change: dashboardData?.prepTimeChange || "0%",
      icon: Clock,
      iconBg: "bg-blue-100",
      iconColor: "text-[#2563EB]",
      trend: dashboardData?.prepTimeTrend || "down"
    }
  ];

  const activeOrders = dashboardData?.recentOrders || [];
  const activePopularItems = dashboardData?.popularItems || [];

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl lg:text-[34px] font-semibold font-playfair">
            Dashboard
          </h1>
          <p className="text-theme-muted">
            Welcome back! Here's what's happening in your restaurant today.
          </p>
        </div>
      </div>


      <div className="">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-5">

          {activeStats.map((s, i) => {

            const Icon = s.icon

            return (

              <div
                key={i}
                className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
              >

                <div className="flex items-start justify-between">

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <Icon className={s.iconColor} size={22} />
                  </div>

                  <div className={`flex items-center gap-1 text-sm font-medium ${s.trend === "up" ? "text-green-600" : "text-red-600"}`}>

                    {s.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}

                    {s.change}

                  </div>

                </div>



                <p className="text-theme-muted mt-4">
                  {s.title}
                </p>

                <h3 className="text-[28px] font-playfair mt-2 text-theme-text">
                  {s.value}
                </h3>

              </div>

            )

          })}

        </div>



        <div className="grid lg:grid-cols-3 gap-5 grid-cols-1">

          <div className="lg:col-span-2">

            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6">

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-xl font-playfair">
                  Recent Orders
                </h3>

                <button  onClick={()=>setActiveTab("orders")} className="text-green-600 font-medium">
                  View All
                </button>

              </div>



              <div className="overflow-x-auto">

                <table className="w-full text-left min-w-[700px]">

                  <thead className="border-b text-sm text-theme-muted">

                    <tr>

                      <th className="py-3 font-medium">ORDER ID</th>
                      <th className="py-3 font-medium">CUSTOMER</th>
                      <th className="py-3 font-medium">ITEMS</th>
                      <th className="py-3 font-medium">STATUS</th>
                      <th className="py-3 font-medium text-end">TOTAL</th>

                    </tr>

                  </thead>



                  <tbody>

                    {activeOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-theme-muted">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <p className="font-medium text-gray-900">No recent orders found</p>
                            <p className="text-sm">There are no orders to display at this time.</p>
                          </div>
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

                            <td className="py-5 font-medium text-theme-text">

                              <div className="leading-5">
                                <p>{orderPrefix}</p>
                                <p>{orderNumber}</p>
                              </div>

                            </td>



                            <td className="py-5">

                              <div className="flex items-center gap-3">

                                <div>
                                  <p className="font-medium text-[#334155]">
                                    {o.customer?.name || (typeof o.customer === 'string' ? o.customer : "Customer")}
                                  </p>

                                  <p className="text-sm text-theme-muted">
                                    {o.time || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "")}
                                  </p>
                                </div>

                              </div>

                            </td>



                            <td className="py-5 text-theme-muted max-w-[240px]">
                              {Array.isArray(o.items) ? o.items.map((it:any) => `${it.quantity || 1}x ${it.name || it.menuItem?.name || "Item"}`).join(", ") : o.items}
                            </td>



                            <td className="py-5">

                              <span className={`px-3 py-1 text-sm rounded-full ${statusStyles[o.status]}`}>
                                {o.status}
                              </span>

                            </td>



                            <td className="py-5 font-semibold text-theme-text text-end">
                              {typeof o.totalAmount === 'number' ? `$${o.totalAmount.toFixed(2)}` : (typeof o.total === 'number' ? `$${o.total.toFixed(2)}` : (o.total || `$${o.totalAmount || 0}`))}
                            </td>

                          </tr>

                        )

                      })
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>



          <div>

            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6">

              <h3 className="text-xl font-playfair mb-6">
                Popular Items
              </h3>



              <div className="space-y-5">

                {activePopularItems.map((p: any, i: number) => (

                  <div key={i} className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <img
                        src={getImageUrl(p.image)}
                        className="w-14 h-14 rounded-xl object-cover"
                      />

                      <div>

                        <p className="font-medium text-theme-text">
                          {p.name}
                        </p>

                        <p className="text-sm text-theme-muted">
                          {p.orders} orders today
                        </p>

                      </div>

                    </div>

                    <p className="font-semibold text-theme-text">
                      {p.price}
                    </p>

                  </div>

                ))}

              </div>



              <button  onClick={()=>setActiveTab("reports")} className="mt-6 w-full bg-[#F1F5F9] rounded-lg py-3 font-medium">
                View Full Report
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}