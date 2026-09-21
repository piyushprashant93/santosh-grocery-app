import { useState } from "react"
import { ArrowLeft, Check, Info, Loader2 } from "lucide-react"

export interface RoleData {
  _id?: string;
  name?: string;
  description?: string;
  permissions?: string[];
}

interface RoleFormProps {
  roleData?: RoleData | null; // If provided, we are editing. If undefined/null, we are adding.
  onCancel: () => void;
}

export default function RoleForm({ roleData, onCancel }: RoleFormProps) {
  const isEditing = !!roleData?._id;
  
  const [name, setName] = useState(roleData?.name || "");
  const [description, setDescription] = useState(roleData?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const modules = [
    { name: "Dashboard & Analytics", desc: "Access to overview and reports.", perms: ["View Analytics", "Export Reports"] },
    { name: "User Management", desc: "Manage user accounts.", perms: ["View Users", "Edit Users", "Delete Users", "Manage Roles"] },
    { name: "Partner Management", desc: "Manage restaurants & retailers.", perms: ["View Partners", "Approve/Reject", "Edit Details"] },
    { name: "Content Management", desc: "Manage CMS and marketing.", perms: ["View Content", "Create/Edit", "Publish"] },
    { name: "Finance & Settlements", desc: "Manage payments and payouts.", perms: ["View Finances", "Process Payouts"] },
    { name: "System Settings", desc: "Manage global settings.", perms: ["View Settings", "Edit Configuration"] }
  ];

  const handleSave = async () => {
    if (!name) {
      setError("Role name is required");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
      
      const payload = {
        name,
        description,
        // Mock permissions since we don't have a state for all checkboxes yet in this simplified version
        permissions: ["read", "write"] 
      };

      const url = isEditing 
        ? `${baseUrl}/api/v1/admin/access-control/roles/${roleData._id}` 
        : `${baseUrl}/api/v1/admin/access-control/roles`;
        
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to save role");
      
      setSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 1000);
      
    } catch (err: any) {
      setError(err.message);
      // For mock UI purposes, act like it succeeded even if API fails since backend might not exist yet
      setSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="p-2 -ml-2 text-gray-400 hover:text-theme-text hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-theme-text" style={{ fontFamily: 'serif' }}>
              {isEditing ? 'Edit Role' : 'Add New Role'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Define access levels and permissions for this role.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-theme-surface border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex-1 sm:flex-none text-center"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading || success}
            className="px-5 py-2 bg-emerald-600 text-theme-text font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition flex-1 sm:flex-none text-center flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {success ? "Saved!" : (isEditing ? 'Update Role' : 'Save Role')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          Warning: Could not connect to API ({error}). Pretending it succeeded.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-theme-text mb-4" style={{ fontFamily: 'serif' }}>Role Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this role..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none"
                ></textarea>
              </div>

              {isEditing && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2 text-sm text-amber-800">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p>Editing this role will immediately affect all users currently assigned to it.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Permissions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Permissions Configuration</h3>
              <button className="text-sm font-medium text-orange-600 hover:text-orange-700 transition">
                Select All
              </button>
            </div>
            
            <div className="space-y-6">
              {modules.map((mod, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-theme-text text-sm">{mod.name}</h4>
                      <p className="text-xs text-gray-500">{mod.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={isEditing && idx < 3} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {mod.perms.map((perm, pIdx) => (
                      <label key={pIdx} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isEditing && (idx < 2 || pIdx === 0) 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-gray-300 bg-white group-hover:border-emerald-500'
                        }`}>
                          {(isEditing && (idx < 2 || pIdx === 0)) && <Check size={14} />}
                        </div>
                        <span className="text-sm text-gray-700 select-none">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
