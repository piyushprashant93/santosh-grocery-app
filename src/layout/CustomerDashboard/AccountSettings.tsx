import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
} from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Bell,
  Globe,
  Moon,
  Smartphone,
  MapPin,
  Home,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddressModal from "./AddressModal";
import { QRCodeSVG } from "qrcode.react";
import { useTheme } from "./ThemeContext";
import { useCurrency } from "./CurrencyContext";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  membershipTier: string;
  walletBalance: number;
  fullName: string;
};

type AddressForm = {
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

const EMPTY_ADDRESS_FORM: AddressForm = {
  label: "",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
};

type TwoFASetupData = {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
};

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

export default function AccountSettings() {
  const { setTheme } = useTheme();
  const { setCurrency } = useCurrency();
  const [tab, setTab] = useState("Profile");
  const navigate = useNavigate();
  const [toggles, setToggles] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: true,
  });
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null,
    membershipTier: "Free",
    walletBalance: 0,
    fullName: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressError, setAddressError] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrData, setQrData] = useState<TwoFASetupData | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [addressForm, setAddressForm] =
    useState<AddressForm>(EMPTY_ADDRESS_FORM);

  const [preferences, setPreferences] = useState({
    language: "",
    currency: "",
    darkMode: false,
  });

  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesSuccess, setPreferencesSuccess] = useState("");
  const [show2FADisableModal, setShow2FADisableModal] = useState(false);
  const [disable2FACode, setDisable2FACode] = useState("");
  const [disable2FALoading, setDisable2FALoading] = useState(false);
  const [disable2FAError, setDisable2FAError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleteAddressLoading, setDeleteAddressLoading] = useState(false);
  const [deleteAddressError, setDeleteAddressError] = useState("");
  
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);
  const [regenerateError, setRegenerateError] = useState("");
  
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const publishUserUpdate = (updates: Record<string, unknown>) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const nextUser = {
      ...storedUser,
      ...updates,
    };

    localStorage.setItem("user", JSON.stringify(nextUser));
    window.dispatchEvent(new CustomEvent("user-updated", { detail: nextUser }));
  };

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  useEffect(() => {
    setProfileImage(profile.avatar || null);
  }, [profile.avatar]);

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    setProfileError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setProfileError("No auth token found.");
      setLoadingProfile(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load profile.");
      }

      const fetchedUser = data?.data?.user;
      if (fetchedUser) {
        setProfile({
          firstName: fetchedUser.firstName || "",
          lastName: fetchedUser.lastName || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
          avatar: fetchedUser.avatar || null,
          membershipTier: fetchedUser.membershipTier || "Free",
          walletBalance: fetchedUser.walletBalance || 0,
          fullName:
            fetchedUser.fullName ||
            `${fetchedUser.firstName || ""} ${fetchedUser.lastName || ""}`,
        });
        setAddresses(fetchedUser.addresses || []);
      }
    } catch (fetchError) {
      setProfileError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load profile.",
      );
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleAddAddress = () => {
    setAddressError("");
    setIsEditingAddress(false);
    setEditingIndex(null);
    setAddressForm(EMPTY_ADDRESS_FORM);
    setShowAddressModal(true);
  };

  const handleEditAddress = (index: number) => {
    const address = addresses[index];

    setEditingIndex(index);

    setAddressForm({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
      isDefault: !!address.isDefault,
    });

    setIsEditingAddress(true);
    setAddressError("");
    setShowAddressModal(true);
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessage({
        type: "error",
        text: "Authentication token not found.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") ||
            data.message ||
            "Failed to update profile.",
        );
      }

      // API may return updated user or just success
      const updatedUser = data.data?.user ?? {
        ...profile,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      };

      setProfile((prev) => ({
        ...prev,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      }));

      publishUserUpdate({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      });

      setIsEditing(false);

      setMessage({
        type: "success",
        text: data.message || "Profile updated successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  const uploadProfileImage = async (file: File) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_BASE}/users/profile/image/upload`, {
        method: "POST",
        headers: {
          // Content-Type intentionally omitted — browser sets correct
          // multipart/form-data boundary automatically for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed.");
      }

      const avatar = data.data?.user?.avatar ?? data.data?.avatar ?? null;

      setProfile((prev) => ({
        ...prev,
        avatar,
      }));

      setProfileImage(avatar);

      publishUserUpdate({
        avatar,
      });

      setMessage({
        type: "success",
        text: data.message || "Profile image updated.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Maximum file size is 5MB.",
      });
      e.target.value = "";
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only image files are allowed (jpg, png, webp, gif).",
      });
      e.target.value = "";
      return;
    }

    await uploadProfileImage(file);

    // reset input so selecting the same file again re-triggers onChange
    e.target.value = "";
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("New password is required.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      setPasswordError("Authentication token not found.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(`${API_BASE}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") ||
            data.message ||
            "Unable to update password.",
        );
      }

      setPasswordSuccess(data.message || "Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordSuccessModal(true);

      setTimeout(() => {
        setShowPasswordSuccessModal(false);

        localStorage.removeItem("authToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("activeTab");
        localStorage.setItem("role", "customer");

        navigate("/role-wise-sign-in?role=customer");
      }, 2000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setDeleteError("Authentication token not found.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await fetch(`${API_BASE}/users/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") ||
            data.message ||
            "Unable to delete account.",
        );
      }

      //   localStorage.clear();

      navigate("/role-wise-sign-in?role=customer");
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteAccountModal(false);
    }
  };

  const validateAddressForm = () => {
    if (!addressForm.fullName.trim()) {
      setAddressError("Full name is required.");
      return false;
    }

    if (!addressForm.phone.trim()) {
      setAddressError("Phone is required.");
      return false;
    }

    if (!addressForm.street.trim()) {
      setAddressError("Street is required.");
      return false;
    }

    if (!addressForm.city.trim()) {
      setAddressError("City is required.");
      return false;
    }

    if (!addressForm.zipCode.trim()) {
      setAddressError("zipCode is required.");
      return false;
    }

    if (!/^\d{6}$/.test(addressForm.zipCode)) {
      setAddressError("zipCode must be exactly 6 digits.");
      return false;
    }

    return true;
  };

  const handleSaveAddress = async () => {
    setAddressError("");

    if (!validateAddressForm()) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setAddressError("Authentication token not found.");
      return;
    }

    const payload = {
      label: addressForm.label || "Home",
      fullName: addressForm.fullName,
      phone: addressForm.phone,
      street: addressForm.street,
      city: addressForm.city,
      state: addressForm.state,
      zipCode: addressForm.zipCode,
      country: addressForm.country,
      isDefault: addressForm.isDefault || addresses.length === 0,
    };

    setAddressSaving(true);

    try {
      if (isEditingAddress) {
        if (editingIndex === null) {
          throw new Error("No address selected to edit.");
        }

        const id = addresses[editingIndex]?._id;

        if (!id) {
          throw new Error("Address id not found.");
        }

        const response = await fetch(`${API_BASE}/users/addresses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.errors?.join(", ") ||
              data.message ||
              "Unable to update address.",
          );
        }

        // Refresh from server so isDefault flags across addresses stay in sync
        await fetchProfile();
      } else {
        const response = await fetch(`${API_BASE}/users/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.errors?.join(", ") || data.message || "Unable to add address.",
          );
        }

        if (data.data?.address) {
          setAddresses((prev) => [...prev, data.data.address]);
        } else {
          // Fallback: refresh from server to get canonical data (including _id)
          await fetchProfile();
        }
      }

      setAddressForm(EMPTY_ADDRESS_FORM);
      setEditingIndex(null);
      setIsEditingAddress(false);
      setShowAddressModal(false);
    } catch (err) {
      setAddressError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const notificationItems = [
    {
      title: "Order Updates",
      description: "Receive updates about your order.",
      key: 0,
    },
    {
      title: "Promotions & Offers",
      description: "Receive promotional offers and discounts.",
      key: 1,
    },
    {
      title: "Driver Messages",
      description: "Receive messages from delivery drivers.",
      key: 2,
    },
  ];

  const fetchPreferences = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/users/preferences`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch preferences.");
      }

      const prefs = data.data.preferences;

      setPreferences({
        language: prefs.language,
        currency: prefs.currency,
        darkMode: prefs.darkMode,
      });

      setTheme(prefs.darkMode ? "dark" : "light");
      if (prefs.currency) setCurrency(prefs.currency);

      setToggles({
        0: prefs.notifications.orderUpdates,
        1: prefs.notifications.promotions,
        2: prefs.notifications.push, // Driver Messages
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    void fetchProfile();
    void fetch2FAStatus();
    void fetchPreferences();
  }, [fetchProfile]);

  const handleUpdatePreferences = async () => {
    setPreferencesError("");
    setPreferencesSuccess("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setPreferencesError("Authentication token not found.");
      return;
    }

    setPreferencesLoading(true);

    try {
      const response = await fetch(`${API_BASE}/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...preferences,
          notifications: {
            orderUpdates: toggles[0],
            promotions: toggles[1],
            push: toggles[2],
            email: true,
            sms: false,
            newsletter: false,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.join(", ") ||
            data.message ||
            "Unable to update preferences.",
        );
      }

      setPreferencesSuccess(
        data.message || "Preferences updated successfully.",
      );

      setTheme(preferences.darkMode ? "dark" : "light");
      if (preferences.currency) setCurrency(preferences.currency);
    } catch (err) {
      setPreferencesError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (deleteIndex === null) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setDeleteAddressError("Authentication token not found.");
      return;
    }

    const id = addresses[deleteIndex]?._id;

    if (!id) {
      setDeleteAddressError("Address id not found.");
      return;
    }

    setDeleteAddressLoading(true);
    setDeleteAddressError("");

    try {
      const response = await fetch(`${API_BASE}/users/addresses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete address.");
      }

      await fetchProfile();

      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (err) {
      setDeleteAddressError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDeleteAddressLoading(false);
    }
  };

  const fetch2FAStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setLoading2FA(true);

    try {
      const response = await fetch(`${API_BASE}/auth/2fa/status`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch 2FA status.");
      }

      setTwoFactorEnabled(data.data.twoFactorEnabled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading2FA(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
    void fetch2FAStatus();
  }, [fetchProfile]);

  const handleDisable2FA = async () => {
    setDisable2FAError("");

    if (!disable2FACode.trim()) {
      setDisable2FAError("Please enter your 2FA code or account password.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setDisable2FAError("Authentication token not found.");
      return;
    }

    setDisable2FALoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/2fa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: disable2FACode }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Unable to disable 2FA.");
      }

      setTwoFactorEnabled(false);
      setShow2FADisableModal(false);
      setDisable2FACode("");
    } catch (err) {
      setDisable2FAError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDisable2FALoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setRegenerateError("Authentication token not found.");
      return;
    }
    setRegenerateLoading(true);
    setRegenerateError("");
    
    try {
      const response = await fetch(`${API_BASE}/auth/2fa/backup-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to regenerate backup codes.");
      }
      
      setBackupCodes(data.data?.backupCodes || []);
      setShowBackupCodesModal(true);
    } catch (err) {
      setRegenerateError(err instanceof Error ? err.message : "Something went wrong.");
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRegenerateLoading(false);
    }
  };

  const handleEnable2FAClick = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/2fa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to setup 2FA.");
      }

      setQrData(data.data);
      setOtpCode("");
      setVerifyError("");
      setShow2FAModal(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleVerify2FA = async () => {
    if (!otpCode.trim()) {
      setVerifyError("Please enter OTP.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) return;

    setVerifyLoading(true);
    setVerifyError("");

    try {
      const response = await fetch(`${API_BASE}/auth/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP.");
      }

      setTwoFactorEnabled(true);
      setShow2FAModal(false);

      fetch2FAStatus();
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="lg:text-[34px] text-[24px] font-playfair font-medium text-[#0F172A] dark:text-white">
          Account Settings
        </h1>
        <p className="text-[#6A7282] mt-1 lg:text-lg text-base">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <div className="flex lg:gap-2 gap-1 bg-[#F1F5F9] dark:bg-[#020618] p-1 rounded-lg lg:rounded-xl w-fit">
        {["Profile", "Security", "Preferences", "Addresses"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`sm:px-4 px-2 py-2 rounded-lg text-sm ${
              tab === t ? "bg-white dark:bg-[#0F172A] shadow-sm" : "text-[#475569] dark:text-[#94A3B8]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message.text && (
        <p
          className={`text-sm p-3 w-full rounded-lg ${
            message.type === "success"
              ? "text-green-600 bg-green-200"
              : "text-red-500 bg-red-200"
          }`}
        >
          {message.text}
        </p>
      )}

      {tab === "Profile" && (
        <div className="border border-[#E5E7EB] dark:border-[#1E293B] lg:rounded-xl rounded-lg lg:p-8 p-3 bg-white dark:bg-[#0F172A] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] space-y-8">
          <div>
            <h2 className="font-playfair text-xl text-[#0F172A] dark:text-white">
              Personal Information
            </h2>
            <p className="text-[#6A7282]">Update your personal details here.</p>
          </div>
          {loadingProfile ? (
            <p className="text-[#6A7282]">Loading profile...</p>
          ) : profileError ? (
            <p className="text-[#F87171]">{profileError}</p>
          ) : null}

          <div className="flex items-center lg:gap-6 gap-3">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="md:min-w-24 md:w-24 md:h-24 w-16 h-16 min-w-16 rounded-full object-cover"
                />
              ) : (
                <div className="md:min-w-24 md:w-24 md:h-24 w-16 h-16 min-w-16 rounded-full bg-gray-100 text-black flex items-center justify-center font-semibold md:text-3xl text-xl">
                  {initials || "U"}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 md:w-8 md:h-8 w-5 h-5 bg-[#009966] text-white rounded-full flex items-center justify-center shadow"
              >
                <Camera className="md:w-4 w-3" />
              </button>
            </div>

            <div>
              <p className="font-playfair text-lg text-[#0F172A] dark:text-white">
                Profile Picture
              </p>

              <p className="text-[#6A7282] lg:text-sm text-xs">
                Supports JPG, PNG, WEBP, and GIF files (max. 5 MB).
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#475569] dark:text-[#94A3B8]">First Name</label>
              <div className="mt-1 w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 flex items-center gap-1">
                <User size={16} className="text-[#94A3B8]" />
                <input
                  value={profile.firstName}
                  disabled={!isEditing}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setProfile((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  className={`ml-2 flex-1 outline-none ${
                    !isEditing
                      ? "bg-transparent cursor-not-allowed text-gray-500 dark:text-[#94A3B8]"
                      : ""
                  } bg-transparent dark:text-white`}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#475569] dark:text-[#94A3B8]">Last Name</label>
              <div className="mt-1 w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 flex items-center gap-1">
                <User size={16} className="text-[#94A3B8]" />
                <input
                  value={profile.lastName}
                  disabled={!isEditing}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setProfile((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  className={`ml-2 flex-1 outline-none ${
                    !isEditing
                      ? "bg-transparent cursor-not-allowed text-gray-500 dark:text-[#94A3B8]"
                      : ""
                  } bg-transparent dark:text-white`}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#475569] dark:text-[#94A3B8]">Email Address</label>
              <div className="mt-1 w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 flex items-center gap-1 bg-gray-50 dark:bg-[#020618]">
                <Mail size={16} className="text-[#94A3B8]" />
                <input
                  value={profile.email}
                  disabled
                  className="ml-2 flex-1 outline-none bg-transparent cursor-not-allowed text-gray-500 dark:text-[#94A3B8] bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#475569] dark:text-[#94A3B8]">Phone Number</label>
              <div className="mt-1 w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 flex items-center gap-1">
                <Phone size={16} className="text-[#94A3B8]" />
                <input
                  value={profile.phone}
                  disabled={!isEditing}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setProfile((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className={`ml-2 flex-1 outline-none ${
                    !isEditing
                      ? "bg-transparent cursor-not-allowed text-gray-500 dark:text-[#94A3B8]"
                      : ""
                  } bg-transparent dark:text-white`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  void handleUpdateProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              className="border border-[#E5E7EB] dark:border-[#1E293B] px-5 py-2 rounded-lg bg-white dark:bg-[#0F172A] shadow-sm w-fit"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      )}

      {tab === "Security" && (
        <div className="border border-[#E5E7EB] dark:border-[#1E293B] lg:rounded-xl rounded-lg lg:p-8 p-3 bg-white dark:bg-[#0F172A] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] space-y-8">
          <div>
            <h2 className="font-playfair text-xl">Password & Security</h2>
            <p className="text-[#6A7282]">
              Manage your password and security settings.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <p className="font-playfair text-lg">Change Password</p>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 pr-12 outline-none bg-transparent dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#94A3B8]"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 pr-12 outline-none bg-transparent dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#94A3B8]"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-4 py-3 pr-12 outline-none bg-transparent dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#94A3B8]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}

            {passwordSuccess && (
              <p className="text-green-600 text-sm">{passwordSuccess}</p>
            )}

            <button
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="bg-[#009966] text-white px-6 py-3 rounded-lg disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <h3 className="font-playfair text-lg">
                Two-Factor Authentication
              </h3>
              <p className="text-[#6A7282] text-sm">
                Add an extra layer of security to your account.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {loading2FA ? (
                <span className="text-gray-500 dark:text-[#94A3B8] text-sm">Loading...</span>
              ) : (
                <span
                  className={`text-sm border px-3 py-1 rounded-full ${
                    twoFactorEnabled
                      ? "text-green-600 border-green-200 bg-green-50"
                      : "text-red-500 border-red-200 bg-red-50"
                  }`}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>
          </div>
          {twoFactorEnabled ? (
            <div className="flex gap-2">
              <button
                onClick={handleRegenerateBackupCodes}
                disabled={regenerateLoading}
                className="border border-[#E5E7EB] dark:border-[#1E293B] px-4 py-2 rounded-lg hover:bg-gray-50 dark:bg-[#020618] disabled:opacity-50 text-sm md:text-base"
              >
                {regenerateLoading ? "Regenerating..." : "Regenerate Backup Codes"}
              </button>
              <button
                onClick={() => {
                  setDisable2FAError("");
                  setDisable2FACode("");
                  setShow2FADisableModal(true);
                }}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 text-sm md:text-base"
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnable2FAClick}
              className="border border-[#E5E7EB] dark:border-[#1E293B] px-4 py-2 rounded-lg"
            >
              Enable 2FA
            </button>
          )}
        </div>
      )}

      {tab === "Preferences" && (
        <div className="space-y-6">
          <div className="border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg lg:rounded-xl lg:p-8 p-3 bg-white dark:bg-[#0F172A] space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="text-[#009966]" size={20} />
              <h3 className="font-playfair text-lg">Notifications</h3>
            </div>

            {notificationItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-[#0F172A] dark:text-white">{item.title}</p>
                  <p className="text-sm text-[#6A7282]">{item.description}</p>
                </div>

                <button
                  onClick={() =>
                    setToggles((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={`w-12 p-0.5 flex items-center rounded-full transition ${
                    toggles[item.key]
                      ? "bg-[#009966] justify-end"
                      : "bg-[#CBD5E1] justify-start"
                  }`}
                >
                  <span className="w-5 h-5 bg-white dark:bg-[#0F172A] rounded-full shadow" />
                </button>
              </div>
            ))}

            <div className="border-t border-[#E5E7EB] dark:border-[#1E293B] my-6"></div>

            <div className="">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-blue-500" size={20} />
                <h3 className="font-playfair text-lg">Preferences</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-[#475569] dark:text-[#94A3B8]">Language</label>

                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="mt-2 w-full h-11 px-3 border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg outline-none bg-transparent text-[#0F172A] dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#475569] dark:text-[#94A3B8]">Currency</label>

                  <select
                    value={preferences.currency}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        currency: e.target.value,
                      })
                    }
                    className="mt-2 w-full h-11 px-3 border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg outline-none bg-transparent text-[#0F172A] dark:text-white"
                  >
                    <option value="NPR">NPR</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] dark:border-[#1E293B] my-6"></div>

              <div className="flex items-center gap-3">
                <Moon className="text-purple-500" />
                <h3 className="font-playfair text-lg">Appearance</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-5">
                <label
                  className={`border-2 rounded-lg lg:rounded-xl p-6 text-center cursor-pointer transition ${
                    preferences.darkMode
                      ? "border-[#009966] bg-[#F0FDF4] dark:bg-[#022c1e] dark:border-[#009966] text-[#009966]"
                      : "border-[#E5E7EB] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    checked={preferences.darkMode}
                    onChange={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        darkMode: true,
                      }))
                    }
                    className="hidden"
                  />
                  <Moon className="mx-auto mb-2" />
                  <span className="block font-medium">Dark Mode</span>
                </label>
                <label
                  className={`border-2 rounded-lg lg:rounded-xl p-6 text-center cursor-pointer transition ${
                    !preferences.darkMode
                      ? "border-[#009966] bg-[#F0FDF4] dark:bg-[#022c1e] dark:border-[#009966] text-[#009966]"
                      : "border-[#E5E7EB] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    checked={!preferences.darkMode}
                    onChange={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        darkMode: false,
                      }))
                    }
                    className="hidden"
                  />
                  <Smartphone className="mx-auto mb-2" />
                  <span className="block font-medium">Light Mode</span>
                </label>
              </div>

              {preferencesError && (
                <p className="text-red-500 text-sm mt-5">{preferencesError}</p>
              )}

              {preferencesSuccess && (
                <p className="text-green-600 text-sm mt-5">
                  {preferencesSuccess}
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpdatePreferences}
                  disabled={preferencesLoading}
                  className="bg-[#009966] text-white px-6 py-3 rounded-lg disabled:opacity-60"
                >
                  {preferencesLoading ? "Updating..." : "Update Preferences"}
                </button>
              </div>
            </div>
          </div>

          <div className="border border-red-200 bg-red-50 rounded-lg lg:rounded-xl lg:p-6 p-3">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="text-[#E7000B]" />
              <h3 className="font-playfair text-lg text-[#E7000B]">
                Danger Zone
              </h3>
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-red-600 font-playfair">Delete Account</h3>
                <p className="text-red-500 text-sm">
                  Permanently remove your account and data.
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteAccountModal(true);
                }}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "Addresses" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={handleAddAddress}
            className="border cursor-pointer border-[#E5E7EB] dark:border-[#1E293B] lg:rounded-xl rounded-lg lg:p-6 p-3 flex flex-col items-center justify-center text-[#6A7282] bg-[#fff]"
          >
            <span className="bg-[#F3F4F6] rounded-full w-[54px] h-[54px] flex justify-center items-center">
              <MapPin size={28} />
            </span>
            <p className="mt-3">Add New Address</p>
          </div>

          {addresses.map((address, index) => (
            <div
              key={address._id || index}
              className="border border-[#34D399] lg:rounded-xl rounded-lg lg:p-6 p-3 bg-white dark:bg-[#0F172A] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-[#009966]" />

                  <div>
                    <h3 className="font-playfair text-lg">
                      {address.label || `Address ${index + 1}`}
                    </h3>

                    <p className="text-xs text-[#6A7282]">{address.fullName}</p>
                  </div>
                </div>

                {address.isDefault && (
                  <span className="bg-[#009966] text-white text-xs px-3 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm text-[#6A7282]">
                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">Phone:</span>{" "}
                  {address.phone}
                </p>

                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">Street:</span>{" "}
                  {address.street}
                </p>

                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">City:</span>{" "}
                  {address.city}
                </p>

                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">State:</span>{" "}
                  {address.state}
                </p>

                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">Zip Code:</span>{" "}
                  {address.zipCode}
                </p>

                <p>
                  <span className="font-medium text-[#0F172A] dark:text-white">Country:</span>{" "}
                  {address.country}
                </p>
              </div>

              <div className="flex gap-4 mt-5 text-sm">
                <button
                  onClick={() => handleEditAddress(index)}
                  className="text-[#6A7282]"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setDeleteIndex(index);
                    setDeleteAddressError("");
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBackupCodesModal(false)}
          />
          <div className="relative bg-white dark:bg-[#0F172A] rounded-xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl">New Backup Codes</h3>
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="text-[#6A7282] hover:text-[#0F172A] dark:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-[#6A7282] mb-4">
              Please save these backup codes in a secure place. They can be used to recover your account if you lose access to your authenticator app.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-2 text-center mb-6">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm tracking-wider font-semibold">
                  {code}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowBackupCodesModal(false)}
              className="w-full bg-[#009966] text-white py-2 rounded-lg"
            >
              I have saved them
            </button>
          </div>
        </div>
      )}

      {show2FADisableModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold text-[#0F172A] dark:text-white">
              Disable Two-Factor Authentication
            </h2>

            <p className="mt-2 text-sm text-[#6A7282]">
              Enter the 6-digit code from your authenticator app.
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={disable2FACode}
              onChange={(e) => setDisable2FACode(e.target.value)}
              className="w-full border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg p-3 mt-4 outline-none bg-transparent dark:text-white"
            />

            {disable2FAError && (
              <p className="mt-3 text-sm text-red-500">{disable2FAError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShow2FADisableModal(false);
                  setDisable2FAError("");
                  setDisable2FACode("");
                }}
                disabled={disable2FALoading}
                className="border border-[#E5E7EB] dark:border-[#1E293B] px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDisable2FA}
                disabled={disable2FALoading}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {disable2FALoading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold">
              Enable Two-Factor Authentication
            </h2>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Scan this QR code using Google Authenticator or Authy.{" "}
              <span className="text-xs text-[#6A7282] mt-2">
                {`(After scanning, open your authenticator app and enter the 6-digit code displayed for this account)`}
              </span>
            </p>

            {qrData && (
              <div className="flex justify-center mt-6">
                <QRCodeSVG value={qrData.otpauthUrl} size={220} includeMargin />
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] mb-2">Secret Key</p>

              <div className="border rounded-lg p-3 break-all">
                {qrData?.secret}
              </div>
            </div>

            <input
              className="w-full border rounded-lg mt-5 p-3"
              placeholder="Enter 6 digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />

            {verifyError && (
              <p className="text-red-500 text-sm mt-3">{verifyError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShow2FAModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleVerify2FA}
                disabled={verifyLoading}
                className="bg-[#009966] text-white px-5 py-2 rounded-lg"
              >
                {verifyLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
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
          setIsEditingAddress(false);
          setAddressForm(EMPTY_ADDRESS_FORM);
        }}
        onSave={handleSaveAddress}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold">Delete Address</h2>

            <p className="mt-3 text-[#6A7282]">
              Are you sure you want to delete this address?
            </p>

            {deleteAddressError && (
              <p className="mt-3 text-sm text-red-500">{deleteAddressError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteAddressError("");
                }}
                disabled={deleteAddressLoading}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAddress}
                disabled={deleteAddressLoading}
                className="bg-red-500 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {deleteAddressLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 !mt-0">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0F172A] p-6 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#0F172A] dark:text-white">
              Password Updated
            </h2>

            <p className="mt-2 text-sm text-[#6A7282]">
              Your password has been changed successfully.
              <br />
              Please sign in again.
            </p>

            <button
              onClick={() => {
                setShowPasswordSuccessModal(false);
                // localStorage.clear();
                navigate("/role-wise-sign-in?role=customer");
              }}
              className="mt-6 w-full rounded-lg bg-[#009966] py-3 text-white hover:opacity-90"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 !mt-0">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-white">
                  Delete Account
                </h2>

                <p className="text-sm text-[#6A7282] mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-5 text-[#475569] dark:text-[#94A3B8]">
              Are you sure you want to permanently delete your account and all
              associated data?
            </p>

            {deleteError && (
              <p className="mt-4 text-sm text-red-500">{deleteError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                disabled={deleteLoading}
                className="border border-[#E5E7EB] dark:border-[#1E293B] rounded-lg px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
