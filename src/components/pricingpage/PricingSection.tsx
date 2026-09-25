import { Check } from "lucide-react"
import { useNavigate } from "react-router-dom"

const plans = [
  {
    title: "Customer",
    price: "Free",
    description: "For everyone who loves great food and products.",
    features: [
      "Access to all restaurants",
      "Marketplace shopping",
      "Order tracking",
      "Basic support",
    ],
    button: "Join Now",
    btnColor: "bg-[#009966]",
    color: "text-[#009966]",
    url: "/sign-up"
  },
  {
    title: "HubNepa+",
    price: "$9.99/mo",
    description: "Premium benefits for frequent users.",
    features: [
      "Free delivery on orders over $25",
      "Exclusive discounts",
      "Priority support",
      "Early access to new items",
    ],
    button: "Start Free Trial",
    btnColor: "bg-[#F54900]",
    color: "text-[#F54900]",
    url: "/sign-up"
  },
  {
    title: "Partner",
    price: "Commission",
    description: "Grow your business with HubNepa.",
    features: [
      "Restaurant & Retailer tools",
      "Marketing suite",
      "Analytics dashboard",
      "Dedicated account manager",
    ],
    button: "Become a Partner",
    btnColor: "bg-[#155DFC]",
    color: "text-[#155DFC]",
    url: "/role-wise-sign-in"
  },
]

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-theme-bg py-[60px] text-theme-text">
      <div className="max-w-[1265px] mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="font-playfair text-[54px] font-medium">
            Simple, Transparent Pricing
          </h2>
          <p className="text-theme-muted text-[22px] mt-6">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-theme-surface border border-theme-border rounded-[18px] p-8 flex flex-col justify-between"
            >

              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-[22px] font-playfair">{plan.title}</p>
                  <h3 className="text-[34px] font-bold">{plan.price}</h3>
                  <p className="text-theme-muted mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#CAD5E2]">
                      <Check size={18} className={plan.color} />
                      {feature}
                    </li>
                  ))}
                </ul>

              </div>

              <button
                onClick={() => navigate(plan.url)}
                className={`${plan.btnColor} mt-8 h-[48px] rounded-lg text-white text-base`}
              >
                {plan.button}
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}