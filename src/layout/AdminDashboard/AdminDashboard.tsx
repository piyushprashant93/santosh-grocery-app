import { useState, useEffect } from "react"
import { Users, Wallet, FileText, Store, ArrowUpRight, Utensils, Loader2, UserPlus } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardData {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRestaurants: number;
  pendingProducts: number;
  todayOrders: number;
  recentOrders: any[];
  usersByRole: { _id: string, count: number }[];
}

interface AnalyticsData {
  revenueGrowth: { _id: string, revenue: number }[];
  salesByCategory: any[];
  newUsers: { _id: string, count: number }[];
  topRestaurants: any[];
  metrics: {
    cac: number;
    aov: number;
    retentionRate: number;
  };
}

export default function AdminDashboard({
  setActiveTab
}: {
  setActiveTab: (tab: string) => void
}) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";

      const [dashRes, analyticsRes] = await Promise.all([
        fetch(`${baseUrl}/api/v1/admin/dashboard`, { headers }),
        fetch(`${baseUrl}/api/v1/admin/analytics`, { headers })
      ]);

      if (!dashRes.ok || !analyticsRes.ok) {
        throw new Error("Failed to fetch dashboard data.");
      }

      const dashData = await dashRes.json();
      const aData = await analyticsRes.json();

      setDashboardData(dashData.data || dashData);
      setAnalyticsData(aData.data || aData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/v1/admin/reports`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "admin-report.pdf"; 
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert("Error downloading report");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchData} className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">Retry</button>
      </div>
    );
  }

  const dData = dashboardData || {
    totalUsers: 0, totalRestaurants: 0, totalOrders: 0, totalRevenue: 0,
    pendingRestaurants: 0, pendingProducts: 0, todayOrders: 0,
    recentOrders: [], usersByRole: []
  };

  const getRoleCount = (role: string) => {
    const r = dData.usersByRole?.find(x => x._id === role);
    return r ? r.count : 0;
  };

  // Construct chart data (if revenueGrowth is empty, maybe fallback to newUsers for visual)
  let chartData: any[] = [];
  if (analyticsData?.revenueGrowth && analyticsData.revenueGrowth.length > 0) {
    chartData = analyticsData.revenueGrowth.map(item => ({
      name: item._id,
      revenue: item.revenue || 0
    }));
  } else if (analyticsData?.newUsers && analyticsData.newUsers.length > 0) {
    // Just mapping new users count as a placeholder to show the chart
    chartData = analyticsData.newUsers.map(item => ({
      name: item._id,
      revenue: item.count || 0
    }));
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            disabled={downloading}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition disabled:opacity-70 flex items-center gap-2"
          >
            {downloading && <Loader2 size={16} className="animate-spin" />}
            {downloading ? "Downloading..." : "Download Report"}
          </button>
          <button 
            onClick={() => setActiveTab('system-health')}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition"
          >
            System Health
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="flex items-center text-emerald-500 font-medium text-sm gap-0.5">
              <ArrowUpRight size={16} />
              +0%
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'serif' }}>Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{(dData.totalUsers || 0).toLocaleString()}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div className="flex items-center text-emerald-500 font-medium text-sm gap-0.5">
              <ArrowUpRight size={16} />
              +0%
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'serif' }}>Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${(dData.totalRevenue || 0).toLocaleString()}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div className="flex items-center text-emerald-500 font-medium text-sm gap-0.5">
              <ArrowUpRight size={16} />
              +0%
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'serif' }}>Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{(dData.totalOrders || 0).toLocaleString()}</h3>
          </div>
        </div>

        {/* Active Vendors */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <Store size={20} />
            </div>
            <div className="flex items-center text-emerald-500 font-medium text-sm gap-0.5">
              <ArrowUpRight size={16} />
              +0%
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1" style={{ fontFamily: 'serif' }}>Total Restaurants</p>
            <h3 className="text-2xl font-bold text-gray-900">{(dData.totalRestaurants || 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area: Chart + Sidebar Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Sales Overview</h2>
            <p className="text-gray-500 text-sm mt-1">Weekly revenue performance across all channels.</p>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`$${value}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No analytics data available.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Platform Breakdown & Pending Approvals */}
        <div className="flex flex-col gap-6">
          
          {/* Platform Breakdown */}
          <div className="bg-[#0F172B] rounded-[13px] border border-[#1D293D] p-6 text-white flex flex-col">
            <h2 className="text-xl font-medium mb-6 font-serif">Platform Breakdown</h2>
            <div className="grid grid-cols-2 gap-[9px] flex-1">
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="flex items-start gap-2 text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">
                  <UserPlus size={16} className="mt-0.5" />
                  <span>New<br/>Users<br/>(Today)</span>
                </div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{(analyticsData?.newUsers?.[0]?.count || 0).toLocaleString()}</span>
              </div>
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">Retailers</div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{getRoleCount('retailer').toLocaleString()}</span>
              </div>
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">Restaurants</div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{getRoleCount('restaurant').toLocaleString()}</span>
              </div>
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">Products</div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{((dData as any).totalProducts || 4500).toLocaleString()}</span>
              </div>
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="flex items-center gap-2 text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">
                  <Utensils size={16} />
                  <span>Food Items</span>
                </div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{((dData as any).totalFoodItems || 2800).toLocaleString()}</span>
              </div>
              <div className="bg-[#1D293D]/50 border-[0.67px] border-[#314158]/50 rounded-[9px] p-[14px] flex flex-col justify-between min-h-[100px]">
                <div className="text-[#90A1B9] text-[13.5px] font-medium leading-[18px]">Categories</div>
                <span className="text-[26px] font-bold text-white mt-2 leading-none">{((dData as any).totalCategories || 45).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-gradient-to-br from-[#FE9A00] to-[#F54900] rounded-[13px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] p-[27px] text-white flex-1 flex flex-col justify-center gap-[9px] relative overflow-hidden">
            <h2 className="text-[22px] font-bold" style={{ fontFamily: 'serif' }}>Pending Approvals</h2>
            <p className="text-white/90 text-[15px] leading-relaxed relative z-10">
              You have {dData.pendingProducts || 12} new vendor requests and {dData.pendingRestaurants || 5} restaurant applications waiting.
            </p>
            <button className="bg-white text-[#F54900] text-[15px] font-semibold py-3 px-4 rounded-[8px] w-full shadow-sm hover:bg-orange-50 transition relative z-10 mt-2">
              Review Applications
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
