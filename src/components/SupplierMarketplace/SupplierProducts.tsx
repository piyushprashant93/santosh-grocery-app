import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Plus, PackageOpen } from "lucide-react";

export default function SupplierProducts({
  role,
  supplierId,
  onBack,
  onGoToCart,
}: {
  role: "retailer" | "restaurant-panel";
  supplierId: string;
  onBack: () => void;
  onGoToCart: () => void;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [supplierName, setSupplierName] = useState("Supplier");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/suppliers/${supplierId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success && data.data) {
           setProducts(data.data.products || data.data);
           if (data.data.supplier) setSupplierName(data.data.supplier.name);
        } else if (Array.isArray(data)) {
           setProducts(data);
        } else if (data.products) {
           setProducts(data.products);
           if (data.supplier) setSupplierName(data.supplier.name);
        }
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [role, supplierId]);

  const handleAddToCart = async (product: any) => {
    try {
      setAddingToCart(product._id || product.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/supply-cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id || product.id,
          quantity: 1, 
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Added to supply cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
     <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{supplierName} Products</h1>
        </div>
        <button
          onClick={onGoToCart}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-sm"
        >
          <ShoppingCart size={18} />
          <span>Supply Cart</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-500 shadow-sm">
           <PackageOpen size={48} className="text-gray-300 mb-4" />
           <p className="text-lg font-medium">No bulk products available from this supplier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
             <div key={product._id || product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="h-48 bg-gray-50 relative border-b border-gray-100">
                   {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <PackageOpen size={40} />
                     </div>
                   )}
                   {product.bulkTierPricing && (
                      <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                         Bulk Pricing Available
                      </div>
                   )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                   <h3 className="font-semibold text-lg text-gray-800 mb-2">{product.name}</h3>
                   <div className="mb-4">
                     <span className="text-2xl font-bold text-gray-900">${product.price || product.basePrice || 0}</span>
                     {product.unit && <span className="text-gray-500 text-sm ml-1">/ {product.unit}</span>}
                   </div>
                   
                   <p className="text-sm text-gray-600 mb-6 line-clamp-2">{product.description || "High quality bulk product for wholesale."}</p>

                   <button
                     onClick={() => handleAddToCart(product)}
                     disabled={addingToCart === (product._id || product.id)}
                     className="mt-auto w-full py-2.5 rounded-lg border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {addingToCart === (product._id || product.id) ? (
                        <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                        <>
                          <Plus size={18} />
                          Add to Supply Cart
                        </>
                     )}
                   </button>
                </div>
             </div>
          ))}
        </div>
      )}
     </div>
  );
}
