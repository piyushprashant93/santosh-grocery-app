import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import LogoDark from "../assets/images/logo.svg";
import LogoLight from "../assets/images/logo-light.svg";
import { useNavigate } from "react-router-dom";

export function SecondaryHeader() {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b border-theme-border bg-theme-bg">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 h-[72px] flex items-center justify-between">
       <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={LogoDark} alt="Hubnepa" className="block dark:hidden" />
          <img src={LogoLight} alt="Hubnepa" className="hidden dark:block" />
        </div>

        <div onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer bg-[#FACC15] text-theme-text px-4 h-[40px] rounded-lg text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </div>
      </div>
    </div>
  );
}