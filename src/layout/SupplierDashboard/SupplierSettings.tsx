import { useState, useEffect } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};
import {
  Building2,
  Shield,
  Bell,
  Users,
  Upload,
  Mail,
  Phone,
  MapPin,
  Save,
  Lock, Plus, Trash2
} from "lucide-react"

const options = [
  {
    title: "Order Updates",
    desc: "Receive notifications when an order status changes."
  },
  {
    title: "Low Stock Alerts",
    desc: "Get notified when inventory levels drop below threshold."
  },
  {
    title: "New Client Requests",
    desc: "Alerts for new B2B partnership requests."
  },
  {
    title: "Financial Reports",
    desc: "Monthly and weekly financial summary."
  }
]


const members = [
  {
    name: "Alex Morgan",
    email: "alex@globalfoods.com",
    role: "Owner",
    initials: "AM",
    status: "Active",
    removable: false
  },
  {
    name: "Sarah Connor",
    email: "sarah@globalfoods.com",
    role: "Logistics Manager",
    initials: "SC",
    status: "Active",
    removable: true
  },
  {
    name: "James Smith",
    email: "james@globalfoods.com",
    role: "Finance",
    initials: "JS",
    status: "Invited",
    removable: true
  }
]

const statusStyles: any = {
  Active: "bg-green-100 text-green-700",
  Invited: "bg-orange-100 text-orange-600"
}

