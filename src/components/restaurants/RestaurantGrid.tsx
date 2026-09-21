import {
  Clock,
  MapPin,
  Star,
  Filter,
  Utensils,
  Wine,
  ChefHat,
  Flame,
  X,
  ImageOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../layout/RoleProvider";
import { getImageUrl } from "../../utils/dataHelper";
import { useCurrency } from "../../context/CurrencyContext";



const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
// const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80";
const restaurantTypes = ["Premium", "Luxury", "Signature", "Elite"];

const defaultCuisines = [
  { name: "All Cuisines", Icon: Utensils },
  { name: "Fine Dining", Icon: ChefHat },
  { name: "Japanese", Icon: Star },
  { name: "Italian", Icon: Wine },
  { name: "American", Icon: Flame },
];

const cuisineIconMap: Record<string, React.ElementType> = {
  "Fine Dining": ChefHat,
  "Japanese": Star,
  "Italian": Wine,
  "American": Flame,
  "Indian": Flame,
  "Chinese": Star,
  "Thai": Flame,
  "Mexican": Flame,
  "Mediterranean": Wine,
  "Korean": Star,
};

interface RestaurantApi {
  _id: string;
  slug: string;
  name: string;
  cuisine?: string[];
  tags?: string[];
  minimumOrder?: number;
  deliveryTime?: {
    min: number;
    max: number;
  };
  distanceInMiles?: number;
  rating?: {
    average?: number;
    count?: number;
  };
  reviewCount?: number;
  deliveryFee?: number;
  banner?: string;
  logo?: string;
  isExclusivePartner?: boolean;
  isOpen?: boolean;
}

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  type: string;
  min: string | null;
  time: string;
  distance: string | null;
  rating: string;
  delivery: string | null;
  reviews: string;
  image?: string;
  tags: string[];
  exclusive: boolean;
  isOpen: boolean;
  badge: string;
}

const mapRestaurant = (r: RestaurantApi, formatPrice: (price: number) => string): Restaurant => {
  const cuisineList = r.cuisine || [];
  const ratingAvg = r.rating?.average;
  const reviewCount = r.reviewCount ?? r.rating?.count ?? 0;
  const getBadge = (name: string) => {  switch (name) {
    case "Stella's Rooftop":
      return "Premium";
    case "Nobu Downtown":
      return "Luxury";
    case "The Charleston":
      return "Luxury";
    default:
      return "Premium";
  }
};
  return {
    id: r._id,
    slug: r.slug,
    name: r.name,
    type: cuisineList.join(" • ").toUpperCase() || "RESTAURANT",
    min: r.minimumOrder != null ? `$${r.minimumOrder}` : null,
    time: r.deliveryTime
      ? `${r.deliveryTime.min}-${r.deliveryTime.max} min`
      : "N/A",
    distance: r.distanceInMiles != null ? `${r.distanceInMiles} mi` : "2.5",
    rating: ratingAvg ? ratingAvg.toFixed(1) : "0",
    delivery:
      r.deliveryFee === 0
        ? "Free Delivery"
        : r.deliveryFee != null
          ? `${formatPrice(r.deliveryFee)} Delivery`
          : null,
    reviews: `${reviewCount}+ ratings`,
    image: r.banner || r.logo || "",
    tags:
      r.tags && r.tags.length > 0
        ? r.tags
        : r.cuisine?.length
          ? r.cuisine
          : ["Best View", "Fresh Import", "Tasting Menu"],
    exclusive: !!r.isExclusivePartner,
    isOpen: r.isOpen ?? false,
    badge: getBadge(r.name),
  };
};

