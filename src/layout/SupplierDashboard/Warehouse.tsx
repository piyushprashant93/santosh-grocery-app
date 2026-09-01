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

const stats = [
  {
    title: "TOTAL STOCK VALUE",
    value: "$2.4M",
    note: "+12% vs last month",
    icon: Layers,
    color: "text-green-600",
  },
  { title: "SPACE UTILIZATION", value: "72%", progress: 72, icon: Grid2X2 },
  {
    title: "ACTIVE BINS",
    value: "1,240",
    note: "Out of 1,500 available",
    icon: MapPin,
  },
  {
    title: "PENDING MOVES",
    value: "18",
    note: "Requires attention",
    icon: Move,
    color: "text-orange-600",
  },
];

const zones = [
  {
    name: "Zone A: Cold Storage",
    temp: "-18°C",
    util: 85,
    color: "bg-blue-500",
  },
  {
    name: "Zone B: Dry Goods",
    temp: "22°C",
    util: 62,
    color: "bg-orange-500",
  },
  {
    name: "Zone C: Fresh Produce",
    temp: "4°C",
    util: 45,
    color: "bg-green-500",
  },
  { name: "Zone D: Packaging", temp: null, util: 90, color: "bg-red-500" },
];

const items = [
  {
    name: "Organic Avocados (Hass)",
    sku: "AVO-HASS-01",
    img: "https://picsum.photos/50?1",
    location: "C-1-204",
    zone: "Zone C",
    onhand: 450,
    unit: "Crates",
    allocated: 120,
    available: 330,
    status: "In Stock",
  },
  {
    name: "Atlantic Salmon Fillets",
    sku: "SEA-SAL-05",
    img: "https://picsum.photos/50?2",
    location: "A-04-01",
    zone: "Zone A",
    onhand: 25,
    unit: "Boxes",
    allocated: 20,
    available: 5,
    status: "Low Stock",
  },
  {
    name: "Basmati Rice (Premium)",
    sku: "RIC-BAS-20",
    img: "https://picsum.photos/50?3",
    location: "B-2-10",
    zone: "Zone B",
    onhand: 1200,
    unit: "Sacks",
    allocated: 0,
    available: 1200,
    status: "In Stock",
  },
  {
    name: "Paper Takeout Containers",
    sku: "PKG-BOX-500",
    img: "https://picsum.photos/50?4",
    location: "D-05-15",
    zone: "Zone D",
    onhand: 2500,
    unit: "Cartons",
    allocated: 500,
    available: 2000,
    status: "In Stock",
  },
];

const statusStyles: any = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-red-100 text-red-600",
  Check: "bg-yellow-100 text-yellow-700",
};

export default function Warehouse() {
  const [openAdjust, setOpenAdjust] = useState(false);
  const [itemsData, setItemsData] = useState<any[]>([]);

  const fetchWarehouse = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/warehouse`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setItemsData(data.data?.items || data.items || data.data || []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

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

      <div className="grid lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;

          return (
            <div
              key={i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#64748B]">{s.title}</p>

                  <p className="text-2xl font-semibold mt-1">{s.value}</p>

                  {s.note && (
                    <p className="text-sm text-green-600 mt-1">{s.note}</p>
                  )}
                </div>

                <div className="bg-gray-100 p-2 rounded-lg">
                  <Icon size={18} />
                </div>
              </div>

              {s.progress && (
                <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                  <div
                    style={{ width: `${s.progress}%` }}
                    className="bg-[#155DFC] h-2 rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {zones.map((z, i) => (
          <div
            key={i}
            className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{z.name}</p>

                {z.temp && <p className="text-sm text-[#64748B]">{z.temp}</p>}
              </div>
            </div>

            <p className="text-sm text-[#64748B] mt-4">Utilization</p>

            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                style={{ width: `${z.util}%` }}
                className={`${z.color} h-2 rounded-full`}
              ></div>
            </div>

            <p className="text-sm mt-1 text-[#64748B]">{z.util}%</p>
          </div>
        ))}
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
              {itemsData.length > 0 ? itemsData.map((i, index) => (
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
    </div>
  );
}
