import { useState, useEffect, useRef } from "react"
import { Download, Plus, Search, Filter, MoreHorizontal, History, CreditCard, Truck, Shield, Ban, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import AddAdminModal from "./AddAdminModal"
import OrderHistory from "./UserSubpages/OrderHistory"
import PaymentHistory from "./UserSubpages/PaymentHistory"
import DeliveryLogs from "./UserSubpages/DeliveryLogs"
import RouteDetailsModal from "./UserSubpages/RouteDetailsModal"
import ManagePermissions from "./UserSubpages/ManagePermissions"
import api from "../../lib/api"

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  walletBalance?: number;
  rewardPoints?: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sub-view states
  const [activeView, setActiveView] = useState<'main' | 'orders' | 'payments' | 'deliveries' | 'permissions'>('main');
  const [activeUserForView, setActiveUserForView] = useState<User | null>(null);
  const [routeModalDeliveryId, setRouteModalDeliveryId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (roleFilter) params.append("role", roleFilter);
      if (search) params.append("search", search);

      const response = await api.get(`/api/v1/admin/users?${params.toString()}`);
      const result = response.data;
      
      if (result.data && Array.isArray(result.data.data)) {
        setUsers(result.data.data);
        setTotalPages(result.data.pagination?.totalPages || 1);
      } else if (result.data && Array.isArray(result.data)) {
        setUsers(result.data);
        setTotalPages(1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const newStatus = !currentStatus;
      await api.put(`/api/v1/admin/users/${userId}/block`, { isActive: newStatus });
      fetchUsers();
    } catch (err) {
      alert("Error updating user status. Please try again.");
    } finally {
      setActionLoading(null);
      setActiveDropdown(null);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append("role", roleFilter);
      if (search) params.append("search", search);
      const query = params.toString() ? `?${params.toString()}` : "";
      
      const response = await api.get(`/api/v1/admin/users/export${query}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error exporting users. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const getSubViewUser = () => ({
    id: activeUserForView?._id || '',
    fullName: activeUserForView?.fullName || `${activeUserForView?.firstName || ''} ${activeUserForView?.lastName || ''}`.trim() || 'Unknown'
  });

  if (activeView === 'orders') {
    return <OrderHistory user={getSubViewUser()} onBack={() => setActiveView('main')} />
  }
  if (activeView === 'payments') {
    return <PaymentHistory user={getSubViewUser()} onBack={() => setActiveView('main')} />
  }
  if (activeView === 'deliveries') {
    return (
      <>
        <DeliveryLogs 
          user={getSubViewUser()} 
          onBack={() => setActiveView('main')}
          onViewRoute={(deliveryId) => setRouteModalDeliveryId(deliveryId)}
        />
        <RouteDetailsModal 
          isOpen={!!routeModalDeliveryId} 
          onClose={() => setRouteModalDeliveryId(null)} 
          deliveryId={routeModalDeliveryId || ''} 
        />
      </>
    )
  }
  if (activeView === 'permissions') {
    return <ManagePermissions user={getSubViewUser()} onBack={() => setActiveView('main')} />
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      
      <AddAdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchUsers}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>User Management</h1>
          <p className="text-gray-500 mt-1">View, edit, and manage user access and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportUsers}
            disabled={isExporting}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? "Exporting..." : "Export Data"}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-orange-500 transition cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Mgr</option>
              <option value="vendor">Vendor</option>
              <option value="retailer">Retailer</option>
              <option value="supplier">Supplier</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
              <p className="text-sm text-gray-500 font-medium">Loading users...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchUsers} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Retry</button>
            </div>
          ) : users.length === 0 ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-gray-500">
              <p>No users found matching your criteria.</p>
            </div>
          ) : null}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</span>
                      <span className="text-sm text-gray-500">{user.email || 'No email'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{user.role || 'User'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!user.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-red-200 text-red-600 bg-red-50">
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200 text-emerald-600 bg-emerald-50">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">${(user.walletBalance || 0).toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{user.rewardPoints || 0} pts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === user._id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 flex flex-col items-start text-left"
                      >
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 w-full mb-1">
                          User Actions
                        </div>
                        <button 
                          onClick={() => { setActiveView('orders'); setActiveUserForView(user); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <History size={16} className="text-gray-400" />
                          Order History
                        </button>
                        <button 
                          onClick={() => { setActiveView('payments'); setActiveUserForView(user); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <CreditCard size={16} className="text-gray-400" />
                          Payment History
                        </button>
                        <button 
                          onClick={() => { setActiveView('deliveries'); setActiveUserForView(user); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <Truck size={16} className="text-gray-400" />
                          Delivery Logs
                        </button>
                        <button 
                          onClick={() => { setActiveView('permissions'); setActiveUserForView(user); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition text-left"
                        >
                          <Shield size={16} className="text-gray-400" />
                          Manage Permissions
                        </button>
                        <button 
                          onClick={() => handleBlockUser(user._id, user.isActive)}
                          disabled={actionLoading === user._id}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition text-left mt-1 border-t border-gray-50 pt-3 disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <Loader2 size={16} className="text-red-600 animate-spin" />
                          ) : (
                            <Ban size={16} className="text-red-600" />
                          )}
                          {!user.isActive ? 'Unblock Access' : 'Block Access'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
