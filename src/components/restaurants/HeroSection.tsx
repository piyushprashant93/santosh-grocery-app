import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeroBg from "../../assets/images/restpagebg.jpg";
interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({
  onSearch,
}: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce as the user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(query.trim());
    }, 400);
    return () => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
};
  }, [query, onSearch]);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch?.(query.trim());
  };

  return (
    <section className="relative w-full bg-cover bg-center bg-theme-bg">
      <img
        src={HeroBg}
        alt=""
        className="absolute inset-0 w-full object-cover h-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(2,6,24,0.5)_50%,#020618_100%)] " />

      <div className="relative max-w-[1265px] mx-auto text-center px-3 lg:px-6 py-[128px] text-theme-text overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-playfair flex items-center gap-3 justify-center">
          <span className="font-playfair">The</span>
          <span className="text-[#00C950] font-playfair italic">
            Curated
          </span>
          <span className="font-playfair">List</span>
        </h1>

        <p className="mt-8 max-w-[730px] mx-auto text-[#CAD5E2] text-[20px]">
          The city's most celebrated kitchens, selected for quality, hygiene, and culinary artistry.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-4 max-w-[756px] mx-auto bg-[#FFFFFF0D] border border-[#FFFFFF1A] shadow-[0px_25px_50px_-12px_#00000040,0px_0px_0px_1px_#FFFFFF0D] rounded-full p-2"
        >
          <div className="flex items-center bg-[#0206184D] rounded-full p-4 w-full">
            <Search className="text-[#00A63E] mr-2" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setQuery(e.target.value)
}
              placeholder="Search for 'Sushi', 'Pizza', or 'Mezze'..."
              className="bg-transparent outline-none text-theme-text placeholder-[#90A1B9] font-medium w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-[#00A63E] hover:opacity-90 transition text-theme-text px-6 py-3 shadow-[0px_4px_6px_-4px_#00A63E33,0px_10px_15px_-3px_#00A63E33] rounded-full font-semibold whitespace-nowrap"
          >
            Find Table
          </button>
        </form>
      </div>
    </section>
  );
}