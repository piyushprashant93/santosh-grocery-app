import { useState } from "react";
import { Upload, Clock, Check, Calculator, Plus, ChartPie } from "lucide-react";

export default function AddMenuItem({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [tab, setTab] = useState("details");
  const [chefRate, setChefRate] = useState(16);
  const [prepTime] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "Main Course",
    description: "",
    dietaryType: "Vegetarian"
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "Solid",
    price: "",
    bulkQty: "",
    usedQty: "",
  });

  const [ingredients, setIngredients] = useState<any[]>([]);

  const addIngredient = () => {
    if (!form.name || !form.price || !form.bulkQty || !form.usedQty) return;

    const unitCost = Number(form.price) / Number(form.bulkQty);
    const finalCost = unitCost * Number(form.usedQty);

    setIngredients((prev) => [...prev, { ...form, unitCost, finalCost }]);

    setForm({
      name: "",
      type: "Solid",
      price: "",
      bulkQty: "",
      usedQty: "",
    });
  };

  const totalIngredients = ingredients.reduce((a, b) => a + b.finalCost, 0);
  const laborCost = (chefRate / 60) * prepTime;
  const totalCost = totalIngredients + laborCost;
  const margin = sellingPrice
    ? ((sellingPrice - totalCost) / sellingPrice) * 100
    : 0;

  const handleSave = async () => {
    setSaving(true);
    setFieldErrors({});
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/restaurant-panel/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: menuItem.name,
          category: menuItem.category,
          description: menuItem.description,
          dietaryType: menuItem.dietaryType,
          prepTime,
          price: sellingPrice,
          ingredients,
          chefRate
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors: Record<string, string> = {};
          data.errors.forEach((err: string) => {
            const errLower = err.toLowerCase();
            if (errLower.includes("name")) newErrors.name = err;
            if (errLower.includes("category")) newErrors.category = err;
            if (errLower.includes("price") || errLower.includes("baseprice")) newErrors.price = err;
            if (errLower.includes("description")) newErrors.description = err;
            if (errLower.includes("dietary")) newErrors.dietaryType = err;
            if (errLower.includes("preptime")) newErrors.prepTime = err;
          });
          setFieldErrors(newErrors);
        }
        throw new Error("Validation failed");
      }

      setActiveTab("menu-management");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="text-[#64748B] text-sm"
            onClick={() => setActiveTab("menu-management")}
          >
            ←
          </button>

          <h1 className="font-playfair text-3xl">Add New Menu Item</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("menu-management")}
            className="border border-[#E5E7EB] px-5 py-2.5 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#059669] text-white px-5 py-2.5 rounded-lg shadow disabled:opacity-50"
          >
            <Check size={16} />
            {saving ? "Saving..." : "Save Item"}
          </button>
        </div>
      </div>

      <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">
        <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setTab("details")}
            className={`px-5 py-2 rounded-md ${
              tab === "details"
                ? "bg-white shadow text-[#0F172A]"
                : "text-[#64748B]"
            }`}
          >
            Details & Pricing
          </button>

          <button
            onClick={() => setTab("recipe")}
            className={`px-5 py-2 rounded-md ${
              tab === "recipe"
                ? "bg-white shadow text-[#0F172A]"
                : "text-[#64748B]"
            }`}
          >
            Recipe & Costing
          </button>
        </div>

        {tab === "details" && (
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                <Upload className="text-[#059669]" />
              </div>

              <p className="font-medium text-[#0F172A]">Upload Dish Image</p>

              <p className="text-sm text-[#64748B] mt-1">PNG, JPG up to 5MB</p>
            </div>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-[#64748B]">Item Name</label>

                  <input
                    value={menuItem.name}
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                    placeholder="e.g. Truffle Mushroom Burger"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                  {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">Category</label>

                  <select
                    value={menuItem.category}
                    onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  >
                    <option>Main Course</option>
                    <option>Starters</option>
                    <option>Desserts</option>
                  </select>
                  {fieldErrors.category && <p className="text-red-500 text-xs mt-1">{fieldErrors.category}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-[#64748B]">Description</label>

                <textarea
                  rows={4}
                  value={menuItem.description}
                  onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                  placeholder="Describe the dish..."
                  className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                />
                {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm text-[#64748B]">
                    Selling Price ($)
                  </label>

                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      $
                    </span>

                    <input
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-8 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  {fieldErrors.price && <p className="text-red-500 text-xs mt-1">{fieldErrors.price}</p>}
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">Prep Time</label>

                  <div className="relative mt-1">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />

                    <input
                      value={prepTime}
                      onChange={(e) => setPrepTime(Number(e.target.value))}
                      placeholder="15"
                      className="w-full pl-8 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  {fieldErrors.prepTime && <p className="text-red-500 text-xs mt-1">{fieldErrors.prepTime}</p>}
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">Dietary Type</label>

                  <select
                    value={menuItem.dietaryType}
                    onChange={(e) => setMenuItem({ ...menuItem, dietaryType: e.target.value })}
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  >
                    <option>Vegetarian</option>
                    <option>Non-Veg</option>
                  </select>
                  {fieldErrors.dietaryType && <p className="text-red-500 text-xs mt-1">{fieldErrors.dietaryType}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "recipe" && (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 lg:p-6">
                <div>
                  <label className="text-sm text-[#64748B]">
                    Chef Hourly Rate ($/hr)
                  </label>
                  <input
                    value={chefRate}
                    onChange={(e) => setChefRate(Number(e.target.value))}
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">
                    Prep Time (min)
                  </label>
                  <input
                    disabled
                    placeholder="Set in Details tab"
                    className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none bg-gray-100"
                  />
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 lg:p-6">
                    <h3 className="font-playfair text-lg mb-4 flex items-center gap-2">
                  <Calculator size={18} className="text-[#009966]" /> Ingredient Cost Calculator
                </h3>
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden p-5 mb-5">

                <div className="grid md:grid-cols-5 gap-3">
                  <input
                    placeholder="Ingredient"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border px-3 py-2 rounded-lg outline-none"
                  />

                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="border px-3 py-2 rounded-lg outline-none"
                  >
                    <option>Solid</option>
                    <option>Liquid</option>
                  </select>

                  <input
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg outline-none"
                  />

                  <input
                    placeholder="Bulk Qty"
                    value={form.bulkQty}
                    onChange={(e) =>
                      setForm({ ...form, bulkQty: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg outline-none"
                  />

                  <input
                    placeholder="Used Qty"
                    value={form.usedQty}
                    onChange={(e) =>
                      setForm({ ...form, usedQty: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg outline-none"
                  />
                </div>

                <button
                  onClick={addIngredient}
                  className="mt-4 w-full bg-[#0F172A] text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Ingredient
                </button>
                </div>
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-[#64748B]">
                    <tr>
                      <th className="px-5 py-3 text-left">Ingredient</th>
                      <th className="px-5 py-3">Unit Cost</th>
                      <th className="px-5 py-3">Usage</th>
                      <th className="px-5 py-3">Final Cost</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {ingredients.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center px-6 py-3 text-[#94A3B8] bg-white"
                        >
                          No ingredients added yet
                        </td>
                      </tr>
                    )}

                    {ingredients.map((i, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-5 py-3">{i.name}</td>
                        <td className="px-5 py-3 text-center">
                          ${i.unitCost.toFixed(2)}
                        </td>
                        <td className="px-5 py-3 text-center">{i.usedQty}</td>
                        <td className="px-5 py-3 text-center font-medium">
                          ${i.finalCost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-4 flex justify-between font-medium">
                  <span>Total Ingredients:</span>
                  <span className="text-green-600">
                    ${totalIngredients.toFixed(2)}
                  </span>
                </div>
              </div>
              </div>

            </div>

            <div className="border border-[#DBEAFE] rounded-xl p-5 space-y-5 bg-[#EFF6FF]">
              <h3 className="font-playfair text-lg flex items-center font-bold gap-2 text-[#1C398E]">
                <ChartPie size={18} /> Cost Analysis
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Ingredients</span>
                  <span>${totalIngredients.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Labor Cost</span>
                  <span>${laborCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-lg text-[#1C398E]">
                <span>Total Recipe Cost</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>

              <div>
                <label className="text-sm text-[#64748B]">Selling Price</label>
                <input
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 outline-none"
                />
              </div>

              <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                <span className="text-[#1C398E]">Profit Margin</span>

                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    margin > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {margin.toFixed(1)}%
                </span>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-[#64748B] mb-2">
                  Suggested Price (3.5x)
                </p>

                <p className="text-xl font-semibold mb-3">
                  ${(totalCost * 3.5).toFixed(2)}
                </p>

                <button
                  onClick={() =>
                    setSellingPrice(Number((totalCost * 3.5).toFixed(2)))
                  }
                  className="w-full border border-[#2563EB] text-[#2563EB] py-2 rounded-lg"
                >
                  Apply Suggested Price
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
