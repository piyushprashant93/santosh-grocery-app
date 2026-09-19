import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function JoinRevolutionSection() {
  return (
    <section className="w-full bg-theme-bg">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 py-[120px] text-center">

        <h2 className="font-playfair text-[54px] font-medium text-theme-text mb-6">
          Join the Revolution
        </h2>

        <p className="text-[20px] text-theme-muted max-w-[760px] mx-auto mb-10 leading-relaxed">
          Whether you're a customer, a restaurant owner, or a driver, there's a
          place for you in the HUBNEPA ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <NavLink
            to="/sign-up"
            className="bg-[#009966] hover:bg-[#00996699] text-white px-8 h-[48px] rounded-lg flex items-center justify-center gap-2 shadow-[0px_8px_10px_-6px_#004F3B4D,0px_20px_25px_-5px_#004F3B4D] transition"
          >
            Get Started Today
            <ArrowRight size={18} />
          </NavLink>

          <NavLink
            to="#"
            className="bg-[#E5E7EB] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] text-theme-muted hover:text-black px-8 h-[48px] rounded-lg flex items-center justify-center transition"
          >
            Become a Partner
          </NavLink>
        </div>

      </div>
    </section>
  );
}