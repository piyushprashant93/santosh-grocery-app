import { useEffect, useState } from "react";
import { MapPin, Plus, Loader2, Check, Pencil, Trash2 } from "lucide-react";
import AddressModal, {
  AddressFormData,
  EMPTY_ADDRESS_FORM,
} from "../AddressModal";

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

interface AddressApi extends AddressFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddressStep() {
  const [addresses, setAddresses] = useState<AddressApi[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] =
    useState<AddressFormData>(EMPTY_ADDRESS_FORM);
  const [addressError, setAddressError] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const ADDRESS_STORAGE_KEY = "checkout_address";
  // Delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const getToken = () => localStorage.getItem("authToken") || "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // ---------- Fetch profile -> addresses ----------
  const fetchAddresses = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load addresses.");
      }

      const list: AddressApi[] = data?.data?.user?.addresses || [];
      setAddresses(list);

      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      setSelectedId(defaultAddr?._id || null);
      if (defaultAddr) {
        localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(defaultAddr)); // 👈 add
      }
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : "Unable to load addresses.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ---------- Add OR Update address ----------
  const handleSaveAddress = async () => {
    setAddressSaving(true);
    setAddressError("");

    const isEdit = isEditingAddress && !!editingAddressId;

    try {
      const res = await fetch(
        isEdit
          ? `${API_BASE}/users/addresses/${editingAddressId}`
          : `${API_BASE}/users/addresses`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(addressForm),
        },
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data?.message ||
            (isEdit ? "Failed to update address." : "Failed to save address."),
        );
      }

      const updatedList: AddressApi[] = data?.data?.addresses || [];
      setAddresses(updatedList);

      const newDefault = updatedList.find((a) => a.isDefault);
      const targetId = isEdit
        ? editingAddressId
        : updatedList[updatedList.length - 1]?._id;
      setSelectedId(newDefault?._id || targetId || null);

      setShowAddressModal(false);
      setAddressError("");
      setEditingIndex(null);
      setEditingAddressId(null);
      setIsEditingAddress(false);
      setAddressForm(EMPTY_ADDRESS_FORM);
    } catch (err: unknown) {
      setAddressError(
        err instanceof Error ? err.message : "Unable to save address.",
      );
    } finally {
      setAddressSaving(false);
    }
  };

  // ---------- Delete address ----------
  const handleDeleteAddress = async (addressId: string) => {
    setDeletingId(addressId);
    setDeleteError("");

    try {
      const res = await fetch(`${API_BASE}/users/addresses/${addressId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to delete address.");
      }

      const updatedList: AddressApi[] =
        data?.data?.addresses ?? addresses.filter((a) => a._id !== addressId);

      setAddresses(updatedList);

      setSelectedId((prev) => {
        if (prev !== addressId) return prev;
        const newDefault = updatedList.find((a) => a.isDefault);
        return newDefault?._id || updatedList[0]?._id || null;
      });

      setConfirmDeleteId(null);
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete address.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border-theme-border border rounded-xl p-6 bg-theme-surface">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-playfair text-theme-text">
          Choose a delivery address
        </h2>
      </div>

      {deleteError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
          {deleteError}
          <button
            onClick={() => setDeleteError("")}
            className="text-red-400 hover:text-red-300 ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-theme-muted py-12">
          <Loader2 size={20} className="animate-spin" />
          Loading addresses...
        </div>
      )}

      {!loading && fetchError && (
        <p className="text-red-400 text-sm py-6">{fetchError}</p>
      )}

      {!loading && !fetchError && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-theme-border rounded-xl">
          <MapPin size={32} className="text-theme-muted" />
          <p className="text-theme-muted text-sm">
            No saved addresses yet. Add one to continue.
          </p>
          <button
            onClick={() => {
              setIsEditingAddress(false);
              setEditingIndex(null);
              setEditingAddressId(null);
              setAddressForm(EMPTY_ADDRESS_FORM);
              setAddressError("");
              setShowAddressModal(true);
            }}
            className="flex items-center justify-center gap-2 text-sm bg-theme-surface text-[#000] w-max px-6 py-2.5 rounded-lg border border-theme-border hover:border-[#00BC7D] transition mt-2"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>
      )}

      {!loading && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr, i) => {
            const isSelected = selectedId === addr._id;
            const isConfirmingDelete = confirmDeleteId === addr._id;
            const isDeleting = deletingId === addr._id;

            return (
              <div
                key={addr._id}
                className={`rounded-xl border transition ${
                  isSelected
                    ? "border-[#009966] bg-[#00BC7D0F]"
                    : "border-theme-border hover:border-gray-400"
                }`}
              >
                <div
                  onClick={() => {
                    if (!isConfirmingDelete) {
                      setSelectedId(addr._id);
                      localStorage.setItem(
                        ADDRESS_STORAGE_KEY,
                        JSON.stringify(addr),
                      );
                    }
                  }}
                  className="flex items-start gap-4 p-4 cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#009966]" : "bg-gray-100 border border-theme-border"
                    }`}
                  >
                    <MapPin size={16} className="text-theme-text" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-theme-text">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#009966] text-white px-2 py-0.5 rounded-full">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-theme-muted mt-1">
                      {addr.fullName} • {addr.phone}
                    </p>
                    <p className="text-sm text-theme-muted mt-0.5">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode},{" "}
                      {addr.country}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingAddress(true);
                        setEditingIndex(i);
                        setEditingAddressId(addr._id);
                        setAddressForm({
                          label: addr.label,
                          fullName: addr.fullName,
                          phone: addr.phone,
                          street: addr.street,
                          city: addr.city,
                          state: addr.state,
                          zipCode: addr.zipCode,
                          country: addr.country,
                          isDefault: addr.isDefault,
                        });
                        setAddressError("");
                        setShowAddressModal(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-theme-surface text-theme-muted"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteError("");
                        setConfirmDeleteId(addr._id);
                      }}
                      disabled={isDeleting}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-theme-muted hover:text-red-400 disabled:opacity-60"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline delete confirmation */}
                {isConfirmingDelete && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between gap-3 px-4 pb-4"
                  >
                    <p className="text-sm text-theme-muted">
                      Delete this address? This cannot be undone.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-theme-border text-theme-muted hover:border-[#334155]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white disabled:opacity-60"
                      >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={() => {
              setIsEditingAddress(false);
              setEditingIndex(null);
              setEditingAddressId(null);
              setAddressForm(EMPTY_ADDRESS_FORM);
              setAddressError("");
              setShowAddressModal(true);
            }}
            className="flex items-center justify-center gap-2 text-sm bg-theme-surface text-[#000] w-full border border-theme-border hover:border-[#00BC7D] px-4 py-4 rounded-lg transition"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>
      )}

      <AddressModal
        open={showAddressModal}
        isEditing={isEditingAddress}
        form={addressForm}
        setForm={setAddressForm}
        error={addressError}
        loading={addressSaving}
        onClose={() => {
          setShowAddressModal(false);
          setAddressError("");
          setEditingIndex(null);
          setEditingAddressId(null);
          setIsEditingAddress(false);
          setAddressForm(EMPTY_ADDRESS_FORM);
        }}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
