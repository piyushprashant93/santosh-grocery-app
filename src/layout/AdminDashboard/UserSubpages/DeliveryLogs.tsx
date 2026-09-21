import { ArrowLeft, MapPin, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import api from "../../../lib/api"

interface DeliveryLogsProps {
  user: { id: string; fullName: string; } | null;
  onBack: () => void;
  onViewRoute: (deliveryId: string) => void;
}

interface DeliveryLog {
  _id: string;
  orderId: string;
  status: string;
  address: string;
  timestamp: string;
  driver: string;
  duration: string;
  failedReason?: string;
}

const mockDeliveries = [
  {
    id: "DLV-1023",
    orderId: "ORD-5521",
    status: "Delivered",
    address: "123 Main St, Apt 4B, New York, NY",
    timestamp: "Feb 12, 2024 - 12:45 PM",
    driver: "Mike S.",
    duration: "25 mins"
  },
  {
    id: "DLV-1022",
    orderId: "ORD-5520",
    status: "Delivered",
    address: "123 Main St, Apt 4B, New York, NY",
    timestamp: "Feb 10, 2024 - 06:30 PM",
    driver: "John D.",
    duration: "32 mins"
  },
  {
    id: "DLV-1015",
    orderId: "ORD-5490",
    status: "Failed",
    address: "Office Building 5, Floor 3, New York, NY",
    timestamp: "Feb 05, 2024 - 01:15 PM",
    driver: "-",
    duration: "-",
    failedReason: "Customer unreachable"
  }
];

export default function DeliveryLogs({ user, onBack, onViewRoute }: DeliveryLogsProps) {
  const [deliveries, setDeliveries] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // The endpoint may accept driverId to filter if applicable
        const response = await api.get(`/api/v1/admin/delivery/logs?driverId=${user.id}`);
        const data = response.data?.data || response.data || [];
        // Map the backend data to our interface
        const mapped = (Array.isArray(data) ? data : data.data || []).map((item: any) => ({
          _id: item._id || item.id || Math.random().toString(),
          orderId: item.order?.orderId || item.orderId || "N/A",
          status: item.status || "Unknown",
          address: item.order?.deliveryAddress?.address || item.address || "No address",
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString() : item.timestamp || "N/A",
          driver: item.driver?.fullName || user.fullName || "Unknown",
          duration: item.duration || "-",
          failedReason: item.failedReason
        }));
        setDeliveries(mapped);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load delivery logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Delivery Logs</h1>
          <p className="text-gray-500 mt-1">
            Track delivery performance for <span className="font-semibold text-gray-900">{user.fullName}</span>
          </p>
        </div>
      </div>

      {/* Delivery Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
          <p className="text-gray-500">Loading delivery logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl">
          {error}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
          No delivery logs found for this driver.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {deliveries.map((delivery) => (
          <div 
            key={delivery._id} 
            className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-all hover:shadow-md ${
              delivery.status.toLowerCase() === 'failed' ? 'border-red-200' : 'border-emerald-200'
            }`}
          >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              delivery.status.toLowerCase() === 'failed' ? 'bg-red-500' : 'bg-emerald-500'
            }`} />

            {/* Left Details */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {delivery._id.substring(0, 8)}
                </span>
                <span className="text-lg font-bold text-gray-900">Order #{delivery.orderId}</span>
                {delivery.status.toLowerCase() === 'delivered' ? (
                  <span className="ml-auto md:ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Delivered
                  </span>
                ) : delivery.status.toLowerCase() === 'failed' ? (
                  <span className="ml-auto md:ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Failed
                  </span>
                ) : (
                  <span className="ml-auto md:ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                    {delivery.status}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex gap-3">
                  <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-800 leading-relaxed max-w-[250px]">{delivery.address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="text-gray-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Timestamp</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{delivery.timestamp}</p>
                  </div>
                </div>
              </div>

              {delivery.failedReason && (
                <div className="mt-2 flex items-center gap-2 px-4 py-3 bg-red-50 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span className="font-medium">Failed Reason:</span> {delivery.failedReason}
                </div>
              )}
            </div>

            {/* Right Action & Stats */}
            <div className="md:w-[280px] shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Driver</span>
                  <span className="font-medium text-gray-900">{delivery.driver}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">{delivery.duration}</span>
                </div>
              </div>
              <button 
                onClick={() => onViewRoute(delivery._id)}
                className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
              >
                View Route Map
              </button>
            </div>

          </div>
          ))}
        </div>
      )}
    </div>
  )
}
