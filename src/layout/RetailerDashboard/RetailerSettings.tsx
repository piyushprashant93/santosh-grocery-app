import { useState, useEffect } from "react"
import { Store, FileText, Bell, Shield, Save } from "lucide-react"

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
import KYCDocuments from "./KYCDocuments"
import NotificationSettings from "./NotificationSettings"
import SecuritySettings from "./SecuritySettings"

export default function RetailerSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState<any>({
    storeName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    notificationPrefs: {
      newOrder: { email: true, sms: false },
      orderCancelled: { email: true, sms: false },
      payoutProcessed: { email: true, sms: true }
    },
    kyc: {}
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/settings`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const user = payload.user || {};
        const profile = payload.profile || {};
        
        setSettings({
          storeName: profile.storeName || user.storeName || "",
          contactPerson: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : (user.fullName || ""),
          email: user.email || "",
          phone: user.phone || "",
          address: profile.address || user.address || "",
          description: profile.description || user.description || "",
          logoUrl: profile.storeLogo || user.avatar || "",
          bannerUrl: profile.storeBanner || "",
          notificationPrefs: profile.notificationPrefs || settings.notificationPrefs,
          kyc: profile.kyc || {}
        });
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let res;
      if (logoFile || bannerFile) {
        const formData = new FormData();
        Object.keys(settings).forEach(key => formData.append(key, settings[key]));
        if (logoFile) formData.append("logo", logoFile);
        if (bannerFile) formData.append("banner", bannerFile);
        formData.set("notificationPrefs", JSON.stringify(settings.notificationPrefs));

        res = await fetch(`${API_BASE}/retailer/settings`, {
          method: "PUT",
          headers: authHeadersForm(),
          body: formData
        });
      } else {
        res = await fetch(`${API_BASE}/retailer/settings`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(settings)
        });
      }

      if (res.ok) {
        alert("Settings saved successfully!");
        fetchSettings();
      } else {
        alert("Failed to save settings");
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Settings
          </h1>

          <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
            Manage your profile, business details, and preferences.
          </p>
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 bg-[#F54900] text-white px-5 py-2.5 rounded-lg shadow">
          <Save size={18}/>
          Save Changes
        </button>

      </div>



      <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-lg w-fit">

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
            activeTab === "profile"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          <Store size={16}/>
          Profile & Business
        </button>

        <button
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
            activeTab === "kyc"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          <FileText size={16}/>
          KYC Documents
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
            activeTab === "notifications"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          <Bell size={16}/>
          Notifications
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
            activeTab === "security"
              ? "bg-white shadow text-[#111827]"
              : "text-[#6A7282]"
          }`}
        >
          <Shield size={16}/>
          Security
        </button>

      </div>



      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">

          <div className="space-y-6">

            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm text-center">

              <h3 className="font-playfair text-xl mb-4">
                Store Logo
              </h3>

              <label className="cursor-pointer block relative w-36 h-36 mx-auto">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setLogoFile(e.target.files[0]);
                    setSettings({ ...settings, logoUrl: URL.createObjectURL(e.target.files[0]) });
                  }
                }} />
                <img
                  src={settings.logoUrl}
                  className="w-36 h-36 rounded-full mx-auto object-cover"
                />
              </label>

              <p className="text-[#6A7282] text-sm mt-4">
                Recommended size: 500×500px. <br/> Formats: JPG, PNG.
              </p>

            </div>



            <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm text-center">

              <h3 className="font-playfair text-xl mb-4">
                Store Banner
              </h3>

              {settings.bannerUrl ? (
                <div className="h-32 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={settings.bannerUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-[#6A7282] text-sm">
                  No banner uploaded
                </div>
              )}

              <label className="mt-4 border border-[#E5E7EB] px-4 py-2 rounded-lg bg-white inline-block cursor-pointer">
                Upload Banner
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBannerFile(e.target.files[0]);
                    setSettings({ ...settings, bannerUrl: URL.createObjectURL(e.target.files[0]) });
                  }
                }} />
              </label>

            </div>

          </div>



          <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

            <h3 className="font-playfair text-xl">
              Business Information
            </h3>

            <p className="text-[#6A7282] text-sm mb-6">
              These details will be visible to customers.
            </p>



            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-[#374151]">Store Name</label>
                <input
                  name="storeName"
                  className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                  value={settings.storeName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm text-[#374151]">Contact Person</label>
                <input
                  name="contactPerson"
                  className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                  value={settings.contactPerson}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm text-[#374151]">Email Address</label>
                <input
                  name="email"
                  className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                  value={settings.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm text-[#374151]">Phone Number</label>
                <input
                  name="phone"
                  className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                  value={settings.phone}
                  onChange={handleChange}
                />
              </div>

            </div>



            <div className="mt-4">

              <label className="text-sm text-[#374151]">
                Business Address
              </label>

              <input
                name="address"
                className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                value={settings.address}
                onChange={handleChange}
              />

            </div>



            <div className="mt-4">

              <label className="text-sm text-[#374151]">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                className="w-full border border-[#E5E7EB] rounded-lg outline-none px-3 py-2 mt-1"
                value={settings.description}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>
      )}

      {activeTab === "kyc" && <KYCDocuments kyc={settings.kyc} />}
      {activeTab === "notifications" && (
        <NotificationSettings 
          prefs={settings.notificationPrefs} 
          onChange={(newPrefs: any) => setSettings({ ...settings, notificationPrefs: newPrefs })} 
        />
      )}
      {activeTab === "security" && <SecuritySettings />}

    </div>
  )
}