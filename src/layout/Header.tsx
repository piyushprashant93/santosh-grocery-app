import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { LayoutGrid, LogOut, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Restaurants", path: "/restaurants" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "How it Works", path: "/how-it-work" },
];

type StoredUser = {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
};

const getStoredUser = (): StoredUser => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export default function Header() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState<StoredUser>(getStoredUser());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isLoggedIn = !!authToken;

  const firstName = user.firstName?.trim();
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  useEffect(() => {
    const handleStorage = () => {
      setAuthToken(localStorage.getItem("authToken"));
      setRole(localStorage.getItem("role"));
      setUser(getStoredUser());
    };

    const handleUserUpdate = (event: Event) => {
      const detail = (event as CustomEvent<StoredUser>).detail;
      setUser(detail ?? getStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "Logout failed.");
      }

      // Success
      localStorage.clear();
      setAuthToken(null);
      setRole("customer");
      setUser({});
      setShowLogoutModal(false);

      navigate("/role-wise-sign-in?role=customer");
    } catch (err) {
      setLogoutError(
        err instanceof Error
          ? err.message
          : "Something went wrong logging out.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-theme-surface shadow-sm h-20 flex items-center">
      <div className="max-w-[1265px] lg:px-6 px-3 mx-auto w-full flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="" className="dark:invert" />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative transition ${
                  isActive
                    ? "text-[#E17100] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#E17100]"
                    : "text-[#64748B] hover:text-theme-text"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        {isLoggedIn ? (
          <div className="flex items-center justify-between gap-3">
            <div
              onClick={() => navigate(`/${role}/dashboard`)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <p className="text-sm text-theme-muted capitalize">
                Hello {firstName || "User"}
              </p>

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={fullName || "Profile"}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-theme-text flex items-center justify-center text-xs font-semibold border border-white/20">
                  {initials || "U"}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/${role}/dashboard`)}
                className="flex items-center gap-2 bg-[#F59E0B] text-theme-text px-5 py-2 rounded-lg font-medium"
              >
                <LayoutGrid size={16} />
                Dashboard
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-red-500"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/sign-in")}
              className="hidden md:block text-sm text-theme-muted font-medium"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/sign-up")}
              className="shadow-[0px_4px_6px_-4px_#D9770633,0px_10px_15px_-3px_#D9770633] flex items-center gap-2 bg-[#D97706] text-theme-text text-sm px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition"
            >
              Sign Up Now
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="hidden md:block text-sm text-theme-muted font-medium"
            >
              Admin
            </button>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-theme-surface p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-theme-text">Sign Out</h2>

            <p className="mt-3 text-sm text-[#6B7280]">
              Are you sure you want to sign out?
            </p>

            {logoutError && (
              <p className="mt-4 text-sm text-red-500">{logoutError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loggingOut ? "Signing Out..." : "Yes, Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
