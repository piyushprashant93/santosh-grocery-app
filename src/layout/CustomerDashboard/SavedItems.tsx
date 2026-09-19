import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Heart,
  ShoppingBag,
  Loader2,
  PackageX,
  AlertTriangle,
} from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";
import CartModal from "./CartModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

interface ProductApi {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  images: string[];
  primaryImage: string | null;
  basePrice: number;
  discountPrice: number;
  salePrice?: number;
  originalPrice?: number;
  discount?: number;
  stockStatus: string;
  inStock?: boolean;
  rating: {
    average: number;
    count: number;
  };
}

interface WishlistItem {
  _id: string;
  itemType: string;
  addedAt: string;
  product: ProductApi | null;
  restaurant: any;
}

export default function SavedItems() {
  const { formatPrice } = useCurrency();
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const getToken = () =>
    (typeof window !== "undefined" && localStorage.getItem("authToken")) || "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // ---------- GET wishlist ----------
  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/wishlist`, {
        method: "GET",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to fetch saved items");
      }

      setItems(data?.data?.wishlist?.items || []);
    } catch (err: any) {
      setError(
        err.message || "Something went wrong while fetching saved items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ---------- DELETE single item ----------
  const removeItem = async (wishlistItemId: string) => {
    setRemovingId(wishlistItemId);
    try {
      const res = await fetch(`${BASE_URL}/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to remove item");
      }

      setItems((prev) => prev.filter((item) => item._id !== wishlistItemId));
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  // ---------- DELETE clear all ----------
  const clearAll = async () => {
    setClearing(true);
    try {
      const res = await fetch(`${BASE_URL}/wishlist/clear`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to clear wishlist");
      }

      setItems([]);
      setShowClearConfirm(false);
    } catch (err: any) {
      setError(err.message || "Failed to clear wishlist");
    } finally {
      setClearing(false);
    }
  };

  // ---------- POST add to cart ----------
  const addToCart = async (productId: string) => {
    const token = getToken();
    if (!token) {
      setError("Please login to add items to your cart.");
      return;
    }

    setAddingToCartId(productId);
    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          itemType: "product",
          itemId: productId,
          quantity: 1,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to add to cart.");
      }

      setSelectedProductId(productId);
      setOpenCart(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong adding to cart.");
    } finally {
      setAddingToCartId(null);
    }
  };

  const validItems = items.filter((item) => item.product !== null);
  const unavailableCount = items.length - validItems.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="lg:text-[34px] text-[24px] font-playfair font-medium text-theme-text dark:text-theme-text">
            Saved Items
          </h1>

          <p className="text-theme-muted dark:text-theme-muted mt-1 lg:text-lg text-base">
            Keep track of products you love.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={clearing}
              className="flex items-center gap-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg w-fit lg:rounded-xl px-4 py-2 bg-theme-surface dark:bg-theme-bg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
            >
              {clearing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Clear All
            </button>
          )}

          <button onClick={()=>navigate("/customer/dashboard")} className="flex items-center gap-2 border border-theme-border dark:border-theme-border rounded-lg w-fit lg:rounded-xl px-4 py-2 bg-theme-surface dark:bg-theme-bg dark:text-theme-text shadow-sm">
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
        </div>
      </div>

      {/* error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* stale/unavailable items notice */}
      {/* {!loading && unavailableCount > 0 && (
        <div className="bg-[#FFF7ED] border border-[#FDBA74] text-[#9A3412] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          {unavailableCount} saved item{unavailableCount > 1 ? "s are" : " is"}{" "}
          no longer available and won't be shown below.
        </div>
      )} */}

      {/* clear all confirm popover/banner */}
      {showClearConfirm && (
        <div className="bg-[#FFF7ED] border border-[#FDBA74] rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-theme-text">
            Are you sure you want to remove all saved items? This cannot be
            undone.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-sm rounded-lg border border-theme-border bg-theme-surface"
            >
              Cancel
            </button>
            <button
              onClick={clearAll}
              disabled={clearing}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white disabled:opacity-60"
            >
              {clearing ? "Clearing..." : "Yes, Clear All"}
            </button>
          </div>
        </div>
      )}

      {/* loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#009966]" />
        </div>
      )}

      {/* empty state */}
      {!loading && items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <PackageX size={40} className="text-[#99A1AF]" />
          <h3 className="text-lg font-playfair text-theme-text dark:text-theme-text">
            No saved items yet
          </h3>
          <p className="text-theme-muted dark:text-theme-muted text-sm">
            Items you save will show up here.
          </p>
        </div>
      )}

      {/* all items stale, none renderable */}
      {!loading && items.length > 0 && validItems.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <PackageX size={40} className="text-[#99A1AF]" />
          <h3 className="text-lg font-playfair text-theme-text dark:text-theme-text">
            These items are no longer available
          </h3>
          <p className="text-theme-muted dark:text-theme-muted text-sm">
            Clear your saved list and start fresh.
          </p>
        </div>
      )}

      {/* items grid */}
      {!loading && validItems.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validItems.map((item) => {
            const product = item.product as ProductApi;

            const img = product.primaryImage || product.images?.[0];
            const averageRating = product.rating?.average ?? 0;
            const ratingCount = product.rating?.count ?? 0;

            const basePrice = product.basePrice ?? 0;
            const discountPrice = product.discountPrice ?? basePrice;
            const hasDiscount = discountPrice < basePrice;

            const isLowStock = product.stockStatus === "Low Stock";
            const isOutOfStock =
              product.inStock === false || product.stockStatus === "Out of Stock";
            const stockLabel = isOutOfStock
              ? "Out of Stock"
              : product.stockStatus === "Active"
                ? "In Stock"
                : product.stockStatus || "In Stock";

            const isRemoving = removingId === item._id;
            const isAddingToCart = addingToCartId === product._id;

            return (
              <div
                key={item._id}
                className="border border-theme-border dark:border-theme-border rounded-lg lg:rounded-xl bg-theme-surface dark:bg-theme-surface shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] overflow-hidden flex flex-col"
              >
                <div className="relative">
                  {img ? (
                    <img src={img} className="w-full h-52 object-cover" />
                  ) : (
                    <div className="w-full h-52 bg-[#F1F5F9] dark:bg-theme-bg flex items-center text-xs justify-center text-[#99A1AF]">
                      No image available
                    </div>
                  )}

                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount ? `${product.discount}% OFF` : "SALE"}
                    </span>
                  )}

                  <button
                    onClick={() => removeItem(item._id)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 w-8 h-8 bg-theme-surface dark:bg-theme-bg dark:text-theme-text rounded-full flex items-center justify-center shadow disabled:opacity-60"
                  >
                    {isRemoving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>

                <div className="lg:p-5 p-2 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="font-playfair text-lg text-theme-text dark:text-theme-text">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-theme-muted uppercase mt-0.5">
                        {product.category}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#009966] text-xl font-bold">
                      {formatPrice(discountPrice)}
                    </span>

                    {hasDiscount && (
                      <span className="text-[#99A1AF] line-through">
                        {formatPrice(basePrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`px-3 py-1 font-semibold text-sm rounded-full ${
                        isOutOfStock
                          ? "bg-[#FEF2F2] dark:bg-red-900/30 text-[#DC2626] dark:text-red-400"
                          : isLowStock
                            ? "bg-[#FFF7ED] dark:bg-orange-900/30 text-[#F54900] dark:text-orange-400"
                            : "bg-[#ECFDF5] dark:bg-green-900/30 text-[#009966] dark:text-[#00b377]"
                      }`}
                    >
                      {stockLabel}
                    </span>

                    <span className="flex items-center gap-1 text-[#F0B100]">
                      <Heart size={14} className="fill-[#F0B100]" />
                      <span>
                        {averageRating} ({ratingCount})
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={isAddingToCart || isOutOfStock}
                    className="mt-auto flex items-center justify-center gap-2 bg-[#009966] text-white py-3 rounded-lg shadow-sm disabled:opacity-60"
                  >
                    {isAddingToCart ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isOutOfStock ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CartModal
        selectedProduct={selectedProductId || undefined}
        open={openCart}
        onClose={() => setOpenCart(false)}
      />
    </div>
  );
}