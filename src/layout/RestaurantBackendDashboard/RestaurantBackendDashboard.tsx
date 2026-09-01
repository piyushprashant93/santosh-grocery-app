import {
  DollarSign,
  Package,
  Users,
  Clock,
  ArrowUpRight,
  Download,
  ChevronDown,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  Wallet,
} from "lucide-react";
import ReportChartCard from "./ReportChartCard";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
const monthlyData = [
  { name: "Jan", value: 40000 },
  { name: "Feb", value: 35000 },
  { name: "Mar", value: 45000 },
  { name: "Apr", value: 48000 },
  { name: "May", value: 52000 },
  { name: "Jun", value: 45000 },
];

const expensesData = [
  { name: "Jan", value: 28000 },
  { name: "Feb", value: 25000 },
  { name: "Mar", value: 31000 },
  { name: "Apr", value: 27000 },
  { name: "May", value: 29500 },
  { name: "Jun", value: 28000 },
];

const maintenanceData = [
  { name: "Jan", value: 3200 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 4000 },
  { name: "Apr", value: 3400 },
  { name: "May", value: 2900 },
  { name: "Jun", value: 3300 },
];

const salaryData = [
  { name: "Jan", value: 18000 },
  { name: "Feb", value: 18000 },
  { name: "Mar", value: 18500 },
  { name: "Apr", value: 18500 },
  { name: "May", value: 19200 },
  { name: "Jun", value: 18700 },
];

