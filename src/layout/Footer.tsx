import { NavLink } from "react-router-dom"
import { Instagram, Twitter, Facebook, Linkedin, Heart } from "lucide-react"
import Logo from "../assets/images/logo-light.svg"

export default function Footer() {
  return (
    <footer className="bg-theme-bg text-gray-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 justify-between gap-32">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 bg-[#FFFFFF0D] p-3 w-fit rounded-[12px]">
              <img src={Logo} alt="" />
            </div>

            <p className="leading-relaxed text-theme-muted">
              HUBNEPA is the premier digital marketplace, seamlessly connecting
              you with the best local restaurants and verified retail brands.
              Experience the future of commerce.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <div className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Instagram size={18} className="text-theme-muted" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Twitter size={18} className="text-theme-muted" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Facebook size={18} className="text-theme-muted" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Linkedin size={18} className="text-theme-muted" />
              </div>
            </div>
          </div>


<div className="col-span-3 flex justify-between gap-5">

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Platform</h3>
    <ul className="space-y-4">
      <li>
        <NavLink to="/restaurants" className="hover:text-theme-text text-theme-muted text-sm transition">
          Restaurants
        </NavLink>
      </li>
      <li>
        <NavLink to="/marketplace" className="hover:text-theme-text text-theme-muted text-sm transition">
          Marketplace
        </NavLink>
      </li>
      <li>
        <NavLink to="/how-it-work" className="hover:text-theme-text text-theme-muted text-sm transition">
          How it Works
        </NavLink>
      </li>
      <li>
        <NavLink to="/sign-in" className="hover:text-theme-text text-theme-muted text-sm transition">
          Partner Access
        </NavLink>
      </li>
      <li>
        <NavLink to="/pricing" className="hover:text-theme-text text-theme-muted text-sm transition">
          Pricing
        </NavLink>
      </li>
    </ul>
  </div>

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Company</h3>
    <ul className="space-y-4">
      <li>
        <NavLink to="/about" className="hover:text-theme-text text-theme-muted text-sm transition">
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/careers" className="hover:text-theme-text text-theme-muted text-sm transition">
          Careers
        </NavLink>
      </li>
      <li>
        <NavLink to="/press" className="hover:text-theme-text text-theme-muted text-sm transition">
          Press
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className="hover:text-theme-text text-theme-muted text-sm transition">
          Contact
        </NavLink>
      </li>
    </ul>
  </div>

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Legal</h3>
    <ul className="space-y-4">
      <li>
        <NavLink to="/terms" className="hover:text-theme-text text-theme-muted text-sm transition">
          Terms of Service
        </NavLink>
      </li>
      <li>
        <NavLink to="/privacy-policy" className="hover:text-theme-text text-theme-muted text-sm transition">
          Privacy Policy
        </NavLink>
      </li>
      <li>
        <NavLink to="/cookies-policy" className="hover:text-theme-text text-theme-muted text-sm transition">
          Cookie Policy
        </NavLink>
      </li>
      <li>
        <NavLink to="/dispute-resolution" className="hover:text-theme-text text-theme-muted text-sm transition">
          Dispute Resolution
        </NavLink>
      </li>
    </ul>
  </div>

</div>
        </div>

        <div className="border-t border-theme-border mt-16 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#62748E]">
          <p>© 2026 HUBNEPA Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className=" fill-[#62748E]" /> in USA
          </p>
        </div>
      </div>
    </footer>
  )
}