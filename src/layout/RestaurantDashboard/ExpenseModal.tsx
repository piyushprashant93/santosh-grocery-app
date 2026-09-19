import { X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ExpenseModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess?: () => void }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Inventory',
    date: '',
    status: 'Pending',
    type: 'Variable'
  })
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    if (!form.title || !form.amount || !form.date) return toast.error("Please fill required fields")
    setSaving(true)
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/restaurant-panel/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          category: form.category,
          type: form.type,
          amount: Number(form.amount),
          description: form.title,
          date: form.date
        })
      })
      if (res.ok) {
        toast.success("Expense recorded!")
        onSuccess?.()
        onClose()
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to record expense")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-theme-surface max-w-[500px] w-[96%] rounded-lg lg:rounded-xl lg:p-6 p-3 relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-1 font-playfair">Record New Expense</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the details of the new expense to add it to your records.
        </p>

        <div className="grid grid-cols-2 gap-4">
          
          <div>
            <label className="text-sm font-medium">Expense Title</label>
            <input
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Weekly Veg Supply"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Amount ($)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})}
              placeholder="0.00"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
              <option>Inventory</option>
              <option>Utilities</option>
              <option>Salary</option>
              <option>Rent</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
              <option>Pending</option>
              <option>Paid</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
              <option>Variable</option>
              <option>Fixed</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button disabled={saving} onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#009966] text-white disabled:opacity-50">
            {saving ? "Saving..." : "Record Expense"}
          </button>
        </div>

      </div>
    </div>
  )
}