export default function SupplierSettings() {
  const [twoFA, setTwoFA] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "team", label: "Team Members", icon: Users }
  ]

  const [settings, setSettings] = useState(
    options.map(() => ({ email: true, sms: false }))
  )

  const toggle = (index: number, type: "email" | "sms") => {
    setSettings(prev => {
      const updated = [...prev]
      updated[index][type] = !updated[index][type]
      return updated
    })
  }

  const [active, setActive] = useState("general")

  const [profileForm, setProfileForm] = useState({
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    address: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/settings`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const profile = data.data || data;
        setProfileForm({
          companyName: profile.companyName || profile.name || "",
          taxId: profile.taxId || profile.ein || "",
          email: profile.email || profile.contactEmail || "",
          phone: profile.phone || profile.phoneNumber || "",
          address: profile.address || profile.businessAddress || ""
        });
        if (profile.twoFA !== undefined) setTwoFA(profile.twoFA);
        if (profile.notifications && Array.isArray(profile.notifications)) {
          setSettings(profile.notifications);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        alert("Profile updated successfully");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) { console.error(err); }
  };

  const handleSavePreferences = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ notifications: settings })
      });
      if (res.ok) {
        alert("Preferences saved successfully");
      } else {
        alert("Failed to save preferences");
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleTwoFA = async () => {
    const newValue = !twoFA;
    setTwoFA(newValue);
    try {
      await fetch(`${API_BASE}/supplier/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ twoFA: newValue })
      });
    } catch (err) { console.error(err); }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/users/change-password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      if (res.ok) {
        alert("Password updated successfully");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert("Failed to update password");
      }
    } catch (err) { console.error(err); }
  };

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
          Settings
        </h1>

        <p className="text-theme-muted mt-2">
          Manage your account, company profile, and preferences.
        </p>

      </div>



      <div className="grid lg:grid-cols-[260px_1fr] gap-6">

        <div className="space-y-2">

          {tabs.map((t) => {

            const Icon = t.icon

            return (

              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-3 w-full border border-l-[3px] border-transparent px-4 py-3 rounded-lg text-left h-[48px] ${active === t.id
                  ? "bg-white border border-l-[3px] !border-[#155DFC] text-[#155DFC] rounded-l-none"
                  : "text-[#64748B] hover:bg-gray-50"
                  }`}
              >

                <Icon size={18} />

                {t.label}

              </button>

            )

          })}

        </div>

        {active === "general" &&
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">

            <h3 className="font-playfair text-xl">
              Company Profile
            </h3>

            <p className="text-sm text-theme-muted mb-6">
              Update your company information and public profile.
            </p>



            <div className="flex gap-6 mb-8">

              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border">

                <Building2 size={28} className="text-theme-muted" />

              </div>

              <div>

                <p className="font-medium">
                  Company Logo
                </p>

                <p className="text-sm text-theme-muted">
                  Recommended size 400×400px. JPG or PNG.
                </p>

                <button className="mt-3 border border-theme-border px-4 py-2 rounded-lg flex items-center gap-2 bg-theme-surface">

                  <Upload size={16} />

                  Upload New

                </button>

              </div>

            </div>



            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-[#374151]">Company Name</label>
                <input
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({...profileForm, companyName: e.target.value})}
                  className="w-full border border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-[#374151]">Tax ID / EIN</label>
                <input
                  placeholder="XX-XXXXXXX"
                  value={profileForm.taxId}
                  onChange={(e) => setProfileForm({...profileForm, taxId: e.target.value})}
                  className="w-full border border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-[#374151]">Contact Email</label>
                <div className="flex items-center border border-theme-border rounded-lg px-3 mt-1">
                  <Mail size={16} className="text-theme-muted" />
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[#374151]">Phone Number</label>
                <div className="flex items-center border border-theme-border rounded-lg px-3 mt-1">
                  <Phone size={16} className="text-theme-muted" />
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>

            </div>



            <div className="mt-4">

              <label className="text-sm text-[#374151]">
                Business Address
              </label>

              <div className="flex items-start border border-theme-border rounded-lg px-3 mt-1">

                <MapPin size={16} className="mt-3 text-theme-muted" />

                <textarea
                  rows={3}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  className="w-full px-2 py-2 outline-none"
                  placeholder="Enter your business address"
                />

              </div>

            </div>



            <div className="flex justify-end mt-6">

              <button onClick={handleSaveProfile} className="bg-[#155DFC] text-white px-5 py-2.5 rounded-lg flex items-center gap-2">

                <Save size={16} />

                Save Changes

              </button>

            </div>

          </div>
        }

        {active === "security" &&
          <div className="space-y-5">

            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">

              <h3 className="font-playfair text-xl">
                Password & Authentication
              </h3>

              <p className="text-sm text-theme-muted mb-6">
                Manage your account security preferences.
              </p>



              <div className="space-y-5">

                <div>
                  <label className="text-sm text-[#374151]">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full border border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
                  />
                </div>



                <div className="grid md:grid-cols-2 gap-4">

                  <div>

                    <label className="text-sm text-[#374151]">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full border border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
                    />

                  </div>

                  <div>

                    <label className="text-sm text-[#374151]">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full border border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
                    />

                  </div>

                </div>



                <div className="flex justify-end">

                  <button onClick={handleUpdatePassword} className="border border-theme-border bg-theme-surface px-5 py-2 rounded-lg shadow-sm">
                    Update Password
                  </button>

                </div>

              </div>



              <div className="border-t mt-8 pt-6 flex items-center justify-between">

                <div>

                  <p className="font-playfair text-lg">
                    Two-Factor Authentication
                  </p>

                  <p className="text-sm text-theme-muted">
                    Add an extra layer of security to your account.
                  </p>

                </div>



                <button
                  onClick={handleToggleTwoFA}
                  className={`relative w-12 h-6 rounded-full transition ${twoFA ? "bg-[#155DFC]" : "bg-gray-300"
                    }`}
                >

                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${twoFA ? "left-6" : "left-0.5"
                      }`}
                  />

                </button>

              </div>

            </div>



            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">

              <h3 className="font-playfair text-xl">
                Active Sessions
              </h3>

              <p className="text-sm text-theme-muted mb-6">
                Devices currently logged into your account.
              </p>



              <div className="bg-theme-bg rounded-lg p-4 flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center">

                    <Lock size={20} className="text-[#155DFC]" />

                  </div>

                  <div>

                    <p className="font-medium">
                      Chrome on MacBook Pro
                    </p>

                    <p className="text-sm text-theme-muted">
                      San Francisco, US • Current Session
                    </p>

                  </div>

                </div>



                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Active
                </span>

              </div>

            </div>

          </div>
        }

        {active === "notifications" &&
          <div className="space-y-5">

            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">

              <h3 className="font-playfair text-xl">
                Notification Preferences
              </h3>

              <p className="text-sm text-theme-muted mb-6">
                Choose how and when you want to be notified.
              </p>

              <div className="space-y-6">

                {options.map((item, i) => (

                  <div key={i} className="flex items-center justify-between border-b pb-6">

                    <div>

                      <p className="font-medium text-theme-text">
                        {item.title}
                      </p>

                      <p className="text-sm text-theme-muted mt-1">
                        {item.desc}
                      </p>

                    </div>



                    <div className="flex gap-8">

                      <span 
                        onClick={() => toggle(i, "email")}
                        className={`text-sm cursor-pointer ${settings[i]?.email ? "text-[#155DFC] font-medium" : "text-[#64748B]"}`}
                      >
                        Email
                      </span>
                      <span 
                        onClick={() => toggle(i, "sms")}
                        className={`text-sm cursor-pointer ${settings[i]?.sms ? "text-[#155DFC] font-medium" : "text-[#64748B]"}`}
                      >
                        SMS
                      </span>

                    </div>

                  </div>

                ))}

              </div>



              <div className="flex justify-end mt-8">

                <button onClick={handleSavePreferences} className="bg-[#155DFC] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow">

                  <Save size={16} />

                  Save Preferences

                </button>

              </div>

            </div>

          </div>
        }

        {active === "team" &&
            <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6 space-y-5">
            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-playfair text-xl">
                  Team Members
                </h3>

                <p className="text-sm text-theme-muted">
                  Manage access to your supplier panel.
                </p>

              </div>

              <button className="bg-[#155DFC] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">

                <Plus size={16} />

                Add Member

              </button>

            </div>

              {members.map((m, i) => (

                <div
                  key={i}
                  className="flex items-center justify-between bg-theme-bg rounded-xl px-5 py-4"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center font-semibold text-[#155DFC]">

                      {m.initials}

                    </div>

                    <div>

                      <p className="font-medium text-theme-text">
                        {m.name}
                      </p>

                      <p className="text-sm text-theme-muted">
                        {m.email} • {m.role}
                      </p>

                    </div>

                  </div>



                  <div className="flex items-center gap-4">

                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[m.status]}`}>
                      {m.status}
                    </span>

                    {m.removable && (

                      <button className="text-red-500 hover:text-red-600">

                        <Trash2 size={18} />

                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>
        }
      </div>

    </div>

  )

}