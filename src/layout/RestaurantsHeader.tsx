import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { useRole } from "./RoleProvider";
export default function RestaurantsHeader() {
    const { setRole } = useRole();
    const navigate = useNavigate();
  return (
    <header className="w-full bg-theme-bg">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3 h-[80px] flex items-center justify-between">

        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="Hubnepa" className="dark:invert h-10 object-contain" />
        </div>

        <div className="flex items-center gap-6">
          <span onClick={() => {
    setRole("restaurantbackend");
    navigate(`/role-wise-sign-in?role=restaurantbackend`);
  }}
            className="text-theme-muted hover:text-theme-text transition cursor-pointer"
          >
            Partner Login
          </span>

          <NavLink
            to="/restaurants"
            className="px-5 py-2 rounded-full border border-theme-border text-[#00D492] hover:bg-theme-surface transition"
          >
            Find Food
          </NavLink>
        </div>

      </div>
    </header>
  );
}