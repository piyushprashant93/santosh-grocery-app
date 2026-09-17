import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Calendar, Download } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import toast from "react-hot-toast"
import EmptyTableState from "../../components/common/EmptyTableState"

export default function ReportsAnalytics() {

  const [reportsData, setReportsData] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/retailer/reports", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setReportsData(data.data || data);
        }
      } catch (err) { console.error(err); }
    };
    fetchReports();
  }, []);

  const activeRevenueData = useMemo(() => reportsData?.dailyRevenue || [], [reportsData]);
  const activeCategoryData = useMemo(() => reportsData?.categoryBreakdown || [], [reportsData]);
  const activeProducts = useMemo(() => reportsData?.topProducts || [], [reportsData]);

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Exporting reports...");
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/retailer/reports/export", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `retailer-reports-${new Date().toISOString().split('T')[0]}.csv`;
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

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Reports & Analytics
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Deep dive into your sales performance and trends.
          </p>
        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white">
            <Calendar size={18}/>
            Last 7 Days
          </button>

          <button onClick={handleExport} className="flex items-center gap-2 bg-[#F54900] text-white rounded-lg px-4 py-2">
            <Download size={18}/>
            Export Report
          </button>

        </div>

      </div>



      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">

        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <h3 className="font-playfair text-xl">Revenue Overview</h3>
          <p className="text-[#6A7282] text-sm mb-6">
            Daily sales breakdown
          </p>

          <div className="h-[360px] -ml-3">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={activeRevenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>

                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip/>

                <Bar
                  dataKey="value"
                  fill="#F97316"
                  radius={[6,6,0,0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>



        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <h3 className="font-playfair text-xl">Sales by Category</h3>
          <p className="text-[#6A7282] text-sm mb-6">
            Distribution of product sales
          </p>

          <div className="h-[200px] flex items-center justify-center">

            <ResponsiveContainer width={200} height={200}>

              <PieChart>

                <Pie
                  data={activeCategoryData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {activeCategoryData.map((c: any, i: number) => (
                    <Cell key={i} fill={c.color}/>
                  ))}
                </Pie>

              </PieChart>

            </ResponsiveContainer>

          </div>



          <div className="space-y-2 mt-4">

            {activeCategoryData.map((c: any, i: number) =>(
              <div key={i} className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{background:c.color}}
                  />
                  {c.name}
                </div>

                <span>{c.value}%</span>

              </div>
            ))}

          </div>

        </div>

      </div>



      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h3 className="font-playfair text-xl">
              Best Selling Products
            </h3>

            <p className="text-[#6A7282] text-sm">
              Top performers by revenue this month
            </p>
          </div>

          <button className="text-[#F54900] font-medium">
            View All Report →
          </button>

        </div>



        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b text-[#6A7282] text-sm">

              <tr>
                <th className="py-3">PRODUCT NAME</th>
                <th className="py-3">UNITS SOLD</th>
                <th className="py-3">TOTAL REVENUE</th>
                <th className="py-3">PERFORMANCE</th>
              </tr>

            </thead>



            <tbody>

              {activeProducts.map((p: any, i: number) =>(
                <tr key={i} className="border-b last:border-none">

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <span className="bg-gray-100 text-sm px-3 py-2 border border-[#E2E8F0] rounded">
                        {p.rank}
                      </span>

                      {p.name}

                    </div>

                  </td>

                  <td className="py-4 text-[#374151]">
                    {p.units}
                  </td>

                  <td className="py-4 text-green-600 font-semibold">
                    {p.revenue}
                  </td>

                  <td className="py-4">

                    <div className="w-[120px] h-2 bg-gray-200 rounded">

                      <div
                        className="h-2 bg-[#F54900] rounded"
                        style={{width:`${p.performance}%`}}
                      />

                    </div>

                  </td>

                </tr>
              ))}
              
              {activeProducts.length === 0 && (
                <EmptyTableState colSpan={4} message="No best selling products found." />
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}