import {
  Package,
  CreditCard,
  User,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  Ticket,
  Home,
  Send,
  Star,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import LegalInfoModal from "./LegalInfoModal";

const LEGAL_CONTENT = {
  terms: {
    title: "Terms of Service",
    subtitle:
      "Please read these Terms carefully before using HubNepa. By accessing our services, you agree to comply with the following conditions.",

    content: [
      "Users must create and maintain accurate account information. You are responsible for protecting your account credentials and all activities performed under your account.",

      "Orders placed through HubNepa are subject to restaurant acceptance, availability, pricing and operational hours. Restaurants may cancel or modify orders based on inventory or operational reasons.",

      "Payments are securely processed using third-party payment providers. Refunds, cancellations and disputes are handled according to our refund policy and applicable regulations.",

      "Any misuse of the platform, fraudulent activity, abusive behavior or attempts to compromise platform security may result in immediate suspension or permanent account termination.",

      "HubNepa reserves the right to update these Terms of Service at any time. Continued use of the platform after changes are published constitutes acceptance of the revised terms."
    ]
  },

  privacy: {
    title: "Privacy Policy",
    subtitle:
      "Your privacy matters to us. This policy explains how your information is collected, stored and protected while using HubNepa.",

    content: [
      "We collect information such as your name, email address, phone number and delivery address to provide our services and improve your overall experience.",

      "Payment details are processed securely by trusted payment gateways. HubNepa never stores your complete debit or credit card information on our servers.",

      "Anonymous analytics and usage statistics may be collected to improve application performance, fix issues and enhance platform features.",

      "We do not sell or rent your personal information to third parties. Information may only be shared when legally required or necessary to complete your orders.",

      "You may request access, correction or deletion of your personal information by contacting our support team. We are committed to protecting your privacy and complying with applicable data protection regulations."
    ]
  }
};

const BASE_URL = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

// ---------- Types ----------
interface Faq {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  hours: string;
  socialMedia: {
    twitter: string;
    instagram: string;
    facebook: string;
  };
  address: string;
  liveChatAvailable: boolean;
  averageResponseTime: string;
}

interface TicketMessage {
  _id: string;
  sender: string;
  senderRole: "user" | "admin" | string;
  message: string;
  attachments: string[];
  isRead: boolean;
  createdAt: string;
}

interface SupportTicket {
  _id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | string;
  status: "Open" | "In Progress" | "Resolved" | "Closed" | string;
  messages: TicketMessage[];
  lastReplyAt: string;
  createdAt: string;
  rating?: number;
  comment?: string;
}

const categories = [
  {
    icon: Package,
    title: "Order Issues",
    matchCategory: "Orders",
    desc: "Track, cancel, or report problems with an order.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: CreditCard,
    title: "Payment & Refunds",
    matchCategory: "Payment & Refunds",
    desc: "Manage wallet, refund status, and payment methods.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: User,
    title: "Account & Settings",
    matchCategory: "Account & Settings",
    desc: "Update profile, address, and login security.",
    color: "text-orange-600 bg-orange-50",
  },
];

const TICKET_CATEGORIES = [
  "Order Issues",
  "Payment & Refunds",
  "Account & Settings",
  "Delivery",
  "Technical",
  "Other",
];

const TICKET_PRIORITIES = ["Low", "Medium", "High"];

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-blue-50 text-blue-600",
  "In Progress": "bg-orange-50 text-orange-600",
  Resolved: "bg-[#ECFDF5] text-[#009966]",
  Closed: "bg-gray-100 text-gray-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-orange-50 text-orange-600",
  High: "bg-red-50 text-red-600",
};

