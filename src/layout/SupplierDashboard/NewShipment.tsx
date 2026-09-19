import { User, Truck, Package, Plus, MapPin, ArrowLeft, Trash2 } from "lucide-react";
import { extractList } from "../../utils/dataHelper";
import { useState, useEffect } from "react";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export default function CreateShipment({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [items, setItems] = useState([{ product: "", qty: 1, price: 0 }]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    clientId: "",
    shippingMethod: "Standard Ground",
    dispatchDate: "",
    vehicle: "Auto-assign"
  });

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/clients`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setClients(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplier/products`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProducts(extractList(data));
      }
    } catch(err) { console.error(err); }
  };

  const addItem = () => {
    setItems([...items, { product: "", qty: 1, price: 0 }]);
  };
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, i) => acc + i.qty * i.price, 0);
  const shipping = 150;
  const total = subtotal + shipping;

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find(p => p._id === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      product: productId,
      price: selectedProduct ? (selectedProduct.price || selectedProduct.basePrice || 0) : 0
    };
    setItems(newItems);
  };

  const handleConfirm = async () => {
    if (!form.clientId) {
      alert("Please select a client");
      return;
    }
    if (items.length === 0 || !items[0].product) {
      alert("Please add at least one product");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/supplier/logistics`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          items,
          subtotal,
          shipping,
          total
        })
      });
      if (res.ok) {
        alert("Shipment created successfully!");
        setActiveTab("logistics");
      } else {
        alert("Failed to create shipment");
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold cursor-pointer flex items-center gap-2" onClick={() => setActiveTab("dashboard")}>
            <ArrowLeft />
          Create New Shipment
        </h1>

        <p className="text-theme-muted mt-2 lg:text-[18px] text-base">
          Schedule a bulk delivery for a client.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={20} className="text-blue-500" />

            <h3 className="font-playfair text-xl">Client Details</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#374151]">Select Client</label>

              <select value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="w-full border h-12 border-theme-border rounded-lg px-3 py-2 mt-1 outline-none">
                <option value="">Choose a client...</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#374151]">Delivery Address</label>

              <div className="border border-theme-border rounded-lg p-4 mt-1 flex gap-3">
                <MapPin size={18} className="text-theme-muted" />

                <div>
                  <p className="font-medium">
                    {form.clientId ? clients.find(c => c._id === form.clientId)?.name : "Main Distribution Center"}
                  </p>

                  <p className="text-sm text-theme-muted">
                    {form.clientId ? (clients.find(c => c._id === form.clientId)?.address?.street || "123 Supply Chain Blvd, Suite 400") : "123 Supply Chain Blvd, Suite 400"}
                  </p>

                  <p className="text-sm text-theme-muted">
                    {form.clientId ? (clients.find(c => c._id === form.clientId)?.address?.city || "New York, NY 10001") : "New York, NY 10001"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Truck size={20} className="text-blue-500" />

            <h3 className="font-playfair text-xl">Logistics</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#374151]">Shipping Method</label>

              <select value={form.shippingMethod} onChange={(e) => setForm({...form, shippingMethod: e.target.value})} className="w-full border h-12 border-theme-border rounded-lg px-3 py-2 mt-1 outline-none">
                <option value="Standard Ground">Standard Ground</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#374151]">Dispatch Date</label>

              <input
                type="date"
                value={form.dispatchDate}
                onChange={(e) => setForm({...form, dispatchDate: e.target.value})}
                className="w-full border h-12 border-theme-border rounded-lg px-3 py-2 mt-1 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-[#374151]">
                Assign Vehicle (Optional)
              </label>

              <select value={form.vehicle} onChange={(e) => setForm({...form, vehicle: e.target.value})} className="w-full border h-12 border-theme-border rounded-lg px-3 py-2 mt-1 outline-none">
                <option value="Auto-assign">Auto-assign</option>
                <option value="Vehicle 1">Vehicle 1</option>
                <option value="Vehicle 2">Vehicle 2</option>
                <option value="Vehicle 3">Vehicle 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-blue-500" />

            <h3 className="font-playfair text-xl">Shipment Items</h3>
          </div>

          <button
            onClick={addItem}
            className="flex items-center gap-2 text-[#2563EB]"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="grid lg:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center">
              <select value={item.product} onChange={(e) => handleProductChange(i, e.target.value)} className="border border-theme-border h-12 rounded-lg px-3 py-2 outline-none">
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name || p.title}</option>
                ))}
              </select>

              <input
                type="number"
                value={item.qty}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[i].qty = Number(e.target.value);
                  setItems(newItems);
                }}
                className="border border-theme-border h-12 rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="text"
                readOnly
                value={`$ ${item.price.toFixed(2)}`}
                className="border border-theme-border h-12 rounded-lg px-3 py-2 outline-none bg-gray-50 text-gray-500"
              />
              <button onClick={() => removeItem(i)} className="p-3 text-red-500 bg-red-50 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <div className="bg-theme-bg rounded-lg p-6 w-[280px] space-y-2">
            <div className="flex justify-between text-sm text-theme-muted">
              <span>Subtotal</span>

              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-theme-muted">
              <span>Shipping</span>

              <span>$150.00</span>
            </div>

            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>

              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={() => setActiveTab("logistics")} className="text-theme-muted">Cancel</button>

        <button onClick={handleConfirm} className="bg-[#2563EB] h-12 text-theme-text px-6 py-2 rounded-lg shadow">
          Confirm Shipment
        </button>
      </div>
    </div>
  );
}
