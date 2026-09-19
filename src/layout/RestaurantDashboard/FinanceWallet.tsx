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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [expensesState, setExpensesState] = useState<any[]>([]);
  const [employeesState, setEmployeesState] = useState<any[]>([]);
  const [issuesState, setIssuesState] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setExpensesState(extractList(data));
        setTotals(data.data?.totals || data.totals || {});
      }
    } catch (err) { console.error(err); }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setEmployeesState(extractList(data));
        setTotals(data.data?.totals || data.totals || {});
      }
    } catch (err) { console.error(err); }
  };

  const fetchMaintenance = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/maintenance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIssuesState(extractList(data));
        setTotals(data.data?.totals || data.totals || {});
      }
    } catch (err) { console.error(err); }
  };

  const resolvedCards = [
    {
      title: "Total Expenses (Feb)",
      value: totals?.totalExpenses ? `$${totals.totalExpenses}` : "$0.00",
      icon: <TrendingDown size={20} className="text-[#E7000B]" />,
      iconBg: "bg-[#FEE2E2]",
      badge: totals?.expenseChange || "+0.0%",
      badgeColor: "text-red-600 bg-[#FEE2E2]"
    },
    {
      title: "Staff Payroll",
      value: totals?.staffPayroll ? `$${totals.staffPayroll}` : "$0.00",
      icon: <Users size={20} className="text-[#155DFC]" />,
      iconBg: "bg-[#E0E7FF]",
      badge: "Fixed Cost",
      badgeColor: "text-[#2563EB] bg-[#DBEAFE]"
    },
    {
      title: "Maintenance & Misc",
      value: totals?.maintenance ? `$${totals.maintenance}` : "$0.00",
      icon: <Wrench size={20} className="text-[#F54900]" />,
      iconBg: "bg-[#FFF7ED]",
      badge: "Variable",
      badgeColor: "text-[#F54900] bg-[#FFEAD5]"
    }
  ];

  useEffect(() => {
    if (activeFinance === 0) fetchExpenses();
    else if (activeFinance === 1) fetchPayroll();
    else if (activeFinance === 2) fetchMaintenance();
  }, [activeFinance]);

  const filterData = (data: any[]) => {
    return data.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const activeExpenses = filterData(expensesState);
  const activeEmployees = filterData(employeesState);
  const activeIssues = filterData(issuesState);

  const handleExport = async () => {
    try {
      if (activeFinance === 0) {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (statusFilter !== "All") queryParams.append("status", statusFilter);

        const res = await fetch(`${API_BASE}/restaurant-panel/expenses/export?${queryParams.toString()}`, { headers: authHeaders() });
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `expenses-export-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          alert("Failed to export expenses");
        }
      } else {
        const res = await fetch(`${API_BASE}/restaurant-panel/reports/export?days=30`, { headers: authHeaders() });
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finance-reports-export-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          alert("Failed to export report");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error exporting");
    }
  };

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
          <button onClick={handleExport} className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 bg-theme-surface shadow-sm hover:bg-gray-50">
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
        onSuccess={fetchExpenses}
      />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {resolvedCards.map((c, i) => (
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-theme-border rounded-lg px-3 h-10 bg-theme-surface w-[200px]">

              <Search size={16} className="text-theme-muted" />

              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter records..."
                className="outline-none w-full"
              />

            </div>
            
            <div className="flex items-center gap-2 border border-theme-border rounded-lg px-3 h-10 bg-theme-surface">
              <Filter size={16} className="text-theme-muted" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="outline-none bg-transparent">
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Resolved">Resolved</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
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

                  {activeExpenses.map((e, i) => (

                    <tr key={i} className="border-b last:border-none">

                      <td className="py-6 px-6 text-theme-text font-medium text-lg">
                        {e.title || e.description}
                      </td>


                      <td className="py-6 px-6">

                        <span className={`px-3 py-1 rounded-full text-sm bg-[#F1F5F9] text-[#475569]`}>
                          {e.category}
                        </span>

                      </td>


                      <td className="py-6 px-6 text-theme-muted">
                        {e.date}
                      </td>


                      <td className="py-6 px-6 font-semibold text-theme-text text-lg">
                        {e.amount}
                      </td>


                      <td className="py-6 px-6">

                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit ${statusStyles[e.status]}`}>

                          <span className="w-2 h-2 rounded-full bg-current" />

                          {e.status}

                        </span>

                      </td>


                      <td className="py-6 px-6 text-end relative">

                        <button
                          onClick={() => setOpenMenu(openMenu === `${i}` ? null : `${i}`)}
                        >
                          <MoreHorizontal size={18} className="text-theme-muted" />
                        </button>

                        {openMenu === `${i}` && (
                          <div className="absolute right-6 top-12 w-max bg-theme-surface border border-theme-border rounded-xl shadow-lg overflow-hidden z-50">

                            <button onClick={() => {
                              alert(`Invoice Details:\nTitle: ${e.title || e.description}\nCategory: ${e.category}\nDate: ${e.date}\nAmount: ${e.amount}\nStatus: ${e.status}`);
                            }} className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">

                              <View size={16} className="text-theme-muted" />

                              View Invoice

                            </button>

                            <button onClick={() => {
                              const title = e.title || e.description || 'expense';
                              const content = `RECEIPT\n\nTitle: ${title}\nCategory: ${e.category}\nDate: ${e.date}\nAmount: ${e.amount}\nStatus: ${e.status}`;
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `receipt-${title.replace(/\s+/g, '-')}-${e.date}.txt`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                            }} className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-theme-bg">

                              <Download size={16} className="text-theme-muted" />

                              Download Receipt

                            </button>

                          </div>
                        )}

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

                    {activeEmployees.map((e, i) => (

                      <tr key={i} className="border-b last:border-none">

                        <td className="py-6 px-6">

                          <div className="flex items-center gap-3">

                            <img
                              src={e.image}
                              className="w-10 h-10 rounded-full object-cover"
                            />

                            <p className="font-medium text-theme-text text-lg">
                              {e.name}
                            </p>

                          </div>

                        </td>


                        <td className="py-6 px-6 text-theme-muted">
                          {e.role}
                        </td>


                        <td className="py-6 px-6 text-theme-muted">
                          {e.month}
                        </td>


                        <td className="py-6 px-6 font-semibold text-theme-text text-lg">
                          {e.amount}
                        </td>


                        <td className="py-6 px-6">

                          <span className={`px-3 py-1 rounded-full text-sm ${statusEmployeeStyles[e.status]}`}>
                            {e.status}
                          </span>

                        </td>


                        <td className="py-6 px-6">

                          <div className="flex items-center justify-end gap-6">

                            <button className="text-[#059669] font-medium">
                              Payslip
                            </button>

                            <div className="relative top-1">

                              <button
                                onClick={() => setOpenMenu(openMenu === `${i}` ? null : `${i}`)}
                              >
                                <MoreHorizontal size={18} className="text-theme-muted" />
                              </button>

                              {openMenu === `${i}` && (
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

                    ))}

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

              <button className="flex items-center gap-2 bg-[#0F172A] text-theme-text px-5 py-2.5 rounded-lg shadow">

                <Wrench size={16} />
                Report Issue

              </button>

            </div>



            <div className="grid md:grid-cols-2 gap-6">

              {activeIssues.map((item, i) => (

                <div
                  key={i}
                  className="border border-theme-border bg-theme-surface rounded-xl p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between mb-4">

                    <div>

                      <h3 className="font-playfair text-xl">
                        {item.title}
                      </h3>

                      <p className="text-theme-muted mt-1">
                        {item.desc}
                      </p>

                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm ${priorityStyles[item.priority]}`}>
                      {item.priority} Priority
                    </span>

                  </div>


                  <div className="border-t pt-4 grid grid-cols-2 gap-y-4 text-sm">

                    <div>
                      <p className="text-theme-muted">Vendor</p>
                      <p className="font-medium text-theme-text">{item.vendor}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Cost</p>
                      <p className="font-medium text-theme-text">{item.cost}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Date Reported</p>
                      <p className="font-medium text-theme-text">{item.date}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Status</p>

                      <div className={`flex items-center gap-1 font-medium ${statusIssueStyles[item.status]}`}>

                        {item.status === "Resolved" && <CheckCircle2 size={16} />}
                        {item.status === "In Progress" && <Clock size={16} />}

                        {item.status}

                      </div>

                    </div>

                  </div>



                  <div className="flex gap-4 mt-6">

                    <button className="flex-1 border border-theme-border rounded-lg py-2 bg-theme-bg text-theme-text">
                      View Details
                    </button>

                    {item.status !== "Resolved" && (
                      <button className="flex-1 bg-[#059669] text-theme-text rounded-lg py-2">
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
