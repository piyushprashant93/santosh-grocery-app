import { useState, useEffect } from "react"
import Dialog from "../../components/common/Dialog"
import { Loader2 } from "lucide-react"
import api from "../../lib/api"

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // call this to refetch users after a successful add
}

type PermissionKeys = 'Dashboard' | 'User Management' | 'Partner Management' | 'Restaurant Panel' | 'Retailer Panel';

export default function AddAdminModal({ isOpen, onClose, onSuccess }: AddAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [permissions, setPermissions] = useState<Record<PermissionKeys, { view: boolean, create: boolean, edit: boolean, delete: boolean }>>({
    "Dashboard": { view: false, create: false, edit: false, delete: false },
    "User Management": { view: false, create: false, edit: false, delete: false },
    "Partner Management": { view: false, create: false, edit: false, delete: false },
    "Restaurant Panel": { view: false, create: false, edit: false, delete: false },
    "Retailer Panel": { view: false, create: false, edit: false, delete: false },
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "admin",
      });
      setPermissions({
        "Dashboard": { view: false, create: false, edit: false, delete: false },
        "User Management": { view: false, create: false, edit: false, delete: false },
        "Partner Management": { view: false, create: false, edit: false, delete: false },
        "Restaurant Panel": { view: false, create: false, edit: false, delete: false },
        "Retailer Panel": { view: false, create: false, edit: false, delete: false },
      });
    }
  }, [isOpen]);

  const handlePermissionChange = (moduleName: PermissionKeys, action: 'view' | 'create' | 'edit' | 'delete') => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [action]: !prev[moduleName][action]
      }
    }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        // Optional splitting if backend requires firstName/lastName
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        moduleAccess: permissions
      };

      // Ensure your backend supports this route!
      await api.post(`/api/v1/admin/users`, payload);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Error creating admin user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Admin User">
      <div className="p-6 flex flex-col gap-5">
        
        {/* Basic Info */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input 
            type="text" 
            value={formData.role}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Module Access */}
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Module Access</h3>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {(Object.keys(permissions) as PermissionKeys[]).map((moduleName) => (
              <div key={moduleName} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition gap-3">
                <span className="text-sm text-gray-700 font-medium">{moduleName}</span>
                <div className="flex items-center gap-6">
                  {(['view', 'create', 'edit', 'delete'] as const).map(action => (
                    <label key={action} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={permissions[moduleName][action]}
                        onChange={() => handlePermissionChange(moduleName, action)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600 capitalize">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
        <button 
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-theme-surface border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Save Admin
        </button>
      </div>
    </Dialog>
  )
}
