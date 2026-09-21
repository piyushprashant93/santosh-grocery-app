import { Plus, Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import SupportLiveChat from "./SupportLiveChat";
import SupportFAQ from "./SupportFAQ";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};



const priorityStyles: any = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-blue-100 text-blue-600",
};

const statusStyles: any = {
  Open: "bg-green-100 text-green-700 border border-[#A7F3D0]",
  Closed: "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]",
  Resolved: "bg-blue-100 text-blue-700 border border-[#BFDBFE]",
};



export default function HelpSupport() {
  const [activeTab, setActiveTab] = useState("tickets");
  
  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", priority: "Medium", message: "" });

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/support/tickets`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (payload.tickets || []));
        setTicketsData(Array.isArray(arr) ? arr : []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/support/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(newTicket)
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        alert("Ticket created successfully!");
        setShowNewTicketModal(false);
        setNewTicket({ subject: "", priority: "Medium", message: "" });
        fetchTickets();
      } else {
        const errorMsg = data?.errors?.length ? data.errors[0] : (data?.message || "Failed to create ticket");
        alert(errorMsg);
      }
    } catch(err) { console.error(err); }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Support Center
          </h1>

          <p className="text-theme-muted mt-2">
            Get help with technical issues or operational questions.
          </p>
        </div>

        <button onClick={() => setShowNewTicketModal(true)} className="bg-[#009966] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === "tickets"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
            }`}
        >
          Support Tickets
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === "chat"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
            }`}
        >
          Live Chat
        </button>

        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === "faq"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
            }`}
        >
          FAQs
        </button>
      </div>

      {activeTab === "tickets" && (
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[360px]">
              <Search size={18} className="text-theme-muted" />

              <input
                placeholder="Search tickets..."
                className="w-full px-3 py-2 outline-none text-sm"
              />
            </div>

            <button className="flex items-center gap-2 text-theme-muted font-medium">
              <Filter size={16} />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b text-sm text-theme-muted bg-theme-bg">
                <tr>
                  <th className="py-4 font-medium px-2">TICKET ID</th>
                  <th className="py-4 font-medium px-2">SUBJECT</th>
                  <th className="py-4 font-medium px-2">PRIORITY</th>
                  <th className="py-4 font-medium px-2">STATUS</th>
                  <th className="py-4 font-medium px-2">LAST UPDATED</th>
                  <th className="py-4 font-medium px-2 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {ticketsData.map((t, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-6 px-2 text-theme-muted text-sm">
                      {t.id ? `#${t.id}` : t.ticketId ? `#${t.ticketId}` : t._id ? `#${t._id.substring(t._id.length - 8).toUpperCase()}` : "#---"}
                    </td>

                    <td className="py-6 px-2">
                      <p className="font-semibold text-theme-text leading-6">
                        {t.subject || t.title || t.issue || "No Subject"}
                      </p>
                    </td>

                    <td className="py-6 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyles[t.priority || "Medium"] || "bg-gray-100"}`}
                      >
                        {t.priority || "Medium"}
                      </span>
                    </td>

                    <td className="py-6 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[t.status || "Open"] || "bg-gray-100"}`}
                      >
                        {t.status || "Open"}
                      </span>
                    </td>

                    <td className="py-6 px-2 text-theme-muted text-sm">
                      {t.updated || (t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "") || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "")}
                    </td>

                    <td className="py-6 px-2 text-right">
                      <button className="text-[#059669] text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {ticketsData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-theme-muted">
                      No support tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <SupportLiveChat onClose={() => setActiveTab("tickets")} />
      )}

      {activeTab === "faq" && (
        <SupportFAQ />
      )}

      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-xl w-[90%] max-w-[500px] p-6 relative">
            <button onClick={() => setShowNewTicketModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-theme-text">
              <X size={20} />
            </button>
            <h3 className="font-playfair text-xl mb-4">Create New Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Subject</label>
                <input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Priority</label>
                <select value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2 outline-none"></textarea>
              </div>
              <button onClick={createTicket} className="w-full bg-[#009966] text-white py-2.5 rounded-lg font-medium">Submit Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
