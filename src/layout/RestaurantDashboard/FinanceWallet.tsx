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

const cards = [
  {
    title: "Total Expenses (Feb)",
    value: "$7,620.50",
    icon: <TrendingDown size={20} className="text-[#E7000B]" />,
    iconBg: "bg-[#FEE2E2]",
    badge: "+4.5%",
    badgeColor: "text-red-600 bg-[#FEE2E2]"
  },
  {
    title: "Staff Payroll",
    value: "$4,200.00",
    icon: <Users size={20} className="text-[#155DFC]" />,
    iconBg: "bg-[#E0E7FF]",
    badge: "Fixed Cost",
    badgeColor: "text-[#2563EB] bg-[#DBEAFE]"
  },
  {
    title: "Maintenance & Misc",
    value: "$570.50",
    icon: <Wrench size={20} className="text-[#F54900]" />,
    iconBg: "bg-[#FFF7ED]",
    badge: "Variable",
    badgeColor: "text-[#F54900] bg-[#FFEAD5]"
  }
]

const expenses = [
  {
    title: "Monthly Rent",
    category: "Rent",
    date: "Feb 01, 2026",
    amount: "$2,500.00",
    status: "Paid"
  },
  {
    title: "Staff Salaries",
    category: "Salary",
    date: "Feb 01, 2026",
    amount: "$4,200.00",
    status: "Paid"
  },
  {
    title: "Vegetable Supply",
    category: "Inventory",
    date: "Feb 03, 2026",
    amount: "$350.50",
    status: "Pending"
  },
  {
    title: "Kitchen Equipment Repair",
    category: "Maintenance",
    date: "Feb 02, 2026",
    amount: "$150.00",
    status: "Paid"
  },
  {
    title: "Electricity Bill",
    category: "Utilities",
    date: "Feb 05, 2026",
    amount: "$420.00",
    status: "Due Soon"
  }
]

const statusStyles: any = {
  Paid: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  Pending: "bg-[#FFF7ED] text-[#F54900] border border-[#FED7AA]",
  "Due Soon": "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]"
}