interface RestaurantGridProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function RestaurantGrid({
  searchQuery = "",
  onClearSearch,
}: RestaurantGridProps) {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [role] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const [activeCuisine, setActiveCuisine] = useState("All Cuisines");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cuisines, setCuisines] = useState<Array<{name: string; Icon: React.ElementType}>>(defaultCuisines);
  const [cuisinesLoading, setCuisinesLoading] = useState(true);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch whenever search query or active cuisine tab changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let url;
        if (searchQuery) {
          url = `${API_BASE}/general/search?q=${encodeURIComponent(searchQuery)}&type=restaurant`;
        } else {
          url = `${API_BASE}/home/food/${encodeURIComponent(activeCuisine)}`;
        }

        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Request failed");

        if (data && data.success && Array.isArray(data.data)) {
          setRestaurants(data.data.map((r: RestaurantApi) => mapRestaurant(r, formatPrice)));
        } else if (Array.isArray(data)) {
          setRestaurants(data.map((r: RestaurantApi) => mapRestaurant(r, formatPrice)));
        } else {
          const list = searchQuery
            ? data.data.restaurants || []
            : data.data.data || [];

          setRestaurants(list.map((r: RestaurantApi) => mapRestaurant(r, formatPrice)));
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Couldn't load restaurants. Please try again.");
          setRestaurants([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [searchQuery, activeCuisine]);

  // Fetch dynamic cuisine categories
  useEffect(() => {
    const fetchCuisines = async () => {
      setCuisinesLoading(true);
      try {
        const res = await fetch(`${API_BASE}/home/food`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const apiCuisines = data?.data?.categories || data?.data || [];
          if (Array.isArray(apiCuisines) && apiCuisines.length > 0) {
            const dynamicCuisines = [
              { name: "All Cuisines", Icon: Utensils },
              ...apiCuisines.map((c: string | { name: string }) => {
                const name = typeof c === "string" ? c : c.name;
                return {
                  name,
                  Icon: cuisineIconMap[name] || Utensils,
                };
              }),
            ];
            setCuisines(dynamicCuisines);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic cuisines", err);
        // Keep fallback cuisines
      } finally {
        setCuisinesLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  const handleCuisineClick = (name: string) => {
    if (searchQuery) onClearSearch?.(); // leaving search mode when a tab is picked
    setActiveCuisine(name);
  };

const handleCardClick = (restaurant: Restaurant) => {
  if (isLoggedIn) {
    if (role === "customer") {
      navigate(
        `/customer/dashboard/restaurant-details?id=${restaurant.id}`
      );
    } else {
      navigate("/restaurant/dashboard");
    }
  } else {
    setRole("restaurant");
    navigate("/role-wise-sign-in?role=restaurant");
  }
};

  return (
    <section className="bg-theme-bg py-16 text-theme-text">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3">
        <div className="flex flex-wrap gap-3 items-center mb-10">
          {searchQuery ? (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm bg-theme-surface text-[#CAD5E2]">
              Results for "{searchQuery}"
              <button
                onClick={() => onClearSearch?.()}
                className="ml-1 hover:text-theme-text"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            cuisines.map((item, i) => (
              <button
                key={i}
                onClick={() => handleCuisineClick(item.name)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition ${
                  activeCuisine === item.name
                    ? "bg-[#00A63E] text-white"
                    : "bg-[#0F172B] text-[#94A3B8] hover:bg-[#1E293B]"
                }`}
              >
                <item.Icon size={16} />
                {item.name}
              </button>
            ))
          )}

          <div className="border-l border-theme-border ml-2 pl-5 flex items-center gap-2 text-theme-muted">
            <Filter size={16} />
            Filters
          </div>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-theme-surface animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-theme-muted py-16">{error}</p>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <p className="text-center text-theme-muted py-16">
            No restaurants found{searchQuery ? ` for "${searchQuery}"` : ""}.
          </p>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-theme-surface cursor-pointer border border-theme-border rounded-2xl overflow-hidden hover:border-[#334155] transition"
              >
                <div className="relative">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-theme-surface flex flex-col items-center justify-center text-theme-muted">
                      <ImageOff size={36} />
                      <span className="mt-2 text-sm">No Image Available</span>
                    </div>
                  )}

                  {item.exclusive && (
                    <span className="absolute top-3 left-3 bg-[#00C950] text-[10px] font-bold px-3 py-1 rounded-full">
                      EXCLUSIVE PARTNER
                    </span>
                  )}

                  {!item.isOpen && (
                    <span className="absolute top-3 right-3 bg-[#62748E] text-[10px] font-bold px-3 py-1 rounded-full">
                      CLOSED
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 flex gap-3 text-xs bg-[#020618CC] rounded-full py-2 px-3">
                    <span className="flex items-center gap-1 text-xs font-medium pr-3 border-r-2 border-r-[#ffffff2e]">
                      <Clock size={14} color="#05DF72" />
                      {item.time}
                    </span>

                    {item.distance && (
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <MapPin size={14} color="#05DF72" />
                        {item.distance}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-theme-surface text-theme-text text-sm font-bold px-2 py-1 rounded-full">
                    <Star
                      size={12}
                      color="#0F172B"
                      className="fill-[#0F172B]"
                    />
                    {item.rating}
                  </div>
                </div>

                <div className="lg:p-5 p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-playfair text-[22px]">{item.name}</h3>
                      <p className="text-xs text-theme-muted uppercase">
                        {item.type}
                      </p>
                    </div>
                    {/* {item.min && ( */}
                      <div className="text-right">
                         <p className="text-[16px] text-[#fff] font-playfair">
                           {item.badge}
                        </p>
                        <p className="text-[10px] text-[#62748E]">
                          Min. {item.min}
                        </p>
                      </div>
                    {/* )} */}
                  </div>

                  <div className="text-sm mt-4 text-theme-muted bg-[#1D293D80] px-3 py-2 rounded-lg flex items-center gap-2">
                    {item.delivery && (
                      <>
                        <span className="text-sm text-[#CAD5E2] font-medium">
                          {item.delivery}
                        </span>
                        •
                      </>
                    )}
                    <span className="text-sm text-theme-muted">
                      {item.reviews}
                    </span>
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-theme-muted px-3 py-1 bg-[#FFFFFF0D] rounded-full"
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="w-full mt-6 bg-[#1D293D] hover:bg-[#334155] text-base text-[#CAD5E2] font-medium py-2 rounded-full">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
