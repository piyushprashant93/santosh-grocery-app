import { AlertCircle, Plus, TriangleAlertIcon } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function StockAdjustmentModal({open, onClose, onAdjustSuccess}: {open: boolean; onClose: () => void; onAdjustSuccess?: () => void}) {

    const [products, setProducts] = useState<any[]>([]);
    const [form, setForm] = useState({
        productId: "",
        type: "Stock In",
        quantity: "",
        binLocation: "",
        reason: ""
    });

    useEffect(() => {
        if (open) {
            fetchProducts();
        }
    }, [open]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/supplier/products`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                const fetched = data.data?.products || data.products || (Array.isArray(data.data) ? data.data : []);
                setProducts(Array.isArray(fetched) ? fetched : []);
            }
        } catch(err) { console.error(err); }
    };

    const handleConfirm = async () => {
        if (!form.productId || !form.quantity) {
            alert("Please select a product and enter a quantity.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/supplier/warehouse/adjust`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(form)
            });
            if (res.ok) {
                alert("Stock adjusted successfully!");
                if (onAdjustSuccess) onAdjustSuccess();
                onClose();
            } else {
                alert("Failed to adjust stock.");
            }
        } catch(err) { console.error(err); }
    };

    if (!open) return null

    return (
        
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >

            <div
                className="bg-[#fff] max-w-[640px] w-[96%] max-h-[95vh] rounded-xl shadow-xl overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-start p-6 border-b bg-[#F8FAFC80]">

                    <div>

                        <h3 className="font-playfair text-2xl">
                            Stock Adjustment
                        </h3>

                        <p className="text-[#64748B] mt-1">
                            Manually adjust inventory levels for a product.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-[#64748B]"
                    >
                        ✕
                    </button>

                </div>



                <div className="p-6 space-y-6 bg-white">

                    <div>

                        <label className="text-sm text-[#374151]">
                            Product
                        </label>

                        <select value={form.productId} onChange={(e) => setForm({...form, productId: e.target.value})} className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none">
                            <option value="">Select product</option>
                            {Array.isArray(products) && products.map(p => (
                                <option key={p._id} value={p._id}>{p.name || p.title}</option>
                            ))}
                        </select>

                    </div>



                    <div>

                        <label className="text-sm text-[#374151] mb-2 block">
                            Adjustment Type
                        </label>

                        <div className="grid grid-cols-3 gap-3">

                            <button onClick={() => setForm({...form, type: "Stock In"})} className={`border ${form.type === "Stock In" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-1`}>
                                <Plus size={20} />
                                Stock In
                            </button>

                            <button onClick={() => setForm({...form, type: "Correction"})} className={`border ${form.type === "Correction" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-1`}>
                                <AlertCircle size={20} />
                                Correction
                            </button>

                            <button onClick={() => setForm({...form, type: "Loss/Damage"})} className={`border ${form.type === "Loss/Damage" ? "border-[#3B82F6] bg-blue-50 text-[#155DFC]" : "border-[#E5E7EB]"} rounded-lg py-4 flex flex-col items-center gap-1`}>
                                <TriangleAlertIcon size={20} />
                                Loss/Damage
                            </button>

                        </div>

                    </div>



                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="text-sm text-[#374151]">
                                Quantity
                            </label>

                            <input
                                type="number"
                                placeholder="0"
                                value={form.quantity}
                                onChange={(e) => setForm({...form, quantity: e.target.value})}
                                className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none"
                            />

                        </div>

                        <div>

                            <label className="text-sm text-[#374151]">
                                Bin Location
                            </label>

                            <input
                                placeholder="e.g. A-12-05"
                                value={form.binLocation}
                                onChange={(e) => setForm({...form, binLocation: e.target.value})}
                                className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none"
                            />

                        </div>

                    </div>



                    <div>

                        <label className="text-sm text-[#374151]">
                            Reason / Notes
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Explain the reason for this adjustment..."
                            value={form.reason}
                            onChange={(e) => setForm({...form, reason: e.target.value})}
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-3 mt-1 outline-none"
                        />

                    </div>

                </div>



                <div className="flex justify-end gap-4 border-t p-6 bg-[#F8FAFC80]">

                    <button
                        onClick={onClose}
                        className="text-[#64748B]"
                    >
                        Cancel
                    </button>

                    <button onClick={handleConfirm} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg shadow">
                        Confirm
                    </button>

                </div>

            </div>

        </div>

    )

}