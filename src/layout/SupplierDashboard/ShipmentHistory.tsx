import {
  Search,
  Calendar,
  Download,
  Filter,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCurrency } from "../../context/CurrencyContext";


const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const { formatPrice } = useCurrency();

  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};



export default function ShipmentHistory({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [openRange, setOpenRange] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/logistics`, { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        const logs = json.data?.manifests || json.data?.deliveries || (Array.isArray(json.data) ? json.data : (json.data?.data || []));
        setData(Array.isArray(logs) ? logs : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        view: 'history',
      });
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (startDate) params.append('dateFrom', startDate);
      if (endDate) params.append('dateTo', endDate);
      
      const res = await fetch(`${API_BASE}/supplier/logistics/export?${params.toString()}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shipment_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Exported successfully!");
    } catch(err) {
      toast.error("Failed to export CSV");
    }
  };

  const filteredData = data.filter(s => {
    const id = String(s.id || s.manifestId || s._id || "");
    const client = String(s.client || s.clientName || s.restaurant?.name || "");
    const driver = String(s.driver || s.driverName || "");
    const status = String(s.status || "Pending");

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      id.toLowerCase().includes(searchLower) || 
      client.toLowerCase().includes(searchLower) ||
      driver.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === "All" || status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (startDate || endDate) {
      const itemDate = s.date ? new Date(s.date) : (s.createdAt ? new Date(s.createdAt) : null);
      if (itemDate) {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchesDate = false;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const activeShipments = filteredData;
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1
            className="lg:text-[34px] text-3xl font-playfair font-semibold flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <ArrowLeft />
            Shipment History
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Archive of all completed and cancelled shipments.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setOpenRange(true)}
              className="flex items-center gap-2 border border-theme-border px-4 py-2 rounded-lg bg-theme-surface shadow-sm"
            >
              <Calendar size={18} />
              {startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : startDate 
                ? `From ${new Date(startDate).toLocaleDateString()}`
                : endDate 
                ? `Until ${new Date(endDate).toLocaleDateString()}`
                : "Select Range"
              }
            </button>
            {openRange && (
                <>
             <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpenRange(false)}></div>   
              <div className="absolute z-50 right-0 mt-2 w-[380px] bg-theme-surface rounded-xl p-6 shadow-xl border border-theme-border">
                <div className="space-y-5">
                  <div>
                    <label className="block text-theme-muted mb-2">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-theme-muted mb-2">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => {
                        setTempStartDate(startDate);
                        setTempEndDate(endDate);
                        setOpenRange(false);
                      }}
                      className="flex-1 border border-theme-border py-3 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button 
                      onClick={() => {
                        setStartDate(tempStartDate);
                        setEndDate(tempEndDate);
                        setOpenRange(false);
                      }}
                      className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg shadow hover:bg-blue-700"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
                </>
            )}
          </div>

          <button onClick={handleExport} className="flex items-center gap-2 border border-theme-border px-4 py-2 rounded-lg bg-theme-surface shadow-sm hover:bg-gray-50">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full">
            <Search size={18} className="text-theme-muted" />

            <input
              placeholder="Search by ID, Client, or Driver..."
              className="w-full px-3 py-2 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex min-w-max items-center gap-2 border border-theme-border px-4 py-2 rounded-lg bg-theme-surface shadow-sm outline-none cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="border-b text-theme-muted text-sm">
              <tr>
                <th className="py-4 font-normal text-[#62748E]">SHIPMENT ID</th>
                <th className="py-4 font-normal text-[#62748E]">DATE</th>
                <th className="py-4 font-normal text-[#62748E]">CLIENT</th>
                <th className="py-4 font-normal text-[#62748E]">
                  ITEMS SUMMARY
                </th>
                <th className="py-4 font-normal text-[#62748E]">AMOUNT</th>
                <th className="py-4 font-normal text-[#62748E]">LOGISTICS</th>
                <th className="py-4 font-normal text-[#62748E]">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {activeShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-theme-muted">
                    No shipments found.
                  </td>
                </tr>
              ) : (
                activeShipments.map((s, i) => (
                <tr key={s._id || i} className="border-b last:border-none">
                  <td className="py-5 font-medium text-theme-text">{s.id || s.manifestId || s._id?.substring(0,8)}</td>

                  <td className="py-5 text-theme-muted">{s.date ? new Date(s.date).toLocaleDateString() : (s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "")}</td>

                  <td className="py-5 font-medium text-theme-text">
                    {s.client || s.clientName || (s.orders?.length > 0 ? `${s.orders.length} Orders` : "Unknown")}
                  </td>

                  <td className="py-5 text-theme-muted">
                    {Array.isArray(s.items) ? `${s.items.length} Items` : (typeof s.items === 'object' && s.items !== null ? (s.items.productName || s.items.name || "1 Item") : (s.items || (s.orders?.length > 0 ? `${s.orders.length} Orders` : "-")))}
                  </td>

                  <td className="py-5 font-semibold text-theme-text">
                    {typeof s.amount === "number" ? `${formatPrice(s.amount)}` : (s.total ? `${formatPrice(s.total)}` : (s.amount ? (s.amount.toString().startsWith('$') ? s.amount : `$${s.amount}`) : "$0.00"))}
                  </td>

                  <td className="py-5">
                    <div className="flex items-start gap-2 text-theme-muted">
                      <Truck size={14} />

                      <div className="-mt-1 text-sm">
                        <p>{s.vehicle || s.carrier || "-"}</p>
                        <p className="text-sm">{s.driver || s.driverName || "-"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5">
                    {(s.status === "Delivered" || s.status === "Completed") && (
                      <span className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit text-sm">
                        <CheckCircle2 size={16} />
                        Delivered
                      </span>
                    )}

                    {s.status === "Cancelled" && (
                      <span className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full w-fit text-sm">
                        <XCircle size={16} />
                        Cancelled
                      </span>
                    )}
                    
                    {(s.status !== "Delivered" && s.status !== "Completed" && s.status !== "Cancelled") && (
                      <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-fit text-sm">
                        {s.status || "Pending"}
                      </span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
