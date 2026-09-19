import {
  Download,
  Wrench, CheckCircle2, Clock,
  MoreHorizontal,
  Filter, Info,
  Plus, TrendingDown, Users,
  Search,
  Edit,
  ImageIcon,
  Trash2,
  View
} from "lucide-react";
import { extractList } from "../../utils/dataHelper";
import { useState, useEffect } from "react";
import ExpenseModal from "./ExpenseModal";
import { getImageUrl } from "../../utils/dataHelper";


const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const statusStyles: any = {
  Paid: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  Pending: "bg-[#FFF7ED] text-[#F54900] border border-[#FED7AA]",
  "Due Soon": "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]"
}

const statusEmployeeStyles: any = {
  Paid: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  Pending: "bg-[#FFF7ED] text-[#F54900] border border-[#FED7AA]"
}



const priorityStyles: any = {
  High: "bg-[#FEE2E2] text-[#DC2626]",
  Medium: "bg-[#FFF7ED] text-[#EA580C]",
  Low: "bg-[#EFF6FF] text-[#2563EB]"
}

const statusIssueStyles: any = {
  Resolved: "text-[#059669]",
  Scheduled: "text-[#64748B]",
  "In Progress": "text-[#2563EB]"
}


export default function FinanceWallet() {
  const tabs = ["All Transactions", "Salaries & Payroll", "Maintenance Logs"];
  const [activeFinance, setActiveFinance] = useState(0);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openPayout, setOpenPayout] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setExpenses(extractList(data));
      }
    } catch (err) { console.error(err); }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setEmployees(extractList(data));
      }
    } catch (err) { console.error(err); }
  };

  const fetchMaintenance = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/maintenance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIssues(extractList(data));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeFinance === 0) fetchExpenses();
    else if (activeFinance === 1) fetchPayroll();
    else if (activeFinance === 2) fetchMaintenance();
  }, [activeFinance]);

  const markMaintenanceResolved = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/maintenance/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: "Resolved" })
      });
      if (res.ok) fetchMaintenance();
    } catch (err) { console.error(err); }
  };

  const cards = [
    {
      title: "Total Expenses",
      value: "$14,250.00",
      icon: <TrendingDown size={24} />,
      iconBg: "bg-[#FEE2E2] text-[#DC2626]",
      badge: "+2.4%",
      badgeColor: "bg-[#FEE2E2] text-[#DC2626]"
    },
    {
      title: "Monthly Payroll",
      value: "$8,500.00",
      icon: <Users size={24} />,
      iconBg: "bg-[#EFF6FF] text-[#2563EB]",
      badge: "Fixed",
      badgeColor: "bg-[#F1F5F9] text-[#64748B]"
    },
    {
      title: "Maintenance",
      value: "$1,200.00",
      icon: <Wrench size={24} />,
      iconBg: "bg-[#FFF7ED] text-[#EA580C]",
      badge: "-5.0%",
      badgeColor: "bg-[#ECFDF5] text-[#059669]"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Expenses & Finance
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Track your spending, salaries, and operational costs.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 bg-theme-surface shadow-sm">
            <Download size={18} />
            Export Report
          </button>

          <button onClick={() => setOpenPayout(true)} className="flex items-center gap-2 bg-[#009966] text-white rounded-lg px-4 py-2 shadow">
            <Plus size={18} />
            Add Expense
          </button>
           <ExpenseModal
        open={openPayout}
        onClose={() => setOpenPayout(false)}
      />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {cards.map((c, i) => (
          <div
            key={i}
            className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6 shadow-sm"
          >

            <div className="flex items-start justify-between mb-5">

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                {c.icon}
              </div>

              <span className={`px-3 py-1 text-xs rounded-full font-medium ${c.badgeColor}`}>
                {c.badge}
              </span>

            </div>

            <p className="text-theme-muted text-lg">
              {c.title}
            </p>

            <h3 className="text-[34px] font-playfair mt-2">
              {c.value}
            </h3>

          </div>
        ))}

      </div>

      <div className="space-y-6">

        <div className="flex justify-between gap-3 items-center">
          <div className="grid grid-cols-3 bg-[#F1F5F9] rounded-xl p-1 w-fit">

            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveFinance(i)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition
                ${activeFinance === i
                    ? "bg-white text-[#2563EB] shadow"
                    : "text-[#0F172A]"
                  }`}
              >
                {tab}
              </button>
            ))}

          </div>
          <div className="flex items-center gap-2 border border-theme-border rounded-lg px-3 h-10 bg-theme-surface w-[200px]">

            <Search size={16} className="text-theme-muted" />

            <input
              placeholder="Filter records..."
              className="outline-none w-full"
            />

          </div>
        </div>
        {
          activeFinance === 0 &&
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-theme-bg border-b text-sm text-theme-muted">

                  <tr>

                    <th className="py-4 px-6 font-medium">
                      EXPENSE TITLE
                    </th>

                    <th className="py-4 px-6 font-medium">
                      CATEGORY
                    </th>

                    <th className="py-4 px-6 font-medium">
                      DATE
                    </th>

                    <th className="py-4 px-6 font-medium">
                      AMOUNT
                    </th>

                    <th className="py-4 px-6 font-medium">
                      STATUS
                    </th>

                    <th className="py-4 px-6 font-medium text-end">
                      ACTION
                    </th>

                  </tr>

                </thead>



                <tbody>

                  {expenses.map((e, i) => {
                    const id = e._id || i.toString();
                    return (
                    <tr key={id} className="border-b last:border-none">
                      <td className="py-6 px-6 text-theme-text font-medium text-lg">
                        {e.title}
                      </td>
                      <td className="py-6 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm bg-[#F1F5F9] text-[#475569]`}>
                          {e.category}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-theme-muted">
                        {e.date ? new Date(e.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-6 px-6 font-semibold text-theme-text text-lg">
                        ${typeof e.amount === "number" ? e.amount.toFixed(2) : e.amount}
                      </td>
                      <td className="py-6 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit ${statusStyles[e.status || "Paid"] || "bg-gray-100"}`}>
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {e.status || "Paid"}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-end relative">
                        <button onClick={() => setOpenMenu(openMenu === id ? null : id)}>
                          <MoreHorizontal size={18} className="text-theme-muted" />
                        </button>
                        {openMenu === id && (
                          <div className="absolute right-6 top-12 w-max bg-theme-surface border border-theme-border rounded-xl shadow-lg overflow-hidden z-50">

                            <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">

                              <View size={16} className="text-theme-muted" />

                              View Invoice

                            </button>

                            <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">

                              <Download size={16} className="text-theme-muted" />

                              Download Receipt

                            </button>

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

              </table>

            </div>

          </div>
        }
        {
          activeFinance === 1 &&
          <div className="space-y-6">

            <div className="flex items-center justify-between">

              <h2 className="font-playfair text-[18px] font-semibold">
                Payroll Management
              </h2>

              <button className="flex items-center gap-2 border border-theme-border bg-theme-surface rounded-lg px-4 py-2 shadow-sm">

                <Download size={16} />
                Payroll Summary

              </button>

            </div>



            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-theme-bg border-b text-sm text-theme-muted">

                    <tr>

                      <th className="py-4 px-6 font-medium">
                        EMPLOYEE
                      </th>

                      <th className="py-4 px-6 font-medium">
                        ROLE
                      </th>

                      <th className="py-4 px-6 font-medium">
                        MONTH
                      </th>

                      <th className="py-4 px-6 font-medium">
                        AMOUNT
                      </th>

                      <th className="py-4 px-6 font-medium">
                        STATUS
                      </th>

                      <th className="py-4 px-6 font-medium text-end">
                        ACTION
                      </th>

                    </tr>

                  </thead>



                  <tbody>

                    {employees.map((e, i) => {
                      const id = e._id || i.toString();
                      const staff = e.staffId || e;
                      return (
                      <tr key={id} className="border-b last:border-none">
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-3">
                            <img src={getImageUrl(staff.image || staff.imageUrl)} className="w-10 h-10 rounded-full object-cover" />
                            <p className="font-medium text-theme-text text-lg">
                              {staff.name || "Unknown"}
                            </p>
                          </div>
                        </td>
                        <td className="py-6 px-6 text-theme-muted">
                          {staff.role || "Staff"}
                        </td>
                        <td className="py-6 px-6 text-theme-muted">
                          {e.month || e.period || "-"}
                        </td>
                        <td className="py-6 px-6 font-semibold text-theme-text text-lg">
                          ${typeof e.amount === "number" ? e.amount.toFixed(2) : e.totalPay || e.amount || "0.00"}
                        </td>
                        <td className="py-6 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm ${statusEmployeeStyles[e.status || "Paid"] || "bg-gray-100"}`}>
                            {e.status || "Paid"}
                          </span>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center justify-end gap-6">
                            <button className="text-[#059669] font-medium">Payslip</button>
                            <div className="relative top-1">
                              <button onClick={() => setOpenMenu(openMenu === id ? null : id)}>
                                <MoreHorizontal size={18} className="text-theme-muted" />
                              </button>
                              {openMenu === id && (
                                <div className="absolute right-3 top-5 w-max bg-theme-surface border border-theme-border rounded-xl shadow-lg overflow-hidden z-50">
                                  <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">
                                    <Edit size={16} className="text-theme-muted" />
                                    Edit Salary
                                  </button>
                                  <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">
                                    <View size={16} className="text-theme-muted" />
                                    View Profile
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )})}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        }
        {
          activeFinance === 2 &&

          <div className="space-y-6">

            <div className="flex items-center justify-between">

              <h2 className="font-playfair text-[18px] font-semibold">
                Maintenance & Repairs
              </h2>

              <button className="flex items-center gap-2 bg-theme-surface text-theme-text px-5 py-2.5 rounded-lg shadow">

                <Wrench size={16} />
                Report Issue

              </button>

            </div>



            <div className="grid md:grid-cols-2 gap-6">

              {issues.map((item, i) => (
                <div key={item._id || i} className="border border-theme-border bg-theme-surface rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-playfair text-xl">
                        {item.title}
                      </h3>
                      <p className="text-theme-muted mt-1">
                        {item.description || item.desc}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${priorityStyles[item.priority || "Low"] || "bg-gray-100"}`}>
                      {item.priority || "Low"} Priority
                    </span>
                  </div>
                  <div className="border-t pt-4 grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <p className="text-theme-muted">Vendor</p>
                      <p className="font-medium text-theme-text">{item.vendor || "-"}</p>
                    </div>
                    <div>
                      <p className="text-theme-muted">Cost</p>
                      <p className="font-medium text-theme-text">${typeof item.cost === "number" ? item.cost.toFixed(2) : item.cost || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-theme-muted">Date Reported</p>
                      <p className="font-medium text-theme-text">{item.date ? new Date(item.date).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <p className="text-theme-muted">Status</p>
                      <div className={`flex items-center gap-1 font-medium ${statusIssueStyles[item.status || "Scheduled"] || "text-gray-500"}`}>
                        {(item.status === "Resolved" || item.status === "Paid") && <CheckCircle2 size={16} />}
                        {item.status === "In Progress" && <Clock size={16} />}
                        {item.status || "Scheduled"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button className="flex-1 border border-theme-border rounded-lg py-2 bg-theme-bg text-theme-text">
                      View Details
                    </button>
                    {(item.status !== "Resolved" && item.status !== "Paid") && (
                      <button onClick={() => markMaintenanceResolved(item._id)} className="flex-1 bg-[#059669] text-theme-text rounded-lg py-2">
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}

            </div>

          </div>
        }
      </div>
    </div>
  );
}
