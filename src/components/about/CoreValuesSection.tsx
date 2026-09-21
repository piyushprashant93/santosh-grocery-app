import { ShieldCheck, Zap, Heart } from "lucide-react";

export default function CoreValuesSection() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      desc: "We prioritize the safety of our community above all else, with rigorous verification and secure handling.",
      iconBg: "bg-[#00C9501A]",
      iconColor: "text-[#00C950]",
    },
    {
      icon: Zap,
      title: "Innovation",
      desc: "Constantly pushing boundaries to make your experience faster, smarter, and more intuitive.",
      iconBg: "bg-[#FACC151A]",
      iconColor: "text-[#FACC15]",
    },
    {
      icon: Heart,
      title: "Customer Obsession",
      desc: "We don't just satisfy customers; we delight them. Your happiness is our primary metric of success.",
      iconBg: "bg-[#FB71851A]",
      iconColor: "text-[#FB7185]",
    },
  ];

  return (
    <section className="w-full bg-theme-surface">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 py-[80px]">
        
        <div className="text-center mb-16">
          <h2 className="font-playfair text-[54px] font-medium text-theme-text mb-4">
            Our Core Values
          </h2>
          <p className="text-theme-muted text-lg max-w-2xl mx-auto">
            Every decision we make is guided by these principles. They define who we are and how we serve you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-theme-bg border border-theme-border rounded-[18px] p-8"
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full mb-6 ${item.iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>

                <h3 className="font-playfair text-[27px] font-medium text-theme-text mb-4">
                  {item.title}
                </h3>

                <p className="text-theme-muted text-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}