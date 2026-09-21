import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts"
import { TrendingUp, ShoppingBag } from "lucide-react"

const salesData = [
  { day: "Mon", value: 4000 },
  { day: "Tue", value: 2800 },
  { day: "Wed", value: 2000 },
  { day: "Thu", value: 2700 },
  { day: "Fri", value: 1900 },
  { day: "Sat", value: 2300 },
  { day: "Sun", value: 3500 }
]

const orderData = [
  { day: "Mon", value: 25 },
  { day: "Tue", value: 18 },
  { day: "Wed", value: 32 },
  { day: "Thu", value: 45 },
  { day: "Fri", value: 30 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 60 }
]

export default function ChartsSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18}/>
          <h3 className="font-playfair text-xl">Sales Overview</h3>
        </div>

        <p className="text-theme-muted text-sm mb-6">
          Weekly sales performance
        </p>

        <div className="h-[260px] -ml-4">

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="day"
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#F97316"
                fill="#FDBA74"
                strokeWidth={3}
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

      </div>


      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={18}/>
          <h3 className="font-playfair text-xl">Order Volume</h3>
        </div>

        <p className="text-theme-muted text-sm mb-6">
          Daily order statistics
        </p>

        <div className="h-[260px] -ml-2">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="day"
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[6,6,0,0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  )
}