import {
  Search,
  MessageCircle,
  BookOpen,
  Users,
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  FileText,
  Send,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import SupportLiveChat from "./SupportLiveChat";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function HelpSupport() {
  const helpCards = [
    {
      title: "Documentation",
      desc: "Read guides & API docs",
      icon: FileText,
    },
    {
      title: "Community",
      desc: "Join the seller forum",
      icon: MessageCircle,
    },
    {
      title: "FAQs",
      desc: "Common questions",
      icon: HelpCircle,
    },
  ];

  const tickets = [
    {
      title: "Integration Issue with API",
      id: "TKT-2491",
      time: "2 hours ago",
      priority: "HIGH",
      status: "Open",
      dot: "bg-green-500",
    },
    {
      title: "Billing Inquiry – Invoice #4501",
      id: "TKT-2458",
      time: "2 days ago",
      priority: "MEDIUM",
      status: "Resolved",
      dot: "bg-blue-500",
    },
    {
      title: "Feature Request: Bulk Export",
      id: "TKT-2390",
      time: "1 week ago",
      priority: "LOW",
      status: "Closed",
      dot: "bg-gray-400",
    },
  ];

  const faq = [
    {
      question: "How do I manage my inventory across multiple warehouses?",
      answer:
        "In the Inventory tab, you can use the 'Filter by Location' feature to view stock levels for specific warehouses. You can also bulk update stock by uploading a CSV file with location IDs.",
    },
    {
      question: "What are the fees for bulk orders?",
      answer:
        "Our standard commission fee for bulk orders is 5%. However, this may vary based on your specific contract tier. You can view a detailed breakdown of fees in your Finance dashboard under 'Transaction History'.",
    },
    {
      question: "How do I update my banking information for payouts?",
      answer:
        "You can update your banking details in the Finance section under 'Settings'. Go to Finance > Settings > Payout Methods to add or edit your bank account information securely.",
    },
    {
      question: "Can I integrate my own logistics provider?",
      answer:
        "Yes, HUBNEPA supports third-party logistics integration. Please contact our technical support team to request API access and documentation for connecting your logistics provider.",
    },
    {
      question: "How do I handle returns and refunds?",
      answer:
        "Returns are managed through the 'Orders' tab. Select the specific order, click on 'Manage Return', and follow the prompts to approve or reject the return request based on your policy.",
    },
  ];

  const priorityStyles: any = {
    HIGH: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-blue-100 text-blue-700",
    High: "bg-red-100 text-red-600",
  };

  const statusStyles: any = {
    Open: "bg-green-100 text-green-700",
    Resolved: "bg-blue-100 text-blue-700",
    Closed: "bg-gray-200 text-gray-600",
  };

  const [open, setOpen] = useState<number | null>(null);
  
  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  
  const [newTicket, setNewTicket] = useState({ subject: "", priority: "Medium", message: "" });
  const [showChat, setShowChat] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/support/tickets`, { headers: authHeaders() });
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
    
    fetch(`${API_BASE}/supplier/support/faq`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setFaqData(data.data);
        } else if (Array.isArray(data)) {
          setFaqData(data);
        }
      }).catch(console.error);
      
    fetch(`${API_BASE}/supplier/support/contact`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContactData(data.data);
        }
      }).catch(console.error);
  }, []);

  const submitTicket = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/support/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        alert("Ticket submitted successfully!");
        setNewTicket({ subject: "", priority: "Medium", message: "" });
        fetchTickets();
      } else {
        alert("Failed to submit ticket");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Help & Support
          </h1>

          <p className="text-[#64748B] mt-2">
            Get assistance with your account, orders, and platform features.
          </p>
        </div>

        <button onClick={() => setShowChat(true)} className="bg-[#155DFC] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <MessageCircle size={16} />
          Start Live Chat
        </button>
      </div>
      
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] relative">
            <SupportLiveChat />
            <button onClick={() => setShowChat(false)} className="absolute top-4 right-16 text-gray-400 hover:text-gray-800 z-50">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#14213D] text-white rounded-xl p-10 text-center">
        <h2 className="text-2xl font-playfair mb-6">
          How can we help you today?
        </h2>

        <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 max-w-[600px] mx-auto">
          <Search size={18} />

          <input
            placeholder="Search for articles, guides, and troubleshooting..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="grid lg:grid-cols-3 gap-5">
            {helpCards.map((c, i) => {
              const Icon = c.icon;

              return (
                <div
                  key={i}
                  className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 text-center"
                >
                  <div className="bg-[#EFF6FF] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} className="text-[#155DFC]" />
                  </div>

                  <p className="font-semibold">{c.title}</p>

                  <p className="text-sm text-[#64748B] mt-1">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair text-lg font-semibold">
                Your Support Tickets
              </h3>
              <button className="text-[#155DFC] text-sm font-medium">
                View All
              </button>
            </div>
            <div>
              {ticketsData.map((t, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-4 ${i !== ticketsData.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2.5 h-2.5 mt-2 rounded-full ${t.status === "Open" ? "bg-green-500" : t.status === "Resolved" ? "bg-blue-500" : "bg-gray-400"}`}
                    ></span>
                    <div>
                      <p className="font-medium text-[#111827]">{t.subject || t.title || "No Subject"}</p>
                      <p className="text-sm text-[#64748B] mt-1">
                        {t.id ? `#${t.id}` : t._id ? `#${t._id.substring(t._id.length - 8).toUpperCase()}` : "#---"} • {t.updated || (t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "") || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-md ${priorityStyles[t.priority] || "bg-gray-100"}`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusStyles[t.status] || "bg-gray-100"}`}
                    >
                      {t.status}
                    </span>
                    <ChevronRight size={18} className="text-[#94A3B8]" />
                  </div>
                </div>
              ))}
              {ticketsData.length === 0 && (
                <p className="text-center text-[#64748B] py-8">No support tickets found.</p>
              )}
            </div>
          </div>

          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">
            <h3 className="font-playfair text-lg font-semibold mb-10">
              Frequently Asked Questions
            </h3>

            <div className="space-y-5">
              {(faqData.length > 0 ? faqData : faq).map((item, i) => (
                <div key={i} className="border-b pb-3">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex justify-between w-full text-left items-center"
                  >
                    <span className="font-medium">{item.question}</span>

                    <ChevronDown
                      size={18}
                      className={`transition ${open === i ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open === i && (
                    <p className="text-sm text-[#64748B] mt-3 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-[#E5E7EB] bg-white lg:rounded-xl rounded-lg p-3 lg:p-6 shadow-sm space-y-8 mb-5">
            <div>
              <h3 className="font-playfair text-lg font-semibold text-[#111827]">
                Contact Support
              </h3>
              <p className="text-base text-[#64748B] mt-1 leading-relaxed">
                Direct channels for urgent issues.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-[#EFF6FF] rounded-xl p-8 flex items-center gap-6">
                <div className="text-[#1447E6]">
                  <Phone size={18} className="min-w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm tracking-widest text-[#2563EB] font-semibold">
                    PHONE SUPPORT
                  </p>
                  <p className="text-lg font-bold text-[#2563EB] mt-2">
                    {typeof contactData?.phone === 'object' ? contactData.phone.number : (contactData?.phone || "+1 (800) 123-4567")}
                  </p>
                  <p className="text-sm text-[#1447E6] mt-2">
                    {typeof contactData?.phone === 'object' ? contactData.phone.hours : "Mon-Fri, 9am - 6pm EST"}
                  </p>
                </div>
              </div>
              <div className="bg-[#ECFDF5] rounded-xl p-8 flex items-center gap-6">
                <div className="text-[#007A55]">
                  <Mail size={18} className="min-w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm tracking-widest text-[#007A55] font-semibold">
                    EMAIL SUPPORT
                  </p>
                  <p className="text-sm font-bold text-[#007A55] mt-2">
                    {typeof contactData?.email === 'object' ? contactData.email.address : (contactData?.email || "support@hubnepa.com")}
                  </p>
                  <p className="text-sm text-[#007A55] mt-2">
                    Response time: {typeof contactData?.email === 'object' ? contactData.email.responseTime : "< 24 hrs"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="border border-[#E5E7EB] bg-white lg:rounded-xl rounded-lg lg:p-6 p-3 shadow-sm">
              <h3 className="font-playfair text-lg font-semibold text-[#111827]">
                Send a Message
              </h3>
              <p className="text-base text-[#64748B] mt-1 leading-relaxed">
                We'll get back to you via email.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-[#334155] mb-2">Subject</label>
                  <input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#334155] mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none shadow-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#334155] mb-2">Message</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    rows={5}
                    placeholder="Describe your issue in detail..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none shadow-sm"
                  />
                </div>
                <button onClick={submitTicket} className="flex items-center justify-center gap-2 bg-[#0F172A] text-white w-full py-4 rounded-xl shadow-lg">
                  <Send size={18} /> Send Ticket
                </button>
              </div>
            </div>
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="font-playfair text-xl text-[#111827]">
                  System Status
                </h3>
                <p className="text-[#64748B] mt-1">
                  All systems functioning normally.
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
