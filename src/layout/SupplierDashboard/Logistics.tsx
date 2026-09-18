import {
  Truck,
  Calendar,
  Plus,
  Search,
  Filter,
  Package,
  CheckCircle2,
  BarChart3
} from "lucide-react"
import AssignDriverModal from "./AssignDriverModal"
import { useState, useEffect } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function Logistics() {
  const [logisticsData, setLogisticsData] = useState<any[]>([]);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [openAssignDriver, setOpenAssignDriver] = useState(false);

  const statusStyles: any = {
    "In Transit": "bg-blue-100 text-blue-700",
    Loading: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-green-100 text-green-700",
    Pending: "bg-gray-200 text-gray-600"
  };

  const fetchLogistics = async () => {
    try {
      const logisticsRes = await fetch(`${API_BASE}/supplier/logistics`, { headers: authHeaders() });
      if (logisticsRes.ok) {
        const data = await logisticsRes.json();
        const shipments = data.data || data;
        setLogisticsData(Array.isArray(shipments) ? shipments : (Array.isArray(shipments.data) ? shipments.data : []));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchLogistics();

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const es = new EventSource(`${API_BASE}/supplier/logistics/fleet/stream?token=${token}`);
    
    es.addEventListener('message', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.vehicles) {
          setFleetData(data.vehicles);
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    });

    es.addEventListener('closed', () => {
      es.close();
    });

    es.addEventListener('error', () => {
      // EventSource handles reconnection automatically
    });

    return () => {
      es.close();
    };
  }, []);

  const activeShipments = logisticsData.filter(d => d.status !== "Delivered").length;
  const delayedShipments = logisticsData.filter(d => d.status === "Delayed").length;
  
  const availableDrivers = fleetData.filter(d => d.isOnline).length;
  const totalDrivers = fleetData.length || 1;

  const stats = [
    {
      title: "ACTIVE SHIPMENTS",
      value: activeShipments.toString(),
      note: `${delayedShipments} Delayed`,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "ON-TIME RATE",
      value: "96.5%",
      note: "+1.2% this week",
      icon: CheckCircle2,
      color: "text-green-600"
    },
    {
      title: "FLEET AVAILABILITY",
      value: `${availableDrivers}/${totalDrivers}`,
      note: `${totalDrivers - availableDrivers} unavailable`,
      icon: Truck,
      color: "text-orange-500"
    },
    {
      title: "AVG DELIVERY TIME",
      value: "42m",
      note: "-5m vs target",
      icon: Calendar,
      color: "text-purple-600"
    }
  ];
  

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Logistics & Delivery
          </h1>

          <p className="text-[#64748B] mt-2">
            Track shipments, manage fleet, and optimize delivery routes.
          </p>

        </div>

        <div className="flex gap-3">

          <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2">
            <Calendar size={16} />
            Schedule
          </button>

          <button onClick={() => setOpenAssignDriver(true)} className="bg-[#155DFC] text-white rounded-lg px-4 py-2 flex items-center gap-2">
            <Plus size={16} />
            Assign Driver
          </button>

          <AssignDriverModal
            open={openAssignDriver}
            onClose={() => setOpenAssignDriver(false)}
            deliveries={logisticsData}
            onAssignSuccess={fetchLogistics}
          />

        </div>

      </div>



      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        {stats.map((s, i) => {

          const Icon = s.icon

          return (

            <div
              key={i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-[#64748B]">
                    {s.title}
                  </p>

                  <p className="text-2xl font-semibold mt-1">
                    {s.value}
                  </p>

                  <p className="text-sm text-[#64748B] mt-1">
                    {s.note}
                  </p>

                </div>

                <Icon size={20} className={s.color} />

              </div>

            </div>

          )

        })}

      </div>



      <div className="grid lg:grid-cols-3 gap-5">

        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4 space-y-5">

          <div className="flex justify-between">
            <h3 className="font-playfair text-xl">
              Fleet Status
            </h3>
            <button className="text-[#155DFC] text-sm">
              View All
            </button>
          </div>

          {fleetData.map((f: any, i: number) => (

            <div key={f._id || i} className="border-b pb-4 last:border-none">

              <p className="font-medium">
                {f.name || f.firstName || "Driver"} {f.plateNumber ? `(${f.plateNumber})` : ""}
              </p>

              <p className="text-sm text-[#64748B]">
                {f.vehicle || "No Vehicle Assigned"}
              </p>

              <p className="text-sm text-[#64748B] mt-1">
                {f.isOnline ? "Online" : "Offline"}
              </p>

              <div className="flex items-center gap-2 mt-2">

                <div className="flex-1 bg-gray-200 h-2 rounded-full">
                  <div
                    style={{ width: `${f.isOnline ? 100 : 0}%` }}
                    className={`${f.isOnline ? 'bg-green-500' : 'bg-gray-400'} h-2 rounded-full`}
                  />
                </div>

                <span className="text-sm text-[#64748B]">
                  {f.isOnline ? "Available" : "Offline"}
                </span>

              </div>

            </div>

          ))}

          {fleetData.length === 0 && (
            <p className="text-[#64748B] text-center text-sm py-4">No drivers found.</p>
          )}

        </div>



        <div className="lg:col-span-2 ">
          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4 mb-5">

          <div className="flex justify-between items-center mb-6">

            <h3 className="font-playfair text-xl">
              Recent Deliveries
            </h3>

            <div className="flex gap-3">

              <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3">
                <Search size={16} />
                <input
                  placeholder="Search ID..."
                  className="px-3 py-2 outline-none text-sm"
                />
              </div>

              <button className="border border-[#E5E7EB] px-4 py-2 rounded-lg flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>

            </div>

          </div>



          <div className="space-y-6">

            {logisticsData.map((d: any, i: number) => (

              <div key={d._id || i} className="grid grid-cols-4 gap-4 items-center border-b pb-5 last:border-none">

                <div>

                  <p className="font-medium">
                    {d.id || d.manifestId || d._id?.substring(0,8)}
                  </p>

                  <p className="text-sm text-[#64748B]">
                    {d.client || d.clientName || (d.orders?.length > 0 ? `${d.orders.length} Orders` : "No Orders")}
                  </p>

                  <p className="text-xs text-[#94A3B8]">
                    {d.address || d.destination || "Multiple Destinations"}
                  </p>

                </div>

                <span className={`px-3 py-1 rounded-full text-xs w-fit ${statusStyles[d.status || "Pending"] || "bg-gray-100"}`}>
                  {d.status || "Pending"}
                </span>

                <div>

                  <p className="font-medium">
                    {d.driver || d.driverName || "Pending"}
                  </p>

                  <p className="text-sm text-[#64748B]">
                    {d.vehicle || d.carrier || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#64748B]">
                    {d.progress || 0}% ETA: {d.eta || "Unknown"}
                  </p>

                  <div className="bg-gray-200 h-2 rounded-full mt-1">

                    <div
                      style={{ width: `${d.progress || 0}%` }}
                      className="bg-[#155DFC] h-2 rounded-full"
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] text-white rounded-xl p-6 flex justify-between items-center">

          <div>

            <h3 className="font-playfair text-xl">
              Route Optimization Active
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              AI-powered routing is currently saving an estimated 12% in fuel costs and reducing delivery times by 15 minutes per route.
            </p>

          </div>

          <button className="bg-white text-[#111827] px-4 py-2 rounded-lg min-w-max flex items-center gap-2 text-sm">
            <BarChart3 size={14} />
            View Analytics
          </button>

        </div>
        </div>

      </div>

    </div>

  )

}