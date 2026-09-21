import { Search, ShoppingBag, Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";

export default function CustomerHeader({
  activeTab,
  setActiveTab,
  openSidebar,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSidebar: () => void;
}) {
  const [openCart, setOpenCart] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUnreadCount = async () => {

      try {
        const response = await fetch(
          "https://mr-santosh-grocery-backend.onrender.com/api/v1/notifications?page=1&limit=20",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch notifications.");
        }

        const notifications = data?.data?.data ?? [];
        const unread = notifications.filter(
          (item: any) => !item.isRead,
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.log(error);
      }
    };

    void fetchUnreadCount();

    const eventSource = new EventSource(`https://mr-santosh-grocery-backend.onrender.com/api/v1/notifications/stream?token=${token}`);
    eventSource.onmessage = (event) => {
      try {
        if (event.data !== "ping") {
          // New notification received
          setUnreadCount((prev) => prev + 1);
          window.dispatchEvent(
            new CustomEvent("new-notification", { detail: JSON.parse(event.data) })
          );
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    window.addEventListener("notifications-updated", fetchUnreadCount);
    return () => {
      window.removeEventListener("notifications-updated", fetchUnreadCount);
      eventSource.close();
    };
  }, []);

  // Fetch cart item count
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          "https://mr-santosh-grocery-backend.onrender.com/api/v1/cart",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setCartCount(data?.data?.cart?.itemCount || 0);
        }
      } catch (err) {
        console.error("Failed to fetch cart count", err);
      }
    };

    void fetchCartCount();
  }, [openCart]); // Re-fetch when cart modal closes

  return (
    <div className="flex items-center justify-between lg:px-8 px-4 h-[72px] bg-theme-surface dark:bg-theme-bg border-b border-theme-border dark:border-theme-border">
      <div className="cursor-pointer lg:hidden dark:text-theme-text" onClick={openSidebar}>
        <Menu />
      </div>

      <div className="sm:flex items-center gap-3 text-sm ml-3 hidden">
        <span className="text-theme-muted">HubNepa</span>
        <span className="text-theme-muted">›</span>
       <span className="font-semibold text-theme-text dark:text-theme-text">
  {activeTab
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}
</span>
      </div>

      <div className="flex items-center sm:gap-4 gap-1 flex-1 justify-end">
        <div
          className="relative sm:max-w-[250px] max-w-[150px] w-full cursor-pointer"
          onClick={() => setActiveTab("search")}
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted cursor-pointer"
          />

          <input
            placeholder="Search orders..."
            readOnly
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F1F5F9] dark:bg-theme-surface dark:text-theme-text dark:border dark:border-theme-border text-sm outline-none cursor-pointer"
          />
        </div>


        <button
          onClick={() => setOpenCart(true)}
          className="relative w-10 min-w-10 h-10 flex items-center justify-center rounded-lg border border-theme-border dark:border-theme-border dark:text-theme-text"
        >
          <ShoppingBag size={18} className="text-theme-muted dark:text-theme-muted" />

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#00A63E] rounded-full text-[10px] text-theme-text font-bold flex items-center justify-center">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        <CartModal selectedProduct="" open={openCart} onClose={() => setOpenCart(false)} />

        <button
          onClick={() => setActiveTab("notifications")}
          className="relative w-10 min-w-10 h-10 flex items-center justify-center rounded-lg border border-theme-border dark:border-theme-border dark:text-theme-text"
        >
          <Bell size={18} className="text-theme-muted dark:text-theme-muted" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-1.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}