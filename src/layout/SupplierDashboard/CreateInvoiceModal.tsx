import { X, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function CreateInvoiceModal({ open, onClose, onInvoiceCreated }: { open: boolean, onClose: () => void, onInvoiceCreated?: () => void }) {

    const [items, setItems] = useState([{ desc: "", qty: 1, price: "" }])
    const [clients, setClients] = useState<any[]>([]);
    const [form, setForm] = useState({
        clientId: "",
        dueDate: "",
    });

    useEffect(() => {
        if (open) {
            fetchClients();
        }
    }, [open]);

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_BASE}/supplier/clients`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                setClients(data.data?.clients || data.clients || data.data || []);
            }
        } catch (err) { console.error(err); }
    };

    const addItem = () => {
        setItems([...items, { desc: "", qty: 1, price: "" }])
    }

    const removeItem = (i: number) => {
        setItems(items.filter((_, index) => index !== i))
    }

    const subtotal = items.reduce((acc, item) => acc + (item.qty * (Number(item.price) || 0)), 0);
    const tax = subtotal * 0; // Assuming 0% tax for now
    const total = subtotal + tax;

    const handleCreateInvoice = async () => {
        if (!form.clientId || !form.dueDate) {
            alert("Please select a client and due date.");
            return;
        }
        if (items.some(i => !i.desc || !i.price)) {
            alert("Please fill out all item descriptions and prices.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/supplier/finance/invoice`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    ...form,
                    items,
                    subtotal,
                    tax,
                    total
                })
            });

            if (res.ok) {
                alert("Invoice created successfully!");
                if (onInvoiceCreated) onInvoiceCreated();
                onClose();
            } else {
                alert("Failed to create invoice.");
            }
        } catch (err) { console.error(err); }
    };

    if (!open) return null

    return (

        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            onClick={onClose}
        >

            <div
                className="bg-white max-w-[756px] w-[95%] rounded-xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-start p-6 border-b">

                    <div>

                        <h3 className="font-playfair text-2xl">
                            New Invoice
                        </h3>

                        <p className="text-[#64748B] mt-1">
                            Create a new invoice for a client.
                        </p>

                    </div>

                    <button onClick={onClose} className="text-[#64748B]">
                        <X size={20} />
                    </button>

                </div>



                <div className="p-6 space-y-6">

                    <div className="grid grid-cols-2 gap-6">

                        <div>

                            <label className="text-sm text-[#62748E]">
                                CLIENT
                            </label>

                            <select value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none">
                                <option value="">Select client</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                        </div>



                        <div>

                            <label className="text-sm text-[#62748E]">
                                DUE DATE
                            </label>

                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({...form, dueDate: e.target.value})}
                                className="w-full border border-[#E5E7EB] rounded-lg h-12 px-3 mt-1 outline-none"
                            />

                        </div>

                    </div>



                    <div>

                        <div className="flex justify-between items-center mb-3">

                            <p className="text-sm text-[#62748E]">
                                LINE ITEMS
                            </p>

                            <button
                                onClick={addItem}
                                className="flex items-center gap-2 text-[#2563EB]"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>

                        </div>



                        <div className="space-y-3">

                            {items.map((item, i) => (

                                <div key={i} className="grid grid-cols-[1fr_120px_140px_auto] gap-3">

                                    <input
                                        placeholder="Item Description"
                                        value={item.desc}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[i].desc = e.target.value;
                                            setItems(newItems);
                                        }}
                                        className="border border-[#E5E7EB] rounded-lg h-12 px-3 outline-none"
                                    />

                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[i].qty = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                        className="border border-[#E5E7EB] rounded-lg h-12 px-3 outline-none"
                                    />

                                    <input
                                        placeholder="Price"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[i].price = e.target.value;
                                            setItems(newItems);
                                        }}
                                        className="border border-[#E5E7EB] rounded-lg h-12 px-3 outline-none"
                                    />

                                    <button
                                        onClick={() => removeItem(i)}
                                        className="text-[#94A3B8]"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>



                    <div className="border-t pt-6 flex justify-end">

                        <div className="w-[260px] space-y-2 text-sm">

                            <div className="flex justify-between text-[#64748B]">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-[#64748B]">
                                <span>Tax (0%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-[#0F172A] font-semibold text-lg pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                        </div>

                    </div>

                </div>



                <div className="flex justify-end gap-6 border-t p-6">

                    <button onClick={onClose} className="text-[#64748B]">
                        Cancel
                    </button>

                    <button onClick={handleCreateInvoice} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg shadow">
                        Create Invoice
                    </button>

                </div>

            </div>

        </div>

    )
}