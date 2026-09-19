import {
  Search,
  Filter,
  Clock,
  Plus,
  MoreHorizontal,
  Calculator,
  SquareMenu, Flame,
  ImageIcon,
  Edit,
  Trash2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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



export default function MenuManagement({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const [tab, setTab] = useState("live");
  const [active, setActive] = useState("All Items");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [serverCategories, setServerCategories] = useState<string[]>([]);
  const defaultCats = ["Main Course", "Starters", "Desserts"];
  const allKnownCats = Array.from(new Set([...defaultCats, ...serverCategories, ...customCategories]));

  const dynamicCategories = [
    { name: "All Items", count: "" },
    ...allKnownCats.map(name => ({ name, count: "" }))
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (active && active !== "All Items") queryParams.append("category", active);

      const res = await fetch(`${API_BASE}/restaurant-panel/menu?${queryParams.toString()}`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data?.menu || data.menu || (Array.isArray(data.data) ? data.data : []);
        setMenuItems(Array.isArray(items) ? items : []);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to fetch menu");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/menu/categories`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setServerCategories(data.data || data.categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMenu();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, active]);

  const toggleStock = async (id: string, currentAvail: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/menu/${id}/availability`, {
        method: "PUT",
        headers: authHeaders(),
      });
      if (res.ok) {
        setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailable: !currentAvail } : item));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/menu/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setMenuItems(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setOpenMenu(null);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/menu/${id}/image`, {
        method: "POST",
        headers: authHeadersForm(),
        body: formData
      });
      if (res.ok) {
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingId(null);
      setOpenMenu(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Menu Management
          </h1>

          <p className="text-theme-muted mt-2">
            Organize your menu, manage availability, and calculate food costs.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex gap-3 bg-[#F1F5F9] p-1 rounded-lg w-fit">

            <button
              onClick={() => setTab("live")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${tab === "live"
                ? "bg-white shadow text-[#0F172A]"
                : "text-[#64748B]"
                }`}
            >
              <SquareMenu size={16} />
              Menu View
            </button>

            <button
              onClick={() => setTab("history")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${tab === "history"
                ? "bg-white shadow text-[#0F172A]"
                : "text-[#64748B]"
                }`}
            >
              <Calculator size={16} />
              Recipe & Costing
            </button>

          </div>
          <button className="border border-theme-border rounded-lg px-4 py-2 flex gap-2 items-center bg-theme-surface">
            <Filter size={16} />
            Filter
          </button>

          <button onClick={()=>setActiveTab("add-item")} className="bg-[#009966] text-white rounded-lg px-4 py-2 flex gap-2 items-center">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      <div className="space-y-6">

        <div className="flex items-center justify-between border border-theme-border bg-theme-surface rounded-xl px-4 py-3">

          <div className="flex items-center gap-3 w-full">

            <Search size={18} className="text-theme-muted" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for items by name, ingredients, or tags..."
              className="outline-none w-full"
            />

          </div>

          <span className="text-sm bg-[#F1F5F9] px-3 py-2 rounded-lg min-w-max">
            {menuItems.length} result{menuItems.length !== 1 ? 's' : ''}
          </span>

        </div>



        <div className="flex flex-wrap gap-3">

          {dynamicCategories.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(c.name)}
              className={`px-5 py-2 rounded-full border flex items-center gap-2 ${active === c.name
                ? "bg-[#059669] text-white border-[#059669]"
                : "bg-white border-[#E5E7EB]"
                }`}
            >
              {c.name}
              <span className={`${active === c.name ? "text-white" : "text-[#64748B]"}`}>
                {c.count}
              </span>
            </button>
          ))}

          <button onClick={() => {
            const newCat = window.prompt("Enter new category name:");
            if (newCat && newCat.trim() !== "") {
              setCustomCategories(prev => [...prev, newCat.trim()]);
              setActive(newCat.trim());
            }
          }} className="w-10 h-10 rounded-full border border-theme-border flex items-center justify-center hover:bg-gray-50">
            <Plus size={18} />
          </button>

        </div>



        <div className="space-y-4">

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading menu...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No menu items match your filter.</div>
          ) : (
            menuItems.map((item, i) => {
              const isAvailable = item.isAvailable !== false && item.stock !== false;
              const imgUrl = item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
              const id = item._id || item.id || i.toString();
              return (

            <div
              key={id}
              className="border border-theme-border bg-theme-surface rounded-xl p-4 flex items-center gap-4"
            >

              <img
                src={imgUrl}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div className="flex-1">

                <div className="flex items-center gap-3">

                  <span className={`w-5 h-5 border-2 flex justify-center items-center rounded-lg ${isAvailable ? "border-green-500" : "border-red-500"}`} >
                    <span  className={`w-3 h-3 inline-block rounded-full ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                  </span>

                  <h3 className="font-playfair text-lg">
                    {item.name}
                  </h3>

                  <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded-md">
                    {item.category}
                  </span>

                </div>


                <div className="min-h-9 flex items-center">
                  {tab === "history" ?

                    <div className="flex items-center gap-4 mt-2">

                      <span className="bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-full text-sm">
                        Cost: {item.cost || item.productionCost || "$0.00"}
                      </span>

                      <span className="text-theme-muted text-sm">
                        Margin: {item.margin || "0%"}
                      </span>

                    </div> :
                    <p className="text-theme-muted text-sm mt-1 line-clamp-1">
                      {item.description || item.desc}
                    </p>

                  }
                </div>


                <div className="flex items-center gap-4 text-sm text-theme-muted mt-2">

                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {item.preparationTime || item.time || "15 min"}
                  </span>

                  <span className="flex items-center gap-1">
                    <Flame size={14} /> {item.cal}
                  </span>

                </div>

              </div>



                <div className="flex items-center gap-6 border-l pl-6">

                  <p className="text-xl font-semibold">
                    ${typeof item.price === "number" ? item.price.toFixed(2) : (item.price || "0.00")}
                  </p>


                  <div className="flex items-center gap-3">

                    <p className={`text-sm ${isAvailable ? "text-green-600" : "text-[#64748B]"}`}>
                      {isAvailable ? "In Stock" : "Out"}
                    </p>

                    <button
                      onClick={() => toggleStock(id, isAvailable)}
                      className={`w-10 h-6 rounded-full flex items-center transition ${isAvailable ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
                        }`}
                    >

                    <div className="w-4 h-4 bg-theme-surface rounded-full mx-1" />

                  </button>

                </div>

                <div className="relative">

                  <button
                    onClick={() => setOpenMenu(openMenu === id ? null : id)}
                  >
                    <MoreHorizontal size={18} className="text-theme-muted" />
                  </button>


                  {openMenu === id && (
                    <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpenMenu(null)}></div>
                    <div className="absolute right-0 top-7 w-52 bg-theme-surface border border-theme-border rounded-xl shadow-lg overflow-hidden z-50">

                      <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-theme-bg">
                        <Edit size={16} className="text-theme-muted" />
                        Edit Item
                      </button>

                      <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-theme-bg relative">
                        <input type="file" ref={fileInputRef} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, id)} />
                        <ImageIcon size={16} className="text-theme-muted" />
                        {uploadingId === id ? "Uploading..." : "Change Photo"}
                      </button>

                      <div className="border-t border-theme-border" />

                      <button onClick={() => deleteItem(id)} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                        Delete Item
                      </button>

                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            );
          })
          )}
        </div>

      </div>
    </div>
  );
}
