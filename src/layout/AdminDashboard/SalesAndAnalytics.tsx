import { useState, useEffect } from "react"
import { Calendar, Download, TrendingUp, DollarSign, Activity, Loader2, AlertTriangle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from "../../lib/api"
import { useCurrency } from "../../context/CurrencyContext";


const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function SalesAndAnalytics() {
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.get('/api/v1/admin/analytics')
      setAnalyticsData(response.data?.data || response.data || {})
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem("authToken")
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com"
      const response = await fetch(`${baseUrl}/api/v1/admin/reports`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      
      if (!response.ok) throw new Error("Failed to download report")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = "sales-analytics-report.pdf" 
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      alert("Error downloading report")
    } finally {
      setDownloading(false)
    }
  }

  // Map API data or fallback to defaults
  let revenueData: any[] = []
  if (analyticsData?.revenueGrowth && Array.isArray(analyticsData.revenueGrowth)) {
    revenueData = analyticsData.revenueGrowth.map((item: any) => ({
      name: item._id || item.name,
      retail: item.retail || 0,
      restaurant: item.restaurant || item.revenue || 0
    }))
  } else {
    revenueData = [
      { name: 'Jan', retail: 4000, restaurant: 2400 },
      { name: 'Feb', retail: 3000, restaurant: 1398 },
      { name: 'Mar', retail: 2000, restaurant: 9800 },
      { name: 'Apr', retail: 2780, restaurant: 3908 },
      { name: 'May', retail: 1890, restaurant: 4800 },
      { name: 'Jun', retail: 2390, restaurant: 3800 },
    ]
  }

  let categoryData: any[] = []
  if (analyticsData?.salesByCategory && Array.isArray(analyticsData.salesByCategory)) {
    categoryData = analyticsData.salesByCategory.map((item: any) => ({
      name: item._id || item.name || 'Unknown',
      value: item.value || item.count || item.totalSales || 0
    }))
  } else {
    categoryData = [
      { name: 'Electronics', value: 400 },
      { name: 'Food & Bev', value: 300 },
      { name: 'Fashion', value: 300 },
      { name: 'Home', value: 200 },
    ]
  }

  const metrics = {
    cac: analyticsData?.metrics?.cac || 12.50,
    aov: analyticsData?.metrics?.aov || 45.00,
    retentionRate: analyticsData?.metrics?.retentionRate || 85
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Sales & Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into platform performance and user behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            Last 30 Days
          </button>
          <button 
            onClick={handleDownloadReport}
            disabled={downloading}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-70"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {downloading ? "Downloading..." : "Export Report"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center pt-20">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          </div>
        )}
        
        {/* Revenue Growth Chart */}
        <div className="xl:col-span-2 bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[400px]">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Revenue Growth</h2>
            <p className="text-gray-500 text-sm mt-1">Comparison between Retail and Restaurant vendors.</p>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRestaurant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
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
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value}`, undefined]}
                />
                <Area 
                  type="monotone" 
                  dataKey="retail" 
                  name="Retail"
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRetail)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="restaurant" 
                  name="Restaurant"
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRestaurant)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Chart */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[400px]">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Sales by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Top performing product categories.</p>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any) => [`${value} Sales`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm font-medium">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-2 justify-center" style={{ color: COLORS[i % COLORS.length] }}>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="truncate max-w-[80px]" title={cat.name}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CAC Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Customer Acquisition Cost</p>
            <div className="text-gray-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{formatPrice(metrics.cac)}</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">+4% from last month</p>
          </div>
        </div>

        {/* AOV Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Average Order Value</p>
            <div className="text-gray-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{formatPrice(metrics.aov)}</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">+2% from last month</p>
          </div>
        </div>

        {/* Retention Rate Card */}
        <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Retention Rate</p>
            <div className="text-gray-400">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{metrics.retentionRate}%</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">Excellent</p>
          </div>
        </div>

      </div>

    </div>
  )
}
