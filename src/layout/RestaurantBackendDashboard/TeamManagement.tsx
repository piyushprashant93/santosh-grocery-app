import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserPlus,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Key,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { extractList } from "../../utils/dataHelper";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const tabs = [
  { key: "directory", label: "Staff Directory", icon: Users },
  { key: "schedule", label: "Schedule", icon: Calendar },
  { key: "requests", label: "Requests", icon: MessageSquare },
  { key: "payroll", label: "Payroll", icon: DollarSign },
];

const staff = [
  {
    name: "Sarah Jenkins",
    type: "Full-time",
    role: "Manager",
    status: "Active",
    branch: "Downtown HQ",
    date: "2023-01-15",
    code: "8821",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    type: "Full-time",
    role: "Head Chef",
    status: "Active",
    branch: "Downtown HQ",
    date: "2023-02-01",
    code: "9932",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jessica Wu",
    type: "Part-time",
    role: "Chef",
    status: "Training",
    branch: "Downtown HQ",
    date: "2023-11-20",
    code: "7741",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Wilson",
    type: "Part-time",
    role: "Front Staff",
    status: "Active",
    branch: "Downtown HQ",
    date: "2023-06-10",
    code: "6652",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Emma Thompson",
    type: "Full-time",
    role: "Front Staff",
    status: "Active",
    branch: "Downtown HQ",
    date: "2023-03-12",
    code: "5519",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const schedule = [
  {
    day: "Monday",
    date: "Feb 12",
    shifts: [
      {
        time: "09:00 - 17:00",
        staff: ["Sarah Jenkins", "Michael Chen", "David Wilson"],
      },
      {
        time: "17:00 - 23:00",
        staff: ["Emma Thompson", "Jessica Wu"],
      },
    ],
  },
  {
    day: "Tuesday",
    date: "Feb 13",
    shifts: [
      {
        time: "09:00 - 17:00",
        staff: ["Sarah Jenkins", "Michael Chen"],
      },
      {
        time: "17:00 - 23:00",
        staff: ["Emma Thompson", "Jessica Wu", "David Wilson"],
      },
    ],
  },
  {
    day: "Wednesday",
    date: "Feb 14",
    shifts: [
      {
        time: "09:00 - 17:00",
        staff: ["Sarah Jenkins", "Michael Chen", "David Wilson"],
      },
      {
        time: "17:00 - 23:00",
        staff: ["Emma Thompson", "Jessica Wu"],
      },
    ],
  },
];

const statusMap: any = {
  Active: "bg-green-100 text-[#009966]",
  Training: "bg-yellow-100 text-yellow-700",
};

const requests = [
  {
    name: "Jessica Wu",
    type: "Time Off",
    subtitle: "Feb 20 - Feb 22",
    note: "Family wedding",
    status: "pending",
    icon: Calendar,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    name: "David Wilson",
    type: "Shift Swap",
    subtitle: "Swap Feb 14 Evening with Emma Thompson",
    status: "approved",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  }
]

const payroll = [
  {
    name: "Sarah Jenkins",
    role: "Manager",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00"
  },
  {
    name: "Michael Chen",
    role: "Head Chef",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00"
  },
  {
    name: "Jessica Wu",
    role: "Chef",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00"
  },
  {
    name: "David Wilson",
    role: "Front Staff",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00"
  },
  {
    name: "Emma Thompson",
    role: "Front Staff",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00"
  }
]

export default function TeamManagement({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [tab, setTab] = useState("directory");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    role: "Staff"
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingStaff(true);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(staffForm)
      });
      if (res.ok) {
        toast.success("Staff member added! Login code sent via email.");
        setIsAddStaffOpen(false);
        setStaffForm({ name: "", email: "", role: "Staff" });
        fetchStaff();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add staff member");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setIsAddingStaff(false);
    }
  };

  const [staff, setStaff] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStaff(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff/schedule`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSchedule(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff/requests`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRequests(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPayroll(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    if (tab === "directory") fetchStaff();
    else if (tab === "schedule") fetchSchedule();
    else if (tab === "requests") fetchRequests();
    else if (tab === "payroll") fetchPayroll();
  }, [tab]);

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff/requests/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchRequests();
    } catch(err) { console.error(err); }
  };

  const runPayroll = async () => {
    if (!confirm("Run payroll for this period?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll/run`, {
        method: "POST",
        headers: authHeaders()
      });
      if (res.ok) fetchPayroll();
    } catch(err) { console.error(err); }
  }

  const markPayrollPaid = async (id: string) => {
    if (!confirm("Mark this payroll as paid?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/expenses/payroll/${id}/pay`, {
        method: "PUT",
        headers: authHeaders()
      });
      if (res.ok) fetchPayroll();
    } catch(err) { console.error(err); }
  }

  const updatePermissions = async (id: string) => {
    if (!id) return;
    const roles = window.prompt("Enter comma separated permissions (e.g., manager,chef):");
    if (!roles) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff/${id}/permissions`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ permissions: roles.split(',') })
      });
      if (res.ok) fetchStaff();
    } catch(err) { console.error(err); }
  }

  const deleteShift = async (id: string) => {
    if (!id) return;
    if (!confirm("Delete this shift?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff/schedule/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) fetchSchedule();
    } catch(err) { console.error(err); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Team Management
          </h1>

          <p className="text-theme-muted mt-2">
            Track daily revenue across all delivery platforms and in-house
            dining.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button className="border border-theme-border rounded-lg px-4 py-2 flex gap-2 items-center bg-theme-surface">
            <FileText size={16} />
            Export Payroll
          </button>
          <button onClick={() => setIsAddStaffOpen(true)} className="bg-[#009966] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <UserPlus size={16} />
            Add Staff Member
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-6 bg-[#F1F5F9] p-2 rounded-xl w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  tab === t.key
                    ? "bg-white shadow text-[#0F172A]"
                    : "text-[#64748B]"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "directory" && (
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm">
            <div className="p-6 flex items-center justify-between border-b">
              <div className="flex items-center gap-3 border rounded-lg px-3 w-[320px]">
                <Search size={16} className="text-theme-muted" />
                <input
                  placeholder="Search staff by name or role..."
                  className="w-full py-2 outline-none text-sm"
                />
              </div>

              <button className="flex items-center gap-2 text-theme-muted">
                <Filter size={16} />
                Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-theme-bg text-sm text-theme-muted">
                  <tr>
                    <th className="py-4 px-6">NAME</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>BRANCH</th>
                    <th>HIRED DATE</th>
                    <th>LOGIN CODE</th>
                    <th className="text-center">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map((s, i) => (
                    <tr key={s._id || i} className="border-t">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.imageUrl || s.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-theme-text">
                              {s.name}
                            </p>
                            <p className="text-sm text-theme-muted">{s.employmentType || s.type || "Full-time"}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-sm">
                          {s.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${statusMap[s.status || "Active"] || "bg-green-100"}`}
                        >
                          {s.status || "Active"}
                        </span>
                      </td>
                      <td className="text-theme-muted">{s.branch || "Downtown HQ"}</td>
                      <td className="text-theme-muted">{s.hiredDate ? new Date(s.hiredDate).toLocaleDateString() : (s.date || "-")}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <span className="bg-[#F1F5F9] px-3 py-1 rounded-md">
                            {s.loginCode || s.code || "****"}
                          </span>
                          <Key size={14} className="text-theme-muted" />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex gap-2 justify-center items-center" title="Update Permissions">
                          <MoreHorizontal
                            onClick={() => updatePermissions(s._id)}
                            size={18}
                            className="text-theme-muted cursor-pointer hover:text-theme-text"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-playfair text-2xl">
                  Week of Feb 12 – Feb 18
                </h2>

                <div className="flex gap-2">
                  <button className="p-2 border rounded-lg">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="p-2 border rounded-lg">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <button className="bg-[#0F172A] text-theme-text px-6 py-3 rounded-lg font-medium">
                Publish Schedule
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {schedule.map((day, i) => (
                <div
                  key={i}
                  className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="font-playfair text-lg">{day.day}</h3>
                    <p className="text-theme-muted">{day.date}</p>
                  </div>

                  <div className="p-5 space-y-4">
                    {(day.shifts || []).map((shift: any, idx: number) => (
                      <div key={shift._id || idx} className="border rounded-xl p-4 relative group">
                        <div className="absolute top-4 right-4 hidden group-hover:flex gap-2">
                          <Trash2 size={16} className="text-red-500 cursor-pointer" onClick={() => deleteShift(shift._id)} />
                        </div>
                        <div className="flex items-center gap-2 text-[#009966] font-medium">
                          <Clock size={16} />
                          {shift.startTime} - {shift.endTime} {shift.time}
                        </div>

                        <div className="mt-3 space-y-2">
                          {(shift.staff || []).map((s: any, j: number) => (
                            <p
                              key={j}
                              className="flex items-center gap-2 text-[#334155]"
                            >
                              <span className="w-2 h-2 bg-green-500 rounded-full" />
                              {s.name || s}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-3 text-theme-muted">
                      <UserPlus size={16} />
                      Add Shift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "requests" && (
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm">

              <div className="p-6 border-b">
                <h3 className="font-playfair text-xl">Staff Requests</h3>
                <p className="text-theme-muted mt-1">
                  Manage time-off requests and shift swaps.
                </p>
              </div>

              <div className="divide-y">

                {requests.map((r, i) => (
                  <div key={r._id || i} className="p-6 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${r.iconBg || 'bg-gray-100'}`}>
                        <Calendar size={20} className={r.iconColor || 'text-gray-600'} />
                      </div>
                      <div>
                        <p className="font-semibold text-theme-text">
                          {(r.staffId?.name || r.name)} • {r.requestType || r.type}
                        </p>
                        <p className="text-theme-muted mt-1">
                          {r.dateRange || r.subtitle || "-"}
                        </p>
                        {(r.reason || r.note) && (
                          <p className="text-theme-muted italic mt-1">
                            "{r.reason || r.note}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {(r.status === "pending" || r.status === "Pending") && (
                        <>
                          <button onClick={() => updateRequestStatus(r._id, "Rejected")} className="px-4 py-2 rounded-lg border border-red-300 text-red-600">
                            Reject
                          </button>
                          <button onClick={() => updateRequestStatus(r._id, "Approved")} className="px-4 py-2 rounded-lg bg-[#009966] text-white">
                            Approve
                          </button>
                        </>
                      )}
                      {(r.status === "approved" || r.status === "Approved") && (
                        <span className="flex items-center gap-2 bg-green-100 text-[#009966] px-3 py-1 rounded-full text-sm">
                          <CheckCircle size={16} />
                          Approved
                        </span>
                      )}
                      {(r.status === "rejected" || r.status === "Rejected") && (
                        <span className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}

              </div>

            </div>
          )}

        {tab === "payroll" && (
              <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl shadow-sm">

      <div className="p-6 flex items-center justify-between border-b">

        <div>
          <h3 className="font-playfair text-xl">Payroll Overview</h3>
          <p className="text-theme-muted mt-1">
            Salary period: Feb 1 - Feb 14
          </p>
        </div>

        <button onClick={runPayroll} className="bg-[#0F172A] text-theme-text px-6 py-3 rounded-lg font-medium">
          Run Payroll
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left min-w-[800px]">

          <thead className="bg-theme-bg text-sm text-theme-muted">
            <tr>
              <th className="py-4 px-6 font-medium">EMPLOYEE</th>
              <th>ROLE</th>
              <th>HOURS WORKED</th>
              <th>HOURLY RATE</th>
              <th className="text-end px-6">TOTAL PAY</th>
            </tr>
          </thead>

          <tbody>

            {payroll.map((p, i) => {
              const staff = p.staffId || p;
              return (
              <tr key={p._id || i} className="border-t">
                <td className="py-5 px-6 font-medium text-theme-text">
                  {staff.name || p.name}
                </td>
                <td className="text-theme-muted">
                  {staff.role || p.role}
                </td>
                <td className="text-theme-text">
                  {p.hoursWorked || p.hours} hrs
                </td>
                <td className="text-theme-muted">
                  ${p.hourlyRate || p.rate || "0.00"}/hr
                </td>
                <td className="py-5 px-6 text-end font-semibold text-[#009966]">
                  ${typeof p.totalPay === "number" ? p.totalPay.toFixed(2) : p.total || "0.00"}
                  {p._id && p.status !== 'Paid' && (
                    <button onClick={() => markPayrollPaid(p._id)} className="ml-4 text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded">
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            )})}

          </tbody>

        </table>

      </div>

    </div>
        )}
      </div>
      {isAddStaffOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair mb-4">Add Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#009966]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (for login code)</label>
                <input required type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#009966]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full border rounded-lg p-2 bg-theme-surface outline-none focus:border-[#009966]">
                  <option>Manager</option>
                  <option>Head Chef</option>
                  <option>Chef</option>
                  <option>Front Staff</option>
                  <option>Staff</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsAddStaffOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" disabled={isAddingStaff} className="px-4 py-2 rounded-lg bg-[#009966] text-white disabled:opacity-50">
                  {isAddingStaff ? "Adding..." : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
