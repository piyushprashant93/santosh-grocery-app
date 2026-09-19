import { BarChart3, CheckCircle2 } from "lucide-react";
import realtime from "../../assets/images/realtime.jpg";
import { useRole } from "../../layout/RoleProvider";
import { useNavigate } from "react-router-dom";

export default function InsightsSection() {
      const { setRole } = useRole();
    const navigate = useNavigate();
  const features = [
    "Live sales tracking and forecasting",
    "Inventory management with low-stock alerts",
    "Staff performance monitoring",
    "Customer feedback aggregation",
  ];

  return (
    <section className="relative bg-theme-surface border-y border-[#FFFFFF0D] overflow-hidden py-[100px]">
      
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-[#00BC7D1A] blur-[240px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#2B7FFF1A] blur-[200px] rounded-full" />

      <div className="relative max-w-[1265px] mx-auto lg:px-6 px-3 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <div className="inline-flex items-center gap-2 bg-[#00BC7D1A] border border-[#00BC7D33] text-[#00D492] font-medium px-4 py-1 rounded-full mb-6">
            <BarChart3 size={16} />
            Restaurant Owners
          </div>

          <h2 className="font-playfair text-[54px] text-theme-text font-bold leading-[1.1] mb-6">
            Real-time insights <br /> at your fingertips
          </h2>

          <p className="text-theme-muted text-[20px] mb-8 max-w-[566px]">
            Stop guessing and start knowing. Our powerful dashboard gives you a
            live view of your restaurant's performance, from sales velocity to
            inventory levels.
          </p>

          <div className="space-y-4 mb-10">
            {features.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[#CBD5F5] text-[18px] font-medium">
                <div className="bg-[#00BC7D1A] p-1 rounded-full">
                <CheckCircle2 className="text-[#00D492]" size={20} />
                </div>
                {item}
              </div>
            ))}
          </div>

          <button onClick={() => {
    setRole("restaurantbackend");
    navigate(`/role-wise-sign-in?role=restaurantbackend`);
  }}
   className="bg-[#009966] text-white px-8 py-3 rounded-full text-[16px]
          shadow-[0px_4px_6px_-4px_#00BC7D33,0px_10px_15px_-3px_#00BC7D33]">
            Explore Now
          </button>
        </div>

        <div className="flex justify-end">
          <img
            src={realtime}
            className="rounded-[22px] w-full max-w-[520px] h-[380px] object-cover"
          />
        </div>

      </div>
    </section>
  );
}