import { User, MapPin, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function AssignDriverModal({ open, onClose, deliveries = [], onAssignSuccess }: { open: boolean; onClose: () => void; deliveries?: any[]; onAssignSuccess?: () => void }) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedShipment, setSelectedShipment] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchDrivers();
    }
  }, [open]);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/logistics/drivers`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!selectedShipment) return toast.error("Please select a shipment");
    if (!selectedDriver) return toast.error("Please select a driver");

    try {
      const toastId = toast.loading("Assigning driver...");
      const res = await fetch(`${API_BASE}/supplier/logistics/${selectedShipment}/assign-driver`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ driverId: selectedDriver })
      });
      if (res.ok) {
        toast.success("Driver assigned successfully", { id: toastId });
        if (onAssignSuccess) onAssignSuccess();
        onClose();
        setSelectedDriver("");
        setSelectedShipment("");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to assign driver", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign driver");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-theme-surface max-w-[576px] w-[96%] max-h-[96vh] overflow-auto rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b bg-[#F8FAFC80]">
          <div>
            <h3 className="font-playfair text-2xl">Assign Driver</h3>
            <p className="text-theme-muted mt-1">Dispatch a shipment to a driver.</p>
          </div>
          <button onClick={onClose} className="text-theme-muted text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-[#374151] block mb-2">Select Shipment</label>
            <select 
              className="w-full border border-theme-border rounded-lg h-12 px-3 outline-none"
              value={selectedShipment}
              onChange={(e) => setSelectedShipment(e.target.value)}
            >
              <option value="">Select shipment</option>
              {deliveries.filter(d => (d.status === "Pending" || !d.driver || d.driver === "Pending")).map(d => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.id || d.manifestId || d._id?.substring(0,8)} - {d.client || d.clientName || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#374151] block mb-3">Available Drivers</label>

            <div className="space-y-3">
              {drivers.length > 0 ? drivers.map((d, i) => (
                <button
                  key={d._id || i}
                  onClick={() => setSelectedDriver(d._id)}
                  className={`w-full border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                    selectedDriver === d._id 
                      ? "border-[#2563EB] bg-[#EFF6FF]" 
                      : "border-[#E5E7EB] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center overflow-hidden">
                    {d.avatar || d.image ? (
                        <img src={d.avatar || d.image} className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} className="text-theme-muted" />
                    )}
                  </div>

                  <div className="text-left">
                    <p className="font-medium text-theme-text">{d.name || d.firstName + " " + d.lastName}</p>
                    <p className="text-sm text-theme-muted">
                      {d.isOnline ? "Available" : "Offline"} • {d.vehicle || "No Vehicle"} {d.plateNumber ? `(${d.plateNumber})` : ""}
                    </p>
                  </div>
                </button>
              )) : (
                <p className="text-theme-muted text-center py-4">No drivers available</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t p-6 bg-[#F8FAFC80]">
          <button onClick={onClose} className="text-theme-muted">Cancel</button>

          <button 
            onClick={handleAssign}
            className="bg-[#2563EB] text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700"
          >
            <Truck size={16} />
            Assign & Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}