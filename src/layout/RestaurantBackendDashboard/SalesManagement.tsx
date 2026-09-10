import {
  Download, Calendar, CheckCircle2, FileText, AlertCircle, Calendar as CalendarIcon, Search, Plus, X
} from "lucide-react";
import { extractList } from "../../utils/dataHelper";
import { useState, useEffect } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const fields = [
  { key: "dineIn", label: "In House Dine-In" },
  { key: "takeOut", label: "In House Take Out" },
  { key: "event", label: "Event" },
  { key: "catering", label: "Catering" },
  { key: "uber", label: "Uber Eats" },
  { key: "deliveroo", label: "Deliveroo" },
  { key: "grubhub", label: "GrubHub" },
  { key: "justeat", label: "JustEat" },
  { key: "instacart", label: "InstaCart" },
  { key: "doordash", label: "DoorDash" },
  { key: "ezecater", label: "EzeCater" },
  { key: "other", label: "Other" }
]

const entries = [
  {
    date: "2024-02-12",
    inhouse: "$1200.00",
    delivery: "$3050.00",
    total: "$4250.00"
  },
  {
    date: "2024-02-11",
    inhouse: "$1100.00",
    delivery: "$2790.50",
    total: "$3890.50"
  },
  {
    date: "2024-02-10",
    inhouse: "$1800.00",
    delivery: "$3300.00",
    total: "$5100.00"
  }
]

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

const data = [
  { day: "Sat", inhouse: 1800, delivery: 3000 },
  { day: "Sun", inhouse: 1200, delivery: 2600 },
  { day: "Mon", inhouse: 1400, delivery: 2900 }
]

