import { CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
      <div className="relative max-w-[1265px] mx-auto px-3 lg:px-6 py-[128px] text-theme-text text-center overflow-hidden">
        <div className="w-[800px] h-[800px] bg-[#00A63E1A] blur-[240px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <span className="shadow-[0px_0px_15px_-5px_#22C55E4D] w-fit mx-auto mb-8 px-4 py-1.5 rounded-full bg-[#00C9501A] uppercase flex gap-2 items-center border border-[#00C95033] text-[#05DF72] text-xs font-bold">
          <CheckCircle2 size={16} />
          Seamless Experience
        </span>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-playfair flex flex-col gap-3 justify-center">
          <span className="font-playfair">From Chef's Kitchen</span>
          <span className=""><span className="font-playfair">to</span> <span className="text-[#00C950] font-playfair italic">Your Table.</span></span>
        </h1>

        <p className="mt-8 max-w-[672px] mx-auto text-[#CAD5E2] text-[20px]">
          We've re-engineered food delivery to prioritize quality over speed (though we're pretty fast, too). Here is how we ensure excellence every time.
        </p>
      </div>
    </section>
  );
}