export default function HelpCenter() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("Orders");

  // FAQs
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // Contact info
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  // Contact form modal
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Ticket form modal
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: TICKET_CATEGORIES[0],
    priority: "Medium",
    message: "",
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // My Tickets list
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [ticketsPage, setTicketsPage] = useState(1);
  const [ticketsHasNext, setTicketsHasNext] = useState(false);

  // Ticket detail modal
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  const getToken = () =>
    (typeof window !== "undefined" && localStorage.getItem("authToken")) || "";

  // ---------- Fetch FAQs ----------
  useEffect(() => {
    const fetchFaqs = async () => {
      setFaqsLoading(true);
      setFaqsError(null);
      try {
        const res = await fetch(`${BASE_URL}/support/faq`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Failed to load FAQs");
        }
        setFaqs(data?.data?.faqs || []);
      } catch (err: any) {
        setFaqsError(err.message || "Something went wrong loading FAQs");
      } finally {
        setFaqsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // ---------- Fetch Contact Info ----------
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/support/contact`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setContactInfo(data?.data?.contact || null);
        }
      } catch {
        // silently fail, static fallback UI will show
      }
    };
    fetchContactInfo();
  }, []);

  // ---------- Fetch My Tickets ----------
  const fetchTickets = async (page: number = 1) => {
    const token = getToken();
    if (!token) {
      setTicketsLoading(false);
      setTicketsError("Please login to view your support tickets");
      return;
    }

    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const res = await fetch(`${BASE_URL}/support?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load tickets");
      }

      setTickets(data?.data?.data || []);
      setTicketsPage(data?.data?.pagination?.page || page);
      setTicketsHasNext(data?.data?.pagination?.hasNextPage || false);
    } catch (err: any) {
      setTicketsError(err.message || "Something went wrong loading tickets");
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, []);

  // ---------- Filtered FAQs ----------
  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory
      ? f.category === activeCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));
