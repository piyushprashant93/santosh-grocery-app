import { useNavigate } from "react-router-dom";
import { useRole } from "../../layout/RoleProvider";
import {
  Users,
  ShoppingBag,
  Truck,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import customerImg from "../../assets/images/customerlogin.svg";
import retailerImg from "../../assets/images/retailerlogin.svg";
import supplierImg from "../../assets/images/supplierlogin.svg";
import restaurantImg from "../../assets/images/restaurantlogin.svg";
import Logo from "../../assets/images/logo-light.svg"
type RoleType = "customer" | "restaurant" | "retailer" | "supplier";

const cards = [
  {
    title: "Customer",
    subtitle: "PERSONAL ACCOUNT",
    desc: "Order food, shop for groceries, and track your deliveries in real-time.",
    btn: "Login as Customer",
    img: customerImg,
    icon: Users,
    iconColor: "text-[#00D492]",
    role: "customer",
  },
  {
    title: "Retailer",
    subtitle: "MERCHANT PANEL",
    desc: "Manage your product inventory, track sales, and grow your business.",
    btn: "Retailer Dashboard",
    img: retailerImg,
    icon: ShoppingBag,
    iconColor: "text-[#FF8904]",
    role: "retailer",
  },
  {
    title: "Supplier",
    subtitle: "WHOLESALE PARTNER",
    desc: "Manage bulk orders, track inventory, and supply to vendors easily.",
    btn: "Supplier Panel",
    img: supplierImg,
    icon: Truck,
    iconColor: "text-[#51A2FF]",
    role: "supplier",
  },
  {
    title: "Restaurant",
    subtitle: "PARTNER KITCHEN",
    desc: "Update your menu, manage orders, and view kitchen performance.",
    btn: "Restaurant Portal",
    img: restaurantImg,
    icon: ChefHat,
    iconColor: "text-[#FF637E]",
    role: "restaurant",
  },
];

export default function ChooseExperience() {
  const { setRole } = useRole();
    const navigate = useNavigate();
  return (
    <section className="bg-theme-bg min-h-[calc(100vh-80px)] flex flex-col justify-between w-full">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 w-full">
        <div className="flex py-9 items-center justify-between gap-3">
            <img src={Logo} alt="" />
            <div className="text-theme-muted font-medium flex items-center gap-2 cursor-pointer" onClick={()=>navigate("/")}>
                <ArrowLeft />
                Back to Home
            </div>
        </div>
        <div className="text-center mx-auto mt-9">
          <h2 className="text-4xl md:text-5xl text-theme-text font-playfair">
            Choose Your{" "}
            <span className="text-[#00A63E] italic font-playfair">
              Experience
            </span>
          </h2>
          <p className="mt-4 text-theme-muted text-[22px]">
            Access your personalized dashboard to manage orders, products, or
            deliveries.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 gap-4 pb-16">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="relative h-[460px] rounded-[18px] overflow-hidden group bg-[#0F172B99] border border-[#FFFFFF0D] shadow-[0px_8px_10px_-6px_#0000001A,0px_20px_25px_-5px_#0000001A]"
              >

                <div
                  className="h-[209px] w-full flex justify-center items-center rounded-t-[18px]"
                  style={{
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-theme-surface border-2 border-[#314158] flex items-center justify-center shadow-[0px_0px_0px_1px_#FFFFFF0D]">
                    <Icon size={28} className={card.iconColor} />
                  </div>
                </div>

                <div className="absolute bottom-5 left-4 right-4 text-center">
                  <h3 className="font-playfair text-[27px] font-bold text-theme-text">
                    {card.title}
                  </h3>
                  <p className="text-xs font-bold text-[#62748E] mt-2">
                    {card.subtitle}
                  </p>
                  <p className="text-theme-muted text-sm mt-4 leading-relaxed">
                    {card.desc}
                  </p>

                  <button onClick={() => {
    setRole(card.role as RoleType);
    navigate(`/role-wise-sign-in?role=${card.role}`);
  }} className="mt-6 w-full bg-[#FFFFFF0D] border border-[#FFFFFF1A] text-theme-text py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-[#00A63E] transition">
                    {card.btn}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
        <div className="text-center py-10">
          <p className="text-[16px] text-[#45556C]">
            Secure Access Portal • Authorized Use Only
          </p>
          <p className="text-[14px] text-[#45556C] font-medium mt-3 uppercase flex items-center gap-2 justify-center">
            <ShieldCheck size={16} />
            Admin Login
          </p>
        </div>
    </section>
  );
}
