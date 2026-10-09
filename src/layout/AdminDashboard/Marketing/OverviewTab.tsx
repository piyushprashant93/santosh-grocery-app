import { useState, useEffect } from "react"
import { BarChart3, Users, MousePointerClick, TrendingUp, PlusCircle, Radio, Image as ImageIcon, Loader2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { apiFetch } from "../../../lib/apiFetch"

export default function OverviewTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchOverview()
  }, [days])

  const fetchOverview = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/admin/marketing/overview?days=${days}`)
      if (res.ok) {
        const json = await res.json()
        setData(json.data || json)
      }
    } catch (err) {
      console.error("Failed to fetch marketing overview", err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'Active Campaigns', value: data?.activeCampaigns || '0', change: '+2', trend: 'up', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Reach', value: data?.totalReach || '0', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Clicks', value: data?.totalClicks || '0', change: '-3%', trend: 'down', icon: MousePointerClick, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Conversion Rate', value: data?.conversionRate || '0%', change: '+0.5%', trend: 'up', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' }
  ]

  const chartData = data?.performanceChart || [
    { name: 'Mon', organic: 0, paid: 0 },
    { name: 'Tue', organic: 0, paid: 0 },
    { name: 'Wed', organic: 0, paid: 0 },
    { name: 'Thu', organic: 0, paid: 0 },
    { name: 'Fri', organic: 0, paid: 0 },
    { name: 'Sat', organic: 0, paid: 0 },
    { name: 'Sun', organic: 0, paid: 0 },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-theme-text">{stat.value}</h4>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Campaign Performance</h3>
              <p className="text-sm text-gray-500">Reach vs Clicks over the selected period</p>
            </div>
            <select 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-orange-500"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={365}>This Year</option>
            </select>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any) => [value, name === 'organic' ? 'Organic Reach' : 'Paid Reach']}
                />
                <Area type="monotone" dataKey="organic" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                <Area type="monotone" dataKey="paid" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-theme-text mb-1" style={{ fontFamily: 'serif' }}>Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-6">Launch new marketing initiatives</p>
          
          <div className="flex flex-col gap-3 flex-1 justify-center">
            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <PlusCircle size={20} />
                </div>
                <div className="text-left">
                  <h5 className="font-bold text-theme-text text-sm group-hover:text-emerald-700 transition">New Campaign</h5>
                  <p className="text-xs text-gray-500">Create a promotional campaign</p>
                </div>
              </div>
            </button>
            
            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Radio size={20} />
                </div>
                <div className="text-left">
                  <h5 className="font-bold text-theme-text text-sm group-hover:text-blue-700 transition">Send Broadcast</h5>
                  <p className="text-xs text-gray-500">Push notification to users</p>
                </div>
              </div>
            </button>
            
            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <div className="text-left">
                  <h5 className="font-bold text-theme-text text-sm group-hover:text-orange-700 transition">Add Banner</h5>
                  <p className="text-xs text-gray-500">Update app homepage banners</p>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
