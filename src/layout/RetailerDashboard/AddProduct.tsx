import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import toast from "react-hot-toast"
import { parseApiError } from "../../lib/apiErrorHandler"

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

export default function AddProduct({ setActiveTab }: { setActiveTab: (tab: string) => void }) {

    const [activeProductTab, setActiveProductTab] = useState("general")
    const [images, setImages] = useState<File[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState<any>({
        name: "",
        description: "",
        category: "",
        sku: "",
        basePrice: "",
        discountPrice: "",
        stock: "",
        lowStock: "",
        weight: "",
        shippingClass: "",
        length: "",
        width: "",
        height: "",
        freeShipping: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setForm({
            ...form,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    }

    const handleSave = async () => {
        setFieldErrors({});
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });
            images.forEach(img => {
                formData.append("images", img);
            });

            const res = await fetch(`${API_BASE}/retailer/products`, {
                method: "POST",
                headers: authHeadersForm(),
                body: formData
            });

            const data = await res.json().catch(() => null);

            if (res.ok) {
                toast.success("Product saved successfully!");
                setActiveTab("products");
            } else {
                if (data && data.errors && Array.isArray(data.errors)) {
                    const newErrors: Record<string, string> = {};
                    data.errors.forEach((err: string) => {
                        const errLower = err.toLowerCase();
                        if (errLower.includes("name")) newErrors.name = err;
                        if (errLower.includes("description")) newErrors.description = err;
                        if (errLower.includes("category")) newErrors.category = err;
                        if (errLower.includes("sku")) newErrors.sku = err;
                        if (errLower.includes("baseprice") || errLower.includes("price")) newErrors.basePrice = err;
                        if (errLower.includes("stock")) newErrors.stock = err;
                        if (errLower.includes("weight")) newErrors.weight = err;
                    });
                    setFieldErrors(newErrors);
                    toast.error("Please fix the validation errors.");
                } else {
                    toast.error(parseApiError(data, "Failed to save product."));
                }
            }
        } catch(err) {
            console.error(err);
            toast.error("An error occurred while saving the product.");
        }
    }

    const tabs = [
        { id: "general", label: "General Info" },
        { id: "pricing", label: "Pricing & Inventory" },
        { id: "images", label: "Images" },
        { id: "shipping", label: "Shipping" }
    ]

    return (
        <div>

            <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">

                <div className="flex items-start gap-4">

                    <button onClick={() => setActiveTab("products")} className="mt-2 text-theme-muted">
                        <ArrowLeft size={22} />
                    </button>

                    <div>
                        <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
                            Add New Product
                        </h1>

                        <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
                            Fill in the details below to create your product.
                        </p>
                    </div>

                </div>


                <div className="flex items-center gap-3">

                    <button onClick={() => setActiveTab("products")} className="px-5 py-2 border border-theme-border rounded-lg bg-theme-surface">
                        Cancel
                    </button>

                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-[#F54900] text-white rounded-lg">
                        <Save size={18} />
                        Save Product
                    </button>

                </div>

            </div>



            <div className="flex w-fit p-1 gap-6 mb-6 border bg-[#F1F5F9] rounded-lg border-[#E2E8F0]">

                {tabs.map((tab) => {

                    const active = activeProductTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveProductTab(tab.id)}
                            className={`px-4 py-2 text-[15px] rounded-lg transition ${active
                                ? "bg-[#F8FAFC] text-[#111827] font-medium shadow-sm"
                                : "text-[#64748B]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}

            </div>



            {activeProductTab === "general" && (
                <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

                    <h3 className="font-playfair text-xl mb-6">
                        Basic Details
                    </h3>



                    <div className="space-y-6">

                        <div>
                            <label className="text-[#374151] font-medium">
                                Product Name
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Organic Whole Milk"
                                className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                            />
                            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                        </div>



                        <div>
                            <label className="text-[#374151] font-medium">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your product..."
                                rows={5}
                                className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                            />
                            {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
                        </div>



                        <div className="grid md:grid-cols-2 gap-6">

                            <div>
                                <label className="text-[#374151] font-medium">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                >
                                    <option value="">Select Category</option>
                                    <option>Dairy</option>
                                    <option>Bakery</option>
                                    <option>Produce</option>
                                    <option>Pantry</option>
                                </select>
                                {fieldErrors.category && <p className="text-red-500 text-xs mt-1">{fieldErrors.category}</p>}
                            </div>



                            <div>
                                <label className="text-[#374151] font-medium">
                                    SKU
                                </label>

                                <input
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    placeholder="e.g. DY-001"
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                />
                                {fieldErrors.sku && <p className="text-red-500 text-xs mt-1">{fieldErrors.sku}</p>}
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {activeProductTab === "pricing" && (
                <div className="space-y-6">

                    <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

                        <h3 className="font-playfair text-xl mb-6">
                            Pricing
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>
                                <label className="text-[#374151] font-medium">
                                    Base Price ($)
                                </label>

                                <input
                                    name="basePrice"
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                />
                                {fieldErrors.basePrice && <p className="text-red-500 text-xs mt-1">{fieldErrors.basePrice}</p>}
                            </div>



                            <div>
                                <label className="text-[#374151] font-medium">
                                    Discount Price ($)
                                </label>

                                <input
                                    name="discountPrice"
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                />
                            </div>

                        </div>

                    </div>



                    <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

                        <h3 className="font-playfair text-xl mb-6">
                            Inventory
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>
                                <label className="text-[#374151] font-medium">
                                    Stock Quantity
                                </label>

                                <input
                                    name="stock"
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                />
                                {fieldErrors.stock && <p className="text-red-500 text-xs mt-1">{fieldErrors.stock}</p>}
                            </div>



                            <div>
                                <label className="text-[#374151] font-medium">
                                    Low Stock Alert Level
                                </label>

                                <input
                                    name="lowStock"
                                    onChange={handleChange}
                                    placeholder="5"
                                    className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
                                />
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {activeProductTab === "images" && (

                <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

                    <h3 className="font-playfair text-xl mb-6">
                        Product Images
                    </h3>

                    <label className="block">

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl py-14 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">

                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>

                            <p className="mt-4 text-lg font-medium text-theme-text">
                                Click to upload images
                            </p>

                            <p className="text-theme-muted mt-1">
                                SVG, PNG, JPG or GIF (max. 5MB)
                            </p>

                        </div>

                    </label>

                </div>

            )}

            {activeProductTab === "shipping" && (

  <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

    <h3 className="font-playfair text-xl mb-6">
      Shipping Information
    </h3>


    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <label className="text-[#374151] font-medium">
          Weight (kg)
        </label>

        <input
          name="weight"
          onChange={handleChange}
          placeholder="0.00"
          className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
        />
        {fieldErrors.weight && <p className="text-red-500 text-xs mt-1">{fieldErrors.weight}</p>}
      </div>



      <div>
        <label className="text-[#374151] font-medium">
          Shipping Class
        </label>

        <select
          name="shippingClass"
          onChange={handleChange}
          className="w-full mt-2 border outline-none border-theme-border rounded-lg px-4 py-3"
        >
          <option value="">Select Class</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="priority">Priority</option>
        </select>
      </div>

    </div>



    <div className="mt-6">

      <label className="text-[#374151] font-medium block mb-3">
        Dimensions (L x W x H) cm
      </label>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          name="length"
          onChange={handleChange}
          placeholder="Length"
          className="border border-theme-border outline-none rounded-lg px-4 py-3"
        />

        <input
          name="width"
          onChange={handleChange}
          placeholder="Width"
          className="border border-theme-border outline-none rounded-lg px-4 py-3"
        />

        <input
          name="height"
          onChange={handleChange}
          placeholder="Height"
          className="border border-theme-border outline-none rounded-lg px-4 py-3"
        />

      </div>

    </div>



    <div className="border-t border-theme-border mt-6 pt-6">

      <label className="flex items-start gap-3 cursor-pointer">

        <input
          type="checkbox"
          name="freeShipping"
          checked={form.freeShipping}
          onChange={handleChange}
          className="mt-1 accent-[#F54900]"
        />

        <div>
          <p className="font-medium text-theme-text">
            Enable Free Shipping for this product
          </p>

          <p className="text-theme-muted text-sm mt-1">
            If checked, shipping costs will be waived for this item.
          </p>
        </div>

      </label>

    </div>

  </div>

)}

        </div>
    )
}