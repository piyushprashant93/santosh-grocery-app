import { useState, useEffect } from "react"
import { ShoppingBag, TrendingUp } from "lucide-react"
import api from "../../../lib/api"

export default function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/v1/admin/partners/restaurants');
        const partners = res.data?.data?.data || res.data?.data || res.data || [];
        const id = Array.isArray(partners) && partners.length > 0 ? (partners[0]._id || partners[0].id) : null;
        if (id) {
          const overviewRes = await api.get(`/api/v1/admin/partners/restaurants/${id}/overview`);
          setData(overviewRes.data?.data || overviewRes.data || null);
        }
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const newOrders: any[] = data?.newOrders || [
    { id: '#ORD-001', amount: '$45.00', status: 'Pending', time: '2 mins ago' },
    { id: '#ORD-002', amount: '$32.50', status: 'Pending', time: '5 mins ago' },
    { id: '#ORD-003', amount: '$112.00', status: 'Pending', time: '12 mins ago' }
  ];

  const topItems: any[] = data?.topItems || [
    { name: 'Spicy Chicken Wings', orders: 145, revenue: '$1,450' },
    { name: 'Classic Burger', orders: 112, revenue: '$980' },
    { name: 'Margherita Pizza', orders: 98, revenue: '$1,200' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      
      {/* New Orders */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-theme-text" />
            <h2 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>New Orders</h2>
          </div>
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700 transition">View All</button>
        </div>
        
        <div className="space-y-4">
          {newOrders.map((order, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <p className="font-bold text-theme-text">{order.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-theme-text">{order.amount}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-theme-text" />
            <h2 className="text-lg font-bold text-theme-text" style={{ fontFamily: 'serif' }}>Top Selling Items</h2>
          </div>
          <select className="bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded-lg px-3 py-1.5 focus:outline-none">
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {topItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-theme-surface border border-gray-200 flex items-center justify-center font-bold text-gray-400">
                  #{i + 1}
                </div>
                <div>
                  <p className="font-bold text-theme-text">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.orders} orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">{item.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
