import { Medal, Crown, Gem, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingPlans() {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Silver",
      price: "$29",
      icon: Medal,
      iconcolor: "text-white",
      description: "Perfect for small restaurants getting started",
      features: [
        "Up to 50 menu items",
        "Basic inventory tracking",
        "Email support",
        "Mobile app access",
        "Monthly reports",
      ],
      highlighted: false,
    },
    {
      name: "Gold",
      price: "$79",
      icon: Crown,
      iconcolor: "text-[#FACC15]",
      description: "Ideal for growing restaurants with multiple locations",
      features: [
        "Unlimited menu items",
        "Advanced inventory tracking",
        "Priority email & chat support",
        "Multi-location management",
        "Real-time analytics",
      ],
      highlighted: true,
    },
    {
      name: "Platinum",
      price: "$149",
      icon: Gem,
      iconcolor: "text-white",
      description: "Enterprise solution for restaurant chains",
      features: [
        "Everything in Gold",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "API access",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="w-full bg-theme-bg">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 pt-16 pb-[120px]">

        <div className="text-center mb-16">
          <p className="text-[#10B981] text-sm tracking-widest uppercase mb-4">
            ✦ Simple & Flexible Pricing
          </p>

          <h2 className="font-playfair text-[54px] font-bold text-theme-text mb-4">
            Choose the Perfect Plan
          </h2>

          <p className="text-[#99A1AF] text-lg max-w-[720px] mx-auto">
            Whether you're a small bistro or large chain, we have a plan that
            fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <div
                key={index}
                className={`relative bg-[#0F172B80] border border-[#1D293D] rounded-[18px] p-8 flex flex-col justify-between w-full ${
                  plan.highlighted
                    ? "border-[#10B981] shadow-[0px_0px_26.22px_0px_#10B9814D]"
                    : ""
                }`}
              >

                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10B981] text-theme-text text-xs px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

               <div>
                 <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#1D293D] rounded-xl mb-6">
                  <Icon className={plan.iconcolor} />
                </div>

                <h3 className="text-theme-text text-[20px] font-medium mb-3 text-center">
                  {plan.name}
                </h3>

                <div className="flex items-end justify-center gap-1 mb-3">
                  <span className="text-theme-text text-[48px] font-playfair">
                    {plan.price}
                  </span>
                  <span className="text-theme-muted mb-2">/month</span>
                </div>

                <p className="text-theme-muted mb-6 text-center text-sm">
                  {plan.description}
                </p>
               </div>

                <div className="w-full">
                    <button onClick={()=>navigate("/complete-order")}
                  className={`h-[48px] w-full rounded-lg mb-8 ${
                    plan.highlighted
                      ? "bg-[#10B981] text-white"
                      : "border border-[#2A3555] text-white"
                  }`}
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="bg-[#10B98133] w-5 h-5 flex justify-center items-center rounded-full"><Check size={15} className="text-[#10B981]" /></span>
                      <span className="text-[#D1D5DC] text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}