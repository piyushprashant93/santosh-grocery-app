import { useState, useEffect } from "react"
import { ChevronDown, FileText } from "lucide-react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function SupportFAQ({ onStartChat }: { onStartChat?: () => void }) {
  const [open, setOpen] = useState<number | null>(null)
  const [categories, setCategories] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/restaurant-panel/support/faq/categories`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      }).catch(console.error);

    fetch(`${API_BASE}/restaurant-panel/support/faq`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setFaqs(data.data);
        } else if (Array.isArray(data)) {
          setFaqs(data);
        }
      }).catch(console.error);
  }, []);

  // Group faqs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ q: faq.question, a: faq.answer });
    return acc;
  }, {} as Record<string, any[]>);

  const finalFaqs = Object.keys(groupedFaqs).map(cat => ({
    category: cat,
    items: groupedFaqs[cat]
  }));

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      <div className="space-y-6">
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[#F54900]" />
            <h3 className="font-playfair text-xl">Help Categories</h3>
          </div>
          <div className="space-y-3 text-[#374151]">
            {categories.length > 0 ? categories.map((c, i) => (
              <p key={i} className="cursor-pointer hover:text-[#F54900]">{c.name || c}</p>
            )) : (
              finalFaqs.map((f, i) => (
                <p key={i} className="cursor-pointer hover:text-[#F54900]">{f.category}</p>
              ))
            )}
            {categories.length === 0 && finalFaqs.length === 0 && (
              <p className="text-theme-muted">Loading categories...</p>
            )}
          </div>
        </div>

        <div className="rounded-lg lg:rounded-xl p-3 lg:p-6 bg-[#FFF7ED] border border-[#FED7AA] shadow-sm">
          <h3 className="font-playfair text-xl mb-2">Still need help?</h3>
          <p className="text-theme-muted mb-4">
            Our support team is available 24/7 to assist you with any issues.
          </p>
          <button onClick={onStartChat} className="bg-[#F54900] text-white px-5 py-2.5 rounded-lg shadow-sm">
            Start Live Chat
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {finalFaqs.length === 0 && <p className="text-theme-muted">Loading FAQs...</p>}
        {finalFaqs.map((section, sIndex) => (
          <div key={sIndex} className="space-y-4">
            <h2 className="font-playfair text-2xl">{section.category}</h2>
            {section.items.map((item: { q: string; a: string }, i: number) => {
              const index = sIndex * 100 + i
              const active = open === index
              return (
                <div
                  key={index}
                  className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-4 shadow-sm cursor-pointer"
                  onClick={() => setOpen(active ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-theme-text">
                      {item.q}
                    </p>
                    <ChevronDown
                      size={18}
                      className={`transition ${active ? "rotate-180" : ""}`}
                    />
                  </div>
                  {active && (
                    <p className="text-theme-muted mt-3 text-sm">
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}