import { useEffect, useState } from "react";
import { useCurrency } from "./CurrencyContext";
import { Wallet, Package, TrendingUp, Clock, AlertCircle, Loader2, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

interface RecommendedDeal {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  basePrice: number;
  discountPrice: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating: { average: number; count: number };
}

interface SavedCard {
  _id: string;
  last4?: string;
  brand?: string;
  isDefault?: boolean;
}
interface Restaurant {
  _id: string;
  name: string;
  logo: string | null;
}
interface DashboardData {
  profile: {
    firstName: string;
    lastName: string;
    walletBalance: number;
    rewardPoints: number;
    membershipTier: string;
  };
  orderSummary: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  recentOrders: {
  _id: string;
  orderId: string;
  restaurant: Restaurant | null;
  orderType: string;
    items: { image: string | null; name: string; quantity: number }[];
    total: number;
    status: string;
    estimatedDelivery: string;
    createdAt: string;
  }[];
  activeOrders: {
    _id: string;
    orderId: string;
    total: number;
    status: string;
    estimatedDelivery: string;
    deliveryPartner: any | null;
  }[];
  wishlistCount: number;
  unreadNotifications: number;
  savedCards: SavedCard[];
  defaultCard: SavedCard | null;
  recommendedDeals: RecommendedDeal[];
  arrivingBy: string | null;
  pointsToGold: number;
  goldThreshold: number;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706", label: "Pending" },
  confirmed: { bg: "#DBEAFE", color: "#2563EB", label: "Confirmed" },
  preparing: { bg: "#FFEDD4", color: "#F97316", label: "Preparing" },
  ready: { bg: "#DBEAFE", color: "#2563EB", label: "Ready" },
  picked_up: { bg: "#DBEAFE", color: "#2563EB", label: "Picked Up" },
  in_transit: { bg: "#DBEAFE", color: "#1447E6", label: "On the way" },
  delivered: { bg: "#D1FAE5", color: "#009966", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626", label: "Cancelled" },
};

// fallback image for products without images
const FALLBACK_PRODUCT_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e";

export default function Overview({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to view your dashboard");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/users/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Failed to load dashboard");
        }

        setDashboard(data?.data || null);
      } catch (err: any) {
        setError(err.message || "Something went wrong loading your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const firstName = dashboard?.profile?.firstName?.trim() || `${user.firstName ?? ""}`.trim();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const formatMoney = (n: number) => `${formatPrice(n)}`;

  const formatEta = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    } catch {
      return null;
    }
  };

  const activeOrder = dashboard?.activeOrders?.[0];

  // ---------- Wallet subtitle: use defaultCard if present, else fallback ----------
  const walletSubtitle = dashboard?.defaultCard?.last4
    ? `**** ${dashboard.defaultCard.last4}`
    : "No card added";

  // ---------- Reward points subtitle: dynamic points-to-gold ----------
  const rewardSubtitle =
    dashboard && dashboard.pointsToGold > 0
      ? `${dashboard.pointsToGold.toLocaleString()} points to Gold Tier`
      : dashboard
      ? "You've reached Gold Tier!"
      : "150 points to Gold Tier";

  // ---------- Active orders subtitle: prefer arrivingBy from API ----------
  const activeOrdersSubtitle = dashboard?.arrivingBy
    ? `Arriving by ${dashboard.arrivingBy}`
    : activeOrder?.estimatedDelivery
    ? `Arriving by ${formatEta(activeOrder.estimatedDelivery)}`
    : "No active orders";

  // ---------- Stats cards (dynamic values, static styling/layout) ----------
  const stats = [
    {
      title: "Wallet Balance",
      value: dashboard ? formatMoney(dashboard.profile.walletBalance) : "$0.00",
      subtitle: walletSubtitle,
      action: "TOP UP",
      icon: Wallet,
      iconColor: "#009966",
      iconBgColor: "bg-[#D0FAE5]",
      iconBorderColor: "border-[#A4F4CF]",
      badge: { text: "Active", bg: "#D1FAE5", color: "#009966" },
      gradient: "from-white to-[#ECFDF580]",
      path: "wallet",
    },
    {
      title: "Active Orders",
      value: dashboard ? `${dashboard.orderSummary.active} ${dashboard.orderSummary.active === 1 ? "Item" : "Items"}` : "0 Items",
      subtitle: activeOrdersSubtitle,
      icon: Package,
      iconColor: "#3B82F6",
      iconBgColor: "bg-[#DBEAFE]",
      iconBorderColor: "border-[#BEDBFF]",
      badge: activeOrder
        ? {
            text: STATUS_STYLES[activeOrder.status]?.label || activeOrder.status,
            bg: STATUS_STYLES[activeOrder.status]?.bg || "#DBEAFE",
            color: STATUS_STYLES[activeOrder.status]?.color || "#2563EB",
          }
        : undefined,
      gradient: "from-white to-[#EFF6FF80]",
      extraIcon: Clock,
      path: "orders",
    },
    {
      title: "Reward Points",
      value: dashboard ? dashboard.profile.rewardPoints.toLocaleString() : "0",
      subtitle: rewardSubtitle,
      icon: TrendingUp,
      iconColor: "#F97316",
      iconBgColor: "bg-[#FFEDD4]",
      iconBorderColor: "border-[#FFD6A7]",
      gradient: "from-white to-[#FFF7ED80]",
      path: "",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-[#009966]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-[24px] capitalize font-playfair font-medium text-[#0F172A]">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-[#6A7282] mt-1 lg:text-lg text-base">
            Welcome back to your personal dashboard.
          </p>
        </div>

        <div className="flex flex-wrap sm:gap-3 gap-1">

          <button onClick={() => setActiveTab("invite")} className="md:px-4 px-2 py-2 text-sm lg:text-base text-white rounded-lg bg-[#9810FA] shadow-sm">
            Invite
          </button>

          <button onClick={() => navigate("/restaurants")} className="md:px-4 px-2 py-2 text-sm lg:text-base text-white rounded-lg bg-[#009966] shadow-sm">
            Order Food
          </button>

          <button onClick={() => navigate("/marketplace")} className="md:px-4 px-2 py-2 text-sm lg:text-base border rounded-lg border-[#E5E7EB] bg-white shadow-sm">
            Buy Groceries
          </button>

        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 gap-3">
        {stats.map((card, i) => {
          const Icon = card.icon;
          const ExtraIcon = (card as any).extraIcon;

          return (
            <div
              key={i}
              onClick={card.path ? () => setActiveTab(card.path) : undefined}
              className={`lg:p-6 p-3 rounded-lg lg:rounded-xl border border-[#E5E7EB] bg-gradient-to-br ${card.gradient} shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] space-y-4 ${
                card.path ? "cursor-pointer hover:shadow-md" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex items-center justify-center w-12 h-12 rounded-full ${card.iconBgColor} border ${card.iconBorderColor}`}>
                  <Icon style={{ color: card.iconColor }} />
                </span>

                {card.badge && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: card.badge.bg,
                      color: card.badge.color,
                    }}
                  >
                    {card.badge.text}
                  </span>
                )}
              </div>

              <div>
                <p className="lg:text-base text-sm mt-6 text-[#6A7282]">{card.title}</p>
                <h2 className="lg:text-[34px] text-[24px] text-[#101828] mt-1 mb-7 font-semibold font-playfair">
                  {card.value}
                </h2>
              </div>

              <div className="flex justify-between lg:text-base text-sm items-center">
                {ExtraIcon ? (
                  <div className="flex items-center gap-1 text-[#1447E6]">
                    <ExtraIcon size={14} />
                    {card.subtitle}
                  </div>
                ) : (
                  <span className={`lg:text-[16px] text-sm ${card.action ? "text-[#6A7282] font-medium" : "text-[#CA3500] font-bold"}`}>
                    {card.subtitle}
                  </span>
                )}

                {card.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("wallet");
                    }}
                    className="text-[#009966] font-medium"
                  >
                    {card.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="font-bold font-playfair text-[20px]">Recent Orders</h2>
            <button onClick={() => navigate("/customer/dashboard/orders")} className="text-[#009966] text-[16px]">View All</button>
          </div>

          {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
            <div className="text-center py-10 border border-dashed border-[#E5E7EB] rounded-xl text-[#6A7282] text-sm">
              No orders yet.
            </div>
          )}

          {dashboard?.recentOrders?.map((order) => {
            const statusInfo = STATUS_STYLES[order.status] || {
              bg: "#F1F5F9",
              color: "#6A7282",
              label: order.status,
            };

            const itemsSummary = order.items?.map((i) => i.name).join(", ") || "No items";
            const img = order.items?.[0]?.image || null;
         const restaurantOrStoreName =
  order.restaurant?.name ||
  (order.orderType === "grocery"
    ? "Grocery Order"
    : "Restaurant Order");

            const dateLabel = (() => {
              try {
                const d = new Date(order.createdAt);
                const today = new Date();
                const isToday = d.toDateString() === today.toDateString();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const isYesterday = d.toDateString() === yesterday.toDateString();

                const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

                if (isToday) return `Today, ${time}`;
                if (isYesterday) return "Yesterday";
                return d.toLocaleDateString();
              } catch {
                return "";
              }
            })();

            return (
              <div
                key={order._id}
                onClick={() => setActiveTab("orders")}
                className="cursor-pointer lg:p-4 p-2 border border-[#E5E7EB] rounded-lg lg:rounded-xl shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] flex items-center lg:gap-4 gap-2"
              >
                {img ? (
                  <img
                    src={img || "https://placehold.co/64x64?text=No+Image"}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/64x64?text=No+Image"; }}
                    className="w-16 h-16 rounded-lg object-cover"
                    alt={order.items?.[0]?.name || "Order item"}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#6A7282] text-xs shrink-0">
                    No Img
                  </div>
                )}

                <div className="flex md:flex-row flex-col md:items-center gap-4 flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg font-playfair">{restaurantOrStoreName}</h3>
                    <p className="text-sm text-[#6A7282]">
                      {itemsSummary}
                    </p>

                    <p className="text-xs text-[#6A7282] mt-1">
                      {dateLabel} • {formatMoney(order.total)}
                    </p>
                  </div>

                  <span
                    className="text-xs px-3 py-1 rounded-full w-fit"
                    style={{ background: statusInfo.bg, color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            );
          })}

        </div>

        <div className="space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="font-bold font-playfair text-[20px]">Recommended</h2>
            <button onClick={() => navigate("/marketplace")} className="text-[#E17100] text-[16px]">View Deals</button>
          </div>

          {/* Recommended deals — dynamic from recommendedDeals */}
          {(!dashboard?.recommendedDeals || dashboard.recommendedDeals.length === 0) && (
            <div className="text-center py-8 border border-dashed border-[#E5E7EB] rounded-xl text-[#6A7282] text-sm">
              No recommendations yet.
            </div>
          )}

          {dashboard?.recommendedDeals?.slice(0, 2).map((deal) => {
            const dealImg = deal.images?.[0] || FALLBACK_PRODUCT_IMG;
            const hasDiscount = deal.discountPrice < deal.basePrice;

            return (
              <div
                key={deal._id}
                className="lg:p-6 p-3 border border-[#E5E7EB] lg:rounded-xl rounded-lg shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-[#F9FAFB]"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {deal.isNewArrival && (
                    <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                      New Arrival
                    </span>
                  )}
                  {deal.isFeatured && (
                    <span className="text-xs bg-[#9810FA] text-white px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-[20px] font-medium font-playfair mt-3">
                  {deal.name}
                </h3>

                <p className="text-sm text-[#6A7282] mt-1 line-clamp-2">
                  {deal.description}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[#009966] font-bold text-lg">
                    {formatPrice(deal.discountPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[#99A1AF] line-through text-sm">
                      {formatPrice(deal.basePrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/customer/dashboard/product-details?id=${deal._id}`)}
                  className="mt-4 w-full border border-[#A4F4CF] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] text-[#009966] bg-[#ECFDF5] py-2 rounded-lg"
                >
                  View Product
                </button>
              </div>
            );
          })}

          <div className="lg:p-6 p-3 border border-[#E5E7EB] lg:rounded-xl rounded-lg shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-white flex items-start gap-3">
            <AlertCircle size={20} className="text-[#99A1AF] min-w-5 mt-1" />
            <div>
              <h3 className="font-bold font-playfair flex items-center gap-3">
                Complete your profile
              </h3>
              <p className="text-sm text-[#6A7282] mt-2">
                Add your backup phone number to secure your account.
              </p>

              <button onClick={() => navigate("/customer/dashboard/profile")} className="mt-3 text-[#009966] font-medium text-sm">
                Go to Settings
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}