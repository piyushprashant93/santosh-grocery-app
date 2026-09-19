import { ChefHat } from "lucide-react";
import HeroBg from "../../assets/images/orderbg.jpg";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../layout/RoleProvider";

export default function HeroSection() {
    const { setRole } = useRole();
    const navigate = useNavigate();
  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
      <img
        src={HeroBg}
        alt=""
        className="absolute inset-0 w-full object-cover h-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#020618_0%,rgba(2,6,24,0.5)_50%,rgba(0,0,0,0)_100%),linear-gradient(90deg,#020618_0%,rgba(2,6,24,0.8)_50%,rgba(2,6,24,0.4)_100%)]" />

      <div className="relative max-w-[1265px] mx-auto px-3 lg:px-6 py-[90px] text-theme-text text-start overflow-hidden">
        <span className="w-fit mb-8 px-4 py-1.5 rounded-full mx-auto bg-[#00C9501A] flex gap-2 items-center border uppercase border-[#00C95033] text-[#00BC7D] text-xs font-bold">
          <ChefHat size={16} />
          For Food Lovers & Creators
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-playfair flex gap-3 justify-center">
          <span className="font-playfair">The Heart of</span>
          <span className="text-[#00BC7D] font-playfair">Good Food</span>
        </h1>

        <p className="mt-8 max-w-[734px] text-[#CAD5E2] text-[20px] mx-auto text-center">
          Connecting passionate chefs with hungry hearts. Whether you're here to
          serve or to savor, you've found the right place.
        </p>

        <div className="mt-16 border border-theme-border rounded-[26px] overflow-hidden bg-theme-surface max-w-[805px] mx-auto">
          <div className="p-8 relative">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00BC7D1A] border border-[#00BC7D1A] text-[#00D492] px-3 py-1 rounded-full mb-6">
                <ChefHat size={18} />
                <span className="text-sm font-medium tracking-wide uppercase">
                  For Owners
                </span>
              </div>

              <h2 className="font-playfair text-[32px] lg:text-[40px] leading-[1.1] text-theme-text mb-6">
                Manage your Restaurant?
              </h2>

              <p className="text-theme-muted text-[20px] leading-relaxed max-w-[480px] mb-10">
                Streamline operations, track inventory, and grow your customer
                base with our all-in-one management suite.
              </p>

              <div onClick={() => {
    setRole("restaurantbackend");
    navigate(`/role-wise-sign-in?role=restaurantbackend`);
  }}
                className="inline-flex cursor-pointer items-center justify-center bg-[#009966] hover:bg-[#008055] text-white px-8 h-[56px] rounded-full text-lg font-medium shadow-[0px_4px_6px_-4px_#004F3B33,0px_10px_15px_-3px_#004F3B33]"
              >
                Partner Access
              </div>
            </div>

            <div className="flex justify-end absolute -bottom-10 -right-10">
              <div className="w-[288px] h-[288px] rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
