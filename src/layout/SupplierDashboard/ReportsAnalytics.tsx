import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

import {
  Calendar,
  Download,
  DollarSign,
  Package,
  Users,
  TrendingDown, Filter
} from "lucide-react"
import { useState, useEffect } from "react"

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "At Risk": "bg-yellow-100 text-yellow-700",
  Inactive: "bg-red-100 text-red-600"
}

export default function ReportsAnalytics() {
  const [activeReportTab, setActiveReportTab] = useState("Sales Analysis")
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/supplier/reports", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const json = await res.json();
          setReportData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const stats = reportData?.stats || [];
  const revenueData = reportData?.revenueData || [];
  const categoryData = reportData?.categoryData || [];
  const products = reportData?.products || [];
  const growthData = reportData?.growthData || [];
  const statusData = reportData?.statusData || [];
  const clients = reportData?.clients || [];

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-start">

        <div>

          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Reports & Analytics
          </h1>

          <p className="text-[#6A7282] mt-2">
            Deep dive into your business performance.
          </p>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white">

            <Calendar size={18} />

            Last 7 Days

          </button>

          <button className="flex items-center gap-2 bg-[#2563EB] text-white rounded-lg px-4 py-2">

            <Download size={18} />

            Export PDF

          </button>

        </div>

      </div>



      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((s: any, i: number) => {

          const Icon = s.icon

          return (

            <div
              key={i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm"
            >

              <div className="flex justify-between items-center mb-4">

                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <Icon size={20} className={s.color} />
                </div>

                <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded-full">
                  {s.change}
                </span>

              </div>

              <p className="text-[#64748B] text-sm">
                {s.label}
              </p>

              <p className="text-2xl font-playfair font-semibold mt-1">
                {s.value}
              </p>

            </div>

          )

        })}

      </div>



      <div className="flex bg-[#fff] border border-[#E2E8F0] rounded-lg p-1 w-full">

        {["Sales Analysis", "Product Performance", "Client Insights"].map((t, i) => (

          <button
            key={i}
            onClick={() => setActiveReportTab(t)}
            className={`px-6 py-2 rounded-lg text-sm flex-1 transition ${activeReportTab === t
              ? "bg-[#EFF6FF] border border-[#00000000] text-[#1447E6]"
              : "text-[#020617]"
              }`}
          >
            {t}
          </button>

        ))}

      </div>

      {activeReportTab === "Sales Analysis" && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

            <h3 className="font-playfair text-xl">
              Revenue Trends
            </h3>

            <p className="text-[#6A7282] text-sm mb-6">
              Daily revenue performance over time
            </p>

            <div className="h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={revenueData}>

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>



          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

            <h3 className="font-playfair text-xl">
              Sales by Category
            </h3>

            <p className="text-[#6A7282] text-sm mb-6">
              Revenue distribution by product type
            </p>

            <div className="flex justify-center">

              <ResponsiveContainer width={220} height={220}>

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={75}
                      outerRadius={100}
                    paddingAngle={3}
                  >

                    {categoryData.map((c: any, i: number) => (
                      <Cell
                        key={`cell-${i}`} fill={c.color} />
                    ))}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>

            </div>



            <div className="space-y-3 mt-6">

              {categoryData.map((c: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">

                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: c.color }}
                    />

                    <div className="text-sm">

                      <p className="text-[#111827]">
                        {c.name}
                      </p>

                    </div>

                  </div>

                  <div className="text-right text-sm">

                    <p className="font-medium">
                      {c.amount}
                    </p>

                    <p className="text-[#64748B]">
                      {c.percent}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      )}

      {activeReportTab === "Product Performance" && (
        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="flex justify-between items-start mb-6">

            <div>

              <h3 className="font-playfair text-xl">
                Top Performing Products
              </h3>

              <p className="text-[#6A7282] text-sm">
                Best selling items by volume and revenue
              </p>

            </div>

            <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white">

              <Filter size={16} />

              Filter

            </button>

          </div>



          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-[#F8FAFC] text-[#64748B] text-sm">

                <tr>

                  <th className="py-4 px-4">
                    PRODUCT NAME
                  </th>

                  <th className="py-4 px-4">
                    SALES VOLUME
                  </th>

                  <th className="py-4 px-4">
                    TOTAL REVENUE
                  </th>

                  <th className="py-4 px-4">
                    GROWTH (MOM)
                  </th>

                  <th className="py-4 px-4 text-right">
                    ACTION
                  </th>

                </tr>

              </thead>



              <tbody>

                {products.map((p: any, i: number) => (
                  <tr
                    key={i} className="border-t">

                    <td className="py-5 px-4 text-[#111827] font-medium">
                      {p.name}
                    </td>

                    <td className="py-5 px-4 text-[#64748B]">
                      {p.volume}
                    </td>

                    <td className="py-5 px-4 text-green-600 font-semibold">
                      {p.revenue}
                    </td>

                    <td className="py-5 px-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm">
                        {p.growth}
                      </span>

                    </td>

                    <td className="py-5 px-4 text-right">

                      <button className="text-[#2563EB] font-medium">
                        View Details
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {activeReportTab === "Client Insights" && (
        <div>
          <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mb-5">

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

              <h3 className="font-playfair text-xl">
                Client Growth
              </h3>

              <p className="text-[#6A7282] text-sm mb-6">
                New vs Returning Clients over the last 6 months
              </p>

              <div className="h-[300px]">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={growthData}>

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="new" fill="#3B82F6" radius={[4, 4, 0, 0]} />

                    <Bar dataKey="returning" fill="#10B981" radius={[4, 4, 0, 0]} />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              <div className="flex gap-6 mt-4 text-sm">

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#3B82F6] rounded" />
                  New Clients
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#10B981] rounded" />
                  Returning Clients
                </div>

              </div>

            </div>

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

              <h3 className="font-playfair text-xl">
                Client Status
              </h3>

              <p className="text-[#6A7282] text-sm mb-6">
                Distribution of client engagement
              </p>

              <div className="flex justify-center">

                <ResponsiveContainer width={200} height={200}>

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={3}
                    >

                      {statusData.map((s: any, i: number) => (
                        <Cell
                          key={`cell-${i}`} fill={s.color} />
                      ))}

                    </Pie>

                  </PieChart>

                </ResponsiveContainer>

              </div>

              <div className="text-center -mt-32 mb-10">

                <h2 className="text-3xl font-semibold">
                  28
                </h2>

                <p className="text-sm text-[#6A7282]">
                  TOTAL CLIENTS
                </p>

              </div>

              <div className="space-y-2 mt-24">

                {statusData.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">

                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: s.color }}
                      />

                      {s.name}

                    </div>

                    <span>{s.value}%</span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

            <div className="flex justify-between items-start mb-6">

              <div>

                <h3 className="font-playfair text-xl">
                  Top Clients by Revenue
                </h3>

                <p className="text-[#6A7282] text-sm">
                  Highest value partnerships and their current status
                </p>

              </div>

              <button className="border border-[#E5E7EB] px-4 py-2 rounded-lg">
                View All Clients
              </button>

            </div>

            <table className="w-full text-left">

              <thead className="bg-[#F8FAFC] text-sm text-[#64748B]">

                <tr>

                  <th className="py-4 px-4">CLIENT NAME</th>
                  <th className="py-4 px-4">TOTAL ORDERS</th>
                  <th className="py-4 px-4">TOTAL REVENUE</th>
                  <th className="py-4 px-4">LAST ORDER</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">ACTIONS</th>

                </tr>

              </thead>

              <tbody>

                {clients.map((c: any, i: number) => (

                  <tr key={i} className="border-t">

                    <td className="py-5 px-4 font-medium">
                      {c.name}
                    </td>

                    <td className="py-5 px-4 text-[#64748B]">
                      {c.orders}
                    </td>

                    <td className="py-5 px-4 text-green-600 font-semibold">
                      {c.revenue}
                    </td>

                    <td className="py-5 px-4 text-[#64748B]">
                      {c.last}
                    </td>

                    <td className="py-5 px-4">

                      <span className={`px-3 py-1 rounded-md text-sm ${statusStyles[c.status as keyof typeof statusStyles]}`}>
                        {c.status}
                      </span>

                    </td>

                    <td className="py-5 px-4 text-[#64748B]">
                      •••
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        </div>
      )}

    </div>

  )

}