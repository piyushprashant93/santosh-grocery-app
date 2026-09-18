import { Search, ShoppingBag, Bell, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";
import CustomerChild from "./CustomerChild";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "../RoleProvider";
import { ThemeProvider } from "./ThemeContext";

const customerTabToPath = (tab: string) => {
  if (tab === "overview") return "";
  return `/${tab}`;
};

const customerPathToTab = (pathname: string) => {
  const parts = pathname
    .replace("/customer/dashboard", "")
    .split("/")
    .filter(Boolean);
  const last = parts[parts.length - 1];
  return last || "overview";
};

type StoredUser = {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  membershipTier?: string;
};

const getStoredUser = (): StoredUser => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "overview";
  });

const { setRole } = useRole();
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [user, setUser] = useState<StoredUser>(getStoredUser());

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: string) => {
    localStorage.setItem("activeTab", tab);
    navigate(`/customer/dashboard${customerTabToPath(tab)}`);
  };

  useEffect(() => {
    const routeTab = customerPathToTab(location.pathname);
    if (routeTab !== activeTab) {
      setActiveTab(routeTab);
    }
  }, [location.pathname, activeTab]);

  useEffect(() => {
    const handleUserUpdate = (event: Event) => {
      const detail = (event as CustomEvent<StoredUser>).detail;
      if (detail) {
        setUser(detail);
      } else {
        setUser(getStoredUser());
      }
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white relative">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
      <div
        ref={sidebarRef}
        className={`fixed lg:static z-40 h-full min-h-svh bg-white dark:bg-[#020618] border-r border-[#E5E7EB] dark:border-[#1E293B] transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <CustomerSidebar
          user={user}
          setIsLoggedIn={setIsLoggedIn}
          setShowLogoutModal={setShowLogoutModal}
          loggingOut={loggingOut}
          logoutError={logoutError}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[#111827]">Sign Out</h2>

            <p className="mt-3 text-sm text-[#6B7280]">
              Are you sure you want to sign out?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                disabled={loggingOut}
                className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600 disabled:opacity-60"
              >
                {loggingOut ? "Signing Out..." : "Yes, Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <CustomerHeader
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openSidebar={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto scroll-hide lg:p-8 p-4">
          <CustomerChild setActiveTab={handleTabChange} activeTab={activeTab} />
        </div>
      </div>
      </div>
    </ThemeProvider>
  );
}
