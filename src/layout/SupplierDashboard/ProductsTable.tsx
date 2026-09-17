import { Search, Download, Plus, Trash2, Upload } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useDebounce } from "use-debounce"
import toast from "react-hot-toast"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const authHeadersForm = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function ProductsTable({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (categoryFilter !== "All") queryParams.append("category", categoryFilter);
      if (statusFilter !== "All") queryParams.append("status", statusFilter);

      const res = await fetch(`${API_BASE}/supplier/products?${queryParams.toString()}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const prods = data.data?.products || data.products || (Array.isArray(data.data) ? data.data : []);
        setProductsData(Array.isArray(prods) ? prods : []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, categoryFilter, statusFilter]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/supplier/products/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) { console.error(err); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const toastId = toast.loading("Importing products...");
      const res = await fetch(`${API_BASE}/supplier/products/import`, {
        method: "POST",
        headers: authHeadersForm(),
        body: formData
      });

      if (res.ok) {
        toast.success("Products imported successfully", { id: toastId });
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to import products", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during import");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Exporting products...");
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (categoryFilter !== "All") queryParams.append("category", categoryFilter);
      if (statusFilter !== "All") queryParams.append("status", statusFilter);

      const res = await fetch(`${API_BASE}/supplier/products/export?${queryParams.toString()}`, { headers: authHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products_export.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Export successful", { id: toastId });
      } else {
        toast.error("Export failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  const statusStyles: any = {
    "In Stock": "bg-green-100 text-green-700",
    "Low Stock": "bg-red-100 text-red-600",
    "Out of Stock": "bg-gray-100 text-gray-600"
  }

  const categories = ["All", "Fresh Produce", "Meat & Poultry", "Seafood", "Dairy", "Grains", "Oils", "Packaging", "Beverages", "Other"];

  const filteredProducts = productsData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
            Product Catalog
          </h1>
          <p className="text-[#64748B] mt-2">
            Manage your bulk inventory and pricing tiers.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button onClick={() => fileInputRef.current?.click()} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Upload size={16} />
            Import CSV
          </button>
          <button onClick={handleExport} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Download size={16} />
            Export
          </button>

          <button onClick={() => setActiveTab("add-product")} className="bg-[#155DFC] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 flex-1">
            <Search size={18} className="text-[#64748B]" />
            <input
              placeholder="Search by name, SKU, or category..."
              className="w-full px-3 py-2 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 text-sm outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c, i) => <option key={i} value={c}>Category: {c}</option>)}
          </select>

          <select
            className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 text-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b text-[#64748B] text-sm">
              <tr>
                <th className="py-3">PRODUCT</th>
                <th className="py-3">SKU / UNIT</th>
                <th className="py-3">BASE PRICE</th>
                <th className="py-3">BULK TIERS</th>
                <th className="py-3">STOCK</th>
                <th className="py-3">STATUS</th>
                <th className="py-3">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? filteredProducts.map((p, i) => (
                <tr key={p._id || i} className="border-b last:border-none">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <img src={p.img || p.image || p.imageUrl || "https://picsum.photos/60?1"} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-[#111827]">{p.name || p.title}</p>
                        <p className="text-sm text-[#64748B]">{p.category?.name || p.category || "General"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5">
                    <div>
                      <p className="text-[#111827]">{p.unit || p.quantityUnit || "Unit"}</p>
                      <p className="text-sm text-[#64748B]">{p.sku || p.barcode || p._id?.substring(0, 8)}</p>
                    </div>
                  </td>

                  <td className="py-5 font-medium">
                    ${typeof p.price === "number" ? p.price.toFixed(2) : (p.basePrice ? p.basePrice.toFixed(2) : p.price)}
                  </td>

                  <td className="py-5">
                    <div className="space-y-1">
                      {p.tiers?.map((t: any, index: number) => (
                        <div key={index} className="flex gap-2 text-sm">
                          <span className="text-[#64748B]">{t.label || `${t.minQuantity}+`}:</span>
                          <span className="text-green-600 font-medium">${typeof t.price === "number" ? t.price.toFixed(2) : t.price}</span>
                        </div>
                      )) || <span className="text-[#64748B] text-sm">No tiers</span>}
                    </div>
                  </td>

                  <td className="py-5 font-medium">
                    {p.stock || p.stockQuantity || p.quantity || 0}
                  </td>

                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[p.status || (p.stock > 0 ? "In Stock" : "Out of Stock")] || "bg-gray-100"}`}>
                      {p.status || (p.stock > 0 ? "In Stock" : "Out of Stock")}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm">
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p._id)} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
