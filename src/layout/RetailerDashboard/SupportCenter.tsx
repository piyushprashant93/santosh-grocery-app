import { Search, X } from "lucide-react"
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
import SupportLiveChat from "./SupportLiveChat"
import SupportFAQ from "./SupportFAQ"

export default function SupportCenter() {

  const [activeTab, setActiveTab] = useState("tickets")

  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", priority: "Medium", message: "" });

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/support/tickets`, { headers: authHeaders() });
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
      const res = await fetch(`${API_BASE}/retailer/support/tickets`, {
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

  const priorityStyles: any = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-blue-100 text-blue-600"
  }

  const statusStyles: any = {
    Open: "bg-green-100 text-green-700 border border-[#A4F4CF]",
    Closed: "bg-gray-200 text-gray-600 border border-[#E2E8F0]",
    Resolved: "bg-blue-100 text-blue-700 border border-[#BEDBFF]"
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Support Center
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Get help with your store and orders.
          </p>
        </div>

        <button onClick={() => setShowNewTicketModal(true)} className="bg-[#F54900] text-white px-5 py-2.5 rounded-lg shadow-sm">
          + New Ticket
        </button>

      </div>



      <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-lg w-fit">

        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "tickets"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          Support Tickets
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "chat"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          Live Chat
        </button>

        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "faq"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          FAQs
        </button>

      </div>



      {activeTab === "tickets" && (

        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[320px] mb-6">
            <Search size={18} className="text-theme-muted" />
            <input
              placeholder="Search tickets..."
              className="w-full px-3 py-2 outline-none text-sm"
            />
          </div>



          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b text-theme-muted text-sm">

                <tr>

                  <th className="py-3 text-sm font-medium text-[#62748E]">
                    TICKET ID
                  </th>

                  <th className="py-3 text-sm font-medium text-[#62748E]">
                    SUBJECT
                  </th>

                  <th className="py-3 text-sm font-medium text-[#62748E]">
                    PRIORITY
                  </th>

                  <th className="py-3 text-sm font-medium text-[#62748E]">
                    STATUS
                  </th>

                  <th className="py-3 text-sm font-medium text-[#62748E]">
                    LAST UPDATED
                  </th>

                  <th className="py-3 text-sm font-medium text-[#62748E] text-center">
                    ACTIONS
                  </th>

                </tr>

              </thead>



              <tbody>

                {ticketsData.length > 0 ? ticketsData.map((t, i) => (
                  <tr key={t._id || i} className="border-b last:border-none">
                    <td className="py-5 text-[#62748E]">
                      {t.id ? `#${t.id}` : t.ticketId ? `#${t.ticketId}` : t._id ? `#${t._id.substring(t._id.length - 8).toUpperCase()}` : "#---"}
                    </td>
                    <td className="py-5 text-theme-text font-medium">
                      {t.subject || t.title || t.issue || "No Subject"}
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-md text-sm ${priorityStyles[t.priority || "Medium"] || "bg-gray-100"}`}>
                        {t.priority || "Medium"}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[t.status || "Open"] || "bg-gray-100"}`}>
                        {t.status || "Open"}
                      </span>
                    </td>
                    <td className="py-5 text-theme-muted">
                      {t.updated || (t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "") || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "")}
                    </td>
                    <td className="py-5 text-center text-[#F54900] font-medium cursor-pointer">
                      View
                    </td>
                  </tr>
                )) : null}
                
                {ticketsData.length === 0 && (
                  <EmptyTableState colSpan={6} message="No support tickets found." />
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
            <button onClick={() => setShowNewTicketModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
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
              <button onClick={createTicket} className="w-full bg-[#F54900] text-white py-2.5 rounded-lg font-medium">Submit Ticket</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}