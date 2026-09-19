import { MapPin, Smartphone, Star, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Local Discovery",
    desc: "Find hidden gems and top-rated spots in your neighborhood with our smart discovery engine.",
    link: "Browse Restaurants",
    color: "text-[#FF6900]",
  },
  {
    icon: Smartphone,
    title: "Smart Management",
    desc: "Restaurants get a powerful tablet dashboard to manage orders, inventory, and staff in real-time.",
    link: "See Features",
    color: "text-[#00BC7D]",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    desc: "Authentic feedback from real customers helps diners choose better and restaurants improve faster.",
    link: "Read Reviews",
    color: "text-[#F0B100]",
  },
];

export default function EcosystemSection() {
  return (
    <section className="w-full bg-theme-bg pt-10 pb-[100px]">
      <div className="bg-theme-surface border-y border-[#FFFFFF0D] mb-10">
        <div className="h-[104px] flex items-center justify-between text-theme-muted text-sm max-w-[1265px] lg:px-6 px-3 mx-auto">
          <span>Michelin Stars</span>
          <span>Eater Approved</span>
          <span>James Beard Foundation</span>
          <span>Zagat Rated</span>
          <span>Bon Appétit</span>
        </div>
      </div>

      <div className="max-w-[1265px] lg:px-6 px-3 mx-auto">


        <div className="text-center max-w-[720px] mx-auto mb-16">
          <h2 className="font-playfair text-[54px] text-theme-text font-medium leading-[1.1] mb-6">
            A complete ecosystem for food lovers
          </h2>

          <p className="text-theme-muted text-[20px]">
            Whether you're ordering dinner or serving it, we've built the tools
            to make the experience seamless.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="bg-theme-surface border border-[#FFFFFF0D] rounded-[18px] p-8"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FFFFFF0D] flex items-center justify-center mb-6">
                  <Icon className={`${item.color}`} size={22} />
                </div>

                <h3 className="font-playfair text-[24px] text-theme-text mb-4">
                  {item.title}
                </h3>

                <p className="text-theme-muted text-[18px] mb-6">
                  {item.desc}
                </p>

                <button className={`flex items-center gap-2 ${item.color}`}>
                  {item.link}
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}