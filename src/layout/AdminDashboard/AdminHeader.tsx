import { Menu, Search, Bell, User, Edit, LogOut, Camera, Loader2, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { apiFetch } from "../../lib/apiFetch"

export default function AdminHeader({
  activeTab,
  setActiveTab,
  openSidebar
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  openSidebar: () => void
}) {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Edit form state
  const [editData, setEditData] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiFetch('/admin/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
        setEditData({
          firstName: data.data.user.firstName || '',
          lastName: data.data.user.lastName || '',
          phone: data.data.user.phone || ''
        });
      }
    } catch (err) {
      console.error("Failed to fetch admin profile", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/admin/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.data.user);
        toast.success("Profile updated");
        setEditModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const loadingToast = toast.loading("Uploading avatar...");
    try {
      const res = await apiFetch('/admin/me/avatar', {
        method: 'POST',
        // Omit Content-Type so fetch sets the boundary for FormData automatically
        body: formData,
        // we need to remove the content-type from apiFetch defaults if it forces application/json
        // Wait, apiFetch sets json if we pass headers. Let's use raw fetch with token
      });
      
      // Let's implement this slightly differently to avoid apiFetch Content-Type overwrite if it does
      // Wait, apiFetch only sets Authorization if not present, and doesn't set Content-Type unless passed.
      
      const data = await res.json();
      if (res.ok && data.success) {
        setUser({ ...user, avatar: data.data?.avatar || data.data?.user?.avatar || user.avatar });
        toast.success("Avatar updated", { id: loadingToast });
        fetchProfile(); // Refresh to be safe
      } else {
        toast.error(data.message || "Failed to upload avatar", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Error uploading avatar", { id: loadingToast });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="h-[80px] bg-theme-surface border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={openSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg max-w-[400px] w-full border border-gray-100">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Global search (Users, Orders, IDs)..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 relative">
        <button 
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition"
        >
          <Bell size={22} />
          {user?.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>

        <div className="hidden sm:block w-[1px] h-8 bg-gray-200"></div>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-full transition"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-theme-text">{user?.fullName || "Loading..."}</span>
              <span className="text-xs text-gray-500">{user?.title || "..."}</span>
            </div>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500">
                <User size={20} />
              </div>
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { setEditModalOpen(true); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <Edit size={16} /> Edit Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-1"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-6 relative">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                      <User size={40} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={editData.firstName} 
                      onChange={e => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={editData.lastName} 
                      onChange={e => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={editData.phone} 
                    onChange={e => setEditData({...editData, phone: e.target.value})}
                    placeholder="+977..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

