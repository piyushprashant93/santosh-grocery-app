import { Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import EmptyTableState from "../../components/common/EmptyTableState"
import { getImageUrl } from "../../utils/dataHelper";


const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function ProductsTable({ setActiveTab }: { setActiveTab: (tab: string) => void }) {

  const [productsData, setProductsData] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/retailer/products`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const payload = data.data || data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (payload.products || []));
        setProductsData(Array.isArray(arr) ? arr : []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/retailer/products/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) fetchProducts();
    } catch(err) { console.error(err); }
  };

  const statusStyles: any = {
    Active: "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
    Inactive: "bg-gray-200 text-gray-600"
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Products
          </h1>

          <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>

        <button onClick={() => setActiveTab("addproduct")} className="bg-[#F54900] text-white rounded-lg px-5 py-2.5 shadow-sm">
          + Add New Product
        </button>

      </div>


      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center border border-theme-border rounded-lg px-3 w-full lg:w-[320px]">
            <Search size={18} className="text-theme-muted" />
            <input
              placeholder="Search products..."
              className="w-full px-3 py-2 outline-none text-sm"
            />
          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 shadow-sm bg-theme-surface">
              <Filter size={16} />
              Filters
            </button>

            <button className="flex items-center gap-2 border border-theme-border rounded-lg px-4 py-2 shadow-sm bg-theme-surface">
              <Download size={16} />
              Export
            </button>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b text-theme-muted text-sm">

              <tr>
                <th className="py-3 text-sm font-medium text-[#62748E] min-w-6">
                  <input type="checkbox" className="accent-[#F54900] cursor-pointer" />
                </th>

                <th className="py-3 text-sm font-medium text-[#62748E]">PRODUCT</th>
                <th className="py-3 text-sm font-medium text-[#62748E]">SKU</th>
                <th className="py-3 text-sm font-medium text-[#62748E]">CATEGORY</th>
                <th className="py-3 text-sm font-medium text-[#62748E]">PRICE</th>
                <th className="py-3 text-sm font-medium text-[#62748E]">STOCK</th>
                <th className="py-3 text-sm font-medium text-[#62748E]">STATUS</th>
                <th className="py-3 text-sm font-medium text-[#62748E] text-center">ACTION</th>
              </tr>

            </thead>

            <tbody>

              {productsData.map((p, i) => (
                <tr key={p._id || i} className="border-b last:border-none">

                  <td className="py-4">
                    <input type="checkbox" className="accent-[#F54900] cursor-pointer" />
                  </td>

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={getImageUrl(p.img || p.imageUrl || p.image)}
                        className="w-12 h-12 min-w-12 rounded-lg object-cover"
                      />
                      <span className="text-theme-text font-medium">
                        {p.name}
                      </span>

                    </div>

                  </td>

                  <td className="py-4 text-theme-muted">
                    {p.sku}
                  </td>

                  <td className="py-4 text-[#374151]">
                    {p.category}
                  </td>

                  <td className="py-4 font-medium">
                    ${typeof p.price === "number" ? p.price.toFixed(2) : p.price || p.basePrice || "0.00"}
                  </td>

                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-sm ${(p.stock === 0 || p.status === "Out of Stock") ? "bg-red-100 text-red-600" : (p.stock < (p.lowStock || 5) || p.status === "Low Stock") ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-[#374151]"}`}>
                      {p.stock}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[p.status || "Active"] || "bg-gray-100 text-gray-700"}`}>
                      {p.status || "Active"}
                    </span>
                  </td>

                  <td className="py-4 text-center relative group">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                    <div className="absolute right-0 mt-2 hidden group-hover:block bg-theme-surface border border-theme-border rounded-lg shadow-lg z-10 w-32">
                      <button onClick={() => deleteProduct(p._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>

                </tr>

              ))}

              {productsData.length === 0 && (
                <EmptyTableState colSpan={8} message="No products found." />
              )}

            </tbody>

          </table>

        </div>


        <div className="flex items-center justify-between mt-6 text-sm text-theme-muted">

          <p>
            Showing {productsData.length} product{productsData.length !== 1 ? 's' : ''}
          </p>

          <div className="flex gap-3">

            <button className="border border-theme-border px-4 py-1.5 rounded-lg bg-gray-100">
              Previous
            </button>

            <button className="border border-theme-border px-4 py-1.5 rounded-lg bg-theme-surface">
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}