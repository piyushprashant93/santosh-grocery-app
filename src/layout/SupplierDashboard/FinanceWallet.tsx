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
import toast from "react-hot-toast";
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

const statusStyles: any = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-orange-100 text-orange-700",
  Overdue: "bg-red-100 text-red-700"
}

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

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Exporting finance report...");
      const res = await fetch(`${API_BASE}/supplier/finance/export`, { headers: authHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `supplier-finance-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Export successful", { id: toastId });
      } else {
        toast.error("Export failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
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

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Track revenue, manage payouts, and handle invoices.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 bg-theme-surface shadow-sm hover:bg-gray-50">
            <Download size={18} />
            Export Report
          </button>

          <button onClick={() => setOpenPayout(true)} className="flex items-center gap-2 bg-[#2563EB] text-theme-text rounded-lg px-4 py-2 shadow">
            <DollarSign size={18} />
            Request Payout
          </button>

          <RequestPayoutModal  open={openPayout}
                    onClose={() => setOpenPayout(false)} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {cardsData.length > 0 ? cardsData.map((c: any, i: number) => (
          <div
            key={i}
            className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
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
                {c.badge || "Status"}
              </span>
            </div>

            <p className="text-[#62748E]">{c.title || "Metric"}</p>

            <h3 className="text-[28px] font-playfair mt-2">{typeof c.value === 'number' ? `$${c.value.toFixed(2)}` : c.value || "-"}</h3>

            <p className="text-theme-muted mt-2 text-sm">{c.desc || ""}</p>
          </div>
        )) : (
          <div className="lg:col-span-4 text-center py-6 text-gray-500">No finance cards data available.</div>
        )}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">

        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="mb-6">

            <h3 className="font-playfair text-xl">
              Revenue Analytics
            </h3>

            <p className="text-theme-muted text-sm mt-1">
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

          <div className="bg-theme-surface text-theme-text rounded-lg lg:rounded-xl p-6 shadow-lg">

            <h3 className="font-playfair text-xl">
              Payout Method
            </h3>

            <p className="text-theme-muted mt-1">
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

            <button className="w-full mt-5 bg-theme-surface text-theme-text rounded-lg py-2.5 font-medium">
              Manage Accounts
            </button>

          </div>



          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <h3 className="font-playfair text-xl mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <button onClick={() => setOpenInvoice(true)} className="border border-theme-border rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-theme-bg">

                <FileText size={20} />
                Create Invoice

              </button>

              <CreateInvoiceModal  open={openInvoice}
                    onClose={() => setOpenInvoice(false)} />

              <button className="border border-theme-border rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-theme-bg">

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
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h3 className="font-playfair text-xl">
                Recent Transactions
              </h3>

              <button className="flex items-center gap-2 text-theme-text">

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

                  {transactionsData.length > 0 ? transactionsData.map((t: any, i: number) => (
                    <tr key={t.id || t._id || i} className="border-b last:border-none">

                      <td className="py-4 text-theme-muted">
                        {t.id || t._id?.substring(0,8) || "N/A"}
                      </td>

                      <td className="py-4 text-theme-muted">
                        {t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-")}
                      </td>

                      <td className="py-4 text-theme-text font-medium">
                        {t.desc || t.description || "-"}
                      </td>

                      <td className="py-4">

                        <span className={`px-3 py-1 rounded-full text-xs ${statusTransStyles[t.status || "Completed"] || "bg-gray-100"}`}>
                          {t.status || "Completed"}
                        </span>

                      </td>

                      <td
                        className={`py-4 text-end font-medium ${t.type === "credit" || (typeof t.amount === 'number' && t.amount > 0)
                          ? "text-green-600"
                          : "text-[#0F172A]"
                          }`}
                      >
                        {typeof t.amount === "number" ? `$${Math.abs(t.amount).toFixed(2)}` : (t.amount || "-")}
                      </td>

                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No recent transactions found.</td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        }
        {
          activeFinance === 1 &&
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h3 className="font-playfair text-xl">
                Issued Invoices
              </h3>

              <button className="bg-[#2563EB] text-theme-text px-4 py-2 rounded-lg shadow">
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

                  {invoicesData.length > 0 ? invoicesData.map((inv: any, i: number) => (
                    <tr key={inv.id || inv._id || i} className="border-b last:border-none">

                      <td className="py-4 text-theme-muted">
                        {inv.id || inv._id?.substring(0,8) || inv.invoiceNumber || "N/A"}
                      </td>

                      <td className="py-4 font-medium text-theme-text">
                        {inv.client || inv.clientName || "Unknown Client"}
                      </td>

                      <td className="py-4 text-theme-muted">
                        {inv.issued || inv.issuedDate || (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "-")}
                      </td>

                      <td className="py-4 text-theme-muted">
                        {inv.due || inv.dueDate || "N/A"}
                      </td>

                      <td className="py-4">

                        <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[inv.status || "Unpaid"] || "bg-gray-100"}`}>
                          {inv.status || "Unpaid"}
                        </span>

                      </td>

                      <td className="py-4 text-end font-medium text-theme-text">
                        {typeof inv.amount === "number" ? `$${inv.amount.toFixed(2)}` : (inv.total ? `$${inv.total.toFixed(2)}` : (inv.amount || "-"))}
                      </td>

                      <td className="py-4 text-end">

                        <button className="text-theme-muted">
                          <MoreHorizontal size={18} />
                        </button>

                      </td>

                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">No invoices found.</td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>
        }
        {
          activeFinance === 2 &&
          <div className="grid lg:grid-cols-2 gap-6">

            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

              <div className="mb-6">
                <h3 className="font-playfair text-xl">
                  Tax Information
                </h3>

                <p className="text-theme-muted mt-1">
                  Manage your tax documents and settings
                </p>
              </div>



              <div className="space-y-4">

                <div className="border border-theme-border rounded-xl p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <FileText size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-theme-text">
                        W-9 Form
                      </p>

                      <p className="text-sm text-theme-muted">
                        Verified on Jan 15, 2024
                      </p>
                    </div>

                  </div>

                  <button className="text-[#2563EB] font-medium">
                    Update
                  </button>

                </div>



                <div className="border border-theme-border rounded-xl p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-theme-muted">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-theme-text">
                        Tax ID (EIN)
                      </p>

                      <p className="text-sm text-theme-muted">
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



            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="font-playfair text-xl">
                  Payout Preferences
                </h3>

                <p className="text-theme-muted mt-1">
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

                  <select className="w-full border border-theme-border rounded-lg h-12 px-3 outline-none">

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
