import { Upload, Box, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { parseApiError } from "../../lib/apiErrorHandler";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeadersForm = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function AddProduct({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [tiers, setTiers] = useState([{ minQuantity: 10, price: 0 }]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    sku: "",
    description: "",
    unit: "",
    basePrice: "",
    stockQuantity: "",
    lowStockAlert: "",
    status: "Active",
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const addTier = () => {
    setTiers([...tiers, { minQuantity: 0, price: 0 }]);
  };
  const removeTier = (i: number) => {
    setTiers(tiers.filter((_, index) => index !== i));
  };

  const updateTier = (i: number, field: string, value: string) => {
    const updated = [...tiers];
    updated[i] = { ...updated[i], [field]: Number(value) };
    setTiers(updated);
  };

  const handleSave = async () => {
    setFieldErrors({});
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, (form as any)[key]));
      formData.append("tiers", JSON.stringify(tiers));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_BASE}/supplier/products`, {
        method: "POST",
        headers: authHeadersForm(),
        body: formData
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success("Product added successfully!");
        setActiveTab("products");
      } else {
        if (data && data.errors && Array.isArray(data.errors)) {
          const newErrors: Record<string, string> = {};
          data.errors.forEach((err: string) => {
            const errLower = err.toLowerCase();
            if (errLower.includes("title") || errLower.includes("name")) newErrors.title = err;
            if (errLower.includes("category")) newErrors.category = err;
            if (errLower.includes("sku")) newErrors.sku = err;
            if (errLower.includes("description")) newErrors.description = err;
            if (errLower.includes("unit")) newErrors.unit = err;
            if (errLower.includes("baseprice") || errLower.includes("price")) newErrors.basePrice = err;
            if (errLower.includes("stock")) newErrors.stockQuantity = err;
            if (errLower.includes("lowstock")) newErrors.lowStockAlert = err;
          });
          setFieldErrors(newErrors);
          toast.error("Please fix the validation errors.");
        } else {
          toast.error(parseApiError(data, "Failed to add product"));
        }
      }
    } catch(err) {
      console.error(err);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="lg:text-[34px] text-3xl font-playfair font-semibold cursor-pointer flex items-center gap-2"
          onClick={() => setActiveTab("products")}
        >
          <ArrowLeft />
          Add New Product
        </h1>

        <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
          Create a new product listing for your bulk catalog.
        </p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        
        <div className="space-y-6">
          
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
            
            <h3 className="font-playfair text-xl"> Basic Information </h3>
            <p className="text-theme-muted mb-6">
              
              Product name, category and identification.
            </p>
            <div className="space-y-4">
              
              <div>
                
                <label className="text-sm text-[#374151]">
                  Product Name
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none"
                  placeholder="e.g. Organic Avocados (Hass)"
                />
                {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                
                <div>
                  
                  <label className="text-sm text-[#374151]">
                    Category
                  </label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none">
                    
                    <option value="">Select category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.category && <p className="text-red-500 text-xs mt-1">{fieldErrors.category}</p>}
                </div>
                <div>
                  
                  <label className="text-sm text-[#374151]">SKU</label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none"
                    placeholder="e.g. AVO-HASS-01"
                  />
                  {fieldErrors.sku && <p className="text-red-500 text-xs mt-1">{fieldErrors.sku}</p>}
                </div>
              </div>
              <div>
                
                <label className="text-sm text-[#374151]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-theme-border rounded-lg px-3 py-3 mt-1 outline-none"
                />
                {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
            
            <h3 className="font-playfair text-xl">
              
              Pricing & Inventory
            </h3>
            <p className="text-theme-muted mb-6">
              
              Manage unit costs and stock levels.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              
              <div>
                
                <label className="text-sm text-[#374151]">Unit Type</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none">
                  
                  <option value="">Select unit</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                </select>
                {fieldErrors.unit && <p className="text-red-500 text-xs mt-1">{fieldErrors.unit}</p>}
              </div>
              <div>
                
                <label className="text-sm text-[#374151]">
                  Base Price (per unit)
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleChange}
                  className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none"
                  placeholder="0.00"
                />
                {fieldErrors.basePrice && <p className="text-red-500 text-xs mt-1">{fieldErrors.basePrice}</p>}
              </div>
              <div>
                
                <label className="text-sm text-[#374151]">
                  Initial Stock
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none"
                  placeholder="0"
                />
                {fieldErrors.stockQuantity && <p className="text-red-500 text-xs mt-1">{fieldErrors.stockQuantity}</p>}
              </div>
              <div>
                
                <label className="text-sm text-[#374151]">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={form.lowStockAlert}
                  onChange={handleChange}
                  className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1 outline-none"
                  placeholder="10"
                />
                {fieldErrors.lowStockAlert && <p className="text-red-500 text-xs mt-1">{fieldErrors.lowStockAlert}</p>}
              </div>
            </div>
            <div className="mt-6">
              
              <div className="flex justify-between items-center mb-4">
                
                <div className="flex items-center gap-2">
                  
                  <Box size={18} />
                  <h4 className="font-medium"> Bulk Pricing Tiers </h4>
                </div>
                <button
                  onClick={addTier}
                  className="flex items-center gap-2 border border-theme-border px-3 py-2 rounded-lg"
                >
                  
                  <Plus size={16} /> Add Tier
                </button>
              </div>
              <div className="border border-theme-border rounded-lg p-4 space-y-3">
                
                {tiers.map((t, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                    
                    <input
                      type="number"
                      value={t.minQuantity}
                      onChange={(e) => updateTier(i, "minQuantity", e.target.value)}
                      className="border border-theme-border rounded-lg px-3 h-12"
                      placeholder="Min Quantity"
                    />
                    <input
                      type="number"
                      value={t.price}
                      onChange={(e) => updateTier(i, "price", e.target.value)}
                      className="border border-theme-border rounded-lg px-3 h-12"
                      placeholder="Unit Price"
                    />
                    <button onClick={() => removeTier(i)}>
                      
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-theme-muted mt-2">
                
                Add tiers to encourage larger orders (e.g. Buy 10+ for
                $5/unit)
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
            
            <h3 className="font-playfair text-xl mb-4"> Product Image </h3>
            <label className="border-2 border-dashed border-theme-border rounded-xl p-10 text-center block cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
              {imagePreview ? (
                <img src={imagePreview} className="mx-auto h-32 object-contain" />
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-[#2563EB]" />
                  <p className="mt-3 font-medium"> Click to upload image </p>
                  <p className="text-sm text-theme-muted">
                    SVG, PNG, JPG or GIF (max 5MB)
                  </p>
                </>
              )}
            </label>
          </div>
          <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
            
            <h3 className="font-playfair text-xl mb-4"> Visibility </h3>
            <div className="space-y-4">
              
              <div>
                
                <label className="text-sm text-[#374151]"> Status </label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-theme-border rounded-lg px-3 h-12 mt-1">
                  
                  <option value="Active">Active</option> 
                  <option value="Draft">Draft</option>

                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                
                <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange} /> Mark as Featured Product
              </label>
            </div>
          </div>
          <div className="space-y-3">
            
            <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-[#2563EB] text-theme-text w-full py-3 rounded-lg shadow">
              
              <Save size={18} /> Publish Product
            </button>
            <button onClick={() => setActiveTab("products")} className="w-full border border-theme-border py-3 rounded-lg">
              
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
