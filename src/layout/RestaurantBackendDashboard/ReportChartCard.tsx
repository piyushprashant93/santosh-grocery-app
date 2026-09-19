import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function ReportChartCard({
  title,
  total,
  color,
  type = "bar",
  data
}: any) {

  return (

    <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-medium text-lg">
          {title}
        </h3>

        <p className={`font-medium`} style={{ color }}>
          Total: {total}
        </p>

      </div>


      <div className="h-[320px] -ml-4 -mb-4">

        <ResponsiveContainer width="100%" height="100%">

          {type === "bar" ? (

            <BarChart data={data}>

              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />

              <Tooltip />

              <Bar
                dataKey="value"
                fill={color}
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          ) : (

            <LineChart data={data}>

              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
              />

            </LineChart>

          )}

        </ResponsiveContainer>

      </div>

    </div>

  )
}