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
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

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
    <div className="flex items-center justify-between lg:px-8 px-4 h-[72px] bg-white border-b border-[#E5E7EB]">
      <div className="cursor-pointer lg:hidden" onClick={openSidebar}>
        <Menu />
      </div>

      <div className="sm:flex items-center gap-3 text-sm ml-3 hidden">
        <span className="text-[#64748B]">HubNepa</span>
        <span className="text-[#94A3B8]">›</span>
       <span className="font-semibold text-[#0F172A]">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
          />

          <input
            placeholder="Search orders..."
            readOnly
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F1F5F9] text-sm outline-none cursor-pointer"
          />
        </div>

        <button
          onClick={() => setOpenCart(true)}
          className="relative w-10 min-w-10 h-10 flex items-center justify-center rounded-lg border border-[#E5E7EB]"
        >
          <ShoppingBag size={18} className="text-[#64748B]" />

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#00A63E] rounded-full text-[10px] text-white font-bold flex items-center justify-center">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        <CartModal selectedProduct="" open={openCart} onClose={() => setOpenCart(false)} />

        <button
          onClick={() => setActiveTab("notifications")}
          className="relative w-10 min-w-10 h-10 flex items-center justify-center rounded-lg border border-[#E5E7EB]"
        >
          <Bell size={18} className="text-[#64748B]" />

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