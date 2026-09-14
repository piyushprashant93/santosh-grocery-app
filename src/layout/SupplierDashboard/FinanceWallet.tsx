import {
  Download,
  DollarSign,
  Clock,
  CheckCircle2,
  BarChart3,
  Building2, FileText,
  MoreHorizontal,
  Filter, Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import CreateInvoiceModal from "./CreateInvoiceModal";
import RequestPayoutModal from "./RequestPayoutModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const data = [
  { month: "Jan", revenue: 45000, profit: 12000 },
  { month: "Feb", revenue: 52000, profit: 15000 },
  { month: "Mar", revenue: 48000, profit: 13000 },
  { month: "Apr", revenue: 61000, profit: 18000 },
  { month: "May", revenue: 58000, profit: 16500 },
  { month: "Jun", revenue: 75000, profit: 22000 },
  { month: "Jul", revenue: 84000, profit: 26000 }
]

const invoices = [
  {
    id: "INV-2024-001",
    client: "Urban Bistro Group",
    issued: "Oct 20, 2024",
    due: "Nov 20, 2024",
    status: "Paid",
    amount: "$1,250.00"
  },
  {
    id: "INV-2024-002",
    client: "Whole Foods Local",
    issued: "Oct 18, 2024",
    due: "Nov 18, 2024",
    status: "Paid",
    amount: "$4,500.00"
  },
  {
    id: "INV-2024-003",
    client: "Green Grocers",
    issued: "Oct 25, 2024",
    due: "Nov 25, 2024",
    status: "Unpaid",
    amount: "$2,100.00"
  },
  {
    id: "INV-2024-004",
    client: "Sushi Zen",
    issued: "Oct 26, 2024",
    due: "Nov 26, 2024",
    status: "Overdue",
    amount: "$840.50"
  }
]

const statusStyles: any = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-orange-100 text-orange-700",
  Overdue: "bg-red-100 text-red-700"
}

const cards = [
  {
    title: "Total Balance",
    value: "$124,592.00",
    desc: "Total earnings across all channels",
    icon: <DollarSign size={20} />,
    iconBg: "bg-[#EEF2FF]",
    badge: "+12.5%",
    badgeColor: "text-green-700 bg-green-100",
  },
  {
    title: "Pending Payout",
    value: "$12,450.00",
    desc: "Scheduled for Oct 31, 2024",
    icon: <Clock size={20} />,
    iconBg: "bg-[#FFF7ED]",
    badge: "Pending",
    badgeColor: "text-[#F54900] bg-[#FFF1E6]",
  },
  {
    title: "Last Payout",
    value: "$8,500.00",
    desc: "Processed on Oct 24, 2024",
    icon: <CheckCircle2 size={20} />,
    iconBg: "bg-[#ECFDF5]",
    badge: "Paid",
    badgeColor: "text-[#64748B] bg-[#F1F5F9]",
  },
  {
    title: "Net Profit Margin",
    value: "24.8%",
    desc: "Higher than industry average",
    icon: <BarChart3 size={20} />,
    iconBg: "bg-[#EEF2FF]",
    badge: "+2.1%",
    badgeColor: "text-green-700 bg-green-100",
  },
];

const transactions = [
  {
    id: "TRX-9921",
    date: "Oct 24, 2024",
    desc: "Payout to Bank Account ****4589",
    status: "Completed",
    amount: "-$8,500.00",
    type: "debit"
  },
  {
    id: "TRX-9920",
    date: "Oct 23, 2024",
    desc: "Order #ORD-2891 Payment (Urban Bistro)",
    status: "Completed",
    amount: "+$1,250.00",
    type: "credit"
  },
  {
    id: "TRX-9919",
    date: "Oct 23, 2024",
    desc: "Order #ORD-2890 Payment (Sushi Zen)",
    status: "Completed",
    amount: "+$840.50",
    type: "credit"
  },
  {
    id: "TRX-9918",
    date: "Oct 22, 2024",
    desc: "Logistics Fee (DHL Express)",
    status: "Pending",
    amount: "-$320.00",
    type: "debit"
  },
  {
    id: "TRX-9917",
    date: "Oct 21, 2024",
    desc: "Order #ORD-2888 Payment (Whole Foods)",
    status: "Completed",
    amount: "+$4,500.00",
    type: "credit"
  }
]

const statusTransStyles: any = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-orange-100 text-orange-700"
}

