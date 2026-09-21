import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { extractList } from "../../utils/dataHelper";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    // We need the restaurant ID to fetch reviews. 
    // First, let's fetch the profile to get the ID.
    const fetchProfileAndReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/restaurants/my/restaurant`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          const rId = data.data?.restaurant?._id || data.restaurant?._id;
          if (rId) {
            setRestaurantId(rId);
            const reviewsRes = await fetch(`${API_BASE}/reviews/restaurant/${rId}?page=1`, { headers: authHeaders() });
            if (reviewsRes.ok) {
              const reviewsData = await reviewsRes.json();
              setReviews(extractList(reviewsData));
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Customer Reviews
          </h1>
          <p className="text-theme-muted mt-2">
            See what customers are saying about your restaurant.
          </p>
        </div>
      </div>

      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6 shadow-sm">
        {loading ? (
          <p className="text-center text-theme-muted py-8">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <MessageSquare size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-theme-text">No reviews yet</h3>
            <p className="text-gray-500">When customers leave reviews, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6 divide-y">
            {reviews.map((r, i) => (
              <div key={r._id || i} className={i !== 0 ? "pt-6" : ""}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center font-semibold uppercase">
                      {(r.user?.name || r.userName || "C")[0]}
                    </div>
                    <div>
                      <p className="font-medium text-theme-text">{r.user?.name || r.userName || "Customer"}</p>
                      <p className="text-sm text-theme-muted">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF7ED] px-2 py-1 rounded-lg">
                    <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="font-semibold text-[#B45309]">{r.rating || 5}.0</span>
                  </div>
                </div>
                <p className="text-theme-muted mt-3">
                  {r.comment || r.reviewText || "No comment provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
