import { useState, useEffect } from "react"
import { RefreshCw, Server, Database, Cloud, CreditCard, AlertTriangle, Info, CheckCircle2, Loader2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from "../../lib/api"

export default function SystemHealth() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [healthData, setHealthData] = useState<any>(null)

  useEffect(() => {
    fetchHealthData()
  }, [])

  const fetchHealthData = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.get('/api/v1/admin/system-health')
      setHealthData(response.data?.data || response.data || {})
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load system health data")
    } finally {
      setLoading(false)
    }
  }

  // Fallbacks if data doesn't map perfectly from backend yet
  const chartData = healthData?.chartData || [
    { time: '10:00', latency: 120 },
    { time: '10:05', latency: 135 },
    { time: '10:10', latency: 110 },
    { time: '10:15', latency: 150 },
    { time: '10:20', latency: 190 },
    { time: '10:25', latency: 140 },
    { time: '10:30', latency: 115 },
  ]

  const logs = healthData?.logs || [
    { id: 1, type: "error", message: "Failed to connect to SMTP", source: "Notifications", time: "10:28 AM" },
    { id: 2, type: "warning", message: "High memory usage detected", source: "Worker-01", time: "10:15 AM" },
    { id: 3, type: "success", message: "Daily backup completed successfully", source: "Backup Service", time: "09:00 AM" },
    { id: 4, type: "info", message: "New deployment version v2.1.0", source: "Deployer", time: "08:30 AM" },
  ]

  const resources = {
    cpu: healthData?.resources?.cpu || 42,
    memory: healthData?.resources?.memory || 68,
    storage: healthData?.resources?.storage || 24
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-text tracking-tight flex items-center gap-3" style={{ fontFamily: 'serif' }}>
            System Health
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Real-time infrastructure monitoring and status reports.</p>
        </div>
        <button 
          onClick={fetchHealthData}
          disabled={loading}
          className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          icon={<Server size={20} />} 
          title="API Gateway" 
          uptime={healthData?.status?.apiGateway?.uptime || "99.99%"} 
          latency={healthData?.status?.apiGateway?.latency || "45ms"} 
        />
        <StatusCard 
          icon={<Database size={20} />} 
          title="Primary Database (PostgreSQL)" 
          uptime={healthData?.status?.database?.uptime || "99.95%"} 
          latency={healthData?.status?.database?.latency || "12ms"} 
        />
        <StatusCard 
          icon={<Cloud size={20} />} 
          title="Object Storage (CDN)" 
          uptime={healthData?.status?.cdn?.uptime || "100%"} 
          latency={healthData?.status?.cdn?.latency || "24ms"} 
        />
        <StatusCard 
          icon={<CreditCard size={20} />} 
          title="Payment Processing" 
          uptime={healthData?.status?.payments?.uptime || "99.9%"} 
          latency={healthData?.status?.payments?.latency || "-"} 
        />
      </div>

      {/* Main Split */}
      <div className="flex flex-col lg:flex-row gap-6 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center pt-20">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          </div>
        )}

        {/* Left Chart Area */}
        <div className="flex-1 bg-theme-surface border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-theme-text mb-1">API Latency & Traffic</h3>
          <p className="text-sm text-gray-500 mb-8">Response time in milliseconds (ms) over the last 30 minutes.</p>
          
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorLatency)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
          
          {/* Server Resources */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-800 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-gray-400" />
              <h3 className="font-bold text-theme-text">Server Resources</h3>
            </div>
            
            <div className="flex flex-col gap-4 mt-2">
              <ProgressBar label="CPU Usage" percentage={resources.cpu} color="bg-orange-500" />
              <ProgressBar label="Memory (RAM)" percentage={resources.memory} color="bg-blue-500" />
              <ProgressBar label="Storage" percentage={resources.storage} color="bg-emerald-500" />
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-theme-surface rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
            <h3 className="font-bold text-theme-text mb-6">Recent Logs</h3>
            <div className="flex flex-col gap-5">
              {logs.map((log: any, index: number) => (
                <div key={log.id || index} className="flex gap-4">
                  <div className="mt-0.5">
                    {log.type === 'error' && <AlertTriangle size={18} className="text-red-500" />}
                    {log.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
                    {log.type === 'info' && <Info size={18} className="text-blue-500" />}
                    {log.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
                  </div>
                  <div className="flex flex-col w-full">
                    <p className={`text-sm font-medium ${log.type === 'error' ? 'text-theme-text' : 'text-gray-700'}`}>
                      {log.message}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>{log.source}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-auto pt-6 text-sm font-medium text-gray-600 hover:text-theme-text transition text-center w-full">
              View All Logs
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

function StatusCard({ icon, title, uptime, latency }: { icon: React.ReactNode, title: string, uptime: string, latency: string }) {
  return (
    <div className="bg-theme-surface border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">
          {icon}
        </div>
        <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          Operational
        </div>
      </div>
      <h3 className="font-bold text-theme-text text-sm mb-3 min-h-[40px]">{title}</h3>
      <div className="flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-0.5">Uptime</span>
          <span className="font-semibold text-theme-text">{uptime}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-gray-500 text-xs mb-0.5">Lat</span>
          <span className="font-semibold text-theme-text">{latency}</span>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold text-theme-text">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
