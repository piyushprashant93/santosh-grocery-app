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

    if (finalAccessToken) {
      // Store authentication data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", finalAccessToken);
      
      let userRole = "customer";
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      if (userParam) {
        try {
          // It might be a URL encoded JSON string
          const decodedUser = decodeURIComponent(userParam);
          // Just verify it's valid JSON (though we'll store it as a string)
          const userObj = JSON.parse(decodedUser);
          localStorage.setItem("user", decodedUser);
          
          if (userObj.role) {
            userRole = userObj.role;
          }
        } catch (e) {
          console.error("Failed to parse user data from URL", e);
        }
      }
      
      localStorage.setItem("role", userRole);

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
      console.error("No access token found in URL parameters");
      // Redirect back to login if authentication fails or token is missing
      navigate("/customer");
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-[#020618] flex items-center justify-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-[#00BC7D] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#90A1B9] text-sm font-medium animate-pulse">Completing authentication...</p>
    </div>
  );
}
