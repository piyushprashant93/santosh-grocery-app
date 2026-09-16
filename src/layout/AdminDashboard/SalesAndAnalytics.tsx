import { Calendar, Download, TrendingUp, DollarSign, Activity } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  { name: 'Jan', retail: 4000, restaurant: 2400 },
  { name: 'Feb', retail: 3000, restaurant: 1398 },
  { name: 'Mar', retail: 2000, restaurant: 9800 },
  { name: 'Apr', retail: 2780, restaurant: 3908 },
  { name: 'May', retail: 1890, restaurant: 4800 },
  { name: 'Jun', retail: 2390, restaurant: 3800 },
]

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Food & Bev', value: 300 },
  { name: 'Fashion', value: 300 },
  { name: 'Home', value: 200 },
]

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

export default function SalesAndAnalytics() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Sales & Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into platform performance and user behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Revenue Growth Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[400px]">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[400px]">
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
                  {categoryData.map((entry, index) => (
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
            <div className="flex items-center gap-2 text-sky-500 justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-sky-500"></div>
              Electronics
            </div>
            <div className="flex items-center gap-2 text-emerald-500 justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
              Food & Bev
            </div>
            <div className="flex items-center gap-2 text-amber-500 justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-500"></div>
              Fashion
            </div>
            <div className="flex items-center gap-2 text-red-500 justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div>
              Home
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CAC Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Customer Acquisition Cost</p>
            <div className="text-gray-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">$12.50</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">+4% from last month</p>
          </div>
        </div>

        {/* AOV Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Average Order Value</p>
            <div className="text-gray-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">$45.00</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">+2% from last month</p>
          </div>
        </div>

        {/* Retention Rate Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'serif' }}>Retention Rate</p>
            <div className="text-gray-400">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">85%</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">Excellent</p>
          </div>
        </div>

      </div>

    </div>
  )
}