const [legalModal, setLegalModal] = useState({
  open: false,
  title: "",
  subtitle: "",
  content: [] as string[],
});
  // ---------- Submit contact form ----------
  const submitContactForm = async () => {
    setContactError(null);

    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      setContactError("Please fill in all fields");
      return;
    }

    setContactSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to send message");
      }

      setContactSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setShowContactForm(false);
        setContactSuccess(false);
      }, 1800);
    } catch (err: any) {
      setContactError(err.message || "Something went wrong");
    } finally {
      setContactSubmitting(false);
    }
  };

  // ---------- Submit raise ticket form ----------
  const submitTicketForm = async () => {
    setTicketError(null);

    if (!ticketForm.subject || !ticketForm.message) {
      setTicketError("Please fill in subject and message");
      return;
    }

    const token = getToken();
    if (!token) {
      setTicketError("Please login to raise a support ticket");
      return;
    }

    setTicketSubmitting(true);
    try {
      const payload = {
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        message: ticketForm.message,
      };

      const res = await fetch(`${BASE_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data?.errors?.length ? data.errors[0] : (data?.message || "Failed to raise ticket");
        throw new Error(errorMsg);
      }

      setTicketSuccess(true);
      setTicketForm({
        subject: "",
        category: TICKET_CATEGORIES[0],
        priority: "Medium",
        message: "",
      });

      // refresh tickets list in background
      fetchTickets(1);

      setTimeout(() => {
        setShowTicketForm(false);
        setTicketSuccess(false);
      }, 1800);
    } catch (err: any) {
      setTicketError(err.message || "Something went wrong");
    } finally {
      setTicketSubmitting(false);
    }
  };

  // ---------- Open ticket detail ----------
  const openTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setReplyError(null);
    setRating(ticket.rating || 0);
    setRatingComment(ticket.comment || "");
    setRatingError(null);
    setRatingSuccess(false);
  };

  // ---------- Submit reply ----------
  const submitReply = async () => {
    if (!selectedTicket) return;
    setReplyError(null);

    if (!replyMessage.trim()) {
      setReplyError("Please enter a message");
      return;
    }

    const token = getToken();
    setReplySubmitting(true);
    try {
      const res = await fetch(
        `${BASE_URL}/support/${selectedTicket._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: replyMessage }),
        },
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to send reply");
      }

      // append new message locally (optimistic) using returned ticket if provided, else construct
      const updatedTicket: SupportTicket = data?.data?.ticket || {
        ...selectedTicket,
        messages: [
          ...selectedTicket.messages,
          {
            _id: `temp-${Date.now()}`,
            sender: "me",
            senderRole: "user",
            message: replyMessage,
            attachments: [],
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)),
      );
      setReplyMessage("");
    } catch (err: any) {
      setReplyError(err.message || "Something went wrong");
    } finally {
      setReplySubmitting(false);
    }
  };

  // ---------- Submit rating ----------
  const submitRating = async () => {
    if (!selectedTicket) return;
    setRatingError(null);

    if (rating < 1) {
      setRatingError("Please select a rating");
      return;
    }

    const token = getToken();
    setRatingSubmitting(true);
    try {
      const res = await fetch(
        `${BASE_URL}/support/${selectedTicket._id}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment: ratingComment }),
        },
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to submit rating");
      }

      setRatingSuccess(true);
      const updatedTicket = {
        ...selectedTicket,
        rating,
        comment: ratingComment,
      };
      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)),
      );
    } catch (err: any) {
      setRatingError(err.message || "Something went wrong");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const canRate =
    selectedTicket &&
    (selectedTicket.status === "Resolved" ||
      selectedTicket.status === "Closed");

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="lg:text-[34px] text-[24px] font-playfair text-theme-text">
          How can we help you today?
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for answers, orders, or topics..."
          className="max-w-xl mx-auto w-full border border-theme-border rounded-xl px-5 py-3 shadow-sm outline-none block"
        />

        <button
          onClick={() => setShowTicketForm(true)}
          className="inline-flex items-center gap-2 bg-[#009966] text-white px-5 py-2.5 rounded-lg shadow-sm"
        >
          <Ticket size={16} />
          Raise a Support Ticket
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((c, i) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.matchCategory;

          return (
            <button
              key={i}
              onClick={() =>
                setActiveCategory(isActive ? null : c.matchCategory)
              }
              className={`border rounded-lg lg:rounded-xl lg:p-8 p-3 text-center bg-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] transition ${
                isActive
                  ? "border-[#009966] ring-1 ring-[#009966]"
                  : "border-[#E5E7EB]"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 ${c.color}`}
              >
                <Icon size={22} />
              </div>

              <h3 className="font-playfair text-xl text-theme-text">
                {c.title}
              </h3>

              <p className="text-theme-muted mt-2 text-sm">{c.desc}</p>
            </button>
          );
        })}
      </div>

      {/* ---------- My Tickets Section ---------- */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-2xl text-theme-text">
            My Support Tickets
          </h2>

          <button
            onClick={() => fetchTickets(ticketsPage)}
            className="flex items-center gap-1.5 text-sm text-theme-muted hover:text-theme-text"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {ticketsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={26} className="animate-spin text-[#009966]" />
          </div>
        )}

        {ticketsError && !ticketsLoading && (
          <p className="text-red-500 text-sm">{ticketsError}</p>
        )}

        {!ticketsLoading && !ticketsError && tickets.length === 0 && (
          <div className="border border-dashed border-theme-border rounded-xl py-10 text-center text-theme-muted text-sm">
            You haven't raised any support tickets yet.
          </div>
        )}

        {!ticketsLoading && !ticketsError && tickets.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {tickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => openTicketDetail(t)}
                  className="text-left border border-theme-border rounded-lg lg:rounded-xl p-4 bg-theme-surface hover:border-[#009966] transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-theme-text font-medium line-clamp-1">
                      {t.subject}
                    </p>
                    <span
                      className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                        STATUS_STYLES[t.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#99A1AF] mb-3">{t.ticketId}</p>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-1 rounded-full bg-[#F1F5F9] text-theme-muted">
                      {t.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        PRIORITY_STYLES[t.priority] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.priority} Priority
                    </span>
                    {t.rating && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50 text-yellow-600">
                        <Star
                          size={12}
                          className="fill-yellow-500 text-yellow-500"
                        />
                        {t.rating}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#99A1AF] mt-3">
                    <Clock size={12} />
                    Last reply: {formatDate(t.lastReplyAt)}
                  </div>
                </button>
              ))}
            </div>

            {ticketsPage > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => fetchTickets(ticketsPage - 1)}
                  disabled={ticketsPage <= 1}
                  className="px-4 py-2 text-sm border border-theme-border rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-theme-muted">
                  Page {ticketsPage}
                </span>
                <button
                  onClick={() => fetchTickets(ticketsPage + 1)}
                  disabled={!ticketsHasNext}
                  className="px-4 py-2 text-sm border border-theme-border rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div>
          <h2 className="font-playfair text-2xl text-theme-text mb-6">
            Frequently Asked Questions
          </h2>

          {faqsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={26} className="animate-spin text-[#009966]" />
            </div>
          )}

          {faqsError && !faqsLoading && (
            <p className="text-red-500 text-sm">{faqsError}</p>
          )}

          {!faqsLoading && !faqsError && (
            <>
              <div className="flex items-center gap-1 mb-6 pb-1 flex-wrap">
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-2 py-1.5 rounded-full text-xs transition whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-[#0F172A] text-white"
                        : "bg-[#F1F5F9] text-[#6A7282] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredFaqs.length === 0 && (
                  <p className="text-theme-muted text-sm">
                    No matching questions found.
                  </p>
                )}

                {filteredFaqs.map((f, i) => (
                  <div
                    key={f.id}
                    className="border border-theme-border rounded-lg lg:rounded-xl lg:p-4 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                  >
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between text-left gap-4"
                    >
                      <p className="text-theme-text font-medium">{f.question}</p>

                      <ChevronDown
                        className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`}
                        size={18}
                      />
                    </button>

                    {open === i && (
                      <p className="text-theme-muted text-sm mt-3">{f.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="font-playfair text-2xl text-theme-text">Contact Us</h2>

          <div className="border border-theme-border rounded-lg lg:rounded-xl bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full flex items-center justify-between p-4 border-b text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <MessageSquare className="text-green-600" size={18} />
                </div>

                <div>
                  <p className="text-theme-text">Live Chat / Message Us</p>
                  <p className="text-sm text-theme-muted">
                    {contactInfo
                      ? `Response time: ${contactInfo.averageResponseTime}`
                      : "Wait time: ~2 mins"}
                  </p>
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Phone className="text-blue-600" size={18} />
                </div>

                <div>
                  <p className="text-theme-text">Call Support</p>
                  <p className="text-sm text-theme-muted">
                    {contactInfo ? contactInfo.phone : "Available 24/7"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Home className="text-red-600" size={18} />
                </div>

                <div>
                  <p className="text-theme-text">Address</p>
                  <p className="text-sm text-theme-muted">
                    {contactInfo ? contactInfo.address : "NA"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="text-gray-600" size={18} />
                </div>

                <div>
                  <p className="text-theme-text">Email Us</p>
                  <p className="text-sm text-theme-muted">
                    {contactInfo ? contactInfo.email : "Response in 24h"}
                  </p>
                </div>
              </div>
            </div>

            {contactInfo?.hours && (
              <div className="px-4 pb-4 text-xs text-theme-muted">
                Support hours: {contactInfo.hours}
              </div>
            )}
          </div>

          <div className="border border-theme-border rounded-lg lg:rounded-xl lg:p-6 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
            <div className="flex items-center gap-3 mb-3">
              <FileText size={18} className="text-theme-muted" />

              <h3 className="font-playfair text-lg">Policies</h3>
            </div>

            <div className="flex flex-col gap-2 text-[#009966] text-sm">
  <button
    className="text-left hover:underline"
    onClick={() =>
     setLegalModal({
  open: true,
  title: LEGAL_CONTENT.terms.title,
  subtitle: LEGAL_CONTENT.terms.subtitle,
  content: LEGAL_CONTENT.terms.content,
})
    }
  >
    Terms of Service
  </button>

  <button
    className="text-left hover:underline"
    onClick={() =>
     setLegalModal({
  open: true,
  title: LEGAL_CONTENT.privacy.title,
  subtitle: LEGAL_CONTENT.privacy.subtitle,
  content: LEGAL_CONTENT.privacy.content,
})
    }
  >
    Privacy Policy
  </button>
</div>
          </div>
        </div>
      </div>

<LegalInfoModal
  open={legalModal.open}
  title={legalModal.title}
  subtitle={legalModal.subtitle}
  content={legalModal.content}
  onClose={() =>
    setLegalModal((prev) => ({
      ...prev,
      open: false,
    }))
  }
/>

      {/* ---------- Contact Form Modal ---------- */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-theme-surface border border-theme-border rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-theme-muted hover:text-theme-text"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl text-theme-text mb-4">
              Send us a Message
            </h3>

            {contactSuccess ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 size={40} className="text-[#009966]" />
                <p className="text-theme-text font-medium">
                  Message sent successfully!
                </p>
                <p className="text-sm text-theme-muted">
                  We'll get back to you soon.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
                />

                <input
                  placeholder="Your Email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
                />

                <input
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
                />

                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none resize-none focus:border-[#009966]"
                />

                {contactError && (
                  <p className="text-red-400 text-sm">{contactError}</p>
                )}

                <button
                  onClick={submitContactForm}
                  disabled={contactSubmitting}
                  className="w-full bg-[#009966] hover:bg-[#00b377] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {contactSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Raise Ticket Modal ---------- */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-theme-surface border border-theme-border rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTicketForm(false)}
              className="absolute top-4 right-4 text-theme-muted hover:text-theme-text"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl text-theme-text mb-4 flex items-center gap-2">
              <Ticket size={20} className="text-[#009966]" />
              Raise a Support Ticket
            </h3>

            {ticketSuccess ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 size={40} className="text-[#009966]" />
                <p className="text-theme-text font-medium">
                  Ticket raised successfully!
                </p>
                <p className="text-sm text-theme-muted">
                  Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  placeholder="Subject"
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, category: e.target.value })
                    }
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text outline-none focus:border-[#009966]"
                  >
                    {TICKET_CATEGORIES.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="bg-theme-bg text-theme-text"
                      >
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, priority: e.target.value })
                    }
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text outline-none focus:border-[#009966]"
                  >
                    {TICKET_PRIORITIES.map((p) => (
                      <option
                        key={p}
                        value={p}
                        className="bg-theme-bg text-theme-text"
                      >
                        {p} Priority
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Describe your issue"
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, message: e.target.value })
                  }
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-3 text-theme-text placeholder:text-theme-muted outline-none resize-none focus:border-[#009966]"
                />

                {ticketError && (
                  <p className="text-red-400 text-sm">{ticketError}</p>
                )}

                <button
                  onClick={submitTicketForm}
                  disabled={ticketSubmitting}
                  className="w-full bg-[#009966] hover:bg-[#00b377] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {ticketSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Ticket Detail Modal ---------- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-theme-surface border border-theme-border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col relative">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-theme-border">
              <div>
                <p className="text-xs text-theme-muted mb-1">
                  {selectedTicket.ticketId}
                </p>

                <h3 className="font-playfair text-lg text-theme-text">
                  {selectedTicket.subject}
                </h3>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      STATUS_STYLES[selectedTicket.status] ||
                      "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-theme-surface text-theme-muted">
                    {selectedTicket.category}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      PRIORITY_STYLES[selectedTicket.priority] ||
                      "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {selectedTicket.priority} Priority
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="text-theme-muted hover:text-theme-text shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m._id}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.senderRole === "user"
                      ? "ml-auto bg-[#009966] text-white"
                      : "bg-[#1E293B] text-white"
                  }`}
                >
                  <p>{m.message}</p>

                  <p
                    className={`text-[10px] mt-1 ${
                      m.senderRole === "user"
                        ? "text-white/70"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {formatDate(m.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div className="p-4 border-t border-theme-border">
              <div className="flex items-center gap-2">
                <input
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-theme-text placeholder:text-theme-muted outline-none focus:border-[#009966]"
                  onKeyDown={(e) => e.key === "Enter" && submitReply()}
                />

                <button
                  onClick={submitReply}
                  disabled={replySubmitting}
                  className="bg-[#009966] hover:bg-[#00b377] text-white w-10 h-10 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-60"
                >
                  {replySubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>

              {replyError && (
                <p className="text-red-400 text-xs mt-2">{replyError}</p>
              )}

              {/* Rating */}
              {canRate && (
                <div className="mt-4 pt-4 border-t border-theme-border">
                  {selectedTicket.rating && !ratingSuccess ? (
                    <div className="flex items-center gap-2 text-sm text-theme-muted">
                      <span>You rated this:</span>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={14}
                            className={
                              n <= (selectedTicket.rating || 0)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-500"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-theme-text font-medium mb-2">
                        Rate this support experience
                      </p>

                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => setRating(n)}>
                            <Star
                              size={22}
                              className={
                                n <= rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-500"
                              }
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Add a comment (optional)"
                        rows={2}
                        className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-theme-text placeholder:text-theme-muted outline-none resize-none mb-2 focus:border-[#009966]"
                      />

                      {ratingError && (
                        <p className="text-red-400 text-xs mb-2">
                          {ratingError}
                        </p>
                      )}

                      {ratingSuccess && (
                        <p className="text-[#009966] text-xs mb-2 flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          Thanks for your feedback!
                        </p>
                      )}

                      <button
                        onClick={submitRating}
                        disabled={ratingSubmitting}
                        className="bg-[#009966] hover:bg-[#00b377] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
                      >
                        {ratingSubmitting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Submit Rating"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
