import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-light.svg";
import { useState, useEffect } from "react";

interface FooterLink {
  label: string;
  url: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { label: "Privacy", url: "/privacy-policy" },
  { label: "Terms", url: "/terms" },
  { label: "Contact", url: "/contact" },
];

export default function SecondaryFooter() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<FooterLink[]>(DEFAULT_LINKS);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch(
          "https://mr-santosh-grocery-backend.onrender.com/api/v1/public/secondary-footer"
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.links) {
            setLinks(json.data.links);
          }
        }
      } catch (error) {
        console.log("Using default secondary footer data", error);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <div className="border-t border-theme-border bg-theme-bg">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3 py-6 flex items-center justify-between">

        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate("/")}>
          <img
            src={Logo}
            className=""
          />
        </div>

        <div className="flex items-center gap-8 text-theme-muted text-sm">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.url}
              className="hover:text-theme-text transition"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <p className="text-theme-muted text-sm">
          © 2026 HUBNEPA.
        </p>

      </div>
    </div>
  );
}