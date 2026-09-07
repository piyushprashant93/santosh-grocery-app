import "leaflet/dist/leaflet.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import AdminLogin from "./pages/AdminLogin";
import { HowItWork } from "./pages/HowItWork";
import { MarketPlace } from "./pages/MarketPlace";
import { Restaurant } from "./pages/Restaurant";
import { Pricing } from "./pages/Pricing";
import { ContactPage } from "./pages/ContactPage";
import { PressPage } from "./pages/PressPage";
import { CareerPage } from "./pages/CareerPage";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { PolicyPage } from "./pages/PolicyPage";
import { CookiesPage } from "./pages/CookiesPage";
import { DisputePage } from "./pages/DisputePage";
import { OrderPlace } from "./pages/OrderPlace";
import { RoleWiseSignIn } from "./pages/RoleWiseSignIn";
import { CompleteOrderPage } from "./pages/CompleteOrderPage";
import CustomerLayout from "./layout/CustomerDashboard/CustomerLayout";
import Checkout from "./layout/CustomerDashboard/CheckoutStep/Checkout";
import RetailerLayout from "./layout/RetailerDashboard/RetailerLayout";
import SupplierLayout from "./layout/SupplierDashboard/SupplierLayout";
import RestaurantLayout from "./layout/RestaurantDashboard/RestaurantLayout";
import RestaurantBackendLayout from "./layout/RestaurantBackendDashboard/RestaurantBackendLayout";
import PaymentVerify from "./pages/PaymentVerify";
import AdminLayout from "./layout/AdminDashboard/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/role-wise-sign-in" element={<RoleWiseSignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/how-it-work" element={<HowItWork />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/orderplace" element={<OrderPlace />} />
        <Route path="/complete-order" element={<CompleteOrderPage />} />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/careers" element={<CareerPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
        <Route path="/cookies-policy" element={<CookiesPage />} />
        <Route path="/dispute-resolution" element={<DisputePage />} />

        <Route path="/customer/payment-verify" element={<PaymentVerify />} />

        <Route path="/customer/dashboard/*" element={<CustomerLayout />} />
        <Route path="/customer/dashboard/checkout" element={<Checkout />} />
        <Route path="/retailer/dashboard/*" element={<RetailerLayout />} />
        <Route path="/supplier/dashboard/*" element={<SupplierLayout />} />
        <Route path="/restaurant/dashboard/*" element={<RestaurantLayout />} />
        <Route path="/restaurantbackend/dashboard/*" element={<RestaurantBackendLayout />} />
        <Route path="/admin/dashboard/*" element={<AdminLayout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
