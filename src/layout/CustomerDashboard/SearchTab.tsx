import {
  Search,
  Package,
  ShoppingBag,
  Utensils,
  FilterIcon,
  Loader2,
  X,
} from "lucide-react";
import { useCurrency } from "./CurrencyContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";
const RECENT_KEY = "recentSearches";
const MAX_RECENT = 8;

// ---------- Types ----------

interface RatingApi {
  average: number;
  count: number;
}

interface ProductApi {
  _id: string;
  name: string;
  category: string;
  images: string[];
  basePrice: number;
  discountPrice: number;
  stockStatus?: string;
  rating?: RatingApi;
}

interface RestaurantApi {
  _id: string;
  name: string;
  logo: string | null;
  cuisine: string[];
  deliveryFee: number;
  isOpen: boolean;
  deliveryTime?: { min: number; max: number };
  rating?: RatingApi;
}

interface MenuItemSearchApi {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  restaurantId?: string;
  restaurant?: { _id: string; name?: string };
  image?: string | null;
}

interface SuggestionApi {
  text: string;
  type: "product" | "restaurant" | "menuItem" | string;
  category?: string;
}

// Unified row shape the UI already renders
interface ResultRow {
  id: string;
  kind: "product" | "restaurant" | "menuItem";
  title: string;
  subtitle: string;
  desc: string;
  status: string;
  price: string;
  icon: typeof Package;
  img: string;
  navigateTo: string;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80";

function mapProduct(p: ProductApi): ResultRow {
  return {
    id: p._id,
    kind: "product",
    title: p.name,
    subtitle: p.category,
    desc:
      p.discountPrice != null && p.discountPrice !== p.basePrice
        ? `$${p.discountPrice} (was $${p.basePrice})`
        : `$${p.basePrice}`,
    status: p.stockStatus || "In Stock",
    price: `$${p.discountPrice ?? p.basePrice}`,
    icon: ShoppingBag,
    img: p.images?.[0] || FALLBACK_IMG,
    navigateTo: `/customer/dashboard/product-details?id=${p._id}`,
  };
}

function mapRestaurant(r: RestaurantApi): ResultRow {
  const ratingText =
    r.rating && r.rating.average > 0
      ? `${r.rating.average.toFixed(1)} (${r.rating.count} Reviews)`
      : "New";
  const timeText = r.deliveryTime
    ? `${r.deliveryTime.min}-${r.deliveryTime.max} min`
    : "";

  return {
    id: r._id,
    kind: "restaurant",
    title: r.name,
    subtitle: r.cuisine?.join(" • ") || "Restaurant",
    desc: [ratingText, timeText].filter(Boolean).join(" • "),
    status: r.isOpen ? "Open" : "Closed",
    price: r.deliveryFee === 0 ? "Free Delivery" : `$${r.deliveryFee} Delivery`,
    icon: Utensils,
    img: r.logo || FALLBACK_IMG,
    navigateTo: `/customer/dashboard/restaurant-details?id=${r._id}`,
  };
}

function mapMenuItem(m: MenuItemSearchApi): ResultRow {
  const restaurantId = m.restaurantId || m.restaurant?._id || "";
  return {
    id: m._id,
    kind: "menuItem",
    title: m.name,
    subtitle: m.restaurant?.name || m.category || "Menu Item",
    desc: m.category || "",
    status: "Available",
    price: m.price != null ? `$${m.price}` : "",
    icon: Package,
    img: m.image || FALLBACK_IMG,
    navigateTo: restaurantId
      ? `/customer/dashboard/restaurant-details?id=${restaurantId}`
      : "#",
  };
}

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const existing = getRecentSearches().filter(
    (t) => t.toLowerCase() !== trimmed.toLowerCase(),
  );
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
}

