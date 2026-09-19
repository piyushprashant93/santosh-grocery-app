import { Zap, Leaf, ChefHat } from "lucide-react"

export default function WhyHubnepa() {
  return (
    <section className="bg-theme-bg py-24">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-playfair text-[32px] md:text-[48px] font-medium text-theme-text">
            Why HUBNEPA for Food?
          </h2>
          <p className="mt-4 text-theme-muted text-lg">
            We care about what you eat. From hygiene to taste, we ensure quality at every step.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 lg:gap-8 gap-3">
          <div className="bg-theme-surface border border-[#FFFFFF0D] rounded-[16px] p-8 text-center backdrop-blur-sm">
            <div className="w-[58px] h-[58px] mx-auto rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00A63E]">
              <Zap size={28} />
            </div>
            <h3 className="font-playfair text-[20px] font-bold text-theme-text mt-8">
              Hot & Fast Delivery
            </h3>
            <p className="text-theme-muted mt-2 leading-relaxed">
              Our thermal bags keep your food steaming hot. We deliver faster than you can cook.
            </p>
          </div>

          <div className="bg-theme-surface border border-[#FFFFFF0D] rounded-[16px] p-8 text-center backdrop-blur-sm">
            <div className="w-[58px] h-[58px] mx-auto rounded-xl flex items-center justify-center bg-[#FFEDD4] text-[#F54900]">
              <Leaf size={28} />
            </div>
            <h3 className="font-playfair text-[20px] font-bold text-theme-text mt-8">
              Fresh Ingredients
            </h3>
            <p className="text-theme-muted mt-2 leading-relaxed">
              We partner with local farms to bring you organic vegetables and fruits that are chemical-free.
            </p>
          </div>

          <div className="bg-theme-surface border border-[#FFFFFF0D] rounded-[16px] p-8 text-center backdrop-blur-sm">
            <div className="w-[58px] h-[58px] mx-auto rounded-xl flex items-center justify-center bg-[#DBEAFE] text-[#155DFC]">
              <ChefHat size={28} />
            </div>
            <h3 className="font-playfair text-[20px] font-bold text-theme-text mt-8">
              Top Rated Chefs
            </h3>
            <p className="text-theme-muted mt-2 leading-relaxed">
              Discover hidden gems and top-rated restaurants curated by our food experts.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}