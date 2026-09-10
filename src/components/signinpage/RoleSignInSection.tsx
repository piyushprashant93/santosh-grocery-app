import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { useRole } from "../../layout/RoleProvider";
import { User, ChefHat, Store, Truck } from "lucide-react";
import GoogleIcon from "../../assets/images/googleicon.svg";
import CustomerImg from "../../assets/images/customersideimg.jpg";
import RestaurantImg from "../../assets/images/restaurantsideimg.jpg";
import RetailerImg from "../../assets/images/retailersideimg.jpg";
import SupplierImg from "../../assets/images/suppliersideimg.jpg";
type RoleType =
  | "customer"
  | "restaurant"
  | "restaurantbackend"
  | "retailer"
  | "supplier";

type RoleConfigType = {
  icon: any;
  title: string;
  description: string;
  btnColor: string;
  iconColor: string;
  borderColor: string;
  quote: string;
  person: string;
  nameLetter: string;
  applyText: string | null;
  quoteColor: string;
  image: string;
  partnerText?: string;
};

const roleConfig: Record<RoleType, RoleConfigType> = {
  customer: {
    icon: User,
    title: "Customer Access",
    description: "Sign in to order exclusive meals and premium products.",
    btnColor: "bg-[#009966]",
    iconColor: "text-[#009966]",
    borderColor: "#009966",
    quote: "Dining at home has never felt this luxurious.",
    person: "PLATINUM MEMBER",
    nameLetter: "P",
    applyText: null,
    quoteColor: "bg-[#009966]",
    image: CustomerImg,
  },

  restaurant: {
    icon: ChefHat,
    title: "Restaurant Owners",
    description: "Manage your menu, orders, and kitchen performance.",
    btnColor: "bg-[#00A63E]",
    iconColor: "text-[#00A63E]",
    borderColor: "#00A63E",
    quote: "HubNepa aligns perfectly with our culinary standards.",
    person: "EXECUTIVE CHEF",
    nameLetter: "E",
    applyText: "Apply for Partnership",
    quoteColor: "bg-[#00A63E]",
    image: RestaurantImg,
    partnerText: "Need access to the Partner Portal?",
  },

  restaurantbackend: {
    icon: ChefHat,
    title: "Restaurant Backend",
    description: "Manage your menu, orders, and kitchen performance.",
    btnColor: "bg-[#00A63E]",
    iconColor: "text-[#00A63E]",
    borderColor: "#00A63E",
    quote: "HubNepa aligns perfectly with our culinary standards.",
    person: "EXECUTIVE CHEF",
    nameLetter: "E",
    applyText: "Apply for Partnership",
    quoteColor: "bg-[#00A63E]",
    image: RestaurantImg,
    partnerText: "Need access to the Partner Portal?",
  },

  retailer: {
    icon: Store,
    title: "Retailer Access",
    description: "Track inventory, sales, and customer insights.",
    btnColor: "bg-[#FF4D00]",
    iconColor: "text-[#FF4D00]",
    borderColor: "#FF4D00",
    quote: "Connecting our premium products with discerning customers.",
    person: "MARKET DIRECTOR",
    nameLetter: "M",
    applyText: "Apply for Partnership",
    quoteColor: "bg-[#FF4D00]",
    image: RetailerImg,
    partnerText: "Need access to the Seller Hub?",
  },

  supplier: {
    icon: Truck,
    title: "Supplier Portal",
    description: "Manage wholesale orders and inventory.",
    btnColor: "bg-[#3B82F6]",
    iconColor: "text-[#3B82F6]",
    borderColor: "#3B82F6",
    quote: "Streamlining the supply chain for modern commerce.",
    person: "LOGISTICS MANAGER",
    nameLetter: "L",
    applyText: "Apply for Partnership",
    quoteColor: "bg-[#3B82F6]",
    image: SupplierImg,
    partnerText: "Need access to the Supplier Portal?",
  },
};