const stats = [
  {
    title: "Sales – This Month",
    value: "$45,250",
    change: "+12.5%",
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    trend: "up",
  },
  {
    title: "Expenses – This Month",
    value: "$28,150",
    change: "+8.2%",
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-[#2563EB]",
    trend: "up",
  },
  {
    title: "Total Staff – This Month",
    value: "24",
    change: "+2",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    trend: "up",
  },
  {
    title: "Salary – This Month",
    value: "$18,500",
    change: "+5.7%",
    icon: Wallet,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    trend: "up",
  },
];

const orders = [
  {
    id: "#ORD-8821",
    customer: "John Doe",
    time: "2 min ago",
    items: "2x Chicken Burger, 1x Coke",
    amount: "$28.50",
    status: "New",
  },
  {
    id: "#ORD-8820",
    customer: "Alice Smith",
    time: "15 min ago",
    items: "1x Veg Pizza, 1x Garlic Bread",
    amount: "$32.00",
    status: "Cooking",
  },
  {
    id: "#ORD-8819",
    customer: "Bob Wilson",
    time: "25 min ago",
    items: "3x Pasta Alfredo",
    amount: "$45.00",
    status: "Ready",
  },
  {
    id: "#ORD-8818",
    customer: "Emma Davis",
    time: "1 hour ago",
    items: "1x Caesar Salad",
    amount: "$15.50",
    status: "Delivered",
  },
];

const popularItems = [
  {
    name: "Spicy Chicken Burger",
    orders: 24,
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=200",
  },
  {
    name: "Margherita Pizza",
    orders: 18,
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=200",
  },
  {
    name: "Caesar Salad",
    orders: 16,
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200",
  },
  {
    name: "Pasta Alfredo",
    orders: 14,
    price: "$13.99",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200",
  },
];

const statusStyles: any = {
  New: "bg-blue-100 text-blue-600",
  Cooking: "bg-orange-100 text-orange-600",
  Ready: "bg-purple-100 text-purple-600",
  Delivered: "bg-green-100 text-green-600",
};

export default function RestaurantBackendDashboard({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [dashboardData, setDashboardData] = useState<any>(null);

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

  const activeStats = [
    {
      title: "Sales – This Month",
      value: dashboardData?.totalSales ? `$${dashboardData.totalSales.toLocaleString()}` : stats[0].value,
      change: dashboardData?.salesChange || stats[0].change,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: dashboardData?.salesTrend || stats[0].trend,
    },
    {
      title: "Expenses – This Month",
      value: dashboardData?.totalExpenses ? `$${dashboardData.totalExpenses.toLocaleString()}` : stats[1].value,
      change: dashboardData?.expensesChange || stats[1].change,
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-[#2563EB]",
      trend: dashboardData?.expensesTrend || stats[1].trend,
    },
    {
      title: "Total Staff – This Month",
      value: dashboardData?.totalStaff || stats[2].value,
      change: dashboardData?.staffChange || stats[2].change,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: dashboardData?.staffTrend || stats[2].trend,
    },
    {
      title: "Salary – This Month",
      value: dashboardData?.totalSalary ? `$${dashboardData.totalSalary.toLocaleString()}` : stats[3].value,
      change: dashboardData?.salaryChange || stats[3].change,
      icon: Wallet,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: dashboardData?.salaryTrend || stats[3].trend,
    },
  ];

  const activeOrders = dashboardData?.recentOrders || orders;
  const activePopularItems = dashboardData?.popularItems || popularItems;
  const activeMonthlyData = dashboardData?.monthlyData || monthlyData;
  const activeExpensesData = dashboardData?.expensesData || expensesData;
  const activeMaintenanceData = dashboardData?.maintenanceData || maintenanceData;
  const activeSalaryData = dashboardData?.salaryData || salaryData;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const branches = ["All Branches", "Branch 1", "Branch 2"];
  const [month, setMonth] = useState("Jun");
  const [branch, setBranch] = useState("All Branches");
  const data = [
    { name: "Rent", value: 8000, percent: 48 },
    { name: "Utilities", value: 3500, percent: 21 },
    { name: "Supplies", value: 2200, percent: 13 },
    { name: "Marketing", value: 1800, percent: 11 },
    { name: "Insurance", value: 1200, percent: 7 },
  ];

  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-semibold font-playfair">
            Dashboard
          </h1>
          <p className="text-[#64748B]">
            Welcome back! Here's what's happening in your restaurant today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Calendar size={16} /> Last updated: Feb 20, 2026, 10:30 AM
        </div>
      </div>

      <div className="">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-5">
          {activeStats.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#64748B] text-sm">{s.title}</p>

                    <h3 className="text-[28px] font-playfair mt-2 text-[#0F172A]">
                      {s.value}
                    </h3>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}
                  >
                    <Icon className={s.iconColor} size={22} />
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <span
                    className={`${s.trend === "up" ? "text-green-600" : "text-red-600"} font-medium`}
                  >
                    {s.change}
                  </span>

                  <span className="text-[#94A3B8] ml-2">vs last month</span>
                </div>

                <p className="text-[#94A3B8] text-sm mt-3">
                  Updated after monthly report generation
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <h2 className="text-2xl font-semibold text-[#0F172A]">
            Monthly Restaurant Report
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none border border-[#E5E7EB] bg-[#fff] px-4 pr-10 py-3 rounded-lg text-sm outline-none"
              >
                {months.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
            </div>

            <div className="relative">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="appearance-none border border-[#E5E7EB] bg-[#fff] px-4 pr-10 py-3 rounded-lg text-sm outline-none"
              >
                {branches.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
            </div>

            <button className="flex items-center gap-2 bg-[#059669] text-white px-5 py-2.5 rounded-lg shadow">
              <Download size={16} />
              Download Report (PDF)
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <ReportChartCard
            title="Sales"
            total={dashboardData?.totalSales ? `$${dashboardData.totalSales.toLocaleString()}` : "$270,250"}
            color="#10B981"
            type="bar"
            data={activeMonthlyData}
          />

          <ReportChartCard
            title="Expenses"
            total={dashboardData?.totalExpenses ? `$${dashboardData.totalExpenses.toLocaleString()}` : "$167,650"}
            color="#3B82F6"
            type="line"
            data={activeExpensesData}
          />

          <ReportChartCard
            title="Maintenance Cost"
            total={dashboardData?.totalMaintenance ? `$${dashboardData.totalMaintenance.toLocaleString()}` : "$19,900"}
            color="#8B5CF6"
            type="bar"
            data={activeMaintenanceData}
          />

          <ReportChartCard
            title="Salaries"
            total={dashboardData?.totalSalary ? `$${dashboardData.totalSalary.toLocaleString()}` : "$110,500"}
            color="#F97316"
            type="line"
            data={activeSalaryData}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <h2 className="text-2xl font-semibold text-[#0F172A]">
            Other Expenses Breakdown
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 bg-[#059669] text-white px-5 py-2.5 rounded-lg shadow">
              Overview
            </button>

            <button className="flex items-center gap-2 bg-[#fff] text-black px-5 py-2.5 rounded-lg shadow">
              Detailed View
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Expense Distribution</h3>

            <div className="h-[260px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ percent }) => `${(percent || 0).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-2 border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Expense Categories</h3>

              <p className="text-[#64748B]">Total: ${total.toLocaleString()}</p>
            </div>

            <div className="space-y-5">
              {data.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />

                      <p className="text-[#0F172A] font-medium">{item.name}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-[#64748B] text-sm">{item.percent}%</p>

                      <p className="font-semibold">
                        ${item.value.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: COLORS[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair">Recent Orders</h3>

              <button
                onClick={() => setActiveTab("orders")}
                className="text-[#059669] font-medium flex items-center gap-1"
              >
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b text-xs text-[#64748B] tracking-wide">
                  <tr>
                    <th className="py-3">ORDER ID</th>
                    <th className="py-3">CUSTOMER</th>
                    <th className="py-3">ITEMS</th>
                    <th className="py-3">AMOUNT</th>
                    <th className="py-3 text-end">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {activeOrders.map((o: any, i: number) => {
                    const idString = o.id || o.orderId || o._id || `#ORD-88${20-i}`;
                    const prefix = idString.includes("-") ? idString.split("-")[0] : "#ORD";
                    const number = idString.includes("-") ? idString.split("-")[1] : idString.substring(0, 4);

                    return (
                      <tr key={i} className="border-b last:border-none">
                        <td className="py-5 font-medium text-[#0F172A]">
                          <div>
                            <p>{prefix}-</p>
                            <p>{number}</p>
                          </div>
                        </td>

                        <td className="py-5">
                          <p className="font-medium">{o.customer}</p>
                          <p className="text-sm text-[#64748B]">{o.time}</p>
                        </td>

                        <td className="py-5 text-[#64748B] max-w-[200px]">
                          {o.items}
                        </td>

                        <td className="py-5 font-semibold">{o.amount}</td>

                        <td className="py-5 text-end">
                          <span
                            className={`px-3 py-1 rounded-md text-sm ${statusStyles[o.status]}`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair">Popular Items</h3>

              <button
                onClick={() => setActiveTab("menu")}
                className="text-[#059669] font-medium flex items-center gap-1"
              >
                View All →
              </button>
            </div>

            <div className="space-y-5">
              {activePopularItems.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-medium text-[#0F172A]">{p.name}</p>

                      <p className="text-sm text-[#64748B]">
                        {p.orders} orders today
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-[#0F172A]">{p.price}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("reports")}
              className="mt-6 w-full border border-[#E5E7EB] rounded-lg py-3 font-medium text-[#334155]"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
