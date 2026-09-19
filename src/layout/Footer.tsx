import { NavLink } from "react-router-dom"
import { Instagram, Twitter, Facebook, Linkedin, Heart } from "lucide-react"
import Logo from "../assets/images/logo-light.svg"
import { useState, useEffect } from "react";

interface FooterLink {
  label: string;
  url: string;
}

interface FooterData {
  description: string;
  socials: {
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  platformLinks: FooterLink[];
  companyLinks: FooterLink[];
  legalLinks: FooterLink[];
}

const DEFAULT_FOOTER_DATA: FooterData = {
  description:
    "HUBNEPA is the premier digital marketplace, seamlessly connecting you with the best local restaurants and verified retail brands. Experience the future of commerce.",
  socials: {
    instagram: "#",
    twitter: "#",
    facebook: "#",
    linkedin: "#",
  },
  platformLinks: [
    { label: "Restaurants", url: "/restaurants" },
    { label: "Marketplace", url: "/marketplace" },
    { label: "How it Works", url: "/how-it-work" },
    { label: "Partner Access", url: "/sign-in" },
    { label: "Pricing", url: "/pricing" },
  ],
  companyLinks: [
    { label: "About Us", url: "/about" },
    { label: "Careers", url: "/careers" },
    { label: "Press", url: "/press" },
    { label: "Contact", url: "/contact" },
  ],
  legalLinks: [
    { label: "Terms of Service", url: "/terms" },
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Cookie Policy", url: "/cookies-policy" },
    { label: "Dispute Resolution", url: "/dispute-resolution" },
  ],
};

export default function Footer() {
  const [data, setData] = useState<FooterData>(DEFAULT_FOOTER_DATA);

  useEffect(() => {
    // Placeholder fetch logic until public API is available
    const fetchFooterData = async () => {
      try {
        const res = await fetch(
          "https://mr-santosh-grocery-backend.onrender.com/api/v1/public/footer"
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setData(json.data);
          }
        }
      } catch (error) {
        console.log("Using default footer data", error);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-theme-bg text-gray-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 justify-between gap-32">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 bg-[#FFFFFF0D] p-3 w-fit rounded-[12px]">
              <img src={Logo} alt="" />
            </div>

            <p className="leading-relaxed text-theme-muted">
              {data.description}
            </p>

            <div className="flex items-center gap-4 mt-8">
              <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Instagram size={18} className="text-theme-muted" />
              </a>
              <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Twitter size={18} className="text-theme-muted" />
              </a>
              <a href={data.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Facebook size={18} className="text-theme-muted" />
              </a>
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1D293D] flex items-center justify-center hover:bg-[#D97706] transition cursor-pointer">
                <Linkedin size={18} className="text-theme-muted" />
              </a>
            </div>
          </div>


<div className="col-span-3 flex justify-between gap-5">

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Platform</h3>
    <ul className="space-y-4">
      {data.platformLinks.map((link, i) => (
        <li key={i}>
          <NavLink to={link.url} className="hover:text-theme-text text-theme-muted text-sm transition">
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Company</h3>
    <ul className="space-y-4">
      {data.companyLinks.map((link, i) => (
        <li key={i}>
          <NavLink to={link.url} className="hover:text-theme-text text-theme-muted text-sm transition">
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>

  <div>
    <h3 className="text-theme-text font-semibold font-playfair mb-6">Legal</h3>
    <ul className="space-y-4">
      {data.legalLinks.map((link, i) => (
        <li key={i}>
          <NavLink to={link.url} className="hover:text-theme-text text-theme-muted text-sm transition">
            {link.label}
          </NavLink>
        </li>
      ))}
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