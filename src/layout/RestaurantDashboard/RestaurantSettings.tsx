import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/dataHelper";
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
  X,
} from "lucide-react";

const tabs = [
  { key: "general", label: "General", icon: Settings },
  { key: "locations", label: "Locations", icon: Store },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "team", label: "Team", icon: Users },
];

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};



const statusStyles: any = {
  Active: "bg-[#ECFDF5] text-[#059669]",
  Maintenance: "bg-[#FFF7ED] text-[#EA580C]",
};

const initialMembers: any[] = [];

const roleStyles: any = {
  Owner: "bg-[#EEF2FF] text-[#4F46E5]",
  Manager: "bg-[#F1F5F9] text-[#64748B]",
  Staff: "bg-[#F1F5F9] text-[#64748B]",
};

export default function RestaurantSettings({
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

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>({ name: "", address: "", phone: "", status: "Active" });

  const [members, setMembers] = useState<any[]>(initialMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "Staff" });
  
  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/staff`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        // The API returns the list in data.data or data
        const staffList = data.data || data;
        if (Array.isArray(staffList)) {
          setMembers(staffList);
        }
      }
    } catch(err) { console.error(err); }
  };
  const [profile, setProfile] = useState<any>({});
  const [locs, setLocs] = useState<any[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);


  const getFullDayName = (shortDay: string) => {
    const map: any = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
    return map[shortDay] || shortDay;
  };

  const mapTitleToKey = (title: string) => {
    const map: any = {
      "New Orders": "newOrders",
      "Order Updates": "orderUpdates",
      "Customer Reviews": "customerReviews",
      "Payouts & Finance": "payoutsFinance",
      "System Updates": "systemUpdates"
    };
    return map[title];
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/settings/locations`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLocs(data.data?.locations || data.locations || (Array.isArray(data.data) ? data.data : []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurants/my/restaurant`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const profileData = data.data?.restaurant || data.restaurant || data.data || {};
        setProfile(profileData);
        
        // Handle new openingHours object
        if (profileData.openingHours && typeof profileData.openingHours === 'object' && !Array.isArray(profileData.openingHours)) {
          setDays(prev => prev.map(d => {
            const fullDay = getFullDayName(d.day);
            const shortDayLower = d.day.toLowerCase();
            const h = profileData.openingHours[fullDay] || profileData.openingHours[fullDay.toLowerCase()] || profileData.openingHours[shortDayLower];
            if (h) {
              return { ...d, open: !h.isClosed, time: `${h.open || "09:00"} - ${h.close || "22:00"}` };
            }
            return d;
          }));
        } else if (profileData.operatingHours && Array.isArray(profileData.operatingHours)) {
          setDays(profileData.operatingHours); // fallback
        }

        // Handle new notificationPreferences object
        if (profileData.notificationPreferences && typeof profileData.notificationPreferences === 'object') {
          setData(prev => prev.map(item => {
            const key = mapTitleToKey(item.title);
            const found = profileData.notificationPreferences[key];
            return found ? { ...item, email: found.email, sms: found.sms } : item;
          }));
        } else if (profileData.notifications && Array.isArray(profileData.notifications)) {
          // fallback
          setData(prev => prev.map(item => {
            const found = profileData.notifications.find((n: any) => n.title === item.title);
            return found ? { ...item, email: found.email, sms: found.sms } : item;
          }));
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProfile();
    fetchTeam();
    fetchLocations();
  }, []);

  const saveProfile = async () => {
    try {
      const openingHours: any = {};
      days.forEach(d => {
        const parts = d.time.split("-");
        const openTime = parts[0]?.trim() || "09:00";
        const closeTime = parts[1]?.trim() || "22:00";
        openingHours[getFullDayName(d.day)] = {
          open: openTime,
          close: closeTime,
          isClosed: !d.open
        };
      });

      const res = await fetch(`${API_BASE}/restaurant-panel/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ openingHours })
      });
      if (res.ok) {
         // Also update the profile general fields using the old endpoint
         const res2 = await fetch(`${API_BASE}/restaurants/my/restaurant`, {
           method: "PUT",
           headers: authHeaders(),
           body: JSON.stringify(profile)
         });
         if (res2.ok) {
           alert("Settings saved!");
           fetchProfile();
         }
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/change-password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || data.errors?.join(", ") || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again later.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpload = async (type: 'logo' | 'banner', file: File) => {
    const formData = new FormData();
    formData.append(type, file);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: formData
      });
      if (res.ok) fetchProfile();
    } catch (err) { console.error(err); }
  };

  const deleteLocation = async (id: string) => {
    if (!id || !confirm("Delete location?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/settings/locations/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) fetchLocations();
    } catch (err) { console.error(err); }
  };

  const saveLocation = async () => {
    if (!editingLocation.name || !editingLocation.address) return alert("Name and Address required");
    try {
      const url = editingLocation._id 
        ? `${API_BASE}/restaurant-panel/settings/locations/${editingLocation._id}`
        : `${API_BASE}/restaurant-panel/settings/locations`;
      const method = editingLocation._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(editingLocation)
      });
      if (res.ok) {
        fetchLocations();
        setShowLocationModal(false);
      }
    } catch(err) { console.error(err); }
  };

  const saveNotifications = async () => {
    try {
      const notificationPreferences: any = {};
      data.forEach(item => {
        const key = mapTitleToKey(item.title);
        if (key) {
           notificationPreferences[key] = { email: item.email, sms: item.sms };
        }
      });
      const res = await fetch(`${API_BASE}/restaurant-panel/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ notificationPreferences })
      });
      if (res.ok) {
        alert("Notifications saved!");
        fetchProfile();
      }
    } catch (err) { console.error(err); }
  };

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

          <p className="text-theme-muted mt-2">
            Manage your restaurant profile, locations, team, and security.
          </p>
        </div>

        <button onClick={activeSettingTab === 'notifications' ? saveNotifications : saveProfile} className="bg-[#009966] text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl">Restaurant Details</h2>

                <p className="text-theme-muted mt-1">
                  Update your public restaurant information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-theme-muted">
                    Restaurant Name
                  </label>

                  <input
                    value={profile.name || "The Golden Spoon"}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-theme-muted">Phone Number</label>

                  <input
                    value={profile.phone || "+1 (555) 123-4567"}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm text-theme-muted">Email Address</label>

                <input
                  value={profile.email || "contact@goldenspoon.com"}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm text-theme-muted">Description</label>

                <textarea
                  rows={4}
                  value={profile.description || ""}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
            </div>
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl">Operational Details</h2>

                <p className="text-theme-muted mt-1">
                  Configure cuisines, timing, and order rules.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="text-sm text-theme-muted">Cuisine Type</label>

                  <input
                    defaultValue="Italian, Continental, Seafood"
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                  <span className="text-sm text-[#62748E80]">
                    Separate cuisines with commas.
                  </span>
                </div>

                <div>
                  <label className="text-sm text-theme-muted">
                    Average Cost for Two
                  </label>

                  <input
                    defaultValue="65.00"
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-theme-muted">
                    Preparation Time (Avg)
                  </label>

                  <input
                    defaultValue="30-45 mins"
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-theme-muted">
                    Min. Order Value
                  </label>

                  <input
                    defaultValue="20.00"
                    className="w-full mt-1 border border-theme-border rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
              <h3 className="font-playfair text-2xl mb-5">Branding</h3>

              <div className="flex flex-col items-center">
                <img
                  src={getImageUrl(profile.logo)}
                  className="w-32 h-32 rounded-full object-cover shadow"
                />

                <label className="mt-4 w-full border border-theme-border rounded-lg py-2 text-theme-text text-center cursor-pointer block">
                  Change Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleUpload('logo', e.target.files[0]);
                  }} />
                </label>
              </div>

              <div className="border-t my-6"></div>

              <div>
                <p className="text-sm text-theme-muted mb-2">Cover Image</p>

                <div className="relative rounded-xl overflow-hidden group">
                  <img
                    src={getImageUrl(profile.banner)}
                    className="w-full h-40 object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                    <label className="bg-white/80 px-4 py-2 rounded-lg text-sm cursor-pointer">
                      Upload Cover
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleUpload('banner', e.target.files[0]);
                      }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm max-w-md">
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
                        <div className="w-4 h-4 bg-theme-surface rounded-full" />
                      </button>

                      <span className="text-theme-text font-medium w-10">
                        {d.day}
                      </span>
                    </div>

                    {d.open ? (
                      <span className="bg-[#F1F5F9] px-4 py-1.5 rounded-md text-sm text-theme-muted">
                        {d.time}
                      </span>
                    ) : (
                      <span className="bg-[#F1F5F9] px-4 py-1.5 rounded-md text-sm text-theme-muted">
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
          {locs.map((loc, i) => (
            <div
              key={loc._id || i}
              className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                  <Store size={20} className="text-theme-muted" />
                </div>

                <div className="flex gap-2">
                  {loc._id && <span onClick={() => deleteLocation(loc._id)} className="text-red-500 cursor-pointer text-sm font-medium">Delete</span>}
                  <MoreHorizontal onClick={() => {
                    setEditingLocation(loc);
                    setShowLocationModal(true);
                  }} size={18} className="text-theme-muted cursor-pointer hover:text-theme-text" />
                </div>
              </div>

              <h3 className="font-playfair text-xl mb-3">{loc.name || loc.address}</h3>

              <div className="space-y-2 text-theme-muted text-sm">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5" />
                  {loc.address}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {loc.phone || profile.phone}
                </p>
              </div>

              <div className="border-t my-5"></div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${statusStyles[loc.status || "Active"] || "bg-green-100 text-green-700"}`}
                >
                  {loc.status || "Active"}
                </span>

                <button className="border border-theme-border px-4 py-2 rounded-lg text-theme-text shadow-sm">
                  View Dashboard
                </button>
              </div>
            </div>
          ))}

          <div onClick={() => {
            setEditingLocation({ name: "", address: "", phone: "", status: "Active" });
            setShowLocationModal(true);
          }} className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[260px] cursor-pointer hover:bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4 shadow-sm">
              <Plus size={28} className="text-theme-muted" />
            </div>

            <h3 className="text-lg font-medium text-theme-text">
              Add New Location
            </h3>

            <p className="text-theme-muted text-sm mt-1">Expand your business</p>
          </div>
        </div>
      )}

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-xl w-[90%] max-w-[500px] p-6 relative">
            <button onClick={() => setShowLocationModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
              <X size={20} />
            </button>
            <h3 className="font-playfair text-xl mb-4">{editingLocation._id ? "Edit Location" : "Add Location"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Name / Title</label>
                <input value={editingLocation.name} onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none" placeholder="e.g. Downtown Branch" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Address</label>
                <input value={editingLocation.address} onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none" placeholder="123 Main St" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Phone</label>
                <input value={editingLocation.phone} onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none" placeholder="+1..." />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Status</label>
                <select value={editingLocation.status} onChange={(e) => setEditingLocation({ ...editingLocation, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button onClick={saveLocation} className="w-full bg-[#009966] text-white py-2.5 rounded-lg font-medium">Save Location</button>
            </div>
          </div>
        </div>
      )}

      {activeSettingTab == "notifications" && (
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl">Notification Preferences</h2>

            <p className="text-theme-muted mt-1">
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
                      <Icon size={20} className="text-theme-muted" />
                    </div>

                    <div>
                      <h3 className="font-playfair text-lg">{item.title}</h3>

                      <p className="text-theme-muted text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-theme-muted">EMAIL</span>

                      <button
                        onClick={() => toggle(i, "email")}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition ${
                          item.email
                            ? "bg-green-600 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-theme-surface rounded-full" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-theme-muted">SMS</span>

                      <button
                        onClick={() => toggle(i, "sms")}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition ${
                          item.sms
                            ? "bg-green-600 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-theme-surface rounded-full" />
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
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl">Password & Security</h2>

            <p className="text-theme-muted mt-1">
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
                  <label className="text-sm text-theme-muted">
                    Current Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={show.current ? "text" : "password"}
                      className="w-full border border-theme-border text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <button
                      onClick={() => toggleShow("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted"
                    >
                      {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-theme-muted">New Password</label>

                  <div className="relative mt-1">
                    <input
                      type={show.new ? "text" : "password"}
                      className="w-full border border-theme-border text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button
                      onClick={() => toggleShow("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted"
                    >
                      {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-theme-muted">
                    Confirm New Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={show.confirm ? "text" : "password"}
                      className="w-full border border-theme-border text-black rounded-lg px-4 py-2.5 pr-10 outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                      onClick={() => toggleShow("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted"
                    >
                      {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUpdatePassword}
                disabled={passwordLoading}
                className="mt-5 w-full bg-theme-surface text-theme-text py-3 rounded-lg font-medium shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
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

                <div className="border border-theme-border rounded-xl p-4 bg-theme-bg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-theme-text">
                        SMS Authentication
                      </p>

                      <p className="text-sm text-theme-muted mt-1 max-w-xs">
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
                      <div className="w-4 h-4 bg-theme-surface rounded-full" />
                    </button>
                  </div>

                  <div className="border-t mt-4 pt-3 text-sm text-theme-muted">
                    Verified Phone: +1 (555) ***-4567
                  </div>
                </div>
              </div>

              <div className="border border-theme-border rounded-xl p-4 bg-theme-bg flex items-center justify-between">
                <div>
                  <p className="font-medium text-theme-text">Active Sessions</p>

                  <p className="text-sm text-theme-muted">
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
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-playfair text-2xl">Team Management</h2>

              <p className="text-theme-muted mt-1">
                Control who has access to your restaurant dashboard.
              </p>
            </div>

            <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 bg-[#009966] text-white px-5 py-2.5 rounded-lg shadow">
              <Users size={16} />
              Invite Member
            </button>
          </div>

          <div className="divide-y">
            {members.map((m, i) => (
              <div key={i} className="py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(m.image)}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-lg">{m.name}</p>

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${roleStyles[m.role] || "bg-[#F1F5F9] text-[#64748B]"}`}
                      >
                        {m.role}
                      </span>
                    </div>

                    <p className="text-theme-muted text-sm">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-theme-muted">Access Level</p>

                    <p className="text-sm text-theme-text">{m.access}</p>
                  </div>

                  <button
                    onClick={() => toggleAccess(i)}
                    className={`w-11 h-6 rounded-full flex items-center px-1 ${
                      m.enabled
                        ? "bg-green-500 justify-end"
                        : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-theme-surface rounded-full" />
                  </button>

                  <Settings
                    size={18}
                    className="text-theme-muted cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-theme-surface rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair text-2xl font-bold text-theme-text">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-theme-muted hover:text-theme-text">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">Name</label>
                <input type="text" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-[#009966]" placeholder="e.g. John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">Email Address</label>
                <input type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-[#009966]" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">Role</label>
                <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-[#009966]">
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Chef">Chef</option>
                </select>
              </div>
              
              <button onClick={async () => {
                try {
                  const res = await fetch(`${API_BASE}/restaurant-panel/staff`, {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify(inviteForm)
                  });
                  if (res.ok) {
                    alert("Member invited successfully! They have been emailed their login code.");
                    setShowInviteModal(false);
                    setInviteForm({ name: "", email: "", role: "Staff" });
                    fetchTeam();
                  } else {
                    const errData = await res.json();
                    alert(errData.message || "Failed to invite member");
                  }
                } catch(err) {
                  console.error(err);
                  alert("An error occurred");
                }
              }} className="w-full bg-[#009966] text-white py-3 rounded-lg font-medium hover:bg-[#008055] transition mt-4">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
