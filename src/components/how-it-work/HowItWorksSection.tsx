import { Search, Utensils, Truck, Star, ChevronRightIcon } from "lucide-react"
import CurateImage from "../../assets/images/curate.jpg"
import PrepareImage from "../../assets/images/masterful.jpg"
import DeliverImage from "../../assets/images/delivery.jpg"
import EnjoyImage from "../../assets/images/savor.jpg"
import { getImageUrl } from "../../utils/dataHelper";


const steps = [
  {
    id: 1,
    title: "Curate Your Order",
    desc: "Browse our exclusive list of 5-star restaurants and organic markets. Filter by cuisine, dietary preference, or chef specials.",
    icon: Search,
    image: CurateImage,
    color: "text-green-400",
  },
  {
    id: 2,
    title: "Masterful Preparation",
    desc: "Your order is sent directly to the kitchen tablet. Our partner chefs prepare your meal with the same attention to detail as a dine-in experience.",
    icon: Utensils,
    image: PrepareImage,
    color: "text-orange-400",
  },
  {
    id: 3,
    title: "White-Glove Delivery",
    desc: "A uniformed HubNepa professional picks up your order in a temperature-controlled thermal case, ensuring it arrives piping hot or perfectly chilled.",
    icon: Truck,
    image: DeliverImage,
    color: "text-blue-400",
  },
  {
    id: 4,
    title: "Savor the Moment",
    desc: "Unbox a restaurant-quality meal at your dining table. Rate your experience to help us maintain our rigorous standards.",
    icon: Star,
    image: EnjoyImage,
    color: "text-green-400",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
      <div className="relative max-w-[1265px] mx-auto px-3 lg:px-6 py-20">

        <div className="flex flex-col gap-32">

          {steps.map((step, index) => {
            const Icon = step.icon
            const reverse = index % 2 !== 0

            return (
              <div
                key={step.id}
                className={`grid lg:grid-cols-2 gap-10 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
              >

                <div className="relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-[320px] md:h-[420px] object-cover rounded-[16px]"
                  />

                  <div className={`absolute top-4 font-playfair left-4 w-12 h-12 rounded-full bg-[#0F172B] flex items-center justify-center text-[20px] font-bold text-white ${step.color}`}>
                    {step.id}
                  </div>
                </div>

                <div className="text-left">
                  <div className="w-12 h-12 rounded-xl bg-theme-surface flex items-center justify-center mb-6 border border-theme-border">
                    <Icon size={22} className={step.color} />
                  </div>

                  <h3 className="font-playfair text-[28px] md:text-[36px] font-medium text-theme-text mb-4">
                    {step.title}
                  </h3>

                  <p className="text-theme-muted text-[18px] leading-relaxed max-w-[560px]">
                    {step.desc}
                  </p>

                  <button className={`mt-6 flex items-center gap-2 text-xs font-medium ${step.color}`}>
                    LEARN MORE
                    <ChevronRightIcon size={16} />
                  </button>
                </div>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}