export default function RoleSignInSection() {
  const navigate = useNavigate();
  const { role } = useRole();
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const [show2FAModal, setShow2FAModal] = useState(false);
const [otpCode, setOtpCode] = useState("");
const [otpLoading, setOtpLoading] = useState(false);
const [pendingUser, setPendingUser] = useState<any>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!role) return null;

  const config = roleConfig[role as RoleType];
  const Icon = config.icon;

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      const user = data.data.user;

      if (user.twoFactorEnabled) {
        setPendingUser({
          user,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        });

        setOtpCode("");
        setShow2FAModal(true);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);

        localStorage.setItem("authToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        localStorage.setItem("user", JSON.stringify(user));

        setIsLoggedIn(true);

        if (role === "customer") {
          navigate("/customer/dashboard");
        } else if (role === "retailer") {
          navigate("/retailer/dashboard");
        } else if (role === "supplier") {
          navigate("/supplier/dashboard");
        } else if (role === "restaurant") {
          navigate("/restaurant/dashboard");
        } else if (role === "restaurantbackend") {
          navigate("/restaurantbackend/dashboard");
        }
      }
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleValidate2FA = async () => {
  if (!otpCode.trim()) {
    setError("Please enter OTP.");
    return;
  }

  setOtpLoading(true);

  try {
    const response = await fetch(
      "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/2fa/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: pendingUser.user._id,
          code: otpCode,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Invalid OTP");
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);

    localStorage.setItem("authToken", pendingUser.accessToken);

    localStorage.setItem(
      "refreshToken",
      pendingUser.refreshToken,
    );

    localStorage.setItem(
      "user",
      JSON.stringify(pendingUser.user),
    );

    setIsLoggedIn(true);

    setShow2FAModal(false);

    if (role === "customer") {
      navigate("/customer/dashboard");
    } else if (role === "retailer") {
      navigate("/retailer/dashboard");
    } else if (role === "supplier") {
      navigate("/supplier/dashboard");
    } else if (role === "restaurant") {
      navigate("/restaurant/dashboard");
    } else if (role === "restaurantbackend") {
      navigate("/restaurantbackend/dashboard");
    }
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong.",
    );
  } finally {
    setOtpLoading(false);
  }
};

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const response = await fetch(
        "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to process request.");
      }

      setForgotMessage(
        data.message || "Password reset instructions have been sent.",
      );
      setResetToken(data?.data?.resetToken || "");
      setShowResetForm(true);
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotError("");
    setForgotMessage("");

    if (!resetToken.trim()) {
      setForgotError("Please enter reset token.");
      return;
    }

    if (!newPassword.trim()) {
      setForgotError("Please enter new password.");
      return;
    }

    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch(
        "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.errors)
          ? data.errors.join("\n")
          : data.errors
            ? Object.values(data.errors).flat().join("\n")
            : data.message || "Something went wrong.";

        throw new Error(errorMessage);
      }

      setForgotMessage(data.message || "Password reset successfully.");

      setTimeout(() => {
        setShowForgotModal(false);
        setShowResetForm(false);

        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotEmail("");
      }, 1500);
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <section className="bg-[#020618] text-white">
      <div className="min-h-[calc(100vh-80px)] max-w-[1265px] lg:px-6 px-3 mx-auto flex">
        <div className="w-[50%] max-w-[400px] py-10 mx-auto flex flex-col justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#90A1B9] mb-8"
          >
            <ArrowLeft size={18} />
            Switch Portal
          </button>

          <div className="w-12 h-12 rounded-xl bg-[#0F172B] border border-[#1D293D] focus:outline-none focus:border-[#00A63E] flex items-center justify-center mb-6">
            <Icon className={config.iconColor} />
          </div>

          <h1 className="font-playfair text-[44px] mb-4">{config.title}</h1>

          <p className="text-[#90A1B9] text-lg mb-10">{config.description}</p>

          <div>
            <div>
              <p className="text-sm mb-2 text-[#90A1B9]">Email Address</p>
              <div
                className="flex items-center border border-[#1D293D] bg-[#0F172B] rounded-lg px-4 py-3 focus-within:ring-[0.5px] transition"
                style={
                  { "--focus-color": config.borderColor } as React.CSSProperties
                }
              >
                <Mail className="mr-2 opacity-60" size={18} />
                <input
                  name="email"
                  value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setEmail(event.target.value)
                  }
                  className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                  placeholder="name@hubnepa.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#90A1B9]">Password</span>
                <button
                  type="button"
                  onClick={() => {
                    setForgotMessage("");
                    setForgotError("");
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className={config.iconColor}
                >
                  Forgot password?
                </button>
              </div>

              <div
                className="flex items-center border border-[#1D293D] bg-[#0F172B] rounded-lg px-4 py-3 focus-within:ring-[0.5px] transition"
                style={
                  { "--focus-color": config.borderColor } as React.CSSProperties
                }
              >
                <Lock className="mr-2 opacity-60" size={18} />

                <input
                  name="password"
                  value={password}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setPassword(event.target.value)
                  }
                  type={show ? "text" : "password"}
                  className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                  placeholder="••••••••"
                />

                {show ? (
                  <EyeOff
                    size={18}
                    className="opacity-60 cursor-pointer"
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="opacity-60 cursor-pointer"
                    onClick={() => setShow(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <button
                type="button"
                onClick={() => setChecked(!checked)}
                className={`mt-1 w-4 h-4 min-w-4 rounded-[4px] border transition-all duration-200 flex items-center justify-center
                                    ${
                                      checked
                                        ? "bg-[#009966] border-[#009966]"
                                        : "bg-[#0F172B] border-[#334155] shadow-[0px_0px_0px_1px_#FFFFFF0D]"
                                    }
                                `}
              >
                {checked && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </button>
              <p className="text-sm text-[#90A1B9] leading-relaxed">
                Remember this device
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 mt-6 rounded-lg font-medium flex items-center justify-center gap-2 ${config.btnColor} ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>

            {error ? (
              <p className="mt-3 text-sm text-[#F87171]">{error}</p>
            ) : null}

            {config.applyText && (
              <div className="border border-[#1D293D] bg-[#0F172B80] rounded-xl text-sm p-5 text-center text-[#90A1B9] mt-6">
                <span className="text-xs mb-3 inline-block">
                  {config.partnerText}
                </span>
                <div
                  className={`${config.iconColor} cursor-pointer`}
                  onClick={() => navigate("/orderplace")}
                >
                  {config.applyText}
                </div>
              </div>
            )}

            {role === "customer" && (
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-[1px] bg-[#1D293D]"></div>
                  <p className="text-[#62748E] text-xs">OR CONTINUE WITH</p>
                  <div className="flex-1 h-[1px] bg-[#1D293D]"></div>
                </div>

                <button 
                  onClick={() => {
                    const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
                    window.location.href = `${baseUrl}/api/v1/auth/google`;
                  }}
                  className="w-full bg-white text-[#0F172B] py-3 rounded-lg flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition"
                >
                  <img src={GoogleIcon} alt="google" className="w-5 h-5" />
                  Sign in with Google
                </button>

                <p className="text-center text-[#90A1B9] mt-6 text-sm">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/sign-up")}
                    className="text-[#00BC7D] font-medium cursor-pointer"
                  >
                    Sign up now
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="w-[50%] relative bg-cover bg-center flex items-end justify-center"
          style={{ backgroundImage: `url(${config.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#020618] to-transparent"></div>

          <div className="relative max-w-[420px] text-white pb-10">
            <div className={`h-[4px] w-14 ${config.quoteColor} mb-6`} />

            <h2 className="font-playfair text-[42px] leading-[1.2] mb-8">
              "{config.quote}"
            </h2>

            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex font-semibold text-black items-center justify-center ${config.quoteColor}`}
              >
                {config.nameLetter}
              </div>

              <div>
                <p className="text-sm">{config.person}</p>
                <p className="text-[#90A1B9] text-xs">Verified Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 border-2"
            style={{ borderColor: config.borderColor }}
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {showResetForm ? "Reset Password" : "Forgot Password"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {showResetForm
                ? "Enter your new password to complete the reset process."
                : "Enter your registered email address. We'll send you password reset instructions."}
            </p>

            <input
              type="email"
              value={forgotEmail}
              disabled={showResetForm}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter email"
              className={`mt-5 w-full rounded-lg border px-4 py-3 outline-none text-black ${
                showResetForm ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              style={{ borderColor: config.borderColor }}
            />

            {showResetForm && (
              <>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Paste Reset Token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none text-black"
                    style={{ borderColor: config.borderColor }}
                  />
                </div>

                <div className="mt-4 relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 pr-12 outline-none text-black"
                    style={{ borderColor: config.borderColor }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="mt-4 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 pr-12 outline-none text-black"
                    style={{ borderColor: config.borderColor }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </>
            )}

            {forgotMessage && (
              <p className="mt-3 text-sm text-green-600">{forgotMessage}</p>
            )}

            {forgotError && (
              <p className="mt-3 text-sm text-red-500">{forgotError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg border px-5 py-2 transition"
                style={{
                  borderColor: config.borderColor,
                  color: config.borderColor,
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  showResetForm ? handleResetPassword : handleForgotPassword
                }
                disabled={forgotLoading || resetLoading}
                className="rounded-lg px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-70"
                style={{
                  backgroundColor: config.borderColor,
                }}
              >
                {forgotLoading
                  ? "Sending..."
                  : resetLoading
                    ? "Resetting..."
                    : showResetForm
                      ? "Reset Password"
                      : "Send Reset Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {show2FAModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div className="bg-white rounded-xl p-6 w-full max-w-sm">

      <h2 className="text-xl font-semibold text-black">
        Two-Factor Authentication
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        Enter the 6-digit code from Google Authenticator.
      </p>

      <input
        className="w-full border rounded-lg p-3 mt-5 text-black"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="123456"
      />

      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShow2FAModal(false)}
          className="border px-4 py-2 rounded-lg text-black"
        >
          Cancel
        </button>

        <button
          onClick={handleValidate2FA}
          disabled={otpLoading}
          className="bg-[#009966] text-white px-5 py-2 rounded-lg"
        >
          {otpLoading ? "Verifying..." : "Verify"}
        </button>

      </div>

    </div>

  </div>
)}
    </section>
  );
}