export default function SalesManagement({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const [salesEntries, setSalesEntries] = useState<any[]>(entries);
  const [missingDates, setMissingDates] = useState<string[]>([]);
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  const [values, setValues] = useState<any>({
    dineIn: "",
    takeOut: "",
    event: "",
    catering: "",
    uber: "",
    deliveroo: "",
    grubhub: "",
    justeat: "",
    instacart: "",
    doordash: "",
    ezecater: "",
    other: ""
  })

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/sales-closing`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = extractList(data);
        setSalesEntries(list.length > 0 ? list : entries);
      }
    } catch(err) { console.error(err); }
  };

  const fetchMissing = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/sales-closing/missing`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMissingDates(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchSales();
    fetchMissing();
  }, []);

  const handleSave = async () => {
    const total = Object.values(values).reduce((sum: number, v: any) => sum + (parseFloat(v) || 0), 0);
    try {
      const payload = {
        date: dateStr,
        ...values,
        total
      };
      const res = await fetch(`${API_BASE}/restaurant-panel/sales-closing`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Sales saved");
        fetchSales();
        fetchMissing();
        setValues({
          dineIn: "", takeOut: "", event: "", catering: "", uber: "", deliveroo: "", grubhub: "", justeat: "", instacart: "", doordash: "", ezecater: "", other: ""
        });
      }
    } catch(err) { console.error(err); }
  };

  const handleChange = (key: string, val: string) => {
    setValues((prev: any) => ({ ...prev, [key]: val }))
  }

  const total =
    Object.values(values).reduce((sum: number, v: any) => sum + (parseFloat(v) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Sales Management
          </h1>

          <p className="text-[#64748B] mt-2">
            Track daily revenue across all delivery platforms and in-house dining.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button className="border border-[#E5E7EB] rounded-lg px-4 py-2 flex gap-2 items-center bg-white">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">

        <div className="space-y-5">
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-playfair text-xl">Daily Sales Entry</h3>
              <p className="text-[#64748B] mt-1">
                Enter end-of-day sales figures for each platform.
              </p>
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Calendar size={16} className="text-[#64748B]" />
              <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">

            {fields.map((f) => (
              <div key={f.key}>
                <p className="text-[#334155] mb-2">{f.label}</p>
                <input
                  value={values[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder="0.00"
                  className="w-full border rounded-lg px-4 py-3 outline-none"
                />
              </div>
            ))}

          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">

            <div>
              <p className="text-[#64748B] text-sm">Total Daily Revenue</p>
              <h3 className="text-2xl font-semibold">${total.toFixed(2)}</h3>
            </div>

            <button onClick={handleSave} className="bg-[#009966] text-white px-6 py-3 rounded-lg font-medium">
              Save Daily Report
            </button>

          </div>

        </div>
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-0 shadow-sm">

      <div className="p-6 border-b">
        <h3 className="font-playfair text-xl">Recent Entries</h3>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left min-w-[800px]">

          <thead className="bg-[#F8FAFC] text-sm text-[#64748B]">
            <tr>
              <th className="py-4 px-6 font-medium">DATE</th>
              <th className="py-4 px-6 font-medium">IN-HOUSE</th>
              <th className="py-4 px-6 font-medium">DELIVERY APPS</th>
              <th className="py-4 px-6 font-medium">TOTAL</th>
              <th className="py-4 px-6 font-medium">STATUS</th>
              <th className="py-4 px-6 font-medium text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {salesEntries.map((e, i) => {
              const dateParts = e.date ? e.date.split("T")[0].split("-") : ["2024", "02", "12"];
              const inhouse = parseFloat(e.inhouse || e.dineIn || "0") + parseFloat(e.takeOut || "0");
              const delivery = (e.total || 0) - inhouse;
              return (
              <tr key={e._id || i} className="border-t">

                <td className="py-5 px-6 text-[#0F172A] font-medium">
                  <div className="leading-5">
                    <p>{dateParts[0] + "-" + dateParts[1]}</p>
                    <p>{dateParts[2]}</p>
                  </div>
                </td>

                <td className="py-5 px-6 text-[#64748B]">
                  ${inhouse.toFixed(2)}
                </td>

                <td className="py-5 px-6 text-[#64748B]">
                  ${delivery.toFixed(2)}
                </td>

                <td className="py-5 px-6 font-semibold text-[#0F172A]">
                  ${typeof e.total === "number" ? e.total.toFixed(2) : parseFloat(e.total || "0").toFixed(2)}
                </td>

                <td className="py-5 px-6">
                  <span className="flex items-center gap-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm w-fit">
                    <CheckCircle2 size={16} />
                    Verified
                  </span>
                </td>

                <td className="py-5 px-6 text-center">
                  <FileText size={18} className="text-[#94A3B8] cursor-pointer mx-auto" />
                </td>

              </tr>
            )})}

          </tbody>

        </table>

      </div>

    </div>
        </div>

        <div className="space-y-5">

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">

            <h3 className="font-playfair text-lg">Sales Trend</h3>
            <p className="text-[#64748B] text-sm mb-4">Last 3 days performance</p>

            <div className="h-[260px] mt-6 -ml-5">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={6}>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 12 }} />

                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    iconType="circle"
                  />

                  <Bar
                    dataKey="inhouse"
                    stackId="a"
                    fill="#16A34A"
                    radius={[0, 0, 4, 4]}
                  />

                  <Bar
                    dataKey="delivery"
                    stackId="a"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

          <div className="rounded-xl p-6 text-white bg-gradient-to-br from-[#1E1B4B] to-[#312E81] shadow-sm">

            <h3 className="font-playfair text-lg mb-4">Weekly Insight</h3>

            <h2 className="text-3xl font-semibold">$13,240.50</h2>

            <p className="text-sm mt-2 text-white/80">
              +12% vs last week
            </p>

            <p className="mt-4 text-sm text-white/80">
              Top Platform <span className="font-semibold text-white">Uber Eats (32%)</span>
            </p>

            <div className="w-full h-2 bg-white/20 rounded-full mt-3">
              <div className="w-[32%] h-full bg-green-400 rounded-full" />
            </div>

          </div>

              {missingDates.length > 0 && (
              <div className="border border-[#FACC15] bg-[#FFFBEB] rounded-xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 min-w-10 flex items-center justify-center rounded-full bg-[#FEF3C7]">
                  <AlertCircle className="text-[#D97706]" size={20} />
                </div>
                <div>
                  <h3 className="text-[#92400E] font-semibold text-lg font-playfair">
                    Missing Data
                  </h3>
                  <p className="text-[#B45309] mt-1 max-w-md">
                    You haven't entered sales data for <span className="font-semibold">{missingDates.join(", ")}</span>. Please update to ensure accurate weekly reports.
                  </p>
                  <button onClick={() => setDateStr(missingDates[0])} className="mt-4 text-[#92400E] font-medium flex items-center gap-1 hover:underline">
                    Fix Now →
                  </button>
                </div>
              </div>
              )}

        </div>



      </div>
    </div>
  );
}
