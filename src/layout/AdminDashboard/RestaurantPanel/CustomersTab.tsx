import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import api from "../../../lib/api"

export default function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/partners/restaurants');
        const partners = res.data?.data?.data || res.data?.data || res.data || [];
        const id = Array.isArray(partners) && partners.length > 0 ? (partners[0]._id || partners[0].id) : null;
        if (id) {
          const customersRes = await api.get(`/admin/partners/restaurants/${id}/customers`);
          const rawData = customersRes.data?.data?.data || customersRes.data?.data || customersRes.data || [];
          setCustomers(rawData.map((c: any) => ({
            id: c._id || c.id || 'CUST-000',
            name: c.fullName || c.firstName || c.name || 'Unknown Customer',
            email: c.email || 'N/A',
            phone: c.phone || 'N/A',
            orders: c.orderCount || c.orders || 0,
            spent: `$${(c.totalSpent || 0).toFixed(2)}`
          })));
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input 
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-theme-text">{c.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-theme-text">{c.email}</p>
                    <p className="text-xs text-gray-500">{c.phone}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{c.orders} orders</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-theme-text">{c.spent}</span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
