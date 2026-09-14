import { Paperclip, Send, MoreVertical, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { parseApiError } from "../../lib/apiErrorHandler"
import toast from "react-hot-toast"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function SupportLiveChat() {
  const [message, setMessage] = useState("")
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/support/livechat`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setChatSessionId(data.data.id || data.data._id);
        setMessages(data.data.messages || []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !chatSessionId) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/support/livechat/${chatSessionId}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("");
        fetchChat();
      } else {
        toast.error(parseApiError(data, "Failed to send message"));
      }
    } catch(err) {
      console.error(err);
    }
  };

  const closeChat = async () => {
    if(!chatSessionId) return;
    try {
      await fetch(`${API_BASE}/restaurant-panel/support/livechat/${chatSessionId}/close`, {
        method: "PUT",
        headers: authHeaders()
      });
      toast.success("Chat session closed.");
      setMessages([]);
      setChatSessionId(null);
      fetchChat();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-0 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] flex flex-col h-[620px]">

      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"/>
          <div>
            <p className="font-playfair text-lg">Admin Support</p>
            <p className="text-sm text-[#6A7282]">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"/>
              Online | Typically replies instantly
            </p>
          </div>
        </div>
        <button onClick={closeChat} className="text-[#6A7282] hover:text-red-500 transition" title="Close Chat">
          <X size={20}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide px-6 py-6 space-y-6">
        <div className="flex justify-center">
          <span className="bg-gray-100 text-sm px-4 py-1 rounded-full text-[#6A7282]">
            Today
          </span>
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.senderType !== "admin" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[420px] px-4 py-3 rounded-2xl shadow-sm ${
                m.senderType !== "admin"
                  ? "bg-[#F54900] text-white"
                  : "bg-white border border-[#E5E7EB]"
              }`}
            >
              <p>{m.message}</p>
              <p
                className={`text-xs mt-2 ${
                  m.senderType !== "admin"
                    ? "text-white/80 text-right"
                    : "text-[#6A7282] text-right"
                }`}
              >
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t px-4 py-3 flex items-center gap-3">
        <Paperclip size={20} className="text-[#6A7282] cursor-pointer"/>
        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border border-[#E5E7EB] rounded-full px-4 py-2 outline-none"
        />
        <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-[#F54900] flex items-center justify-center text-white shrink-0">
          <Send size={18}/>
        </button>
      </div>

    </div>
  )
}