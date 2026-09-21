import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    const userParam = queryParams.get("user");
    
    // Some backends might pass "token" instead of "accessToken"
    const finalAccessToken = accessToken || queryParams.get("token");

    const establishSession = async (token: string) => {
      try {
        const response = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success && data.data) {
          const userObj = data.data.user || data.data;
          localStorage.setItem("user", JSON.stringify(userObj));
          const userRole = userObj.role || "customer";
          localStorage.setItem("role", userRole);
          
          // Notify other components
          window.dispatchEvent(new CustomEvent("user-updated", { detail: userObj }));
          
          // Redirect to correct dashboard based on role
          if (userRole === "restaurant") {
            navigate("/restaurant/dashboard");
          } else if (userRole === "supplier") {
            navigate("/supplier/dashboard");
          } else if (userRole === "admin") {
            navigate("/admin/dashboard");
          } else if (userRole === "retailer") {
            navigate("/retailer/dashboard");
          } else {
            navigate("/customer/dashboard");
          }
        } else {
          throw new Error("Failed to load user profile");
        }
      } catch (err) {
        console.error(err);
        navigate("/sign-in");
      }
    };

    if (finalAccessToken) {
      // Store authentication data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", finalAccessToken);
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      if (userParam) {
        try {
          const decodedUser = decodeURIComponent(userParam);
          const userObj = JSON.parse(decodedUser);
          localStorage.setItem("user", decodedUser);
          localStorage.setItem("role", userObj.role || "customer");
          
          window.dispatchEvent(new CustomEvent("user-updated", { detail: userObj }));
          
          const userRole = userObj.role || "customer";
          if (userRole === "restaurant") {
            navigate("/restaurant/dashboard");
          } else if (userRole === "supplier") {
            navigate("/supplier/dashboard");
          } else if (userRole === "admin") {
            navigate("/admin/dashboard");
          } else if (userRole === "retailer") {
            navigate("/retailer/dashboard");
          } else {
            navigate("/customer/dashboard");
          }
        } catch (e) {
          console.error("Failed to parse user data from URL", e);
          establishSession(finalAccessToken);
        }
      } else {
        establishSession(finalAccessToken);
      }
    } else {
      console.error("No access token found in URL parameters");
      // Redirect back to login if authentication fails or token is missing
      navigate("/sign-in");
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-[#00BC7D] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-theme-muted text-sm font-medium animate-pulse">Completing authentication...</p>
    </div>
  );
}
