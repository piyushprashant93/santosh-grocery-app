import { Search, Filter, Download, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

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
      const res = await fetch(`${API_BASE}/supplier/products`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProductsData(data.data?.products || data.products || data.data || []);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    } catch(err) { console.error(err); }
  };

  const statusStyles: any = {
    "In Stock": "bg-green-100 text-green-700",
    "Low Stock": "bg-red-100 text-red-600"
  }

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

          <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Download size={16} />
            Import CSV
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
            <input placeholder="Search by name, SKU, or category..." className="w-full px-3 py-2 outline-none text-sm" />
          </div>

          {["Category: All", "Status: Active", "Stock: Any"].map((f, i) => (
            <button key={i} className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 text-sm flex items-center gap-2">
              <Filter size={14} />
              {f}
            </button>
          ))}

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

              {productsData.length > 0 ? productsData.map((p, i) => (
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
                      <p className="text-sm text-[#64748B]">{p.sku || p.barcode || p._id?.substring(0,8)}</p>
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

                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[p.status || "In Stock"] || "bg-gray-100"}`}>
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