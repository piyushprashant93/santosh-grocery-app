import { useState, useEffect } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};
import {
  ChefHat,
  Scale,
  AlertTriangle,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  RefreshCcw,
  Edit,
} from "lucide-react";

const stats = [
  {
    title: "Total Recipes",
    value: "48",
    icon: ChefHat,
    iconBg: "bg-blue-100",
    iconColor: "text-[#2563EB]",
  },
  {
    title: "Inventory Value",
    value: "$12,450",
    icon: Scale,
    iconBg: "bg-green-100",
    iconColor: "text-[#009966]",
  },
  {
    title: "Low Stock Alerts",
    value: "3 Items",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const solidStatusMap: any = {
  "In Stock": "bg-green-100 text-[#009966]",
  Low: "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-600",
};

const statusMap: any = {
  "In Stock": "bg-green-100 text-[#009966]",
  "Low": "bg-yellow-100 text-yellow-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-600",
  "Fresh": "bg-green-100 text-[#009966]",
  "Expiring Soon": "bg-yellow-100 text-yellow-700",
  "Expired": "bg-red-100 text-red-600"
};

export default function Inventory({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [tab, setTab] = useState<"beverage" | "kitchen" | "recipes">("beverage");
  const [subTab, setSubTab] = useState<"cooked" | "items">("cooked");
  const [subTab2, setSubTab2] = useState<"raw" | "solid">("raw");

  const [beverages, setBeverages] = useState<any[]>([]);
  const [cooked, setCooked] = useState<any[]>([]);
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [solidItems, setSolidItems] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/inventory`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const items = data.data?.inventory || data.inventory || data.data || [];
        setCooked(items.filter((i: any) => i.type === "cooked"));
        setRawItems(items.filter((i: any) => i.type === "raw"));
        setSolidItems(items.filter((i: any) => i.type === "solid"));
      }
    } catch (e) { console.error(e); }
  };

  const fetchBeverages = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/inventory/beverages`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setBeverages(data.data?.beverages || data.beverages || data.data || []);
      }
    } catch (e) { console.error(e); }
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/recipes`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.data?.recipes || data.recipes || data.data || []);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (tab === "kitchen") {
      fetchInventory();
    } else if (tab === "beverage") {
      fetchBeverages();
    } else if (tab === "recipes") {
      fetchRecipes();
    }
  }, [tab]);

  const deleteBeverage = async (id: string) => {
    if(!confirm("Delete this beverage?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/inventory/beverages/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) fetchBeverages();
    } catch (e) { console.error(e); }
  }

  const deleteItem = async (id: string) => {
    if(!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/inventory/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) fetchInventory();
    } catch (e) { console.error(e); }
  }

  const deleteRecipe = async (id: string) => {
    if(!confirm("Delete this recipe?")) return;
    try {
      const res = await fetch(`${API_BASE}/restaurant-panel/recipes/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) fetchRecipes();
    } catch (e) { console.error(e); }
  }

  const adjustStock = async (id: string, type: 'beverage' | 'inventory') => {
    const qty = window.prompt("Enter quantity to adjust (use negative for deduction):", "0");
    if (!qty || isNaN(Number(qty))) return;
    const notes = window.prompt("Enter reason/notes for adjustment:", "Manual adjustment");
    
    try {
      const endpoint = type === 'beverage' 
        ? `${API_BASE}/restaurant-panel/inventory/beverages/${id}/adjust` 
        : `${API_BASE}/restaurant-panel/inventory/${id}/adjust`;
        
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ quantity: Number(qty), notes: notes || "" })
      });
      if (res.ok) {
        if (type === 'beverage') fetchBeverages();
        else fetchInventory();
      } else {
        alert("Failed to adjust stock.");
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-[34px] font-playfair font-semibold">
            Recipe & Inventory
          </h1>

          <p className="text-[#64748B] mt-2">
            Track stock levels, manage recipes, and calculate food costs.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
              Stock Adjustment
            </button>
          </div>

          <button className="bg-[#009966] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm ">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;

          return (
            <div
              key={i}
              className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.iconBg}`}
              >
                <Icon className={s.iconColor} size={24} />
              </div>

              <div>
                <p className="text-[#64748B] text-sm">{s.title}</p>

                <h3 className="text-[28px] font-playfair mt-1 text-[#0F172A]">
                  {s.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
        <div className="flex gap-8 border-b mb-6">
          <button
            onClick={() => setTab("beverage")}
            className={`pb-3 text-sm font-medium ${
              tab === "beverage"
                ? "text-[#009966] border-b-2 border-[#009966]"
                : "text-[#64748B]"
            }`}
          >
            Beverage Management
          </button>

          <button
            onClick={() => setTab("kitchen")}
            className={`pb-3 text-sm font-medium ${
              tab === "kitchen"
                ? "text-[#009966] border-b-2 border-[#009966]"
                : "text-[#64748B]"
            }`}
          >
            Kitchen Stock Management
          </button>

          <button
            onClick={() => setTab("recipes")}
            className={`pb-3 text-sm font-medium ${
              tab === "recipes"
                ? "text-[#009966] border-b-2 border-[#009966]"
                : "text-[#64748B]"
            }`}
          >
            Recipes
          </button>
        </div>

        {tab === "beverage" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#64748B]">Total: {beverages.length} items</p>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <RefreshCcw size={16} />
                  Stock Adjustment
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#009966] text-white rounded-lg">
                  <Plus size={16} />
                  Add Beverage
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b text-sm text-[#64748B]">
                  <tr>
                    <th className="py-3">Beverage Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Threshold</th>
                    <th>Unit Type</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {beverages.map((b, i) => (
                    <tr key={b._id || i} className="border-b last:border-none">
                      <td className="py-4">{b.name}</td>
                      <td>{b.category || "Beverage"}</td>
                      <td className="font-medium">{b.stockQuantity || b.stock || 0}</td>
                      <td>{b.minThreshold || b.min || 0}</td>
                      <td>{b.unitType || b.unit || "-"}</td>
                      <td>{b.supplierName || b.supplier || "-"}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${statusMap[b.status || "In Stock"] || "bg-gray-100"}`}
                        >
                          {b.status || "In Stock"}
                        </span>
                      </td>
                      <td className="text-end cursor-pointer text-red-600">
                        <div className="flex gap-3 justify-end items-center">
                          <RefreshCcw
                            onClick={() => adjustStock(b._id, 'beverage')}
                            size={16}
                            className="text-[#009966] cursor-pointer"
                          />
                          <Pencil size={16} className="text-blue-600 cursor-pointer" />
                          <Trash2
                            onClick={() => deleteBeverage(b._id)}
                            size={18}
                            className="text-red-600 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "kitchen" && (
          <>
            <div className="flex gap-8 border-b mb-6">
              <button
                onClick={() => setSubTab("cooked")}
                className={`pb-3 text-sm font-medium ${
                  subTab === "cooked"
                    ? "text-[#009966] border-b-2 border-[#009966]"
                    : "text-[#64748B]"
                }`}
              >
                Cooked Food Stock
              </button>

              <button
                onClick={() => setSubTab("items")}
                className={`pb-3 text-sm font-medium ${
                  subTab === "items"
                    ? "text-[#009966] border-b-2 border-[#009966]"
                    : "text-[#64748B]"
                }`}
              >
                Kitchen Item Stock
              </button>
            </div>

            {subTab === "cooked" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[#64748B]">Total: 3 items</p>

                  <button className="flex items-center gap-2 px-4 py-2 bg-[#009966] text-white rounded-lg">
                    <Plus size={16} />
                    Add Cooked Food
                  </button>
                </div>

                <table className="w-full text-left">
                  <thead className="border-b text-sm text-[#64748B]">
                    <tr>
                      <th className="py-3">Dish Name</th>
                      <th>Prepared By</th>
                      <th>Prepared Date</th>
                      <th>Expiry Time</th>
                      <th>Remaining</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cooked.map((c, i) => (
                      <tr
                        key={c._id || i}
                        className={`border-b ${c.status === "Expired" ? "bg-red-50" : ""}`}
                      >
                        <td className="py-4">{c.name}</td>
                        <td>{c.preparedBy || c.by || "-"}</td>
                        <td>{c.preparedDate ? new Date(c.preparedDate).toLocaleString() : (c.prepared || "-")}</td>
                        <td>{c.expiryDate ? new Date(c.expiryDate).toLocaleString() : (c.expiry || "-")}</td>
                        <td className={c.remainingColor || ""}>{c.remaining || "-"}</td>
                        <td>{c.quantity || c.qty || 0}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${statusMap[c.status || "Fresh"] || "bg-gray-100"}`}
                          >
                            {c.status || "Fresh"}
                          </span>
                        </td>
                        <td className="">
                          <div className="flex gap-3 items-center justify-end">
                            <Edit size={16} className="text-blue-600 cursor-pointer" />
                            <Trash2 size={16} onClick={() => deleteItem(c._id)} className="text-red-600 cursor-pointer" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {subTab === "items" && (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setSubTab2("raw")}
                    className={`px-5 py-2 rounded-lg text-sm font-medium ${
                      subTab2 === "raw"
                        ? "bg-[#009966] text-white"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    Raw Food Items
                  </button>

                  <button
                    onClick={() => setSubTab2("solid")}
                    className={`px-5 py-2 rounded-lg text-sm font-medium ${
                      subTab2 === "solid"
                        ? "bg-[#009966] text-white"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    Solid / Non-Consumable Items
                  </button>
                </div>

                <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[#64748B]">
                      Total:{" "}
                      {subTab2 === "raw"
                        ? rawItems.length
                        : solidItems.length}{" "}
                      items
                    </p>

                    <button className="flex items-center gap-2 px-4 py-2 bg-[#009966] text-white rounded-lg">
                      <Plus size={16} />
                      {subTab2 === "raw"
                        ? "Add Raw Food Item"
                        : "Add Solid Item"}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b text-sm text-[#64748B]">
                        <tr>
                          <th className="py-3">Item Name</th>
                          <th>Current Stock</th>
                          <th>Min Threshold</th>
                          <th>Unit Price</th>
                          <th>Supplier</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(subTab2 === "raw"
                          ? rawItems
                          : solidItems
                        ).map((item, i) => (
                          <tr key={item._id || i} className="border-b last:border-none">
                            <td className="py-4 font-medium text-[#0F172A]">
                              {item.name}
                            </td>
                            <td>{item.stockQuantity || item.stock || 0}</td>
                            <td>{item.minThreshold || item.min || 0}</td>
                            <td>{item.unitPrice || item.price || "$0.00"}</td>
                            <td>{item.supplierName || item.supplier || "-"}</td>
                            <td>
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  subTab2 === "raw"
                                    ? (statusMap[item.status || "In Stock"] || "bg-gray-100")
                                    : (solidStatusMap[item.status || "In Stock"] || "bg-gray-100")
                                }`}
                              >
                                {item.status || "In Stock"}
                              </span>
                            </td>
                            <td>
                              <div className="flex justify-center gap-3">
                                <RefreshCcw
                                  onClick={() => adjustStock(item._id, 'inventory')}
                                  size={16}
                                  className="text-[#009966] cursor-pointer"
                                />
                                <Pencil
                                  size={16}
                                  className="text-blue-600 cursor-pointer"
                                />
                                <Trash2
                                  onClick={() => deleteItem(item._id)}
                                  size={16}
                                  className="text-red-600 cursor-pointer"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "recipes" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#64748B]">Total: {recipes.length} recipes</p>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#009966] text-white rounded-lg">
                <Plus size={16} />
                Create Recipe
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b text-sm text-[#64748B]">
                  <tr>
                    <th className="py-3">Recipe Name</th>
                    <th>Category</th>
                    <th>Prep Time</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recipes.map((r, i) => (
                    <tr key={r._id || i} className="border-b last:border-none">
                      <td className="py-4 font-medium text-[#0F172A]">{r.name}</td>
                      <td>{r.category || "-"}</td>
                      <td>{r.prepTime || "-"}</td>
                      <td>{r.cost ? `$${r.cost}` : "-"}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-sm ${r.status === 'Active' ? 'bg-green-100 text-[#009966]' : 'bg-gray-100 text-gray-700'}`}>
                          {r.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-3">
                          <Pencil size={16} className="text-blue-600 cursor-pointer" />
                          <Trash2
                            onClick={() => deleteRecipe(r._id)}
                            size={16}
                            className="text-red-600 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recipes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#64748B]">No recipes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}