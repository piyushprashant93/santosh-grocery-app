import { Download, Wallet, Clock, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import EmptyTableState from "../../components/common/EmptyTableState"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function FinanceWallet() {
  const [financeData, setFinanceData] = useState<any>(null);

  const fetchFinance = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/finance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFinanceData(data.data || data);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleWithdraw = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/finance/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount: financeData?.totalRevenue || 0 })
      });
      if (res.ok) {
        alert("Withdrawal request submitted successfully!");
        fetchFinance();
      } else {
        alert("Withdrawal failed");
      }
    } catch(err) { console.error(err); }
  };

  const resolvedTransactions = financeData?.transactions || [];

  const statusStyles: any = {
    Completed: "bg-green-100 text-green-700 border border-[#A4F4CF]",
    Pending: "bg-yellow-100 text-yellow-700 border border-[#FFF085]"
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Finance & Wallet
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Manage your earnings, settlements, and payouts.
          </p>
        </div>

        <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white shadow-sm">
          <Download size={18} />
          Download Statement
        </button>

      </div>



      <div className="grid lg:grid-cols-3 gap-6">

        <div className="rounded-lg lg:rounded-xl p-3 lg:p-6 bg-[#0F8A5F] text-white shadow-lg flex flex-col justify-between">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm opacity-80">Total Revenue</p>
              <h2 className="text-[32px] font-playfair mt-2">${(financeData?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>

            <div className="w-12 h-12 min-w-12 mt-3 flex items-center justify-center rounded-xl bg-white/20">
              <Wallet size={22} />
            </div>

          </div>

          <button onClick={handleWithdraw} className="mt-6 bg-white text-[#0F8A5F] rounded-lg py-2.5 font-medium">
            Withdraw Funds
          </button>

        </div>



        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[#6A7282] text-sm">Pending Payouts</p>
              <h2 className="text-[32px] font-playfair mt-2">${(financeData?.pendingPayouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              <p className="text-[#6A7282] text-sm mt-6">
                Funds usually clear within 24–48 hours after delivery.
              </p>
            </div>

            <div className="w-12 h-12 min-w-12 mt-3 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Clock size={22} />
            </div>

          </div>

        </div>



        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[#6A7282] text-sm">Next Payout</p>
              <h2 className="text-[32px] font-playfair mt-2">{financeData?.nextPayoutDate || "TBD"}</h2>
              <p className="text-[#6A7282] text-sm mt-6">
                Estimated amount: ${(financeData?.nextPayoutAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="w-12 h-12 min-w-12 mt-3 flex items-center justify-center rounded-xl bg-orange-100 text-[#F54900]">
              <Calendar size={22} />
            </div>

          </div>

        </div>

      </div>



      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

        <div className="mb-6">
          <h3 className="font-playfair text-xl">Transaction History</h3>
          <p className="text-[#6A7282] text-sm mt-1">
            Recent earnings and deductions
          </p>
        </div>



        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b text-[#6A7282] text-sm">

              <tr>
                <th className="py-3 text-sm font-medium text-[#62748E]">
                  TRANSACTION ID
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  DESCRIPTION
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">
                  DATE
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E] text-end">
                  AMOUNT
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E] text-end">
                  STATUS
                </th>
              </tr>

            </thead>



            <tbody>

              {resolvedTransactions.map((t: any, i: number) => (
                <tr key={t._id || i} className="border-b last:border-none">
                  <td className="py-4 text-[#6A7282]">
                    {t.id || t.transactionId || t._id?.substring(0, 8)}
                  </td>
                  <td className="py-4 text-[#111827] font-medium">
                    {t.desc || t.description}
                  </td>
                  <td className="py-4 text-[#6A7282]">
                    {t.date ? new Date(t.date).toLocaleDateString() : (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "")}
                  </td>

                  <td
                    className={`py-4 text-end ${
                      t.type === "credit"
                        ? "text-green-600"
                        : "text-[#111827]"
                    }`}
                  >
                    {typeof t.amount === "number" ? (t.type === "credit" ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`) : t.amount}
                  </td>

                  <td className="py-4 text-end">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${statusStyles[t.status || "Completed"] || "bg-gray-100 text-gray-800"}`}
                    >
                      {t.status || "Completed"}
                    </span>

                  </td>

                </tr>

              ))}
              
              {resolvedTransactions.length === 0 && (
                <EmptyTableState colSpan={5} message="No transactions found." />
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}