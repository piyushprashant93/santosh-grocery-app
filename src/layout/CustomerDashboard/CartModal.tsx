import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrency } from "./CurrencyContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const CART_STORAGE_KEY = "checkout_cart";
interface CartItem {
  _id: string;
  itemType: string;
  product: string | null;
  restaurant: string | null;
  menuItemId: string | null;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export default function CartModal({

  open,
  onClose,
  selectedProduct,
  setActiveTab,
}: {
  open: boolean;
  onClose: () => void;
  selectedProduct?: string;
  setActiveTab?: (tab: string) => void;
}) {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  const saveCartToStorage = (cartData: Cart | null) => {
  if (!cartData) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
};

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setUpdatingId(cartItemId);

    const previousCart = cart;

    // optimistic update
    setCart((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items.map((i) =>
        i._id === cartItemId
          ? { ...i, quantity: newQuantity, subtotal: i.price * newQuantity }
          : i,
      );
      const updatedSubtotal = updatedItems.reduce(
        (sum, i) => sum + i.subtotal,
        0,
      );
      const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      return {
        ...prev,
        items: updatedItems,
        subtotal: updatedSubtotal,
        itemCount: updatedCount,
      };
    });

    try {
      const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to update quantity.");
      }

       if (data?.data?.cart) {
        setCart(data.data.cart);
        saveCartToStorage(data.data.cart); 
      } else {
        setCart((prev) => {
          saveCartToStorage(prev);     
          return prev;
        });
      }
    } catch (err: any) {
      // revert on failure
      setCart(previousCart);
      saveCartToStorage(previousCart);  
      alert(err.message || "Something went wrong updating quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cart`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load cart.");
      }

      const fetchedCart = data?.data?.cart || null;
      setCart(fetchedCart);
      saveCartToStorage(fetchedCart);          // 👈 add
    } catch (err: any) {
      setError(err.message || "Something went wrong loading your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open]);

  const handleDeleteItem = async (cartItemId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setDeletingId(cartItemId);

    const previousCart = cart;

    // optimistic removal
    setCart((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items.filter((i) => i._id !== cartItemId);
      const updatedSubtotal = updatedItems.reduce(
        (sum, i) => sum + i.subtotal,
        0,
      );
      const updatedCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      return {
        ...prev,
        items: updatedItems,
        subtotal: updatedSubtotal,
        itemCount: updatedCount,
      };
    });

   try {
      const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to remove item.");
      }

      if (data?.data?.cart) {
        setCart(data.data.cart);
        saveCartToStorage(data.data.cart);     // 👈 add
      } else {
        setCart((prev) => {
          saveCartToStorage(prev);             // 👈 add
          return prev;
        });
      }
    } catch (err: any) {
      setCart(previousCart);
      saveCartToStorage(previousCart);         // 👈 add
      alert(err.message || "Something went wrong removing the item.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const confirmed = window.confirm("Are you sure you want to empty your cart?");
    if (!confirmed) return;

    setClearingCart(true);
    try {
      const res = await fetch(`${API_BASE}/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to clear cart.");
      }

      setCart(null);
      saveCartToStorage(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong clearing the cart.");
    } finally {
      setClearingCart(false);
    }
  };

  if (!open) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const delivery = items.length > 0 ? 0 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + delivery + tax;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center !mt-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[448px] w-[96%] max-h-[85vh] bg-[#020618] shadow-[0px_25px_50px_-12px_#000000] text-white flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 text-lg font-medium font-playfair">
            <ShoppingBag size={20} className="text-[#00BC7D]" />
            Your Cart{" "}
            <span className="text-[#62748E] text-sm">
              ({cart?.itemCount || 0})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={clearingCart}
                className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 disabled:opacity-50"
              >
                {clearingCart ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Clear All
              </button>
            )}
            <button onClick={onClose}>
              <X className="text-gray-400" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <Loader2 size={26} className="animate-spin text-[#009966]" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center py-16 px-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : items.length > 0 ? (
          <div className="flex flex-col h-full justify-between overflow-hidden">
            <div className="lg:p-5 p-3 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#0F172A] border border-[#1E293B] rounded-lg lg:rounded-xl lg:p-4 p-2 flex gap-4 items-start"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#64748B] text-xs shrink-0">
                      No Img
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-playfair text-lg text-white truncate">
                          {item.name}
                        </h3>

                        <p className="text-[#94A3B8] text-sm mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        disabled={deletingId === item._id}
                        className="text-[#94A3B8] hover:text-red-500 disabled:opacity-50 shrink-0"
                      >
                        {deletingId === item._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-[#00BC7D] font-medium">
                        {formatPrice(item.subtotal)}
                      </p>

                      <div className="flex items-center border border-[#1E293B] rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={
                            updatingId === item._id || item.quantity <= 1
                          }
                          className="px-3 py-2 text-[#94A3B8] disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-4 text-white min-w-[32px] text-center">
                          {updatingId === item._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin mx-auto"
                            />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={updatingId === item._id}
                          className="px-3 py-2 text-[#94A3B8] disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0F172A] lg:p-6 p-3 border-t border-[#1E293B]">
              <div className="space-y-3 text-[#94A3B8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(delivery)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-[#1E293B]">
                <span className="text-white text-lg">Total</span>

                <span className="text-[#00BC7D] text-xl font-playfair font-semibold">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem(
                    "checkoutSummary",
                    JSON.stringify({
                      subtotal,
                      deliveryFee: delivery,
                      tax,
                      total,
                    }),
                  );

                  navigate("/customer/dashboard/checkout");
                }}
                className="mt-6 w-full bg-[#009966] py-4 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              >
                Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6">
            <div className="w-20 h-20 rounded-full bg-[#0F172B] flex items-center justify-center mb-6">
              <ShoppingBag size={30} className="text-[#314158]" />
            </div>

            <h2 className="text-[20px] font-medium font-playfair mb-2">
              Your cart is empty
            </h2>

            <p className="text-[#62748E] max-w-[310px] mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={()=>navigate("/marketplace")}
              className="bg-[#009966] px-6 py-3 rounded-lg font-medium"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
