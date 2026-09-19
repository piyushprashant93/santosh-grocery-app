import { useEffect, useState } from "react";
import { Search, ShoppingCart, Store, ChevronRight } from "lucide-react";
import { extractList } from "../../utils/dataHelper";

export default function SupplierMarketplaceList({
  role,
  onSelectSupplier,
  onGoToCart,
}: {
  role: "retailer" | "restaurant-panel";
  onSelectSupplier: (id: string) => void;
  onGoToCart: () => void;
}) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setSuppliers(extractList(data));
    } catch (err) {
      console.error("Error fetching suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [role]);

  const filteredSuppliers = suppliers.filter(s => 
    s?.name?.toLowerCase().includes(search.toLowerCase()) || 
    s?.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Marketplace</h1>
        <button
          onClick={onGoToCart}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-theme-text rounded-lg hover:bg-orange-700 transition shadow-sm"
        >
          <ShoppingCart size={18} />
          <span>Supply Cart</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search suppliers by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSuppliers.map((supplier, idx) => {
            const suppId = supplier.supplierId || supplier._id || supplier.id || supplier.userId || idx.toString();
            return (
            <div
              key={suppId}
              onClick={() => onSelectSupplier(suppId)}
              className="bg-theme-surface rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition">
                <Store size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">{supplier.name || 'Unknown Supplier'}</h3>
              <p className="text-sm text-gray-500 mb-4">{supplier.category || 'General Category'}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-medium text-orange-600">View Products</span>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition" />
              </div>
            </div>
          )})}
          {filteredSuppliers.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 bg-theme-surface rounded-xl border border-gray-100">
              No suppliers found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
