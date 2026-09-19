import { X, Loader2 } from "lucide-react";

export interface AddressFormData {
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export const EMPTY_ADDRESS_FORM: AddressFormData = {
  label: "Home",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  isDefault: false,
};

interface AddressModalProps {
  open: boolean;
  isEditing: boolean;
  form: AddressFormData;
  setForm: React.Dispatch<React.SetStateAction<AddressFormData>>;
  error: string;
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
}

const labelOptions = ["Home", "Office", "Other"];

export default function AddressModal({
  open,
  isEditing,
  form,
  setForm,
  error,
  loading,
  onClose,
  onSave,
}: AddressModalProps) {
  if (!open) return null;

  const update = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 !mt-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0F172A] border border-theme-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-theme-border">
          <h3 className="font-playfair text-xl text-theme-text">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-theme-surface text-theme-muted"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-theme-muted mb-1.5 block">
              Label
            </label>
            <div className="flex gap-2">
              {labelOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update("label", opt)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    form.label === opt
                      ? "bg-[#009966] border-[#009966] text-white"
                      : "border-[#1E293B] text-[#94A3B8] hover:border-[#334155]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                Full Name
              </label>
              <input
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                Phone
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-theme-muted mb-1.5 block">
              Street Address
            </label>
            <input
              required
              value={form.street}
              onChange={(e) => update("street", e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                City
              </label>
              <input
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                State
              </label>
              <input
                required
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                Zip Code
              </label>
              <input
                required
                value={form.zipCode}
                onChange={(e) => update("zipCode", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
            <div>
              <label className="text-xs text-theme-muted mb-1.5 block">
                Country
              </label>
              <input
                required
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text text-sm outline-none focus:border-[#009966]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              className="w-4 h-4 accent-[#009966]"
            />
            <span className="text-sm text-theme-muted">
              Set as default address
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#009966] hover:bg-[#00b377] transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Address"
            ) : (
              "Save Address"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}