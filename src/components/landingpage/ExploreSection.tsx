import { UtensilsCrossed, ShoppingBag } from "lucide-react"
import eatsImg from "../../assets/images/meal.jpg"
import martImg from "../../assets/images/fresh.jpg"
import { useNavigate } from "react-router-dom"

export default function ExploreSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-theme-bg py-20">
      <div className="max-w-[1265px] mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-8">
        
        <div onClick={()=>navigate("/orderplace")}
          className="relative h-[500px] rounded-[24px] overflow-hidden group cursor-pointer"
          style={{
            backgroundImage: `url(${eatsImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020618]/90 via-[#020618]/40 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-4">
            <span className="bg-[#00A63E] text-theme-text px-4 py-1 rounded-full text-xs font-semibold">
              EATS
            </span>
            <span className="text-[#CAD5E2] text-xs">
              RESTAURANTS
            </span>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="font-playfair text-[36px] font-medium text-theme-text">
              Order Meals
            </h3>
            <p className="mt-4 text-[#CAD5E2] text-[18px] max-w-[400px]">
              Hungry? Get hot, delicious meals from the best local kitchens delivered in minutes.
            </p>

            <div className="mt-6">
              <button className="w-12 h-12 rounded-full bg-[#00A63E] flex items-center justify-center shadow-[0px_10px_15px_-3px_#00A63E33] hover:scale-105 transition">
                <UtensilsCrossed className="text-theme-text" size={20} />
              </button>
            </div>
          </div>
        </div>

        <div onClick={()=>navigate("/marketplace")}
          className="relative h-[500px] rounded-[24px] overflow-hidden group cursor-pointer"
          style={{
            backgroundImage: `url(${martImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020618]/90 via-[#020618]/40 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-4">
            <span className="bg-[#F54900] text-white px-4 py-1 rounded-full text-xs font-semibold">
              MART
            </span>
            <span className="text-theme-text/60 text-xs">
              GROCERY
            </span>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="font-playfair text-[36px] font-medium text-theme-text">
              Shop Fresh
            </h3>
            <p className="mt-4 text-[#CAD5E2] text-[18px] max-w-[400px]">
              Fresh vegetables, fruits, dairy, and pantry staples straight from the farm to your door.
            </p>

            <div className="mt-6">
              <button className="w-12 h-12 rounded-full bg-[#E7000B] flex items-center justify-center shadow-[0px_10px_15px_-3px_#82181A33] hover:scale-105 transition">
                <ShoppingBag className="text-theme-text" size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}