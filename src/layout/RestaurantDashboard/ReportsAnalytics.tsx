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
} from "recharts";

import {
  Calendar,
  Download,
  DollarSign,
  Package,
  Users,
  TrendingDown,
  Filter,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};


export default function ReportsAnalytics() {
  const [days, setDays] = useState(7);
  const [reportData, setReportData] = useState<any>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/reports?days=${days}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setReportData(data.data || data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchReports();
  }, [days]);

  const resolvedStats = reportData?.stats || [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: reportData?.totalRevenue ? `$${reportData.totalRevenue}` : "$0.00",
      change: "+0.0%",
      color: "text-green-600",
    },
    {
      icon: Package,
      label: "Total Orders",
      value: reportData?.totalOrders?.toString() || "0",
      change: "+0.0%",
      color: "text-blue-600",
    },
    {
      icon: DollarSign,
      label: "Avg. Order Value",
      value: reportData?.avgOrderValue ? `$${reportData.avgOrderValue}` : "$0.00",
      change: "+0.0%",
      color: "text-orange-500",
    },
    {
      icon: Users,
      label: "New Customers",
      value: reportData?.newCustomers?.toString() || "0",
      change: "+0.0%",
      color: "text-purple-600",
    },
  ];

  const resolvedRevenueData = reportData?.dailyRevenue || reportData?.revenueTrend || reportData?.revenueData || [];
  const resolvedCategoryData = reportData?.salesMix || reportData?.categoryData || [];
  const resolvedCategoryExpense = reportData?.expenseBreakdown || reportData?.expensesByCategory || reportData?.categoryExpense || [];
  const resolvedExpenseList = reportData?.expenseList || reportData?.expensesByTitle || [];
  const resolvedTopItems = reportData?.popularItems || reportData?.topItems || [];
  const resolvedPeakData = reportData?.peakHours || reportData?.peakData || [];

  const totalMonthlyExpense = reportData?.totalMonthlyExpense || "0.00";

  const change = "-3.2%";
  const isNegative = change.includes("-");
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Reports & Analytics
          </h1>

          <p className="text-[#6A7282] mt-2">
            Track your restaurant's performance, revenue, and customer insights.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white">
            <Calendar size={18} />

            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="outline-none bg-transparent cursor-pointer">
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </button>

          <button className="flex items-center gap-2 bg-[#2563EB] text-white rounded-lg px-4 py-2">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resolvedStats.map((s: any, i: number) => {
          const Icon = s.icon;
          const isNegative = s.change.includes("-");

          return (
            <div
              key={i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className={s.color} />
                <p className="text-[#64748B] text-sm font-medium">{s.label}</p>
              </div>

              <p className="text-2xl font-semibold text-[#0F172A]">{s.value}</p>

              <p
                className={`text-sm mt-2 flex items-center gap-1 ${isNegative ? "text-red-500" : "text-green-600"}`}
              >
                {isNegative ? (
                  <>
                    <TrendingDown size={16} />
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} />
                  </>
                )}
                {s.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="border border-l-[4px] border-[#FB2C36] rounded-xl p-6 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Receipt size={18} className="text-red-500" />
            <p className="text-[#64748B] text-sm font-medium">
              Total Monthly Expense
            </p>
          </div>

          <p className="text-3xl font-semibold text-[#0F172A]">${totalMonthlyExpense}</p>

          <p
            className={`text-sm mt-2 flex items-center gap-1 ${isNegative ? "text-red-500" : "text-green-600"
              }`}
          >
            {isNegative ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
            {change} vs last period
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-playfair text-lg text-[#111827]">
              Revenue Trends
            </h3>

            <button className="text-blue-600 text-sm font-medium">
              View Details
            </button>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolvedRevenueData}>
                <XAxis
                  dataKey="day"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />

                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">
          <h3 className="font-playfair text-lg text-[#111827] mb-4">
            Sales Mix
          </h3>

          <div className="flex justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={resolvedCategoryData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {resolvedCategoryData.map((c: any, i: number) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-6">
            {resolvedCategoryData.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: c.color }}
                  />

                  <p className="text-sm text-[#475569]">{c.name}</p>
                </div>

                <p className="text-sm font-medium text-[#111827]">
                  {c.percent}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">

        <h2 className="text-lg font-playfair font-semibold text-[#111827] mb-3">
          Expense Overview
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">

            <h3 className="text-lg font-medium text-[#111827] mb-4">
              Expense by Category
            </h3>

            <div className="text-sm">

              <div className="grid grid-cols-3 text-[#64748B] border-b pb-3 mb-3">
                <p>CATEGORY</p>
                <p className="text-right">TOTAL EXPENSE</p>
                <p className="text-right">% OF TOTAL</p>
              </div>

              {resolvedCategoryExpense.map((item: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-3 py-3 border-b last:border-2"
                >
                  <p className="text-[#111827]">{item.name}</p>
                  <p className="text-right">${item.amount}</p>
                  <p className="text-right text-[#475569]">{item.percent}</p>
                </div>
              ))}

              <div className="grid grid-cols-3 pt-4 mt-2 font-semibold">
                <p>Total</p>
                <p className="text-right">$13070.00</p>
                <p className="text-right">100.0%</p>
              </div>

            </div>

          </div>

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">

            <h3 className="text-lg font-medium text-[#111827] mb-4">
              Expense by Title
            </h3>

            <div className="text-sm">

              <div className="grid grid-cols-4 text-[#64748B] border-b pb-3 mb-3">
                <p>EXPENSE TITLE</p>
                <p>CATEGORY</p>
                <p className="text-right">AMOUNT</p>
                <p className="text-right">ENTRIES</p>
              </div>

              {resolvedExpenseList.map((item: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-4 py-3 border-b last:border-none"
                >
                  <p className="text-[#111827] break-words">{item.title}</p>
                  <p className="text-[#475569]">{item.category}</p>
                  <p className="text-right">${item.amount}</p>
                  <p className="text-right">{item.entries}</p>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">

  <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">

    <h3 className="text-lg font-medium text-[#111827] mb-4">
      Top Selling Items
    </h3>

    <div className="text-sm">

      <div className="grid grid-cols-3 text-[#64748B] border-b pb-3 mb-3">
        <p>ITEM NAME</p>
        <p className="text-right">ORDERS</p>
        <p className="text-right">REVENUE</p>
      </div>

      {resolvedTopItems.map((item: any, i: number) => (
        <div
          key={i}
          className="grid grid-cols-3 py-3 border-b last:border-none"
        >
          <p className="text-[#111827]">{item.name}</p>
          <p className="text-right">{item.orders}</p>
          <p className="text-right">${item.revenue}</p>
        </div>
      ))}

    </div>

    <div className="text-center mt-6">
      <button className="text-blue-600 text-sm font-medium">
        View All Items →
      </button>
    </div>

  </div>


  <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">

    <h3 className="text-lg font-medium text-[#111827] mb-4">
      Peak Hours
    </h3>

    <div className="h-[350px]">

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={resolvedPeakData}>

          <XAxis
            dataKey="time"
            axisLine={true}
            tickLine={true}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />

          <YAxis
            axisLine={true}
            tickLine={true}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>

  </div>

</div>
    </div>
  );
}
