import { useState, type ChangeEvent, type FormEvent } from "react";
import { User, Mail, Lock, Eye, Sparkles, Check } from "lucide-react";
import authImg from "../../assets/images/signupbg.svg";
import GoogleIcon from "../../assets/images/googleicon.svg";
import RestIcon from "../../assets/images/restIcon.svg";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "../../lib/apiErrorHandler";

export default function AuthSection() {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checked) {
      setError("Please accept terms and policy before continuing.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: "customer",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(data, "Registration failed. Please try again."));
      }

      setSuccess("Account created successfully. Redirecting to sign in...");
      navigate("/role-wise-sign-in?role=customer");
      setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "" });
      setChecked(false);

      window.setTimeout(() => {
        navigate("/sign-in");
      }, 1200);
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[851px] bg-theme-bg ">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3 flex">
        <div
          className="hidden lg:flex w-1/2 relative"
          style={{
            backgroundImage: `url(${authImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#020618]/90 via-[#020618]/60 to-transparent" />

          <div className="relative z-10 px-10 py-16 flex flex-col justify-end text-theme-text">
            <div className="w-16 h-1 bg-[#00BC7D] mb-6 rounded-full" />
            <h2 className="font-playfair text-[48px] font-medium">
              "The most exclusive dining club in the city."
            </h2>
            <p className="mt-6 text-[#E2E8F0] text-lg">
              Join 50,000+ members enjoying priority reservations and premium
              delivery.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center py-16">
          <div className="w-full max-w-[400px]">
            <div className="flex justify-between items-center mb-8">
              <span className="flex items-center gap-2 bg-[#00BC7D1A] border border-[#00BC7D33] text-[#00BC7D] px-4 py-1.5 rounded-full text-xs font-semibold">
                <Sparkles size={16} />
                FREE MEMBERSHIP
              </span>

              <div className="flex items-center gap-5">
                <span className="text-xs text-theme-muted">
                  Already a member?
                </span>
                <button onClick={()=>navigate("/sign-in")} className="text-theme-muted text-xs bg-[#1E2939] border border-theme-border px-3 py-1 rounded-full font-medium hover:text-theme-text transition">
                  SIGN IN
                </button>
              </div>
            </div>

            <h3 className="font-playfair text-[36px] font-medium text-theme-text">
              Join the Inner Circle
            </h3>

            <p className="mt-2 text-theme-muted text-lg">
              Create your account to unlock premium access.
            </p>

            <button 
              onClick={() => {
                const baseUrl = import.meta.env.VITE_BASE_URL || "https://mr-santosh-grocery-backend.onrender.com";
                window.location.href = `${baseUrl}/api/v1/auth/google`;
              }}
              className="mt-8 w-full bg-theme-surface text-[#0F172B] font-bold py-3 rounded-[12px] hover:bg-gray-200 transition flex items-center gap-3 justify-center"
            >
              <img src={GoogleIcon} alt="" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#1D293D]" />
              <span className="text-xs text-[#62748E]">
                OR SIGN UP WITH EMAIL
              </span>
              <div className="flex-1 h-px bg-[#1D293D]" />
            </div>

            {error ? (
              <p className="mb-4 text-sm text-[#F87171]">{error}</p>
            ) : null}
            {success ? (
              <p className="mb-4 text-sm text-[#34D399]">{success}</p>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="" className="text-[#CAD5E2] text-sm">
                  First Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                  />
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="John"
                    className="w-full bg-theme-surface border border-theme-border rounded-[12px] pl-10 pr-4 py-3 text-theme-text placeholder-[#64748B] focus:outline-none focus:border-[#00A63E]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-[#CAD5E2] text-sm">
                  Last Name
                </label>
                <div>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-theme-surface border border-theme-border rounded-[12px] px-4 py-3 text-theme-text placeholder-[#64748B] focus:outline-none focus:border-[#00A63E]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="" className="text-[#CAD5E2] text-sm">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                  className="w-full bg-theme-surface border border-theme-border rounded-[12px] pl-10 pr-4 py-3 text-theme-text placeholder-[#64748B] focus:outline-none focus:border-[#00A63E]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="" className="text-[#CAD5E2] text-sm">
                Phone
              </label>
              <div className="relative">
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="e.g. +919645299758"
                  autoComplete="off"
                  className="w-full bg-theme-surface border border-theme-border rounded-[12px] px-4 py-3 text-theme-text placeholder-[#64748B] focus:outline-none focus:border-[#00A63E]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="" className="text-[#CAD5E2] text-sm">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Create a strong password"
                  className="w-full bg-theme-surface border border-theme-border rounded-[12px] pl-10 pr-10 py-3 text-theme-text placeholder-[#64748B] focus:outline-none focus:border-[#00A63E]"
                />
                <Eye
                  size={18}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-6">
              <button
                type="button"
                onClick={() => setChecked(!checked)}
                className={`mt-1 w-4 h-4 min-w-4 rounded-[4px] border transition-all duration-200 flex items-center justify-center
                    ${
                      checked
                        ? "bg-[#00A63E] border-[#00A63E]"
                        : "bg-[#0F172B] border-[#334155] shadow-[0px_0px_0px_1px_#FFFFFF0D]"
                    }
                `}
              >
                {checked && (
                  <Check size={14} className="text-theme-text" strokeWidth={3} />
                )}
              </button>
              <p className="text-sm text-theme-muted leading-relaxed">
                I agree to the{" "}
                <span className="text-[#00BC7D]">Terms of Service</span> and{" "}
                <span className="text-[#00BC7D]">Privacy Policy</span>, and I
                want to receive exclusive offers.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full bg-[#009966] text-white py-3 rounded-[12px] font-semibold shadow-[0px_10px_15px_-3px_#00A63E33] transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#00A63E] flex gap-2 items-center justify-center">
              <img src={RestIcon} alt="" />
              Are you a restaurant or driver? Partner with us
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
