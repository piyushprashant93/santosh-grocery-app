import { Search, Filter, Mail, Phone, MapPin, MoreHorizontal, Building2 } from "lucide-react"
import { useState, useEffect } from "react";
import BroadcastMessageModal from "./BroadcastMessageModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function Clients({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [openBroadcast, setOpenBroadcast] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/clients`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setClientsData(data.data?.clients || data.clients || (Array.isArray(data.data) ? data.data : []));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchClients();
  }, []);

const statusStyles: any = {
  Active: "bg-green-100 text-green-700",
  Review: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-200 text-gray-600"
}

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Client Management
          </h1>

          <p className="text-[#64748B] mt-2">
            Manage relationships with restaurants and retailers.
          </p>

        </div>

        <button onClick={() => setOpenBroadcast(true)} className="bg-[#155DFC] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
          <Mail size={16} />
          Broadcast Message
        </button>

        <BroadcastMessageModal
          open={openBroadcast}
          onClose={() => setOpenBroadcast(false)}
        />

      </div>



      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-4">

        <div className="flex gap-3">

          <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 flex-1">

            <Search size={18} className="text-[#64748B]" />

            <input
              placeholder="Search clients by name, email, or location..."
              className="w-full px-3 py-2 outline-none text-sm"
            />

          </div>

          <button className="border border-[#E5E7EB] px-4 py-2 rounded-lg flex items-center gap-2 bg-white">
            <Filter size={16} />
            Filter
          </button>

        </div>

      </div>



      <div className="grid lg:grid-cols-3 gap-6">

        {clientsData.length > 0 ? clientsData.map((c, i) => (

          <div
            key={c._id || i}
            className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-6 shadow-sm"
          >

            <div className="flex justify-between">

              <div className="flex gap-3">

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg ${c.type === "Restaurant" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}>
                  {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                </div>

                <div>

                  <p className="font-semibold text-[#111827]">
                    {c.name || "Unknown Client"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-[#64748B] mt-1">
                    <Building2 size={14} />
                    {c.type || "Client"}
                  </div>

                </div>

              </div>

              <button className="text-[#64748B]">
                <MoreHorizontal size={18} />
              </button>

            </div>



            <div className="space-y-3 mt-5 text-sm text-[#374151]">

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#64748B]" />
                {c.email || "N/A"}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#64748B]" />
                {c.phone || "N/A"}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#64748B]" />
                {c.location || c.address?.city || "N/A"}
              </div>

            </div>



            <div className="border-t mt-5 pt-4 flex justify-between items-center">

              <div>

                <p className="text-sm text-[#64748B]">
                  Total Spend
                </p>

                <p className="font-semibold">
                  ${typeof c.spend === "number" ? c.spend.toFixed(2) : (c.totalSpend || 0)}
                </p>

              </div>

              <div>

                <p className="text-sm text-[#64748B]">
                  Active Orders
                </p>

                <p className="font-semibold">
                  {c.orders || c.activeOrders || 0}
                </p>

              </div>

              <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[c.status || "Active"] || "bg-gray-100"}`}>
                {c.status || "Active"}
              </span>

            </div>

          </div>

        )) : (
          <div className="col-span-3 text-center py-10 text-gray-500">No clients found</div>
        )}

      </div>

    </div>

  )

}