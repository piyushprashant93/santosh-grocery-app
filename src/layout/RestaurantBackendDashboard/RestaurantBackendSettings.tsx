import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Shield,
  Bell,
  Users,
  Save,
  Settings,
  Store,
  MapPin,
  Phone,
  MoreHorizontal,
  Plus,
  Utensils,
  DollarSign,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const authHeadersForm = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const tabs = [
  { key: "general", label: "General", icon: Settings },
  { key: "locations", label: "Locations", icon: Store },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "team", label: "Team", icon: Users },
];



const statusStyles: any = {
  Active: "bg-[#ECFDF5] text-[#059669]",
  Maintenance: "bg-[#FFF7ED] text-[#EA580C]",
};



const roleStyles: any = {
  Owner: "bg-[#EEF2FF] text-[#4F46E5]",
  Manager: "bg-[#F1F5F9] text-[#64748B]",
  Staff: "bg-[#F1F5F9] text-[#64748B]",
};

export default function RestaurantBackendSettings({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const navigate = useNavigate();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [members, setMembers] = useState<any[]>([]);

  const toggleAccess = (index: number) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m)),
    );
  };

  const [twoFA, setTwoFA] = useState(true);

  const toggleShow = (field: "current" | "new" | "confirm") => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const [activeSettingTab, setActiveSettingTab] = useState("general");

  const [settingsData, setSettingsData] = useState<any>({});
  const [locationsData, setLocationsData] = useState<any[]>([]);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    name: "",
    address: "",
    phone: "",
    status: "Active"
  });

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingLocation(true);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/settings/locations`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(locationForm)
      });
      if (res.ok) {
        toast.success("Location added successfully");
        setIsAddLocationOpen(false);
        setLocationForm({ name: "", address: "", phone: "", status: "Active" });
        fetchLocations();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add location");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setIsAddingLocation(false);
    }
  };
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/settings`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSettingsData(data.data?.settings || data.settings || data.data || {});
      }
    } catch(err) { console.error(err); }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/settings/locations`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLocationsData(data.data?.locations || data.locations || data.data || []);
      }
    } catch(err) { console.error(err); }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data?.staff || data.staff || data.data || []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    if (activeSettingTab === "general") fetchSettings();
    else if (activeSettingTab === "locations") fetchLocations();
    else if (activeSettingTab === "team") fetchTeam();
  }, [activeSettingTab]);

  const updateSettings = async () => {
    try {
      await fetch(`${API_BASE}/restaurant-panel/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(settingsData)
      });
      alert("Settings updated!");
    } catch(err) { console.error(err); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/logo`, { method: "POST", headers: authHeadersForm(), body: formData });
      if (res.ok) fetchSettings();
    } catch(err) { console.error(err); }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("banner", file);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/banner`, { method: "POST", headers: authHeadersForm(), body: formData });
      if (res.ok) fetchSettings();
    } catch(err) { console.error(err); }
  };
  const [data, setData] = useState([
    {
      title: "New Orders",
      desc: "Receive alerts when a customer places a new order.",
      icon: Utensils,
      email: true,
      sms: true,
    },
    {
      title: "Order Updates",
      desc: "Notifications about driver arrivals and delivery status.",
      icon: MapPin,
      email: true,
      sms: true,
    },
    {
      title: "Customer Reviews",
      desc: "Get notified when you receive a new review.",
      icon: Users,
      email: true,
      sms: true,
    },
    {
      title: "Payouts & Finance",
      desc: "Weekly payout summaries and invoice alerts.",
      icon: DollarSign,
      email: true,
      sms: true,
    },
    {
      title: "System Updates",
      desc: "Important updates about the platform and features.",
      icon: Settings,
      email: true,
      sms: true,
    },
  ]);

  const toggle = (index: number, type: "email" | "sms") => {
    setData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [type]: !item[type] } : item,
      ),
    );
  };
  const [days, setDays] = useState([
    { day: "Mon", open: true, time: "09:00 - 22:00" },
    { day: "Tue", open: true, time: "09:00 - 22:00" },
    { day: "Wed", open: true, time: "09:00 - 22:00" },
    { day: "Thu", open: true, time: "09:00 - 22:00" },
    { day: "Fri", open: true, time: "09:00 - 22:00" },
    { day: "Sat", open: true, time: "09:00 - 22:00" },
    { day: "Sun", open: false, time: "09:00 - 22:00" },
  ]);

  const toggleDay = (index: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, open: !d.open } : d)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Settings
          </h1>

          <p className="text-[#64748B] mt-2">
            Manage your restaurant profile, locations, team, and security.
          </p>
        </div>

        <button onClick={updateSettings} className="bg-[#009966] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveSettingTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                activeSettingTab === tab.key
                  ? "bg-white shadow text-[#0F172A]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Icon size={16} />

              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSettingTab == "general" && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5 items-start">
          <div className="space-y-5">
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl">Restaurant Details</h2>

                <p className="text-[#64748B] mt-1">
                  Update your public restaurant information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-[#64748B]">Restaurant Name</label>
                  <input
                    value={settingsData.restaurantName || ""}
                    onChange={(e) => setSettingsData({...settingsData, restaurantName: e.target.value})}
                    placeholder="The Golden Spoon"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#64748B]">Phone Number</label>
                  <input
                    value={settingsData.phone || ""}
                    onChange={(e) => setSettingsData({...settingsData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label className="text-sm text-[#64748B]">Email Address</label>
                <input
                  value={settingsData.email || ""}
                  onChange={(e) => setSettingsData({...settingsData, email: e.target.value})}
                  placeholder="contact@goldenspoon.com"
                  className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
              <div className="mt-5">
                <label className="text-sm text-[#64748B]">Description</label>
                <textarea
                  rows={4}
                  value={settingsData.description || ""}
                  onChange={(e) => setSettingsData({...settingsData, description: e.target.value})}
                  className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
            </div>
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl">Operational Details</h2>

                <p className="text-[#64748B] mt-1">
                  Configure cuisines, timing, and order rules.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="text-sm text-[#64748B]">Cuisine Type</label>
                  <input
                    value={settingsData.cuisineType || ""}
                    onChange={(e) => setSettingsData({...settingsData, cuisineType: e.target.value})}
                    placeholder="Italian, Continental, Seafood"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                  <span className="text-sm text-[#62748E80]">Separate cuisines with commas.</span>
                </div>
                <div>
                  <label className="text-sm text-[#64748B]">Average Cost for Two</label>
                  <input
                    value={settingsData.averageCost || ""}
                    onChange={(e) => setSettingsData({...settingsData, averageCost: e.target.value})}
                    placeholder="65.00"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#64748B]">Preparation Time (Avg)</label>
                  <input
                    value={settingsData.preparationTime || ""}
                    onChange={(e) => setSettingsData({...settingsData, preparationTime: e.target.value})}
                    placeholder="30-45 mins"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#64748B]">Min. Order Value</label>
                  <input
                    value={settingsData.minOrderValue || ""}
                    onChange={(e) => setSettingsData({...settingsData, minOrderValue: e.target.value})}
                    placeholder="20.00"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <h3 className="font-playfair text-2xl mb-5">Branding</h3>

              <div className="flex flex-col items-center">
                <img
                  src={settingsData.logoUrl || "https://randomuser.me/api/portraits/women/44.jpg"}
                  className="w-32 h-32 rounded-full object-cover shadow"
                />
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <button onClick={() => logoInputRef.current?.click()} className="mt-4 w-full border border-[#E5E7EB] rounded-lg py-2 text-[#0F172A]">
                  Change Logo
                </button>
              </div>
              <div className="border-t my-6"></div>
              <div>
                <p className="text-sm text-[#64748B] mb-2">Cover Image</p>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={settingsData.bannerUrl || "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500"}
                    className="w-full h-40 object-cover"
                  />
                  <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button onClick={() => bannerInputRef.current?.click()} className="bg-white/80 px-4 py-2 rounded-lg text-sm">
                      Upload Cover
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm max-w-md">
              <h2 className="font-playfair text-2xl mb-6">Operating Hours</h2>

              <div className="space-y-5">
                {days.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleDay(i)}
                        className={`w-11 h-6 rounded-full flex items-center px-1 transition ${
                          d.open
                            ? "bg-green-500 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>

                      <span className="text-[#0F172A] font-medium w-10">
                        {d.day}
                      </span>
                    </div>

                    {d.open ? (
                      <span className="bg-[#F1F5F9] px-4 py-1.5 rounded-md text-sm text-[#475569]">
                        {d.time}
                      </span>
                    ) : (
                      <span className="bg-[#F1F5F9] px-4 py-1.5 rounded-md text-sm text-[#64748B]">
                        Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full bg-[#D1FAE5] text-[#059669] py-2.5 rounded-lg font-medium shadow-sm">
                Edit Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSettingTab == "locations" && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {locationsData.map((loc, i) => (
            <div
              key={loc._id || i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                  <Store size={20} className="text-[#64748B]" />
                </div>
                <MoreHorizontal size={18} className="text-[#94A3B8]" />
              </div>
              <h3 className="font-playfair text-xl mb-3">{loc.name}</h3>
              <div className="space-y-2 text-[#64748B] text-sm">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5" />
                  {loc.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {loc.phone}
                </p>
              </div>
              <div className="border-t my-5"></div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[loc.status || "Active"] || "bg-green-100"}`}>
                  {loc.status || "Active"}
                </span>
                <button className="border border-[#E5E7EB] px-4 py-2 rounded-lg text-[#0F172A] shadow-sm">
                  View Dashboard
                </button>
              </div>
            </div>
          ))}

          <div onClick={() => setIsAddLocationOpen(true)} className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[260px] cursor-pointer hover:bg-gray-50 transition">
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4 shadow-sm">
              <Plus size={28} className="text-[#64748B]" />
            </div>

            <h3 className="text-lg font-medium text-[#0F172A]">
              Add New Location
            </h3>

            <p className="text-[#64748B] text-sm mt-1">Expand your business</p>
          </div>
        </div>
      )}

      {activeSettingTab == "notifications" && (
        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl">Notification Preferences</h2>

            <p className="text-[#64748B] mt-1">
              Choose how you want to be notified about important updates.
            </p>
          </div>

          <div className="divide-y">
            {data.map((item, i) => {
              const Icon = item.icon;

              return (
                <div key={i} className="py-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                      <Icon size={20} className="text-[#64748B]" />
                    </div>

                    <div>
                      <h3 className="font-playfair text-lg">{item.title}</h3>

                      <p className="text-[#64748B] text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-[#94A3B8]">EMAIL</span>

                      <button
                        onClick={() => toggle(i, "email")}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition ${
                          item.email
                            ? "bg-green-600 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-[#94A3B8]">SMS</span>

                      <button
                        onClick={() => toggle(i, "sms")}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition ${
                          item.sms
                            ? "bg-green-600 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSettingTab == "security" && (
        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl">Password & Security</h2>

            <p className="text-[#64748B] mt-1">
              Manage your account security settings.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Lock size={18} className="text-[#059669]" />

                <h3 className="font-playfair text-lg">Change Password</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#64748B]">
                    Current Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={show.current ? "text" : "password"}
                      className="w-full border border-[#E5E7EB] text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                    />

                    <button
                      onClick={() => toggleShow("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    >
                      {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">New Password</label>

                  <div className="relative mt-1">
                    <input
                      type={show.new ? "text" : "password"}
                      className="w-full border border-[#E5E7EB] text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                    />

                    <button
                      onClick={() => toggleShow("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    >
                      {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">
                    Confirm New Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={show.confirm ? "text" : "password"}
                      className="w-full border border-[#E5E7EB] text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                    />

                    <button
                      onClick={() => toggleShow("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    >
                      {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="mt-5 w-full bg-[#0F172A] text-white py-3 rounded-lg font-medium shadow">
                Update Password
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone size={18} className="text-[#059669]" />

                  <h3 className="font-playfair text-lg">
                    Two-Factor Authentication
                  </h3>
                </div>

                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F8FAFC]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        SMS Authentication
                      </p>

                      <p className="text-sm text-[#64748B] mt-1 max-w-xs">
                        Secure your account by requiring a code sent to your
                        phone.
                      </p>
                    </div>

                    <button
                      onClick={() => setTwoFA(!twoFA)}
                      className={`w-11 h-6 rounded-full flex items-center px-1 ${
                        twoFA
                          ? "bg-green-500 justify-end"
                          : "bg-gray-300 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="border-t mt-4 pt-3 text-sm text-[#64748B]">
                    Verified Phone: +1 (555) ***-4567
                  </div>
                </div>
              </div>

              <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0F172A]">Active Sessions</p>

                  <p className="text-sm text-[#64748B]">
                    You are logged in on 2 devices.
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate("/sign-in");
                    setActiveTab("");
                  }}
                  className="border border-red-200 text-red-600 px-4 py-2 rounded-lg bg-red-50"
                >
                  Log out all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSettingTab == "team" && (
        <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-playfair text-2xl">Team Management</h2>

              <p className="text-[#64748B] mt-1">
                Control who has access to your restaurant dashboard.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#009966] text-white px-5 py-2.5 rounded-lg shadow">
              <Users size={16} />
              Invite Member
            </button>
          </div>

          <div className="divide-y">
            {members.map((m, i) => (
              <div key={i} className="py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={m.image}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-lg">{m.name}</p>

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${roleStyles[m.role]}`}
                      >
                        {m.role}
                      </span>
                    </div>

                    <p className="text-[#64748B] text-sm">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-[#64748B]">Access Level</p>

                    <p className="text-sm text-[#0F172A]">{m.access}</p>
                  </div>

                  <button
                    onClick={() => toggleAccess(i)}
                    className={`w-11 h-6 rounded-full flex items-center px-1 ${
                      m.enabled
                        ? "bg-green-500 justify-end"
                        : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>

                  <Settings
                    size={18}
                    className="text-[#94A3B8] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isAddLocationOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair mb-4">Add New Location</h2>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <input required type="text" value={locationForm.name} onChange={e => setLocationForm({...locationForm, name: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input required type="text" value={locationForm.address} onChange={e => setLocationForm({...locationForm, address: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input required type="text" value={locationForm.phone} onChange={e => setLocationForm({...locationForm, phone: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={locationForm.status} onChange={e => setLocationForm({...locationForm, status: e.target.value})} className="w-full border rounded-lg p-2 bg-white outline-none focus:border-[#2563EB]">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsAddLocationOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" disabled={isAddingLocation} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white disabled:opacity-50">
                  {isAddingLocation ? "Adding..." : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
