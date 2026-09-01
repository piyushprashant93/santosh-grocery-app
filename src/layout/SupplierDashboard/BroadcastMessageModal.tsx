import { Users, Store, Building2, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function BroadcastMessageModal({open, onClose}: {open: boolean; onClose: () => void}) {
  const [form, setForm] = useState({
    audience: "All Clients",
    subject: "",
    message: ""
  });

  const handleSend = async () => {
    if (!form.subject || !form.message) {
      alert("Please enter a subject and message.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/supplier/clients/broadcast`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Message broadcasted successfully!");
        onClose();
        setForm({ audience: "All Clients", subject: "", message: "" });
      } else {
        alert("Failed to broadcast message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-[680px] w-[96%] max-h-[96vh] overflow-auto rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b bg-[#F8FAFC80]">
          <div>
            <h3 className="font-playfair text-2xl">Broadcast Message</h3>

            <p className="text-[#64748B] mt-1">
              Send announcements to your clients.
            </p>
          </div>

          <button onClick={onClose} className="text-[#64748B]">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-[#374151] mb-3 block">Target Audience</label>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setForm({...form, audience: "All Clients"})} className={`border ${form.audience === "All Clients" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-2`}>
                <Users size={22} />
                All Clients
              </button>

              <button onClick={() => setForm({...form, audience: "Restaurants"})} className={`border ${form.audience === "Restaurants" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-2`}>
                <Store size={22} />
                Restaurants
              </button>

              <button onClick={() => setForm({...form, audience: "Retailers"})} className={`border ${form.audience === "Retailers" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-2`}>
                <Building2 size={22} />
                Retailers
              </button>
            </div>
          </div>

          <div>
            <label className="text-[#374151]">Subject</label>

            <input
              placeholder="e.g. New Product Arrival: Organic Avocados"
              value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})}
              className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none"
            />
          </div>

          <div>
            <label className="text-[#374151]">Message</label>

            <textarea
              rows={5}
              placeholder="Type your message here..."
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-3 mt-1 outline-none"
            />
          </div>

          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex gap-3">
            <CheckCircle2 className="text-[#2563EB]" size={20} />

            <p className="text-[#1D4ED8] text-sm">
              This message will be sent to <b>145</b> active clients via email
              and in-app notification.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t p-6 bg-[#F8FAFC80]">
          <button onClick={onClose} className="text-[#64748B]">
            Cancel
          </button>

          <button onClick={handleSend} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow">
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
