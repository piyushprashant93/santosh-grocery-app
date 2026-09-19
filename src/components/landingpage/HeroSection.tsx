import { MapPin, ArrowRight, Leaf } from "lucide-react";
import HeroBg from "../../assets/images/herobg.svg";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] bg-cover bg-center">
      <img src={HeroBg} alt="" className="absolute inset-0 w-full h-[calc(100vh-80px)] object-cover" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 text-theme-text">
        <span className="w-fit mb-8 px-4 py-1.5 rounded-full bg-[#00C9501A] flex gap-2 items-center border border-[#00C95033] text-[#05DF72] text-xs font-bold">
          <Leaf size={16} />
          FRESHNESS GUARANTEED
        </span>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-2xl font-playfair flex flex-col gap-3">
          <span className="font-playfair">America's</span>
          <span className="font-playfair">Best Flavors,</span>
          <span className="text-[#00C950] font-playfair">Delivered Hot.</span>
        </h1>

        <p className="mt-8 border-l-2 border-[#00C95080] pl-6 max-w-[488px] text-[#CAD5E2] text-[20px]">
          Craving artisan burgers, sushi, or farm-fresh organic veggies? HUBNEPA
          brings the best local flavors and ingredients straight to your
          kitchen.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-[576px] bg-[#FFFFFF0D] border border-[#FFFFFF1A] shadow-[0px_25px_50px_-12px_#00000040,0px_0px_0px_1px_#FFFFFF0D] rounded-[12px] p-2">
          <div className="flex items-center bg-[#0206184D] rounded-lg p-4 w-full">
            <MapPin className="text-[#00C950] mr-2" size={18} />
            <input
              type="text"
              placeholder="Enter your delivery location..."
              className="bg-transparent outline-none text-theme-text placeholder-[#90A1B9] font-medium w-full"
            />
          </div>

          <button className="bg-[#00A63E] hover:opacity-90 transition text-theme-text px-6 py-3 shadow-[0px_4px_6px_-4px_#00A63E33,0px_10px_15px_-3px_#00A63E33] rounded-lg font-semibold whitespace-nowrap">
            Find Food
          </button>
        </div>

        <div className="flex gap-3 items-start justify-between mt-8 ">
          <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full text-theme-text bg-[linear-gradient(90deg,#E7000B_0%,#EC003F_100%)] hover:opacity-90 transition shadow-[0px_4px_6px_-4px_#82181A33,0px_10px_15px_-3px_#82181A33]">
            Start Ordering
            <ArrowRight size={18} />
          </button>

          <button className="px-6 py-3 text-sm rounded-full bg-theme-surface text-[#0F172B] font-semibold hover:bg-gray-200 transition shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
            Partner with Us
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:gap-24 gap-10">
          <div>
            <h3 className="text-[30px] font-bold">500+</h3>
            <p className="text-theme-muted font-medium text-sm mt-1">RESTAURANTS</p>
          </div>
          <div>
            <h3 className="text-[30px] font-bold">100%</h3>
            <p className="text-theme-muted font-medium text-sm mt-1">ORGANIC VEG</p>
          </div>
          <div>
            <h3 className="text-[30px] font-bold">30min</h3>
            <p className="text-theme-muted font-medium text-sm mt-1">AVG DELIVERY</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
