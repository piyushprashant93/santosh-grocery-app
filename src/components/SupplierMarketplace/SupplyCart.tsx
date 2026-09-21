import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, ShoppingBag } from "lucide-react";
import { getImageUrl } from "../../utils/dataHelper";
import { useCurrency } from "../../context/CurrencyContext";



export default function SupplyCart({
  role,
  onBack,
}: {
  role: "retailer" | "restaurant-panel";
  onBack: () => void;
}) {
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/supply-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
      } else if (data.items) {
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setProcessing(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/supply-cart/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (res.ok) {
        await fetchCart();
      } else {
        alert("Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/supply-cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchCart();
      } else {
        alert("Failed to remove item");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your supply cart?")) return;
    try {
      setProcessing(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/supply-cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchCart();
      } else {
        alert("Failed to clear cart");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/${role}/supplier-marketplace/supply-cart/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok || data.success) {
        alert("Purchase successful! Your wholesale order has been placed.");
        setCart(null);
        onBack();
      } else {
        alert(data.message || "Checkout failed. Please check stock and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cart?.subtotal || cart?.items?.reduce((acc: number, item: any) => acc + (item.price || item.product?.price || 0) * (item.quantity || 1), 0) || 0;
  const total = cart?.total || subtotal;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-theme-text">Supply Cart</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="bg-theme-surface rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-500 shadow-sm">
           <ShoppingBag size={48} className="text-gray-300 mb-4" />
           <p className="text-lg font-medium">Your supply cart is empty.</p>
           <button onClick={onBack} className="mt-6 px-6 py-2.5 bg-orange-600 text-theme-text rounded-lg hover:bg-orange-700 transition shadow-md shadow-orange-200">
              Browse Suppliers
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
           <div className={`col-span-1 lg:col-span-2 space-y-4 ${processing ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-theme-text">Items ({cart.items.length})</h2>
               <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium transition">
                 Clear Cart
               </button>
             </div>
             
             {cart.items.map((item: any) => (
                <div key={item._id || item.id} className="bg-theme-surface rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                      {item.product?.image ? (
                        <img src={getImageUrl(item.product.image)} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-300" />
                      )}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <h3 className="font-semibold text-theme-text truncate">{item.product?.name || "Product Name"}</h3>
                     <p className="text-sm text-gray-500 mb-2">{item.product?.supplier?.name || "Supplier"}</p>
                     <div className="text-orange-600 font-bold">${item.price || item.product?.price || 0} <span className="text-gray-400 text-xs font-normal">/ unit</span></div>
                   </div>

                   <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)} className="p-2 hover:bg-gray-200 text-gray-600 transition">
                           <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium text-theme-text">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)} className="p-2 hover:bg-gray-200 text-gray-600 transition">
                           <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="font-bold text-theme-text w-20 text-right">
                         ${((item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>

                      <button onClick={() => removeItem(item._id || item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition ml-2">
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
             ))}
           </div>

           <div className="col-span-1">
             <div className="bg-theme-surface rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6">
                <h2 className="text-lg font-semibold text-theme-text mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                   </div>
                   {cart.discount && cart.discount > 0 ? (
                   <div className="flex justify-between text-gray-600">
                      <span>Bulk Discount</span>
                      <span className="text-green-600">-{formatPrice(cart.discount)}</span>
                   </div>
                   ) : null}
                   {cart.tax && cart.tax > 0 ? (
                   <div className="flex justify-between text-gray-600">
                      <span>Taxes & Fees</span>
                      <span>{formatPrice(cart.tax)}</span>
                   </div>
                   ) : null}
                   
                   <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold text-xl text-theme-text">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                   </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing || cart.items.length === 0}
                  className="w-full py-3.5 rounded-xl bg-orange-600 text-theme-text font-semibold text-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200"
                >
                   {processing ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <CreditCard size={20} />
                       Checkout & Purchase
                     </>
                   )}
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
