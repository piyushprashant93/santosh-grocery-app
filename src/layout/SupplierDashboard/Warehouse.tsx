import {
  Search,
  Filter,
  Clock,
  ArrowLeftRight,
  Plus,
  Layers,
  Grid2X2,
  MapPin,
  Move,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import StockAdjustmentModal from "./StockAdjustmentModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const statusStyles: any = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-red-100 text-red-600",
  Check: "bg-yellow-100 text-yellow-700",
};

export default function Warehouse() {
  const [openAdjust, setOpenAdjust] = useState(false);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [zonesData, setZonesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      setError(null);
      const [itemsRes, zonesRes] = await Promise.all([
        fetch(`${API_BASE}/supplier/warehouse/items`, { headers: authHeaders() }),
        fetch(`${API_BASE}/supplier/warehouse/zones`, { headers: authHeaders() })
      ]);

      if (!itemsRes.ok && !zonesRes.ok) {
         throw new Error("Failed to load warehouse data");
      }

      const [itemsJson, zonesJson] = await Promise.all([
        itemsRes.ok ? itemsRes.json() : { data: [] },
        zonesRes.ok ? zonesRes.json() : { data: [] }
      ]);

      const items = itemsJson.data?.items || itemsJson.items || (Array.isArray(itemsJson.data) ? itemsJson.data : []);
      const zones = zonesJson.data?.zones || zonesJson.zones || (Array.isArray(zonesJson.data) ? zonesJson.data : []);
      setItemsData(Array.isArray(items) ? items : []);
      setZonesData(Array.isArray(zones) ? zones : []);
    } catch(err: any) { 
      console.error(err); 
      setError(err.message || "An error occurred while loading warehouse data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const filteredItems = itemsData.filter(i => {
    const name = i.name || i.product?.name || i.product?.title || "";
    const sku = i.sku || i.product?.sku || i._id || "";
    const location = i.location || i.bin || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
           location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Warehouse
          </h1>

          <p className="text-[#64748B] mt-2">
            Manage zones, bin locations, and inventory stock levels.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="border border-[#E5E7EB] rounded-lg px-4 py-2 flex gap-2 items-center bg-white">
            <Clock size={16} />
            Movement History
          </button>

          <button className="border border-[#E5E7EB] rounded-lg px-4 py-2 flex gap-2 items-center bg-white">
            <ArrowLeftRight size={16} />
            Transfer Stock
          </button>

          <button onClick={()=>setOpenAdjust(true)} className="bg-[#155DFC] text-white rounded-lg px-4 py-2 flex gap-2 items-center">
            <Plus size={16} />
            Stock Adjustment
          </button>
          <StockAdjustmentModal
            open={openAdjust}
            onClose={()=>setOpenAdjust(false)}
            onAdjustSuccess={fetchWarehouse}
          />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-xl font-playfair font-semibold mb-2">Error Loading Data</h3>
          <p className="mb-4">{error}</p>
          <button onClick={fetchWarehouse} className="bg-red-600 text-white px-6 py-2 rounded-lg">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-[#64748B]">
          <p className="text-lg">Loading warehouse stock...</p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-4 gap-4">
            {zonesData.length > 0 ? zonesData.map((z, i) => (
              <div
                key={z._id || i}
                className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{z.name || z.zoneName}</p>
                    {(z.temp || z.temperature) && <p className="text-sm text-[#64748B]">{z.temp || z.temperature}</p>}
                  </div>
                </div>

                <p className="text-sm text-[#64748B] mt-4">Utilization</p>

                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    style={{ width: `${z.utilization || z.util || 0}%` }}
                    className={`${z.color || 'bg-blue-500'} h-2 rounded-full`}
                  ></div>
                </div>

                <p className="text-sm mt-1 text-[#64748B]">{z.utilization || z.util || 0}%</p>
              </div>
            )) : (
              <div className="col-span-4 py-8 text-center border border-dashed rounded-xl text-gray-500">
                No zones configured.
              </div>
            )}
          </div>

      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-playfair">Stock Level by Bin</h3>

          <div className="flex gap-3">
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3">
              <Search size={16} className="text-[#64748B]" />

              <input
                placeholder="Search SKU, Product, or Bin..."
                className="px-3 py-2 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="border border-[#E5E7EB] rounded-lg px-4 py-2 flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b text-[#64748B] text-sm">
              <tr>
                <th className="py-3 font-normal">PRODUCT DETAILS</th>
                <th className="py-3 font-normal">LOCATION</th>
                <th className="py-3 font-normal">ON HAND</th>
                <th className="py-3 font-normal">ALLOCATED</th>
                <th className="py-3 font-normal">AVAILABLE</th>
                <th className="py-3 font-normal">STATUS</th>
                <th className="py-3 font-normal">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length > 0 ? filteredItems.map((i, index) => (
                <tr key={i._id || index} className="border-b last:border-none">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <img src={i.img || i.image || i.imageUrl || i.product?.image || "https://picsum.photos/50?1"} className="w-10 h-10 rounded-lg object-cover" />

                      <div>
                        <p className="font-medium">{i.name || i.product?.name || i.product?.title || "Unknown"}</p>

                        <p className="text-sm text-[#64748B]">{i.sku || i.product?.sku || i._id?.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5">
                    <div>
                      <p className="font-medium">{i.location || i.bin || "Unassigned"}</p>

                      <p className="text-sm text-[#64748B]">{i.zone || i.zone?.name || "No Zone"}</p>
                    </div>
                  </td>

                  <td className="py-5">
                    <p className="font-medium">{i.onhand || i.stockQuantity || i.quantity || 0}</p>

                    <p className="text-sm text-[#64748B]">{i.unit || i.product?.unit || "Units"}</p>
                  </td>

                  <td className="py-5 text-orange-600 font-medium">
                    {i.allocated || 0}
                  </td>

                  <td className="py-5 text-green-600 font-semibold">
                    {i.available || i.stockQuantity || i.quantity || 0}
                  </td>

                  <td className="py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${statusStyles[i.status || "In Stock"] || "bg-gray-100"}`}
                    >
                      {i.status || ((i.stockQuantity || i.quantity) > 0 ? "In Stock" : "Low Stock")}
                    </span>
                  </td>

                  <td className="">
                    <MoreHorizontal className="cursor-pointer" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
