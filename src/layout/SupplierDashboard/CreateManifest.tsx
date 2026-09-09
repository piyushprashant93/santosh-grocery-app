import { FileText, MapPin, Package, Truck, ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { extractList } from "../../utils/dataHelper";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const orders = [
  {
    id: "ORD-7782",
    name: "Fresh Market NYC",
    location: "New York, NY",
    items: 4,
    shipping: "Express",
    weight: 250,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
  },
  {
    id: "ORD-7781",
    name: "Bistro 55",
    location: "Boston, MA",
    items: 12,
    shipping: "Standard",
    weight: 800,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
  },
  {
    id: "ORD-7785",
    name: "Organic Roots",
    location: "Philadelphia, PA",
    items: 3,
    shipping: "Refrigerated",
    weight: 120,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200",
  },
  {
    id: "ORD-7788",
    name: "Seafood Shack",
    location: "Portland, ME",
    items: 6,
    shipping: "Refrigerated",
    weight: 350,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=200",
  },
];

export default function CreateManifest({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [logistics, setLogistics] = useState({
    carrier: "",
    vehicleType: "",
    dispatchDate: "",
    driver: "",
    notes: ""
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/orders`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrdersData(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const toggleOrder = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };
  const selectedOrders = ordersData.filter((o) => selected.includes(o._id));
  const totalWeight = selectedOrders.reduce((a, b) => a + (b.weight || b.totalWeight || 0), 0);

  const handleGenerate = async () => {
    if (selected.length === 0) {
      alert("Please select at least one order");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/supplier/logistics`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...logistics,
          orders: selected
        })
      });
      if (res.ok) {
        alert("Manifest generated successfully!");
        setActiveTab("orders");
      } else {
        alert("Failed to generate manifest");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="lg:text-[34px] text-3xl font-playfair font-semibold cursor-pointer flex items-center gap-2"
          onClick={() => setActiveTab("orders")}
        >
          <ArrowLeft />
          Create Shipping Manifest
        </h1>

        <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
          Combine multiple orders into a single shipment manifest.
        </p>
      </div>
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        
        <div className="space-y-6">
          
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">
            
            <div className="flex justify-between items-center mb-6">
              
              <div>
                
                <h3 className="font-playfair text-xl">
                  
                  Select Orders to Ship
                </h3>
                <p className="text-[#64748B] text-sm">
                  
                  Only "Ready to Ship" orders are shown.
                </p>
              </div>
              <input
                placeholder="Search orders..."
                className="border border-[#E5E7EB] rounded-lg h-12 px-4 outline-none w-[260px]"
              />
            </div>
            <div className="space-y-4">
              
              {ordersData.length > 0 ? ordersData.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-4"
                >
                  
                  <div className="flex items-center gap-4">
                    
                    <input
                      type="checkbox"
                      checked={selected.includes(order._id)}
                      onChange={() => toggleOrder(order._id)}
                      className="w-5 h-5"
                    />
                    <img
                      src={order.img || order.client?.image || order.restaurant?.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      
                      <p className="font-medium text-[#111827]">
                        
                        {order.client || order.client?.name || order.restaurant?.name || "Unknown"}
                      </p>
                      <div className="flex gap-4 text-sm text-[#64748B] mt-1">
                        
                        <span className="flex items-center gap-1">
                          
                          <MapPin size={14} /> {order.location || order.shippingAddress?.city || "Local"}
                        </span>
                        <span className="flex items-center gap-1">
                          
                          <Package size={14} /> {order.items || order.totalItems || order.items?.length || 0} Items
                        </span>
                        <span className="flex items-center gap-1">
                          
                          <Truck size={14} /> {order.shipping || order.shippingMethod || "Standard"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    
                    <p className="text-sm text-[#64748B]"> {order.id || order.orderId || order._id?.substring(0,8)} </p>
                    <p className="font-semibold text-lg">
                      
                      {order.weight || order.totalWeight || 0} kg
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-4">No pending orders found</div>
              )}
            </div>
          </div>
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6">
            
            <h3 className="font-playfair text-xl mb-6">
              
              Logistics Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              
              <input
                placeholder="Carrier"
                value={logistics.carrier}
                onChange={(e) => setLogistics({ ...logistics, carrier: e.target.value })}
                className="border border-[#E5E7EB] rounded-lg h-12 px-4 outline-none"
              />
              <input
                placeholder="Vehicle Type"
                value={logistics.vehicleType}
                onChange={(e) => setLogistics({ ...logistics, vehicleType: e.target.value })}
                className="border border-[#E5E7EB] rounded-lg h-12 px-4 outline-none"
              />
              <input
                type="date"
                value={logistics.dispatchDate}
                onChange={(e) => setLogistics({ ...logistics, dispatchDate: e.target.value })}
                className="border border-[#E5E7EB] rounded-lg h-12 px-4 outline-none"
              />
              <input
                placeholder="Assign driver..."
                value={logistics.driver}
                onChange={(e) => setLogistics({ ...logistics, driver: e.target.value })}
                className="border border-[#E5E7EB] rounded-lg h-12 px-4 outline-none"
              />
            </div>
            <textarea
              rows={4}
              value={logistics.notes}
              onChange={(e) => setLogistics({ ...logistics, notes: e.target.value })}
              placeholder="Gate codes, handling instructions, loading dock info..."
              className="border border-[#E5E7EB] rounded-lg px-4 py-3 outline-none w-full mt-4"
            />
          </div>
        </div>
        <div className="space-y-6">
          
          <div className="bg-[#0F172A] text-white rounded-xl p-6 shadow-lg">
            
            <div className="flex items-center gap-2 mb-6">
              
              <FileText size={20} />
              <h3 className="font-playfair text-xl"> Manifest Summary </h3>
            </div>
            <div className="space-y-4 text-sm">
              
              <div className="flex justify-between border-b border-white/10 pb-3">
                
                <span>Selected Orders</span> <span>{selected.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                
                <span>Total Weight</span> <span>{totalWeight} kg</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                
                <span>Estimated Cost</span> <span>$--.--</span>
              </div>
            </div>
            <button onClick={handleGenerate} className="w-full mt-6 bg-[#2563EB] py-3 rounded-lg shadow">
              
              Generate Manifest
            </button>
          </div>
          <div className="bg-[#EEF2FF] border border-[#E5E7EB] rounded-xl p-6">
            
            <h4 className="font-playfair text-lg mb-3 flex items-center gap-2">
              <Truck size={24} />
              Shipping Policy
            </h4>
            <p className="text-sm text-[#334155] leading-relaxed">
              
              All manifests created before 2:00 PM EST will be scheduled for
              same-day pickup. Ensure all selected orders are packed and labeled
              before driver arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
