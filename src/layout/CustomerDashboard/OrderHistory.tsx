import {
  Search,
  Filter,
  Package,
  MapPin,
  Clock,
  Truck,
  Utensils,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "./CurrencyContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type DeliveryAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

type Invoice = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  orderId: string;
  orderDate: string;
  deliveredAt: string | null;
  paymentMethod: string;
  paymentStatus: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vendor: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    image: string | null;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  footer: string;
};

type OrderItem = {
  itemType: string;
  product: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  _id: string;
};

type OrderParty = {
  _id: string;
  name?: string;
  logo?: string | null;
  firstName?: string;
  lastName?: string;
  fullName?: string;
} | null;

type Order = {
  _id: string;
  orderId: string;
  orderType: string;
  restaurant: OrderParty;
  retailer: OrderParty;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  estimatedDelivery: string | null;
  notes: string;
  createdAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TrackingStep = {
  status: string;
  label: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
  timestamp: string | null;
  note?: string | null;
};

type TrackingData = {
  orderId: string;
  orderNumber: string;
  status: string;
  currentStep: { label: string; description: string; icon: string };
  timeline: TrackingStep[];
  isCancelled: boolean;
  estimatedDelivery: string | null;
  deliveryAddress: DeliveryAddress;
  deliveryPartner: { available: boolean; message?: string };
  total: number;
  createdAt: string;
  deliveredAt: string | null;
  cancelReason: string | null;
};

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const PAGE_LIMIT = 10;

const statusStyles: any = {
  pending: "bg-[#FFF7ED] text-[#EA580C]",
  confirmed: "bg-[#EFF6FF] text-[#2563EB]",
  preparing: "bg-[#FFF7ED] text-[#EA580C]",
  ready: "bg-[#EFF6FF] text-[#2563EB]",
  picked_up: "bg-[#EFF6FF] text-[#2563EB]",
  transit: "bg-[#EFF6FF] text-[#2563EB]",
  in_transit: "bg-[#EFF6FF] text-[#2563EB]",
  delivered: "bg-[#ECFDF5] text-[#009966]",
  cancelled: "bg-[#FEE2E2] text-red-500",
};

const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "in_transit",
];

const formatStatusLabel = (status: string) => {
  if (status === "in_transit" || status === "transit") return "In Transit";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const getPartnerName = (party: OrderParty) =>
  party?.fullName ||
  `${party?.firstName ?? ""} ${party?.lastName ?? ""}`.trim() ||
  "Unknown";

export default function OrderHistory() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [tab, setTab] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const [reordering, setReordering] = useState(false);
const [reorderMessage, setReorderMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

const [showCancelModal, setShowCancelModal] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [cancelSubmitting, setCancelSubmitting] = useState(false);
const [cancelError, setCancelError] = useState("");
const [cancelSuccess, setCancelSuccess] = useState(false);

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery too slow",
  "Other",
];

  const REFUND_REASONS = [
    "Wrong item",
    "Item damaged",
    "Item missing",
    "Order arrived late",
    "Changed my mind",
    "Other",
  ];

  const handleReorder = async (orderId: string) => {
  setReordering(true);
  setReorderMessage(null);

  const token = localStorage.getItem("authToken");
  if (!token) {
    setReorderMessage({
      type: "error",
      text: "Authentication token not found.",
    });
    setReordering(false);
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/orders/my/${orderId}/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data?.message || "Failed to reorder.");
    }

    setReorderMessage({
      type: "success",
      text: data?.message || "Items added to cart.",
    });
  } catch (err) {
    setReorderMessage({
      type: "error",
      text: err instanceof Error ? err.message : "Unable to reorder.",
    });
  } finally {
    setReordering(false);
  }
};

