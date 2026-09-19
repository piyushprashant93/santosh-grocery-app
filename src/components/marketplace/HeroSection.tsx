import { Leaf, MapPin, Search } from "lucide-react";
import { useState } from "react";
import HeroBg from "../../assets/images/marketpagebg.jpg";

export default function HeroSection({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    onSearch(searchInput);
  };

  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
      <img
        src={HeroBg}
        alt=""
        className="absolute inset-0 w-full object-cover h-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0F172B_0%,rgba(15,23,43,0.6)_50%,rgba(0,0,0,0)_100%)]" />

      <div className="relative max-w-[1265px] mx-auto px-3 lg:px-6 py-[128px] text-theme-text text-start overflow-hidden">
        <span className="w-fit mb-8 px-4 py-1.5 rounded-full bg-[#00C9501A] flex gap-2 items-center border uppercase border-[#00C95033] text-[#FF6900] text-xs font-bold">
          <Leaf size={16} />
          100% Organic Certified
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-playfair flex flex-col gap-3 justify-start">
          <span className="font-playfair">Nature's Best,</span>
          <span className="text-[#FF6900] font-playfair italic">
            Delivered Daily.
          </span>
        </h1>

        <p className="mt-8 max-w-[488px] text-[#CAD5E2] text-[20px]">
          Shop premium groceries, artisan bakery items, and imported gourmet
          goods. Delivered in 60 minutes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-[488px] bg-[#FFFFFF0D] border border-[#FFFFFF1A] shadow-[0px_25px_50px_-12px_#00000040,0px_0px_0px_1px_#FFFFFF0D] rounded-[12px] p-2">
          <div className="flex items-center bg-[#0206184D] rounded-lg p-4 w-full">
            <Search className="text-[#F54900] mr-2" size={18} />
           <input
  type="text"
  value={searchInput}
  onChange={(e) => {
    const value = e.target.value;
    setSearchInput(value);

    // agar input blank ho gaya, turant results reset kar do
    if (value.trim() === "") {
      onSearch("");
    }
  }}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  placeholder="Search for organic products..."
  className="bg-transparent outline-none text-theme-text placeholder-[#90A1B9] font-medium w-full"
/>
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#F54900] hover:opacity-90 transition text-white px-6 py-3 shadow-[0px_4px_6px_-4px_#00A63E33,0px_10px_15px_-3px_#00A63E33] rounded-lg font-semibold whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}