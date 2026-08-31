import {
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Share2,
  Info,
  Loader2,
  AlertCircle,
  MessageCircle,
  Facebook,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CartModal from "./CartModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1553621042-f6e147245754";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
originalPrice: number;
salePrice: number;
discount: number;
inStock: boolean;
reviews: any[];
relatedProducts: Product[];
  unit: string;
  shippingClass: string;
  isFreeShipping: boolean;
  stockQuantity: number;
  lowStockAlert: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating: { average: number; count: number };
  retailer: {
    fullName: string;
  };
}

interface Review {
  _id: string;
  user?: { _id: string; fullName?: string; firstName?: string; lastName?: string; avatar?: string };
  rating: number;
  comment: string;
  helpfulCount?: number;
  reply?: string;
  createdAt: string;
}

export default function ProductDetails({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [openCart, setOpenCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([
    FALLBACK_IMG,
    FALLBACK_IMG,
    FALLBACK_IMG,
  ]);
  const [activeImg, setActiveImg] = useState(FALLBACK_IMG);
  const [qty, setQty] = useState(1);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = product
    ? `Check out ${product.name} on HubNepa!`
    : "Check out this product on HubNepa!";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const shareMore = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }

    setCartLoading(true);
    setCartError(null);

    try {
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType: "product",
          itemId: product._id,
          quantity: qty,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to add to cart.");
      }

      setOpenCart(true);
    } catch (err: any) {
      setCartError(err.message || "Something went wrong.");
      alert(err.message || "Something went wrong.");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("No product selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Failed to load product.");
        }

        const fetchedProduct: Product = data?.data?.product;
        setProduct(fetchedProduct);

        const productImages = fetchedProduct?.images?.length
          ? fetchedProduct.images
          : [FALLBACK_IMG, FALLBACK_IMG, FALLBACK_IMG];

        setImages(productImages);
        setActiveImg(productImages[0]);
        setQty(1);
      } catch (err: any) {
        setError(err.message || "Something went wrong loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const fetchReviews = async (page: number, append: boolean = false) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/product/${productId}?page=${page}`, {
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newReviews = data.data?.reviews || data.data?.data || [];
        setReviews(prev => append ? [...prev, ...newReviews] : newReviews);
        setHasMoreReviews(data.data?.pagination?.hasNextPage || false);
        setReviewsPage(page);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [productId]);

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to write a review.");
      return;
    }
    
    if (reviewRating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType: "product",
          targetId: productId,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }
      setShowReviewModal(false);
      setReviewComment("");
      setReviewRating(0);
      fetchReviews(1); // Refresh reviews
      alert("Review submitted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to mark as helpful.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}/helpful`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    setWishlistError(null);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setWishlistError("Please login to add items to your wishlist.");

      setTimeout(() => {
        setWishlistError(null);
      }, 3000);

      return;
    }

    setWishlistLoading(true);

    try {
      const res = await fetch(`${API_BASE}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType: "product",
          itemId: product._id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to add to wishlist.");
      }

      setIsWishlisted(true);
      setWishlistError(null);
    } catch (err: any) {
      setWishlistError(err.message || "Something went wrong.");

      setTimeout(() => {
        setWishlistError(null);
      }, 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-[#009966]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-red-500">{error || "Product not found."}</p>
        <button
          onClick={() => navigate("/customer/dashboard")}
          className="mt-2 text-[#009966] font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

const hasDiscount = product.salePrice < product.originalPrice;
const total = (product.salePrice * qty).toFixed(2);
const isOutOfStock = !product.inStock;

  return (
    <div className="">
      <button
        onClick={() => navigate("/customer/dashboard")}
        className="mb-3 text-[#6A7282]"
      >
        ← Back to Dashboard
      </button>
      {wishlistError && (
        <div className="flex items-center gap-2 w-full rounded-lg border-red-500 bg-red-200 p-3">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-500">{wishlistError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 pt-3">
        <div>
          <div className="relative">
            <img
              src={activeImg}
              className="w-full aspect-square rounded-2xl object-cover"
            />

            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-[#009966] text-white text-xs px-3 py-1 rounded-full">
                New Arrival
              </span>
            )}

            <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow disabled:opacity-60"
            >
              <Heart
                size={18}
                className={isWishlisted ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImg(img)}
                className={`aspect-square rounded-lg object-cover cursor-pointer border ${
                  activeImg === img ? "border-[#009966]" : "border-[#E5E7EB]"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star size={16} fill="#F59E0B" />
              {product.rating?.average || 0}
            </div>

            <span className="text-[#6A7282] list-disc list-item ml-0">
              {product.rating?.count || 0} Reviews
            </span>

            <span
              className={
                isOutOfStock
                  ? "text-red-500 list-disc list-item ml-0"
                  : "text-[#009966] list-disc list-item ml-0"
              }
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          <h1 className="lg:text-[40px] text-[32px] font-playfair mb-6">
            {product.name}
          </h1>

          <p className="lg:text-[32px] text-xl text-[#101828] mb-4">
           ${product.salePrice.toFixed(2)}

{hasDiscount && (
  <span className="text-[#99A1AF] line-through text-lg ml-3">
    ${product.originalPrice.toFixed(2)}
  </span>
)}

{product.discount > 0 && (
  <span className="ml-3 text-[#009966] text-base font-medium">
    {product.discount}% OFF
  </span>
)}
          </p>

          <p className="text-[#6A7282] lg:text-[20px] text-base leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-16">
            <div className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg lg:rounded-xl xl:p-5 p-2 flex gap-3 sm:flex-row flex-col">
              <ShoppingBag className="text-[#009966] min-w-4" />
<div>
  <p className="font-medium">Availability</p>
  <p className="text-sm text-[#6A7282]">
    {product.stockQuantity} items available in stock.
  </p>
</div>
            </div>

            <div className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg lg:rounded-xl xl:p-5 p-2 flex gap-3 sm:flex-row flex-col">
              <Truck className="text-[#2563EB] min-w-4" />

              <div>
                <p className="font-medium">
  {product.isFreeShipping ? "Free Delivery" : product.shippingClass}
</p>

<p className="text-sm text-[#6A7282]">
 {product.isFreeShipping ? "Eligible for free shipping" : "Shipping charges apply at checkout"}
</p>
              </div>
            </div>
          </div>

         <div className="flex gap-4 mb-6 sm:flex-row flex-col">
  <div
    className={`flex items-center justify-center border rounded-lg ${
      isOutOfStock
        ? "border-[#E5E7EB] opacity-50 pointer-events-none"
        : "border-[#E5E7EB]"
    }`}
  >
    <button
      onClick={() => setQty(Math.max(1, qty - 1))}
      disabled={isOutOfStock}
      className="px-4 py-5 disabled:cursor-not-allowed"
    >
      <Minus size={16} />
    </button>

    <span className="text-center w-[50px]">{qty}</span>

    <button
      onClick={() => setQty(qty + 1)}
      disabled={isOutOfStock}
      className="px-4 py-5 disabled:cursor-not-allowed"
    >
      <Plus size={16} />
    </button>
  </div>

  <button
    onClick={handleAddToCart}
    disabled={cartLoading || isOutOfStock}
    className="flex-1 bg-[#009966] text-white rounded-lg px-3 flex items-center justify-center gap-2 py-4 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
  >
    <ShoppingBag size={18} />
    {cartLoading
      ? "Adding..."
      : isOutOfStock
      ? "Out of Stock"
      : `Add to Cart — $${total}`}
  </button>
</div>
            <CartModal
              setActiveTab={setActiveTab}
              selectedProduct={product._id}
              open={openCart}
              onClose={() => setOpenCart(false)}
            />

          <div className="flex gap-6 text-[#6A7282]">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2"
            >
              <Share2 size={18} />
              Share Product
            </button>

            <button
              onClick={() => setShowQuestionModal(true)}
              className="flex items-center gap-2"
            >
              <Info size={18} />
              Ask a Question
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16 max-w-4xl">
        <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
          <h2 className="text-2xl font-playfair font-medium text-[#0F172A]">Customer Reviews</h2>
          <button 
            onClick={() => {
              if(!localStorage.getItem("authToken")) {
                navigate("/role-wise-sign-in?role=customer");
              } else {
                setShowReviewModal(true);
              }
            }}
            className="bg-[#0F172A] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1E293B]"
          >
            Write a Review
          </button>
        </div>

        {reviewsLoading && reviews.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#009966]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-[#6A7282]">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const name = review.user?.fullName || (review.user?.firstName ? `${review.user.firstName} ${review.user.lastName || ""}` : "Anonymous User");
              return (
                <div key={review._id} className="border-b border-[#E5E7EB] pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-[#0F172A]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">{name}</p>
                        <p className="text-xs text-[#99A1AF]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-[#F59E0B]" : "text-[#E5E7EB]"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#6A7282] text-sm mt-3 leading-relaxed">{review.comment}</p>
                  
                  {review.reply && (
                    <div className="mt-4 bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                      <p className="text-xs font-bold text-[#0F172A] mb-1">Response from Seller</p>
                      <p className="text-sm text-[#6A7282]">{review.reply}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4">
                    <button 
                      onClick={() => handleMarkHelpful(review._id)}
                      className="text-xs text-[#6A7282] flex items-center gap-1 hover:text-[#009966]"
                    >
                      <Plus size={12} />
                      Helpful ({review.helpfulCount || 0})
                    </button>
                  </div>
                </div>
              );
            })}
            
            {hasMoreReviews && (
              <div className="text-center pt-4">
                <button 
                  onClick={() => fetchReviews(reviewsPage + 1, true)}
                  disabled={reviewsLoading}
                  className="text-sm text-[#009966] font-medium border border-[#009966] rounded-lg px-6 py-2 hover:bg-[#009966] hover:text-white transition"
                >
                  {reviewsLoading ? "Loading..." : "Load More Reviews"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {showQuestionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowQuestionModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-lg w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] p-5">
              <div>
                <h3 className="font-playfair text-2xl text-white">
                  Ask a Question
                </h3>

                <p className="text-sm text-[#94A3B8] mt-1">
                  Ask anything about this product.
                </p>
              </div>

              <button
                onClick={() => setShowQuestionModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#1E293B] flex items-center justify-center text-[#94A3B8]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm font-medium text-white mb-3">
                Frequently Asked
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  "Is this product fresh?",
                  "What is the delivery time?",
                  "Is cash on delivery available?",
                  "Do you offer bulk discounts?",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuestion(item)}
                    className="px-4 py-2 rounded-full border border-[#1E293B] text-sm text-[#CBD5E1] hover:bg-[#1E293B]"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="text-sm font-medium text-white">
                Your Question
              </label>

              <textarea
                rows={5}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write your question..."
                className="mt-2 w-full bg-[#020618] border border-[#1E293B] rounded-xl p-4 text-white placeholder:text-[#64748B] resize-none outline-none focus:border-[#009966]"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="px-5 py-2 border border-[#1E293B] text-[#CBD5E1] rounded-lg hover:bg-[#1E293B]"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    alert("Question submitted successfully!");
                    setQuestion("");
                    setShowQuestionModal(false);
                  }}
                  disabled={!question.trim()}
                  className="px-6 py-2 bg-[#009966] hover:bg-[#00b377] text-white rounded-lg disabled:opacity-50"
                >
                  Submit Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-sm w-full"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
              <h3 className="font-playfair text-xl font-semibold text-white">
                Share {product?.name}
              </h3>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E293B] text-[#94A3B8]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${shareText} ${shareUrl}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#1E293B] hover:bg-[#1E293B]"
              >
                <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <MessageCircle size={18} className="text-[#25D366]" />
                </div>
                <span className="text-xs text-[#CBD5E1]">WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#1E293B] hover:bg-[#1E293B]"
              >
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <Facebook size={18} className="text-[#1877F2]" />
                </div>
                <span className="text-xs text-[#CBD5E1]">Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareText,
                )}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#1E293B] hover:bg-[#1E293B]"
              >
                <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center">
                  <Twitter size={18} className="text-white" />
                </div>
                <span className="text-xs text-[#CBD5E1]">X / Twitter</span>
              </a>

              <button
                onClick={shareMore}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#1E293B] hover:bg-[#1E293B]"
              >
                <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center">
                  <Share2 size={18} className="text-[#CBD5E1]" />
                </div>
                <span className="text-xs text-[#CBD5E1]">More</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-semibold text-[#0F172A]">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-[#6A7282] hover:bg-gray-100 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewRating(star)}>
                    <Star size={28} className={star <= reviewRating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#E5E7EB]"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Your Review</label>
              <textarea 
                rows={4}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="What did you like or dislike? What is this product best for?"
                className="w-full border border-[#E5E7EB] rounded-lg p-3 text-sm outline-none focus:border-[#009966] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 border border-[#E5E7EB] text-[#6A7282] rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="px-5 py-2 bg-[#009966] text-white rounded-lg font-medium disabled:opacity-60 flex items-center gap-2"
              >
                {submittingReview ? <Loader2 size={16} className="animate-spin" /> : null}
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