const submitCancelOrder = async () => {
  if (!selectedOrder) return;
  setCancelError("");

  if (!cancelReason.trim()) {
    setCancelError("Please select or enter a reason.");
    return;
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    setCancelError("Authentication token not found.");
    return;
  }

  setCancelSubmitting(true);

  try {
    const response = await fetch(
      `${API_BASE}/orders/my/${selectedOrder._id}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data?.message || "Failed to cancel order.");
    }

    const updatedOrder = data?.data?.order;

    // Update the selected order + list so UI reflects the cancellation immediately
    if (updatedOrder) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: "cancelled" } : prev,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: "cancelled" } : o,
        ),
      );
    }

    setCancelSuccess(true);

    setTimeout(() => {
      setShowCancelModal(false);
      setCancelSuccess(false);
      setCancelReason("");
    }, 1800);
  } catch (err) {
    setCancelError(
      err instanceof Error ? err.message : "Something went wrong.",
    );
  } finally {
    setCancelSubmitting(false);
  }
};

  const submitRefundRequest = async () => {
    if (!selectedOrder) return;
    setRefundError("");

    if (!refundReason.trim()) {
      setRefundError("Please select or enter a reason.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setRefundError("Authentication token not found.");
      return;
    }

    setRefundSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/orders/my/${selectedOrder._id}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: refundReason }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit refund request.");
      }

      setRefundSuccess(true);

      setTimeout(() => {
        setShowRefundModal(false);
        setRefundSuccess(false);
        setRefundReason("");
      }, 1800);
    } catch (err) {
      setRefundError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setRefundSubmitting(false);
    }
  };

  const fetchInvoice = async (orderId: string) => {
    setShowInvoiceModal(true);
    setInvoiceLoading(true);
    setInvoiceError("");
    setInvoice(null);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setInvoiceError("Authentication token not found.");
      setInvoiceLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/invoices/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch invoice.");
      }

      setInvoice(data.data.invoice);
    } catch (err) {
      setInvoiceError(
        err instanceof Error ? err.message : "Unable to fetch invoice.",
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE}/invoices/${orderId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const invoice = data.data.invoice;

      const pdf = new jsPDF();

      // ---------------- Header ----------------

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text("INVOICE", 14, 20);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(`Invoice No: ${invoice.invoiceNumber}`, 140, 18);
      pdf.text(
        `Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`,
        140,
        24,
      );
      pdf.text(`Order: ${invoice.orderId}`, 140, 30);

      // line
      pdf.setDrawColor(220);
      pdf.line(14, 36, 196, 36);

      // ---------------- Vendor ----------------

      pdf.setFont("helvetica", "bold");
      pdf.text("Vendor", 14, 46);

      pdf.setFont("helvetica", "normal");
      pdf.text(invoice.vendor.name, 14, 52);
      pdf.text(invoice.vendor.phone, 14, 58);
      pdf.text(invoice.vendor.address, 14, 64);

      // ---------------- Customer ----------------

      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To", 120, 46);

      pdf.setFont("helvetica", "normal");
      pdf.text(invoice.customer.name, 120, 52);
      pdf.text(invoice.customer.email, 120, 58);
      pdf.text(invoice.customer.phone, 120, 64);

      // ---------------- Payment ----------------

      pdf.roundedRect(14, 72, 182, 18, 2, 2);

      pdf.setFont("helvetica", "bold");
      pdf.text("Payment", 18, 80);

      pdf.setFont("helvetica", "normal");

      pdf.text(
        `${invoice.paymentMethod.toUpperCase()} (${invoice.paymentStatus.toUpperCase()})`,
        45,
        80,
      );

      pdf.text(`Status: ${invoice.status}`, 130, 80);

      // ---------------- Items ----------------

      autoTable(pdf, {
        startY: 98,
        head: [["Item", "Qty", "Unit Price", "Subtotal"]],
        body: invoice.items.map((item: any) => [
          item.name,
          item.quantity,
          `${formatPrice(item.unitPrice)}`,
          `${formatPrice(item.subtotal)}`,
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [0, 153, 102],
        },
      });

      const finalY = (pdf as any).lastAutoTable.finalY + 10;

      // ---------------- Totals ----------------

      pdf.setFont("helvetica", "normal");

      pdf.text(`Subtotal`, 130, finalY);
      pdf.text(`${formatPrice(invoice.subtotal)}`, 185, finalY, {
        align: "right",
      });

      pdf.text(`Delivery Fee`, 130, finalY + 8);
      pdf.text(`${formatPrice(invoice.deliveryFee)}`, 185, finalY + 8, {
        align: "right",
      });

      pdf.text(`Tax`, 130, finalY + 16);
      pdf.text(`${formatPrice(invoice.tax)}`, 185, finalY + 16, {
        align: "right",
      });

      pdf.text(`Discount`, 130, finalY + 24);
      pdf.text(`-${formatPrice(invoice.discount)}`, 185, finalY + 24, {
        align: "right",
      });

      pdf.setDrawColor(180);
      pdf.line(130, finalY + 28, 195, finalY + 28);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);

      pdf.text("Grand Total", 130, finalY + 38);
      pdf.text(`${formatPrice(invoice.total)}`, 185, finalY + 38, {
        align: "right",
      });

      // ---------------- Notes ----------------

      let y = finalY + 55;

      if (invoice.notes) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Notes", 14, y);

        pdf.setFont("helvetica", "normal");
        pdf.text(invoice.notes, 14, y + 8);

        y += 20;
      }

      // ---------------- Footer ----------------

      pdf.setDrawColor(220);
      pdf.line(14, y, 196, y);

      pdf.setFontSize(10);
      pdf.text(invoice.footer, 105, y + 10, {
        align: "center",
      });

      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async (page: number, append: boolean) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setOrdersError("Authentication token not found.");
      setOrdersLoading(false);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setOrdersLoading(true);
    }
    setOrdersError("");

    try {
      const response = await fetch(
        `${API_BASE}/orders/my?page=${page}&limit=${PAGE_LIMIT}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load orders.");
      }

      const items: Order[] = data?.data?.data ?? [];
      const pageInfo: Pagination | null = data?.data?.pagination ?? null;

      setOrders((prev) => (append ? [...prev, ...items] : items));
      setPagination(pageInfo);
    } catch (err) {
      setOrdersError(
        err instanceof Error ? err.message : "Unable to load orders.",
      );
    } finally {
      setOrdersLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void fetchOrders(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!pagination) return;
    void fetchOrders(pagination.page + 1, true);
  };

  const fetchOrderDetails = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrder(null);
    setDetailsError("");
    setDetailsLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setDetailsError("Authentication token not found.");
      setDetailsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/orders/my/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load order details.");
      }

      setSelectedOrder(data?.data?.order ?? null);
    } catch (err) {
      setDetailsError(
        err instanceof Error ? err.message : "Unable to load order details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchTracking = async (orderId: string) => {
    setShowTrackModal(true);
    setTracking(null);
    setTrackingError("");
    setTrackingLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setTrackingError("Authentication token not found.");
      setTrackingLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/orders/my/${orderId}/track`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load tracking info.");
      }

      setTracking(data?.data ?? null);
    } catch (err) {
      setTrackingError(
        err instanceof Error ? err.message : "Unable to load tracking info.",
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const derivedOrderType = o.restaurant ? "food" : (o.retailer ? "grocery" : o.orderType);
      if (tab !== "all" && derivedOrderType !== tab) return false;

      if (status === "active" && !ACTIVE_STATUSES.includes(o.status)) {
        return false;
      }
      if (status === "delivered" && o.status !== "delivered") return false;
      if (status === "cancelled" && o.status !== "cancelled") return false;

      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const partnerName = getPartnerName(
          o.restaurant || o.retailer,
        ).toLowerCase();
        const itemNames = o.items.map((i) => i.name.toLowerCase()).join(" ");

        if (!partnerName.includes(query) && !itemNames.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [orders, tab, status, search]);

  const formatTime = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="lg:text-[34px] text-[24px] font-playfair font-medium text-theme-text">
            Order History
          </h1>

          <p className="text-theme-muted mt-1 lg:text-lg text-base">
            Track current orders and view past receipts.
          </p>
        </div>

        <div className="flex gap-3">
          {["all", "food", "grocery"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg border shadow-sm capitalize ${
                tab === t
                  ? "bg-[#009966] text-white border-[#009966]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 border border-theme-border rounded-lg lg:rounded-xl px-4 py-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
          <Search size={18} className="text-theme-muted" />

          <input
            placeholder="Search by restaurant or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 border border-theme-border rounded-lg lg:rounded-xl px-4 bg-[#009966] text-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      {showFilter && (
        <div className="mt-4 border border-theme-border lg:rounded-xl rounded-lg lg:p-6 p-3 bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
          <p className="text-sm font-semibold text-theme-muted mb-4">
            ORDER STATUS
          </p>

          <div className="flex flex-wrap lg:gap-3 gap-1">
            {["all", "active", "delivered", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`lg:px-4 px-3 py-2 rounded-lg border text-sm capitalize transition
          ${
            status === s
              ? "bg-[#ECFDF5] text-[#009966] border-[#009966]"
              : "bg-white border-[#E5E7EB] text-[#475569]"
          }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-4">
          {ordersLoading && (
            <p className="text-theme-muted text-center py-6">Loading orders...</p>
          )}

          {!ordersLoading && ordersError && (
            <p className="text-red-500 text-center py-6">{ordersError}</p>
          )}

          {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
            <p className="text-theme-muted text-center py-6">
              No orders match your filters.
            </p>
          )}

          {!ordersLoading &&
            !ordersError &&
            filteredOrders.map((o) => {
              const partnerName = getPartnerName(o.restaurant || o.retailer);
              const itemsSummary = o.items.map((i) => i.name).join(", ");

              return (
                <div
                  key={o._id}
                  onClick={() => fetchOrderDetails(o._id)}
                  className={`border border-[#E5E7EB] rounded-xl bg-white p-4 cursor-pointer hover:shadow-md transition
  ${selectedOrderId === o._id ? "ring-2 ring-[#009966]" : ""}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-theme-muted uppercase">
                        {o.restaurant ? "food" : (o.retailer ? "grocery" : o.orderType)} Order
                      </p>

                      <h3 className="font-semibold text-theme-text">
                        {o.orderId}
                      </h3>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        statusStyles[o.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatStatusLabel(o.status)}
                    </span>
                  </div>

                  {/* Restaurant / Retailer */}
                  <div className="mt-4">
                    <p className="text-sm text-theme-muted">Store</p>

                    <p className="font-medium text-theme-text">
                      {o.restaurant?.name ||
                        o.retailer?.fullName ||
                        "Grocery Store"}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    <p className="text-sm text-theme-muted">
                      Items ({o.items.length})
                    </p>

                    {o.items.slice(0, 2).map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm mt-1"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span>{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}

                    {o.items.length > 2 && (
                      <p className="text-xs text-[#009966] mt-1">
                        +{o.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-5 pt-4 border-t">
                    <div>
                      <p className="text-xs text-theme-muted">Payment</p>

                      <p className="text-sm capitalize">
                        {o.paymentMethod} • {o.paymentStatus}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-[10px] text-theme-muted uppercase tracking-wider mb-0.5">Grand Total</p>
                      <p className="font-bold text-[#009966] leading-none">
                        {formatPrice(o.total)}
                      </p>

                      <p className="text-[11px] text-theme-muted mt-1.5">
                        {formatTime(o.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          {!ordersLoading && !ordersError && pagination?.hasNextPage && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full text-theme-muted border border-theme-border rounded-lg py-3 bg-theme-surface disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </div>

        <div className="border border-theme-border rounded-lg lg:rounded-xl lg:p-4 p-2 bg-[#F9FAFB]">
          {!selectedOrderId ? (
            <div className="flex flex-col items-center justify-center text-center text-theme-muted py-10">
              <Package size={40} />

              <p className="mt-3">Select an order to view details</p>
            </div>
          ) : detailsLoading ? (
            <div className="flex flex-col items-center justify-center text-center text-theme-muted py-10">
              <p>Loading details...</p>
            </div>
          ) : detailsError ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <p className="text-red-500 text-sm">{detailsError}</p>
            </div>
          ) : selectedOrder ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between relative">
                <div>
                  <h2 className="font-playfair text-2xl text-theme-text">
                    Order Details
                  </h2>

                  <p className="text-theme-muted mt-1">{selectedOrder.orderId}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowOrderMenu((prev) => !prev)}
                    className="text-theme-muted text-xl hover:text-theme-text transition"
                  >
                    ⋮
                  </button>

                  {showOrderMenu && (
                    <>
                      {/* backdrop to close on outside click */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowOrderMenu(false)}
                      />

                      <div className="absolute right-0 top-full mt-2 w-44 bg-theme-surface border border-theme-border rounded-lg shadow-lg z-20 py-1">
                        {selectedOrder.status !== "delivered" &&
                          selectedOrder.status !== "cancelled" && (
                            <button
                              onClick={() => {
                                setShowOrderMenu(false);
                                fetchTracking(selectedOrder._id);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-[#F1F5F9] text-left"
                            >
                              <Truck size={15} />
                              Track Order
                            </button>
                          )}

                        <button
                          onClick={() => {
                            setShowOrderMenu(false);
                            fetchInvoice(selectedOrder._id);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-[#F1F5F9] text-left"
                        >
                          <FileText size={15} />
                          Invoice
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                  {selectedOrder.orderType === "food" ? (
                    <Utensils size={40} className="text-theme-muted" />
                  ) : (
                    <ShoppingBag size={40} className="text-theme-muted" />
                  )}
                </div>

                {selectedOrder.status !== "delivered" &&
                  selectedOrder.status !== "cancelled" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-[#FFFFFFE5] px-4 py-2 rounded-full shadow text-[#155DFC] text-xs">
                        <Truck size={13} />
                        {formatStatusLabel(selectedOrder.status)}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex gap-3">
                <MapPin className="text-[#009966]" size={20} />

                <div>
                  <p className="font-semibold text-theme-text">
                    Delivery Address
                  </p>

                  <p className="text-theme-muted text-sm">
                    {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.state}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="text-[#009966]" size={20} />

                <div>
                  <p className="font-semibold text-theme-text">
                    Estimated Arrival
                  </p>

                  <p className="text-theme-muted text-sm">
                    {formatTime(selectedOrder.estimatedDelivery)}
                  </p>
                </div>
              </div>

              <div className="border-t border-theme-border" />

              <div className="mt-5">
                <h3 className="font-semibold text-theme-text mb-4">
                  Order Items ({selectedOrder.items.length})
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border border-theme-border rounded-lg p-3 bg-theme-surface"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-theme-bg flex items-center justify-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-theme-bg flex items-center justify-center border border-theme-border">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : selectedOrder.orderType === "food" ? (
                              <Utensils size={20} className="text-[#009966]" />
                            ) : (
                              <ShoppingBag
                                size={20}
                                className="text-[#F97316]"
                              />
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-theme-text">
                            {item.name}
                          </p>

                          <p className="text-sm text-theme-muted">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[#009966]">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-theme-border mt-5" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-theme-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>

                <div className="flex justify-between text-theme-muted">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-theme-muted">
                  <span>Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
              </div>

              <div className="border-t border-theme-border" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-theme-text">
                  Total
                </span>

                <span className="text-xl font-semibold text-[#009966]">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              {/* {selectedOrder.status !== "delivered" &&
                selectedOrder.status !== "cancelled" && (
                  <button
                    onClick={() => fetchTracking(selectedOrder._id)}
                    className="border border-theme-border rounded-lg px-4 py-2 flex items-center gap-2 text-theme-text bg-theme-surface shadow-sm"
                  >
                    <Truck size={16} />
                    Track Order
                  </button>
                )}

              <button className="border border-theme-border rounded-lg px-4 py-2 flex items-center gap-2 text-theme-text bg-theme-surface shadow-sm">
                Invoice
              </button> */}

              {/* Reorder — status delivered ya cancelled hone par */}
{(selectedOrder.status === "delivered" ||
  selectedOrder.status === "cancelled") && (
  <div className="space-y-2">
    <button
      onClick={() => handleReorder(selectedOrder._id)}
      disabled={reordering}
      className="w-full border border-[#009966] text-[#009966] rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 bg-theme-surface shadow-sm disabled:opacity-60"
    >
      <ShoppingBag size={16} />
      {reordering ? "Adding to cart..." : "Reorder"}
    </button>

    {reorderMessage && (
      <p
        className={`text-sm text-center ${
          reorderMessage.type === "success"
            ? "text-[#009966]"
            : "text-red-500"
        }`}
      >
        {reorderMessage.text}
      </p>
    )}
  </div>
)}

{/* Cancel Order — sirf pending hone par */}
{selectedOrder.status === "pending" && (
  <button
    onClick={() => {
      setCancelReason("");
      setCancelError("");
      setCancelSuccess(false);
      setShowCancelModal(true);
    }}
    className="w-full border border-red-200 text-red-600 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 bg-theme-surface shadow-sm hover:bg-red-50"
  >
    Cancel Order
  </button>
)}

<button
  onClick={() => {
    setRefundReason("");
    setRefundError("");
    setRefundSuccess(false);
    setShowRefundModal(true);
  }}
  className="text-xs text-theme-muted text-left cursor-text"
>
  Problem with order?{" "}
  <span className="text-xs text-theme-muted cursor-pointer hover:text-[#009966] underline text-left">
    Request Return/Refund
  </span>
</button>
            </div>
          ) : null}
        </div>
      </div>

      {showCancelModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0 px-4">
    <div className="bg-theme-surface rounded-xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-theme-text">
          Cancel Order
        </h2>

        <button
          onClick={() => setShowCancelModal(false)}
          className="text-theme-muted text-xl"
        >
          ×
        </button>
      </div>

      {cancelSuccess ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-theme-text font-medium">Order cancelled!</p>
          <p className="text-sm text-theme-muted">
            Your order has been cancelled successfully.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-theme-muted">
            Order:{" "}
            <span className="font-medium text-theme-text">
              {selectedOrder?.orderId}
            </span>
          </p>

          <div>
            <label className="text-sm text-theme-muted block mb-2">
              Select a reason
            </label>

            <div className="flex flex-wrap gap-2">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCancelReason(reason)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    cancelReason === reason
                      ? "bg-red-50 text-red-600 border-red-300"
                      : "bg-white border-[#E5E7EB] text-[#475569]"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-theme-muted block mb-2">
              Additional details (optional)
            </label>

            <textarea
              placeholder="Describe why you're cancelling..."
              rows={3}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  setCancelReason(e.target.value);
                }
              }}
              className="w-full border border-theme-border rounded-lg px-3 py-2 outline-none resize-none text-sm"
            />
          </div>

          {cancelError && (
            <p className="text-red-500 text-sm">{cancelError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              disabled={cancelSubmitting}
              className="border border-theme-border px-4 py-2 rounded-lg"
            >
              Keep Order
            </button>

            <button
              onClick={submitCancelOrder}
              disabled={cancelSubmitting}
              className="bg-red-500 text-white px-5 py-2 rounded-lg disabled:opacity-60"
            >
              {cancelSubmitting ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0 px-4">
          <div className="bg-theme-surface rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-theme-text">
                Request Return / Refund
              </h2>

              <button
                onClick={() => setShowRefundModal(false)}
                className="text-theme-muted text-xl"
              >
                ×
              </button>
            </div>

            {refundSuccess ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-7 w-7 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-theme-text font-medium">Request submitted!</p>
                <p className="text-sm text-theme-muted">
                  We'll review your request and get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-theme-muted">
                  Order:{" "}
                  <span className="font-medium text-theme-text">
                    {selectedOrder?.orderId}
                  </span>
                </p>

                <div>
                  <label className="text-sm text-theme-muted block mb-2">
                    Select a reason
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {REFUND_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setRefundReason(reason)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition ${
                          refundReason === reason
                            ? "bg-[#ECFDF5] text-[#009966] border-[#009966]"
                            : "bg-white border-[#E5E7EB] text-[#475569]"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-theme-muted block mb-2">
                    Additional details (optional)
                  </label>

                  <textarea
                    value={refundReason === "Other" ? "" : ""}
                    onChange={() => {}}
                    placeholder="Add more details..."
                    rows={3}
                    className="hidden"
                  />

                  <textarea
                    placeholder="Describe the issue in your own words..."
                    rows={3}
                    onChange={(e) => {
                      // if user types custom text, use it as the reason directly
                      if (e.target.value.trim()) {
                        setRefundReason(e.target.value);
                      }
                    }}
                    className="w-full border border-theme-border rounded-lg px-3 py-2 outline-none resize-none text-sm"
                  />
                </div>

                {refundError && (
                  <p className="text-red-500 text-sm">{refundError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    disabled={refundSubmitting}
                    className="border border-theme-border px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitRefundRequest}
                    disabled={refundSubmitting}
                    className="bg-[#009966] text-white px-5 py-2 rounded-lg disabled:opacity-60"
                  >
                    {refundSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 !mt-0 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-theme-surface p-6">
            {invoiceLoading ? (
              <div className="py-16 text-center text-theme-muted">
                Loading invoice...
              </div>
            ) : invoiceError ? (
              <div className="py-16 text-center text-red-500">
                {invoiceError}
              </div>
            ) : (
              invoice && (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-theme-border pb-5">
                    <div>
                      <h2 className="text-3xl font-bold text-theme-text">
                        Invoice
                      </h2>

                      <p className="mt-1 text-sm text-theme-muted">
                        {invoice.invoiceNumber}
                      </p>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            invoice.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {invoice.paymentStatus.toUpperCase()}
                        </span>

                        <p className="mt-2 text-sm text-theme-muted">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowInvoiceModal(false)}
                        className="text-2xl text-theme-muted hover:text-black"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-theme-border bg-[#FAFAFA] p-5 text-sm">
                    <div>
                      <p className="text-theme-muted">Invoice Number</p>
                      <p className="font-semibold">{invoice.invoiceNumber}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Order ID</p>
                      <p className="font-semibold">{invoice.orderId}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Invoice Date</p>
                      <p className="font-semibold">
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Status</p>
                      <p className="font-semibold">{invoice.status}</p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Payment Method</p>
                      <p className="font-semibold capitalize">
                        {invoice.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-theme-muted">Payment Status</p>
                      <p className="font-semibold capitalize">
                        {invoice.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Vendor + Customer */}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-theme-border p-5">
                      <h3 className="mb-4 text-lg font-semibold text-[#009966]">
                        Vendor
                      </h3>

                      <p className="font-semibold text-theme-text">
                        {invoice.vendor.name}
                      </p>

                      <p className="mt-1 text-theme-muted">
                        {invoice.vendor.phone}
                      </p>

                      <p className="text-theme-muted">{invoice.vendor.address}</p>
                    </div>

                    <div className="rounded-xl border border-theme-border p-5">
                      <h3 className="mb-4 text-lg font-semibold text-[#009966]">
                        Bill To
                      </h3>

                      <p className="font-semibold text-theme-text">
                        {invoice.customer.name}
                      </p>

                      <p className="mt-1 text-theme-muted">
                        {invoice.customer.email}
                      </p>

                      <p className="text-theme-muted">{invoice.customer.phone}</p>
                    </div>
                  </div>

                  {/* Items */}

                  <div className="mt-8 overflow-hidden rounded-xl border border-theme-border">
                    <table className="w-full">
                      <thead className="bg-theme-bg">
                        <tr className="text-sm">
                          <th className="p-4 text-left">Item</th>

                          <th className="p-4 text-center">Qty</th>

                          <th className="p-4 text-center">Unit Price</th>

                          <th className="p-4 text-right">Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {invoice.items.map((item, index) => (
                          <tr key={index} className="border-t border-theme-border">
                            <td className="p-4">{item.name}</td>

                            <td className="p-4 text-center">{item.quantity}</td>

                            <td className="p-4 text-center">
                              {formatPrice(item.unitPrice)}
                            </td>

                            <td className="p-4 text-right font-medium">
                              {formatPrice(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}

                  <div className="mt-8 ml-auto w-full max-w-sm space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(invoice.subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(invoice.deliveryFee)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(invoice.tax)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>{formatPrice(invoice.discount)}</span>
                    </div>

                    <div className="flex justify-between border-t border-theme-border pt-3 text-xl font-bold text-[#009966]">
                      <span>Grand Total</span>
                      <span>{formatPrice(invoice.total)}</span>
                    </div>
                  </div>

                  {/* Notes */}

                  {invoice.notes && (
                    <div className="mt-8 rounded-xl border border-theme-border bg-theme-bg p-4">
                      <h3 className="font-semibold">Notes</h3>

                      <p className="mt-2 text-sm text-theme-muted">
                        {invoice.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer */}

                  <div className="mt-8 border-t border-theme-border pt-5 text-center text-sm text-theme-muted">
                    {invoice.footer}
                  </div>

                  {/* Actions */}

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      onClick={() => setShowInvoiceModal(false)}
                      className="rounded-lg border border-[#D1D5DB] px-5 py-2"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => downloadInvoice(selectedOrder!._id)}
                      className="rounded-lg bg-[#009966] px-5 py-2 font-medium text-white hover:bg-[#007d56]"
                    >
                      Download Invoice
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}

      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0 px-4">
          <div className="bg-theme-surface rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-theme-text">
                {tracking ? `Order ${tracking.orderNumber}` : "Track Order"}
              </h2>

              <button
                onClick={() => setShowTrackModal(false)}
                className="text-theme-muted text-xl"
              >
                ×
              </button>
            </div>

            {trackingLoading ? (
              <p className="text-theme-muted text-center py-10">
                Loading tracking info...
              </p>
            ) : trackingError ? (
              <p className="text-red-500 text-sm text-center py-10">
                {trackingError}
              </p>
            ) : tracking ? (
              <div className="space-y-3">
                {tracking.isCancelled ? (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">
                    Order cancelled
                    {tracking.cancelReason ? `: ${tracking.cancelReason}` : "."}
                  </div>
                ) : (
                  <div className="space-y-0">
                    {tracking.timeline.map((step, i) => (
                      <div key={step.status} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${
                              step.completed
                                ? "bg-[#ECFDF5] border border-[#D0FAE5]"
                                : "bg-[#F1F5F9] border border-[#E5E7EB] opacity-60"
                            }`}
                          >
                            {step.icon}
                          </div>

                          {i !== tracking.timeline.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 min-h-[24px] ${
                                step.completed ? "bg-[#D0FAE5]" : "bg-[#E5E7EB]"
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-2">
                          <p
                            className={`font-medium ${
                              step.completed || step.active
                                ? "text-[#0F172A]"
                                : "text-theme-muted"
                            }`}
                          >
                            {step.label}
                          </p>

                          <p className="text-xs text-theme-muted mt-0.5">
                            {step.description}
                          </p>

                          {step.timestamp && (
                            <p className="text-xs text-theme-muted mt-1">
                              {formatTime(step.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-theme-border pt-4 space-y-3">
                  <div className="flex gap-3">
                    <MapPin className="text-[#009966] shrink-0" size={18} />
                    <p className="text-sm text-theme-muted">
                      {tracking.deliveryAddress.street},{" "}
                      {tracking.deliveryAddress.city}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Truck className="text-[#009966] shrink-0" size={18} />
                    <p className="text-sm text-theme-muted">
                      {tracking.deliveryPartner.available
                        ? "Delivery partner assigned"
                        : tracking.deliveryPartner.message ||
                          "Delivery partner not assigned yet."}
                    </p>
                  </div>

                  {tracking.estimatedDelivery && (
                    <div className="flex gap-3">
                      <Clock className="text-[#009966] shrink-0" size={18} />
                      <p className="text-sm text-theme-muted">
                        Estimated: {formatTime(tracking.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