export default function SearchTab() {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(getRecentSearches());

  // Trending (default view when query is empty)
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [trendingRows, setTrendingRows] = useState<ResultRow[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Search results (when query has content)
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Autocomplete suggestions dropdown
  const [suggestions, setSuggestions] = useState<SuggestionApi[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- Trending: fetched once on mount ----
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrending() {
      setTrendingLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search/trending`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const data = json.data || {};
        setPopularSearches(data.popularSearches || []);

        const productRows = (data.trendingProducts || []).map(mapProduct);
        const restaurantRows = (data.trendingRestaurants || []).map(
          mapRestaurant,
        );
        setTrendingRows([...restaurantRows, ...productRows]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.log(err);
        }
      } finally {
        setTrendingLoading(false);
      }
    }

    fetchTrending();
    return () => controller.abort();
  }, []);

  // ---- Autocomplete suggestions: debounced, fires while typing ----
  useEffect(() => {
    if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/search/suggestions?q=${encodeURIComponent(query.trim())}`,
          { headers: { "Content-Type": "application/json" } },
        );
        const json = await res.json();
        if (json.success) {
          setSuggestions(json.data?.suggestions || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => {
      if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);
    };
  }, [query]);

  // ---- Full search: debounced, fires while typing ----
  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResultRows([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(
        `${API_BASE}/search?q=${encodeURIComponent(term.trim())}&type=all`,
        { headers: { "Content-Type": "application/json" } },
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Search failed.");

      const data = json.data || {};
      const restaurantRows = (data.restaurants || []).map(mapRestaurant);
      const productRows = (data.products || []).map(mapProduct);
      const menuItemRows = (data.menuItems || []).map(mapMenuItem);

      setResultRows([...restaurantRows, ...menuItemRows, ...productRows]);
    } catch (err: unknown) {
      setSearchError(
        err instanceof Error ? err.message : "Unable to search right now.",
      );
      setResultRows([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const handleSubmitSearch = (term: string) => {
    setQuery(term);
    setShowSuggestions(false);
    const updated = saveRecentSearch(term);
    if (updated) setRecent(updated);
    runSearch(term);
  };

  const handleRowClick = (row: ResultRow) => {
    if (row.navigateTo === "#") return;
    navigate(row.navigateTo);
  };

  const isTypingMode = query.trim().length > 0;
  const rowsToShow = isTypingMode ? resultRows : trendingRows;
  const chipsToShow = isTypingMode ? [] : recent;

  return (
    <div className="">
      {/* Search input */}
      <div className="relative mb-2">
        <Search
          size={20}
          className="absolute sm:left-4 left-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitSearch(query);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Search for orders, products, or restaurants..."
          className="w-full h-14 sm:pl-12 pl-8 sm:pr-12 pr-8 lg:rounded-xl text-sm sm:text-base rounded-lg border border-[#E5E7EB] outline-none
          shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute sm:right-4 right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#4A5565]"
          >
            <X size={18} />
          </button>
        ) : (
          <FilterIcon
            size={20}
            className="absolute sm:right-4 right-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
        )}

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 top-[calc(100%+6px)] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSubmitSearch(s.text)}
                className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] flex items-center justify-between gap-3 border-b border-[#F1F5F9] last:border-b-0"
              >
                <span className="text-sm text-[#0F172A]">{s.text}</span>
                {s.category && (
                  <span className="text-xs text-[#94A3B8]">{s.category}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent / Popular chips */}
      <div className="mb-10 mt-6">
        <h3 className="text-sm tracking-widest text-[#6A7282] mb-3 font-playfair">
          {isTypingMode ? "POPULAR SEARCHES" : "RECENT SEARCHES"}
        </h3>

        <div className="flex flex-wrap lg:gap-3 gap-2">
          {(isTypingMode ? popularSearches : chipsToShow).length === 0 ? (
            <p className="text-[#94A3B8] text-sm">No searches yet.</p>
          ) : (
            (isTypingMode ? popularSearches : chipsToShow).map((item, i) => (
              <button
                key={i}
                onClick={() => handleSubmitSearch(item)}
                className="lg:px-5 px-2 text-[#4A5565] sm:py-2 py-2 rounded-full border border-[#E5E7EB] bg-white
                shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
              >
                {item}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-sm tracking-widest text-[#6A7282] font-playfair">
          {isTypingMode ? `RESULTS FOR "${query.trim()}"` : "SUGGESTED FOR YOU"}
        </h3>

        {(isTypingMode ? searching : trendingLoading) && (
          <div className="flex items-center justify-center gap-2 text-[#6A7282] py-10">
            <Loader2 size={18} className="animate-spin" />
            Loading...
          </div>
        )}

        {isTypingMode && !searching && searchError && (
          <p className="text-center text-red-500 py-10">{searchError}</p>
        )}

        {!(isTypingMode ? searching : trendingLoading) &&
          !searchError &&
          rowsToShow.length === 0 && (
            <p className="text-center text-[#94A3B8] py-10">
              {isTypingMode ? "No results found." : "Nothing trending right now."}
            </p>
          )}

        {!(isTypingMode ? searching : trendingLoading) &&
          rowsToShow.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.kind}-${item.id}`}
                onClick={() => handleRowClick(item)}
                className="flex md:flex-row flex-col md:items-center gap-4 lg:p-5 p-2 rounded-lg lg:rounded-xl border border-[#E5E7EB] bg-white
                shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] cursor-pointer hover:border-[#00A63E] transition"
              >
                <img
                  src={item.img || "https://placehold.co/64x64?text=No+Image"}
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/64x64?text=No+Image"; }}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div className="flex-1 space-y-1">
                  <h3 className="font-playfair text-lg font-medium">
                    {item.title}
                  </h3>

                  <p className="text-[#6A7282] text-base">{item.subtitle}</p>

                  <p className="text-[#99A1AF] text-sm">{item.desc}</p>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      item.status === "Open" || item.status === "Active"
                        ? "bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB]"
                        : item.status === "Closed"
                          ? "bg-[#F1F5F9] border border-[#E5E7EB] text-[#6A7282]"
                          : "bg-[#ECFDF5] border border-[#D0FAE5] text-[#009966]"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="text-right border-l border-[#E5E7EB] pl-6 flex md:flex-col gap-3 md:items-end">
                    <p className="font-playfair text-lg">{item.price}</p>
                    <Icon size={18} className="text-[#94A3B8] mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}