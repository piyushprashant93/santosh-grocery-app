import {
  Home,
  Clock,
  Wallet,
  Heart,
  Settings,
  HelpCircle,
  ShoppingBag,
  LogOut,
  Utensils,
} from "lucide-react";
import Logo from "../../assets/images/logo.svg";
import LogoLight from "../../assets/images/logo-light.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

const menu = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "orders", label: "My Orders", icon: Clock },
  { id: "wallet", label: "Wallet & Payments", icon: Wallet },
  { id: "saved", label: "Saved Items", icon: Heart },
  { id: "profile", label: "Profile & Settings", icon: Settings },
  { id: "support", label: "Help & Support", icon: HelpCircle },
];

type StoredUser = {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  membershipTier?: string;
};

export default function CustomerSidebar({
  user,
  activeTab,
  setActiveTab,
  setSidebarOpen,
  setShowLogoutModal,
  loggingOut,
  logoutError,
  setIsLoggedIn
}: {
  user: StoredUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowLogoutModal: (show: boolean) => void;
  loggingOut: boolean;
  logoutError: string;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <div className="w-[288px] flex flex-col h-full pb-5">
      <div className="px-6 py-6 border-b border-theme-border flex justify-between items-center">
        <img 
          src={theme === 'dark' ? LogoLight : Logo} 
          alt="Hubnepa Logo" 
          className="cursor-pointer" 
          onClick={() => navigate("/")} 
        />
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3 bg-theme-surface rounded-xl p-4 border border-theme-border">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#009966] text-white flex items-center justify-center font-semibold text-lg">
              {initials}
            </div>
          )}

          <div>
            <div className="font-semibold text-theme-text">
              {fullName || "Guest User"}
            </div>

            <div className="text-[#009966] text-sm">
              {user.membershipTier || "Free"} Member
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-6 px-4 space-y-1 flex flex-col justify-between gap-1 h-full">
        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition ${
                  active
                    ? "bg-[#ECFDF5] text-[#009966] font-medium"
                    : "text-theme-muted hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}

          <div className="border-t border-theme-border my-4"></div>

          <div className="px-4 text-xs font-semibold text-[#9CA3AF] tracking-wider !mt-5">
            SHOP
          </div>

          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-theme-muted hover:bg-gray-50"
          >
            <ShoppingBag size={20} />
            Marketplace
          </button>
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-theme-muted hover:bg-gray-50"
          >
            <Utensils size={20} />
            Restaurants
          </button>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          disabled={loggingOut}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 ${loggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <LogOut size={20} />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
        {logoutError ? (
          <p className="text-sm text-[#F87171] mt-2 px-4">{logoutError}</p>
        ) : null}
      </div>
    </div>
  );
}
