import {
  Package,
  Clock,
  Utensils,
  Ticket,
  Info,
  Trash2,
  Bell,
  Loader2,
  MessageSquare,
  PartyPopper,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type NotificationItem = {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const PAGE_LIMIT = 20;

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearAllLoading, setClearAllLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

const getNotificationIcon = (type: string, title: string = "") => {
  const t = type?.toLowerCase() || "";
  const titleLower = title.toLowerCase();

  // Order related
  if (t.includes("order") || titleLower.includes("order")) {
    if (t.includes("driver") || t.includes("nearby") || titleLower.includes("driver") || titleLower.includes("nearby")) {
      return {
        icon: Clock,
        iconColor: "#2563EB",
        iconBg: "bg-[#EFF6FF] border border-[#DBEAFE]",
      };
    }
    return {
      icon: Package,
      iconColor: "#009966",
      iconBg: "bg-[#ECFDF5] border border-[#D0FAE5]",
    };
  }

  // Restaurant related
  if (t.includes("restaurant") || titleLower.includes("restaurant")) {
    return {
      icon: Utensils,
      iconColor: "#F97316",
      iconBg: "bg-[#FFF7ED] border border-[#FFEDD4]",
    };
  }

  // Offer / promo related
  if (t.includes("offer") || t.includes("promo") || t.includes("discount") || titleLower.includes("offer")) {
    return {
      icon: Ticket,
      iconColor: "#9333EA",
      iconBg: "bg-[#FAF5FF] border border-[#F3E8FF]",
    };
  }

  // Support ticket related
  if (t.includes("ticket") || t.includes("support") || titleLower.includes("ticket") || titleLower.includes("support")) {
    return {
      icon: MessageSquare,
      iconColor: "#0EA5E9",
      iconBg: "bg-[#F0F9FF] border border-[#BAE6FD]",
    };
  }

  // Welcome / onboarding related
  if (t.includes("welcome") || titleLower.includes("welcome")) {
    return {
      icon: PartyPopper,
      iconColor: "#EC4899",
      iconBg: "bg-[#FDF2F8] border border-[#FBCFE8]",
    };
  }

  // System / maintenance related
  if (t.includes("system") || t.includes("maintenance") || titleLower.includes("maintenance")) {
    return {
      icon: Info,
      iconColor: "#6A7282",
      iconBg: "bg-[#F1F5F9] border border-[#E5E7EB]",
    };
  }

  // Default fallback
  return {
    icon: Bell,
    iconColor: "#2563EB",
    iconBg: "bg-[#EFF6FF] border border-[#DBEAFE]",
  };
};

  const fetchNotifications = useCallback(
    async (pageToFetch: number, append: boolean) => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setLoadError("Authentication token not found.");
        setLoading(false);
        return;
      }

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setLoadError("");

      try {
        const response = await fetch(
          `${API_BASE}/notifications?page=${pageToFetch}&limit=${PAGE_LIMIT}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load notifications.");
        }

        const items: NotificationItem[] = data?.data?.data ?? [];
        // Some paginated APIs return total/pages info; fall back to
        // "got a full page" as a heuristic if that's absent.
        const totalPages = data?.data?.totalPages ?? data?.data?.pages;
        const more =
          typeof totalPages === "number"
            ? pageToFetch < totalPages
            : items.length === PAGE_LIMIT;

        setNotifications((prev) => (append ? [...prev, ...items] : items));
        setHasMore(more);
        setPage(pageToFetch);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
    );

    try {
      const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to mark as read.");
      }
      
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.log(err);
      // Revert optimistic update on failure
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: false } : item,
        ),
      );
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    setMarkAllLoading(true);

    const previous = notifications;

    // Optimistic update
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    try {
      const response = await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to mark all as read.");
      }
      
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.log(err);
      setNotifications(previous);
    } finally {
      setMarkAllLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    setDeletingId(id);

    const previous = notifications;

    // Optimistic removal
    setNotifications((prev) => prev.filter((item) => item._id !== id));

    try {
      const response = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete notification.");
      }
      
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.log(err);
      setNotifications(previous);
    } finally {
      setDeletingId(null);
    }
  };

  const clearAllNotifications = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    if (!window.confirm("Clear all notifications? This can't be undone.")) {
      return;
    }

    setClearAllLoading(true);

    const previous = notifications;

    // Optimistic clear
    setNotifications([]);

    try {
      const response = await fetch(`${API_BASE}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to clear notifications.");
      }

      setHasMore(false);
      setPage(1);
      
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.log(err);
      setNotifications(previous);
    } finally {
      setClearAllLoading(false);
    }
  };

  const loadMore = () => {
    void fetchNotifications(page + 1, true);
  };

  useEffect(() => {
    void fetchNotifications(1, false);

    const handleNewNotification = (e: Event) => {
      const detail = (e as CustomEvent).detail as NotificationItem;
      setNotifications((prev) => {
        // Avoid duplicate additions
        if (prev.some((n) => n._id === detail._id)) return prev;
        return [detail, ...prev];
      });
    };

    window.addEventListener("new-notification", handleNewNotification);
    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="">
      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Notifications
          </h1>

          <p className="text-theme-muted mt-2">
            Stay updated with your orders and exclusive offers.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={markAllAsRead}
            disabled={markAllLoading || unreadCount === 0}
            className="px-4 py-2 border border-theme-border rounded-lg shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-theme-surface disabled:opacity-60"
          >
            {markAllLoading ? "Updating..." : "Mark all as read"}
          </button>

          <button
            onClick={clearAllNotifications}
            disabled={clearAllLoading || notifications.length === 0}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-theme-surface hover:bg-red-50 disabled:opacity-60"
          >
            {clearAllLoading ? "Clearing..." : "Clear all"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-theme-muted py-16">
          <Loader2 size={18} className="animate-spin" />
          Loading notifications...
        </div>
      ) : loadError ? (
        <div className="text-center py-16">
          <p className="text-red-500">{loadError}</p>
          <button
            onClick={() => fetchNotifications(1, false)}
            className="mt-4 px-4 py-2 border border-theme-border rounded-lg bg-theme-surface"
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <Bell size={24} className="text-theme-muted" />
          </div>
          <p className="text-theme-text font-medium">No notifications yet</p>
          <p className="text-theme-muted text-sm max-w-[320px]">
            Order updates and offers will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((item) => {
              const {
  icon: Icon,
  iconBg,
  iconColor,
} = getNotificationIcon(item.type, item.title);

              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) {
                      markAsRead(item._id);
                    }
                  }}
                  className={`border lg:rounded-xl lg:p-6 rounded-lg p-3 flex lg:gap-4 gap-2 cursor-pointer transition
                  ${
                    item.isRead
                      ? "bg-theme-surface border-theme-border"
                      : "bg-[#009966]/10 border-[#009966]/30"
                  }`}
                >
                 <div
  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
>
  <Icon size={22} style={{ color: iconColor }} />
</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className="font-playfair text-lg font-medium">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-theme-muted flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>

                        {!item.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00BC7D]" />
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item._id);
                          }}
                          disabled={deletingId === item._id}
                          className="text-theme-muted hover:text-red-500 disabled:opacity-50 p-1"
                          aria-label="Delete notification"
                        >
                          {deletingId === item._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-theme-muted mt-1">{item.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 border border-theme-border rounded-lg bg-theme-surface shadow-sm disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-theme-muted mt-8">
              You have reached the end of your notifications.
            </p>
          )}
        </>
      )}
    </div>
  );
}