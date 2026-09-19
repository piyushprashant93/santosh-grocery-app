import { X } from 'lucide-react'

export default function ExpenseModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null

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
              placeholder="e.g. Weekly Veg Supply"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Amount ($)</label>
            <input
              placeholder="0.00"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
              <option>Inventory</option>
              <option>Utilities</option>
              <option>Salary</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
              <option>Pending</option>
              <option>Paid</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="mt-1 w-full border rounded-lg px-3 py-2 outline-none">
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

          <button className="px-4 py-2 rounded-lg bg-[#009966] text-white">
            Record Expense
          </button>
        </div>

      </div>
    </div>
  )
}