export default function FinanceWallet() {
  const tabs = ["Transactions", "Invoices", "Finance Settings"];
  const [activeFinance, setActiveFinance] = useState(1);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openPayout, setOpenPayout] = useState(false);

  const [financeData, setFinanceData] = useState<any>(null);

  const fetchFinance = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/finance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFinanceData(data.data || data);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const revenueData = financeData?.revenue || [];
  const invoicesData = financeData?.invoices || [];
  const transactionsData = financeData?.transactions || [];
  const cardsData = financeData?.cards || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Financial Overview
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Track revenue, manage payouts, and handle invoices.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white shadow-sm">
            <Download size={18} />
            Export Report
          </button>

          <button onClick={() => setOpenPayout(true)} className="flex items-center gap-2 bg-[#2563EB] text-white rounded-lg px-4 py-2 shadow">
            <DollarSign size={18} />
            Request Payout
          </button>

          <RequestPayoutModal  open={openPayout}
                    onClose={() => setOpenPayout(false)} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {cardsData.map((c: any, i: number) => (
          <div
            key={i}
            className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${c.iconBg || 'bg-gray-100'}`}
              >
                {c.icon || <DollarSign size={20} />}
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${c.badgeColor || 'text-gray-700 bg-gray-100'}`}
              >
                {c.badge}
              </span>
            </div>

            <p className="text-[#62748E]">{c.title}</p>

            <h3 className="text-[28px] font-playfair mt-2">{typeof c.value === 'number' ? `$${c.value.toFixed(2)}` : c.value}</h3>

            <p className="text-[#94A3B8] mt-2 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">

        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="mb-6">

            <h3 className="font-playfair text-xl">
              Revenue Analytics
            </h3>

            <p className="text-[#6A7282] text-sm mt-1">
              Monthly revenue vs profit performance
            </p>

          </div>

          <div className="h-[320px] -ml-3">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={revenueData}>

                <XAxis dataKey="month" axisLine={false} tickLine={false} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  fill="#2563EB33"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  fill="#10B98133"
                  strokeWidth={3}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>



        <div className="space-y-6">

          <div className="bg-[#0F172A] text-white rounded-lg lg:rounded-xl p-6 shadow-lg">

            <h3 className="font-playfair text-xl">
              Payout Method
            </h3>

            <p className="text-[#94A3B8] mt-1">
              Primary account for receiving funds
            </p>

            <div className="border border-white/20 rounded-xl p-5 mt-6 bg-white/5">

              <div className="flex justify-between items-start">

                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2563EB33]">
                  <Building2 size={20} />
                </div>

                <span className="text-xs bg-[#1E3A8A] px-3 py-1 rounded">
                  PRIMARY
                </span>

              </div>

              <p className="mt-4 text-[#CBD5F5]">
                Chase Business
                <br />
                Checking
              </p>

              <p className="mt-3 text-lg tracking-widest">
                •••• •••• 4589
              </p>

            </div>

            <button className="w-full mt-5 bg-white text-[#0F172A] rounded-lg py-2.5 font-medium">
              Manage Accounts
            </button>

          </div>



          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <h3 className="font-playfair text-xl mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <button onClick={() => setOpenInvoice(true)} className="border border-[#E5E7EB] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#F8FAFC]">

                <FileText size={20} />
                Create Invoice

              </button>

              <CreateInvoiceModal  open={openInvoice}
                    onClose={() => setOpenInvoice(false)} />

              <button className="border border-[#E5E7EB] rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-[#F8FAFC]">

                <Download size={20} />
                Statement

              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="space-y-6">

        <div className="grid grid-cols-3 bg-[#F1F5F9] rounded-xl p-1">

          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveFinance(i)}
              className={`py-2 rounded-lg text-sm font-medium transition
                ${activeFinance === i
                  ? "bg-white text-[#2563EB] shadow"
                  : "text-[#0F172A]"
                }`}
            >
              {tab}
            </button>
          ))}

        </div>
        {
          activeFinance === 0 &&
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h3 className="font-playfair text-xl">
                Recent Transactions
              </h3>

              <button className="flex items-center gap-2 text-[#0F172A]">

                <Filter size={16} />
                Filter

              </button>

            </div>



            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b text-sm text-[#62748E]">

                  <tr>

                    <th className="py-3 font-normal">TRANSACTION ID</th>
                    <th className="py-3 font-normal">DATE</th>
                    <th className="py-3 font-normal">DESCRIPTION</th>
                    <th className="py-3 font-normal">STATUS</th>
                    <th className="py-3 font-normal text-end">AMOUNT</th>

                  </tr>

                </thead>



                <tbody>

                  {transactionsData.map((t: any, i: number) => (
                    <tr key={t.id || t._id || i} className="border-b last:border-none">

                      <td className="py-4 text-[#64748B]">
                        {t.id || t._id?.substring(0,8)}
                      </td>

                      <td className="py-4 text-[#64748B]">
                        {t.date || new Date(t.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 text-[#0F172A] font-medium">
                        {t.desc || t.description}
                      </td>

                      <td className="py-4">

                        <span className={`px-3 py-1 rounded-full text-xs ${statusTransStyles[t.status || "Completed"] || "bg-gray-100"}`}>
                          {t.status || "Completed"}
                        </span>

                      </td>

                      <td
                        className={`py-4 text-end font-medium ${t.type === "credit"
                          ? "text-green-600"
                          : "text-[#0F172A]"
                          }`}
                      >
                        {typeof t.amount === "number" ? `$${t.amount.toFixed(2)}` : t.amount}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        }
        {
          activeFinance === 1 &&
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h3 className="font-playfair text-xl">
                Issued Invoices
              </h3>

              <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg shadow">
                New Invoice
              </button>

            </div>



            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b text-sm text-[#62748E]">

                  <tr>

                    <th className="py-3 font-normal">INVOICE #</th>
                    <th className="py-3 font-normal">CLIENT</th>
                    <th className="py-3 font-normal">ISSUED DATE</th>
                    <th className="py-3 font-normal">DUE DATE</th>
                    <th className="py-3 font-normal">STATUS</th>
                    <th className="py-3 font-normal text-end">AMOUNT</th>
                    <th className="py-3 font-normal text-end">ACTIONS</th>

                  </tr>

                </thead>



                <tbody>

                  {invoicesData.map((inv: any, i: number) => (
                    <tr key={inv.id || inv._id || i} className="border-b last:border-none">

                      <td className="py-4 text-[#64748B]">
                        {inv.id || inv._id?.substring(0,8) || inv.invoiceNumber}
                      </td>

                      <td className="py-4 font-medium text-[#0F172A]">
                        {inv.client || inv.clientName || "Unknown Client"}
                      </td>

                      <td className="py-4 text-[#64748B]">
                        {inv.issued || inv.issuedDate || new Date(inv.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 text-[#64748B]">
                        {inv.due || inv.dueDate || "N/A"}
                      </td>

                      <td className="py-4">

                        <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[inv.status || "Unpaid"] || "bg-gray-100"}`}>
                          {inv.status || "Unpaid"}
                        </span>

                      </td>

                      <td className="py-4 text-end font-medium text-[#0F172A]">
                        {typeof inv.amount === "number" ? `$${inv.amount.toFixed(2)}` : (inv.total ? `$${inv.total.toFixed(2)}` : inv.amount)}
                      </td>

                      <td className="py-4 text-end">

                        <button className="text-[#64748B]">
                          <MoreHorizontal size={18} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        }
        {
          activeFinance === 2 &&
          <div className="grid lg:grid-cols-2 gap-6">

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

              <div className="mb-6">
                <h3 className="font-playfair text-xl">
                  Tax Information
                </h3>

                <p className="text-[#6A7282] mt-1">
                  Manage your tax documents and settings
                </p>
              </div>



              <div className="space-y-4">

                <div className="border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <FileText size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-[#0F172A]">
                        W-9 Form
                      </p>

                      <p className="text-sm text-[#6A7282]">
                        Verified on Jan 15, 2024
                      </p>
                    </div>

                  </div>

                  <button className="text-[#2563EB] font-medium">
                    Update
                  </button>

                </div>



                <div className="border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-[#0F172A]">
                        Tax ID (EIN)
                      </p>

                      <p className="text-sm text-[#6A7282]">
                        ••••••9921
                      </p>
                    </div>

                  </div>

                  <button className="text-[#2563EB] font-medium">
                    View
                  </button>

                </div>

              </div>

            </div>



            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="font-playfair text-xl">
                  Payout Preferences
                </h3>

                <p className="text-[#6A7282] mt-1">
                  Configure when and how you get paid
                </p>

              </div>



              <div className="space-y-6">

                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex gap-3">

                  <Info size={18} className="text-[#2563EB] mt-1" />

                  <div>

                    <p className="text-[#1D4ED8] font-medium">
                      Automatic Payouts Enabled
                    </p>

                    <p className="text-[#1D4ED8] text-sm mt-1">
                      Your earnings are automatically sent to your primary bank account every Monday.
                    </p>

                  </div>

                </div>



                <div>

                  <label className="text-[#374151] block mb-2">
                    Payout Schedule
                  </label>

                  <select className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 outline-none">

                    <option>Weekly (Every Monday)</option>

                    <option>Bi-Weekly</option>

                    <option>Monthly</option>

                  </select>

                </div>

              </div>

            </div>

          </div>
        }
      </div>
    </div>
  );
}
