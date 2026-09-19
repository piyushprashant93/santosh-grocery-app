import { GlobeIcon } from "lucide-react";
import HeroBg from "../../assets/images/aboutbg.jpg";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
              <img
        src={HeroBg}
        alt=""
        className="absolute inset-0 w-full object-cover h-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,24,0.8)_0%,rgba(2,6,24,0.9)_50%,#020618_100%)]" />
      <div className="relative max-w-[1265px] mx-auto px-3 lg:px-6 py-20 text-theme-text text-center overflow-hidden">
        <span className="shadow-[0px_0px_15px_-5px_#22C55E4D] w-fit mx-auto mb-8 px-4 py-1.5 rounded-full bg-[#00C9501A] uppercase flex gap-2 items-center border border-[#00C95033] text-[#05DF72] text-xs font-bold">
          <GlobeIcon size={16} />
          Connecting Communities
        </span>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-playfair flex gap-3 justify-center">
          <span className="font-playfair">We Are</span>
          <span className="font-playfair uppercase bg-[linear-gradient(90deg,#00D492_0%,#00D3F2_100%)] bg-clip-text text-transparent">
  HUBNEPA
</span>
        </h1>

        <p className="mt-8 max-w-[672px] mx-auto text-[#CAD5E2] text-[20px]">
          Bridging the gap between local commerce and modern convenience. We're building the future of how you eat, shop, and live.
        </p>
      </div>
    </section>
  );
}
