import { MapPin, Mail, Clock, Send, LucideBookCopy } from "lucide-react";
import { getImageUrl } from "../../utils/dataHelper";


const pressArticles = [
  {
    source: "TECHCRUNCH",
    date: "Jan 15, 2026",
    title: "HubNepa Raises Series B Funding to Expand Nationwide",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200",
  },
  {
    source: "FORBES",
    date: "Dec 10, 2025",
    title: "How HubNepa is Revolutionizing Local Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
  },
  {
    source: "EATER",
    date: "Nov 22, 2025",
    title: "The Future of Food Delivery: An Interview with HubNepa CEO",
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200",
  },
];

export default function PressSection() {
  return (
    <section className="bg-theme-bg py-24 text-theme-text">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3">
        <div className="text-center mb-16">
          <div className="bg-theme-surface w-[72px] h-[72px] rounded-[18px] border border-theme-border flex justify-center items-center mx-auto mb-6">
            <LucideBookCopy size={40} className="text-[#FF6900]" />
          </div>
          <h2 className="font-playfair text-[54px] font-medium">Newsroom</h2>
          <p className="text-theme-muted max-w-[731px] mx-auto text-[22px] mt-6">
            Latest updates, press releases, and media resources.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressArticles.map((item, index) => (
              <div
                key={index}
                className="bg-theme-surface border border-theme-border rounded-[18px] overflow-hidden hover:border-[#334155] transition"
              >
                <div className="relative">
  <img
    src={getImageUrl(item.image)}
    className="w-full h-[220px] object-cover"
  />

  <div className="absolute inset-0 bg-[linear-gradient(0deg,#0F172B_0%,rgba(0,0,0,0)_100%)]" />
</div>

                <div className="p-6">
                  <div className="flex justify-between text-xs mb-4">
                    <span className="text-[#00BC7D] font-medium uppercase tracking-wider">
                      {item.source}
                    </span>
                    <span className="text-[#62748E] text-xs font-medium">{item.date}</span>
                  </div>

                  <h3 className="font-playfair text-[22px] text-theme-text font-medium leading-snug mb-6">
                    {item.title}
                  </h3>

                  <button className="flex items-center font-medium gap-2 text-theme-muted hover:text-theme-text transition">
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <div className="bg-theme-surface border border-theme-border rounded-[18px] px-12 py-10 text-center max-w-[760px] w-full">
              <h3 className="font-playfair text-[22px] font-medium text-theme-text mb-3">
                Media Inquiries
              </h3>

              <p className="text-theme-muted text-lg mb-6">
                For press kits and interview requests, please contact our media
                team.
              </p>

              <button className="bg-theme-surface text-[#050B1E] px-6 py-3 rounded-lg">
                Contact Press Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
