import { Utensils, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../layout/RoleProvider";
type RoleType = "customer" | "restaurant" | "restaurantbackend" | "retailer" | "supplier";
const cards = [
  {
    icon: Utensils,
    title: "Order Food",
    desc: "Browse menus and order delivery.",
    action: "Order Now",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    path: "/restaurants",
  },
  {
    icon: ChefHat,
    title: "Partner with Us",
    desc: "Grow your restaurant business.",
    action: "Join Now",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    path: "/role-wise-sign-in?role=restaurantbackend",
    role: "restaurantbackend",
  },
];

export default function GetStartedSection() {
        const { setRole } = useRole();
  
  const navigate = useNavigate();
  return (
    <section className="bg-theme-bg py-[108px]">
      <div className="max-w-[1265px] lg:px-6 px-3 mx-auto text-center">

        <h2 className="font-playfair text-[54px] text-theme-text font-medium mb-4">
          Ready to get started?
        </h2>

        <p className="text-theme-muted text-[20px] mb-16">
          Join the fastest growing food community.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
        {cards.map((card, i) => {
  const Icon = card.icon;

  return (
    <div
      key={i}
      onClick={() => {
        if (card.role) {
          setRole(card.role as RoleType);
        }
        navigate(card.path);
      }}
      className="bg-theme-surface max-w-[360px] border border-[#FFFFFF0D] rounded-[20px] p-10 text-center cursor-pointer"
    >
      <div
        className={`w-14 h-14 rounded-full ${card.bg} ${card.border} border flex items-center justify-center mx-auto mb-6`}
      >
        <Icon className={`${card.color}`} size={26} />
      </div>

      <h3 className="font-playfair text-[22px] font-bold text-theme-text mb-3">
        {card.title}
      </h3>

      <p className="text-theme-muted text-[15px] mb-6">
        {card.desc}
      </p>

      <button className={`${card.color} text-[15px] font-medium`}>
        {card.action}
      </button>
    </div>
  );
})}
        </div>

      </div>
    </section>
  );
}