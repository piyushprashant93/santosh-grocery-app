import { useState, useEffect } from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import { apiFetch } from "../../../lib/apiFetch";
import { Loader2, Search } from "lucide-react";

export default function ProductCatalogTab() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCatalog();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) fetchCatalog();
      else setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: page.toString(), limit: "10", ...(search && { search }) });
      const res = await apiFetch(`/admin/supplier-panel/catalog?${query}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data?.data || []);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch product catalog", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-text">Product Catalog</h2>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full shrink-0">
          View Only - Admin Access
        </span>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search catalog..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
        />
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Image</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">SKU</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Product Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Category</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Stock</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Price / MOQ</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-2 px-4">
                    <img src={product.image || product.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-theme-text whitespace-nowrap">{product.sku || product._id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.stock || 0}</td>
                  <td className="py-4 px-4 text-sm font-medium text-theme-text">
                    {formatPrice(product.price || product.basePrice)}
                    <span className="text-gray-500 font-normal text-xs ml-1">(MOQ: {product.moq || 1})</span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Active' || product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Prev
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