const employees = [
  {
    name: "John Doe",
    role: "Head Chef",
    month: "January 2026",
    amount: "$3,200.00",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sarah Smith",
    role: "Restaurant Manager",
    month: "January 2026",
    amount: "$2,800.00",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Mike Johnson",
    role: "Sous Chef",
    month: "January 2026",
    amount: "$2,100.00",
    status: "Pending",
    image: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    name: "Emily Chen",
    role: "Waitstaff",
    month: "January 2026",
    amount: "$1,500.00",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
]

const statusEmployeeStyles: any = {
  Paid: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  Pending: "bg-[#FFF7ED] text-[#F54900] border border-[#FED7AA]"
}

const issues = [
  {
    title: "Walk-in Freezer",
    desc: "Temperature fluctuation",
    priority: "High",
    vendor: "CoolTech Services",
    cost: "$150.00",
    date: "Feb 02, 2026",
    status: "Resolved"
  },
  {
    title: "Espresso Machine",
    desc: "Steam wand leak",
    priority: "Medium",
    vendor: "BaristaFix",
    cost: "$85.00",
    date: "Jan 28, 2026",
    status: "Resolved"
  },
  {
    title: "HVAC System",
    desc: "Filter replacement",
    priority: "Low",
    vendor: "AirMasters",
    cost: "$200.00",
    date: "Jan 15, 2026",
    status: "Scheduled"
  },
  {
    title: "Dishwasher",
    desc: "Drainage blockage",
    priority: "High",
    vendor: "QuickPlumb",
    cost: "$0.00",
    date: "Feb 05, 2026",
    status: "In Progress"
  }
]

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

  const [expensesState, setExpensesState] = useState<any[]>([]);
  const [employeesState, setEmployeesState] = useState<any[]>([]);
  const [issuesState, setIssuesState] = useState<any[]>([]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setExpensesState(data.data?.expenses || data.expenses || data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setEmployeesState(data.data?.payroll || data.payroll || data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchMaintenance = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/maintenance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIssuesState(data.data?.maintenance || data.maintenance || data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeFinance === 0) fetchExpenses();
    else if (activeFinance === 1) fetchPayroll();
    else if (activeFinance === 2) fetchMaintenance();
  }, [activeFinance]);

  const activeExpenses = expensesState.length > 0 ? expensesState : expenses;
  const activeEmployees = employeesState.length > 0 ? employeesState : employees;
  const activeIssues = issuesState.length > 0 ? issuesState : issues;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Expenses & Finance
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Track your spending, salaries, and operational costs.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white shadow-sm">
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
            className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm"
          >

            <div className="flex items-start justify-between mb-5">

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                {c.icon}
              </div>

              <span className={`px-3 py-1 text-xs rounded-full font-medium ${c.badgeColor}`}>
                {c.badge}
              </span>

            </div>

            <p className="text-[#64748B] text-lg">
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
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 h-10 bg-white w-[200px]">

            <Search size={16} className="text-[#94A3B8]" />

            <input
              placeholder="Filter records..."
              className="outline-none w-full"
            />

          </div>
        </div>
        {
          activeFinance === 0 &&
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-[#F8FAFC] border-b text-sm text-[#64748B]">

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

                      <td className="py-6 px-6 text-[#0F172A] font-medium text-lg">
                        {e.title}
                      </td>


                      <td className="py-6 px-6">

                        <span className={`px-3 py-1 rounded-full text-sm bg-[#F1F5F9] text-[#475569]`}>
                          {e.category}
                        </span>

                      </td>


                      <td className="py-6 px-6 text-[#64748B]">
                        {e.date}
                      </td>


                      <td className="py-6 px-6 font-semibold text-[#0F172A] text-lg">
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
                          <MoreHorizontal size={18} className="text-[#94A3B8]" />
                        </button>

                        {openMenu === `${i}` && (
                          <div className="absolute right-6 top-12 w-max bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden z-50">

                            <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-[#F8FAFC]">

                              <View size={16} className="text-[#64748B]" />

                              View Invoice

                            </button>

                            <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-[#F8FAFC]">

                              <Download size={16} className="text-[#64748B]" />

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

              <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 shadow-sm">

                <Download size={16} />
                Payroll Summary

              </button>

            </div>



            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-[#F8FAFC] border-b text-sm text-[#64748B]">

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

                            <p className="font-medium text-[#0F172A] text-lg">
                              {e.name}
                            </p>

                          </div>

                        </td>


                        <td className="py-6 px-6 text-[#475569]">
                          {e.role}
                        </td>


                        <td className="py-6 px-6 text-[#64748B]">
                          {e.month}
                        </td>


                        <td className="py-6 px-6 font-semibold text-[#0F172A] text-lg">
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
                                <MoreHorizontal size={18} className="text-[#94A3B8]" />
                              </button>

                              {openMenu === `${i}` && (
                                <div className="absolute right-3 top-5 w-max bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden z-50">

                                  <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-[#F8FAFC]">

                                    <Edit size={16} className="text-[#64748B]" />

                                    Edit Salary

                                  </button>

                                  <button className="flex items-center gap-3 text-sm px-4 py-3 w-full hover:bg-[#F8FAFC]">

                                    <View size={16} className="text-[#64748B]" />

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

              <button className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg shadow">

                <Wrench size={16} />
                Report Issue

              </button>

            </div>



            <div className="grid md:grid-cols-2 gap-6">

              {activeIssues.map((item, i) => (

                <div
                  key={i}
                  className="border border-[#E5E7EB] bg-white rounded-xl p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between mb-4">

                    <div>

                      <h3 className="font-playfair text-xl">
                        {item.title}
                      </h3>

                      <p className="text-[#64748B] mt-1">
                        {item.desc}
                      </p>

                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm ${priorityStyles[item.priority]}`}>
                      {item.priority} Priority
                    </span>

                  </div>


                  <div className="border-t pt-4 grid grid-cols-2 gap-y-4 text-sm">

                    <div>
                      <p className="text-[#64748B]">Vendor</p>
                      <p className="font-medium text-[#0F172A]">{item.vendor}</p>
                    </div>

                    <div>
                      <p className="text-[#64748B]">Cost</p>
                      <p className="font-medium text-[#0F172A]">{item.cost}</p>
                    </div>

                    <div>
                      <p className="text-[#64748B]">Date Reported</p>
                      <p className="font-medium text-[#0F172A]">{item.date}</p>
                    </div>

                    <div>
                      <p className="text-[#64748B]">Status</p>

                      <div className={`flex items-center gap-1 font-medium ${statusIssueStyles[item.status]}`}>

                        {item.status === "Resolved" && <CheckCircle2 size={16} />}
                        {item.status === "In Progress" && <Clock size={16} />}

                        {item.status}

                      </div>

                    </div>

                  </div>



                  <div className="flex gap-4 mt-6">

                    <button className="flex-1 border border-[#E5E7EB] rounded-lg py-2 bg-[#F8FAFC] text-[#0F172A]">
                      View Details
                    </button>

                    {item.status !== "Resolved" && (
                      <button className="flex-1 bg-[#059669] text-white rounded-lg py-2">
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
