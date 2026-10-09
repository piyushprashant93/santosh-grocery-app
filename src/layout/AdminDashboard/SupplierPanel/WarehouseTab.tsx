import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "../../../lib/apiFetch";

export default function WarehouseTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const fetchWarehouse = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/supplier-panel/warehouse`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch warehouse data", err);
    } finally {
      setLoading(false);
    }
  };

  const zones = data?.zones || [
    { name: "Zone A - Refrigerated", capacityPct: 85 },
    { name: "Zone B - Dry Goods", capacityPct: 62 },
    { name: "Zone C - Frozen", capacityPct: 45 },
  ];

  const movement = data?.movement || {
    incomingToday: 45,
    outgoingToday: 62,
    adjustmentsPending: 8,
  };

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300 relative">
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-theme-text">Warehouse Management</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Zone Management */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/30">
          <h3 className="text-sm font-bold text-theme-text mb-4">Zone Management</h3>
          <div className="flex flex-col gap-3">
            {zones.map((zone: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{zone.name}</span>
                <span className={`font-bold ${zone.capacityPct > 90 ? 'text-red-500' : 'text-theme-text'}`}>
                  {zone.capacityPct}% Full
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Movement */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/30">
          <h3 className="text-sm font-bold text-theme-text mb-4">Stock Movement</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Incoming Today:</span>
              <span className="font-bold text-theme-text">{movement.incomingToday} items</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Outgoing Today:</span>
              <span className="font-bold text-theme-text">{movement.outgoingToday} items</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Adjustments Pending:</span>
              <span className="font-bold text-theme-text">{movement.adjustmentsPending} items</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

