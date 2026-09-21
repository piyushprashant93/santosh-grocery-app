import { useNavigate } from "react-router-dom"

export default function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="bg-[linear-gradient(135deg,#82181A_0%,#8B0836_50%,#0F172B_100%)] py-24">
      <div className="max-w-[1265px] mx-auto px-3 lg:px-6 text-center">
        <h2 className="font-playfair text-[60px] font-bold text-theme-text leading-tight">
          Hungry? Don’t Wait.
        </h2>

        <p className="mt-6 text-[#FFE2E2CC] text-[20px] max-w-[663px] mx-auto">
          Treat yourself to the best food in town. Download the app now or start ordering online.
        </p>

        <div className="mt-10">
          <button onClick={()=>navigate("/sign-in")} className="bg-[#00A63E] text-theme-text px-10 py-4 rounded-full text-lg font-semibold shadow-[0px_25px_50px_-12px_#0D542B80] hover:opacity-90 transition">
            Start Ordering Food
          </button>
        </div>
      </div>
    </section>
  )
}