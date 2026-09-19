import { DollarSign, Package, ShoppingBag, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import EmptyTableState from "../../components/common/EmptyTableState"
import ChartsSection from "./ChartsSection"

const statusStyles:any = {
  Pending:"bg-yellow-100 text-yellow-700",
  Processing:"bg-blue-100 text-blue-700",
  Delivered:"bg-green-100 text-green-700",
  Cancelled:"bg-red-100 text-red-700"
}

export default function RetailerDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/retailer/dashboard", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const json = await res.json();
          setDashboardData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const activeStats = useMemo(() => dashboardData ? [
    {
      title: "Total Revenue",
      value: `$${(dashboardData.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: `Last mo: $${(dashboardData.lastMonthRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: (dashboardData.totalRevenue || 0) >= (dashboardData.lastMonthRevenue || 0) ? "up" : "down",
      trendText: ""
    },
    {
      title: "Pending Orders",
      value: (dashboardData.pendingOrdersCount || 0).toLocaleString(),
      change: "Active",
      icon: ShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "up",
      trendText: "orders"
    },
    {
      title: "Low Stock Items",
      value: (dashboardData.lowStockItems || 0).toLocaleString(),
      change: "Needs attention",
      icon: Package,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "down",
      trendText: "catalog"
    },
    {
      title: "Pending Payments",
      value: `$${(dashboardData.pendingPayments || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "Due",
      icon: Clock,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "up",
      trendText: "today"
    }
  ] : [], [dashboardData]);

  const activeOrders = useMemo(() => (dashboardData?.recentOrders || []).map((o: any) => ({
    id: o._id ? `#${o._id.substring(o._id.length - 6).toUpperCase()}` : (o.id || "#---"),
    customer: o.customer?.name || o.customer || "Unknown",
    amount: typeof o.totalAmount === 'number' ? `$${o.totalAmount.toFixed(2)}` : (o.amount || "$0.00"),
    status: o.status || "Pending",
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : (o.date || "Just now")
  })), [dashboardData]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Dashboard
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex gap-3">

          <button onClick={() => setActiveTab("orders")} className="border border-theme-border bg-theme-surface shadow-sm rounded-lg px-4 py-2 text-theme-text">
            View Orders
          </button>

          <button onClick={() => setActiveTab("products")} className="bg-[#F97316] text-theme-text rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            + Add Product
          </button>

        </div>

      </div>


      <div className="grid lg:grid-cols-4 md:grid-cols-2 lg:gap-6 gap-3">

        {activeStats.map((s: any, i: number) => {

          const Icon = s.icon || DollarSign;

          return(
            <div
              key={i}
              className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
            >

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-theme-muted text-sm">
                    {s.title}
                  </p>

                  <h3 className="font-playfair text-2xl mt-2">
                    {s.value}
                  </h3>

                </div>

                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${s.iconBg || "bg-gray-100"}`}>
                  <Icon className={s.iconColor || "text-gray-600"} size={18}/>
                </div>

              </div>

              <div className="flex items-center gap-2 mt-4 text-sm">

                {s.trend === "up" ? (
                  <ArrowUpRight className="text-green-600" size={16}/>
                ) : (
                  <ArrowDownRight className="text-red-600" size={16}/>
                )}

                <span className={`${s.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {s.change}
                </span>

                <span className="text-theme-muted">
                  {s.trendText !== undefined ? s.trendText : "vs last month"}
                </span>

              </div>

            </div>
          )
        })}

      </div>


<ChartsSection />


      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h3 className="font-playfair text-xl">
              Recent Orders
            </h3>

            <p className="text-theme-muted text-sm">
              Latest transactions from your store
            </p>
          </div>

          <button className="text-[#F97316] font-medium">
            View All
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="text-theme-muted text-sm border-b">

              <tr>
                <th className="py-3">ORDER ID</th>
                <th className="py-3">CUSTOMER</th>
                <th className="py-3">AMOUNT</th>
                <th className="py-3">STATUS</th>
                <th className="py-3">DATE</th>
              </tr>

            </thead>

            <tbody>

              {activeOrders.map((o: any, i: number)=>(
                <tr key={i} className="border-b last:border-none">

                  <td className="py-4">{o.id}</td>
                  <td className="py-4">{o.customer}</td>
                  <td className="py-4">{o.amount}</td>

                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
                  </td>

                  <td className="py-4 text-theme-muted">
                    {o.date}
                  </td>

                </tr>
              ))}
              
              {activeOrders.length === 0 && (
                <EmptyTableState colSpan={5} message="No recent orders found." />
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}