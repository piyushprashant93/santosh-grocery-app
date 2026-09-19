import { useEffect, useState } from "react"
import { Clock, ShieldCheck, ChevronRight, X, Calendar, Check } from "lucide-react"

interface ScheduledTime {
  date: string;   // e.g. "Today", "Tomorrow", or "Mon, Jul 20"
  time: string;   // e.g. "6:30 PM"
}

const SCHEDULE_STORAGE_KEY = "checkout_schedule";

interface SelectedSchedule {
  type: "priority" | "standard" | "scheduled";
  title: string;
  time: string;
  price: string;
}

export function ScheduleStep() {
  const [selected, setSelected] = useState("priority")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<ScheduledTime | null>(null)
  const [tempDate, setTempDate] = useState<string>("Today")
  const [tempTime, setTempTime] = useState<string>("")

  const options = [
    { id: "priority", title: "Priority Delivery", time: "25-35 min", price: "$5.99" },
    { id: "standard", title: "Standard Delivery", time: "45-55 min", price: "Free" }
  ]

  const saveSchedule = (data: SelectedSchedule) => {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data));
  };

    useEffect(() => {
    const defaultOption = options.find((o) => o.id === "priority")!;
    saveSchedule({
      type: "priority",
      title: defaultOption.title,
      time: defaultOption.time,
      price: defaultOption.price,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateOptions = (() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const label =
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      days.push(label);
    }
    return days;
  })();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM",
  ];

  const openScheduleModal = () => {
    setTempDate(scheduledTime?.date || "Today");
    setTempTime(scheduledTime?.time || "");
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    if (!tempTime) return;
    setScheduledTime({ date: tempDate, time: tempTime });
    setSelected("scheduled");
    saveSchedule({
      type: "scheduled",
      title: "Schedule for Later",
      time: `${tempDate}, ${tempTime}`,
      price: "Free",
    });                                          // 👈 add
    setShowScheduleModal(false);
  };

  const isScheduledActive = selected === "scheduled" && scheduledTime;

  return (
    <div className="border border-theme-border rounded-lg lg:rounded-2xl lg:p-6 p-3 bg-theme-surface">

      <h2 className="font-playfair text-2xl mb-6 text-theme-text">
        Delivery Time
      </h2>

      <div className="space-y-4">

        {options.map((item) => {

          const active = selected === item.id

          return (
            <div
              key={item.id}
              onClick={() => {
                setSelected(item.id);
                saveSchedule({                  
                  type: item.id as "priority" | "standard",
                  title: item.title,
                  time: item.time,
                  price: item.price,
                });
              }}
              className={`flex items-center justify-between lg:p-5 p-3 rounded-lg border cursor-pointer transition
              ${active
                ? "border-[#00BC7D] bg-[#031F2E]"
                : "border-[#1E293B] bg-[#0F172B80]"
              }`}
            >

              <div className="flex items-center lg:gap-4 gap-2">

                <div className={`lg:w-12 w-8 lg:h-12 h-8 rounded-full flex items-center justify-center
                ${active ? "bg-[#043D34]" : "bg-[#1E293B]"}`}>

                  <Clock size={20} className={`${active ? "text-[#00BC7D]" : "text-[#94A3B8]"}`} />

                </div>

                <div>

                  <p className="text-theme-text lg:text-lg text-sm">
                    {item.title}
                  </p>

                  <p className="text-theme-muted sm:text-base text-sm">
                    {item.time}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-6">

                <span className="text-theme-text text-lg">
                  {item.price}
                </span>

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center
                ${active ? "border-[#00BC7D]" : "border-[#475569]"}`}>

                  {active && (
                    <div className="w-3 h-3 rounded-full bg-[#00BC7D]" />
                  )}

                </div>

              </div>

            </div>
          )
        })}

        <div
          onClick={openScheduleModal}
          className={`flex items-center justify-between lg:p-5 p-3 rounded-lg lg:rounded-xl border cursor-pointer transition
          ${isScheduledActive
            ? "border-[#00BC7D] bg-[#031F2E]"
            : "border-[#1E293B] bg-[#0F172B80]"
          }`}
        >

          <div className="flex items-center gap-4">

            <div className={`lg:w-12 w-8 lg:h-12 h-8 rounded-full flex items-center justify-center
            ${isScheduledActive ? "bg-[#043D34]" : "bg-[#1E293B]"}`}>
              <Clock size={20} className={isScheduledActive ? "text-[#00BC7D]" : "text-[#94A3B8]"} />
            </div>

            <div>

              <p className="text-theme-text lg:text-lg text-sm">
                Schedule for Later
              </p>

              <p className="text-theme-muted sm:text-base text-sm">
                {scheduledTime
                  ? `${scheduledTime.date}, ${scheduledTime.time}`
                  : "Choose a time"}
              </p>

            </div>

          </div>

          {isScheduledActive ? (
            <div className="w-6 h-6 rounded-full border border-[#00BC7D] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#00BC7D]" />
            </div>
          ) : (
            <ChevronRight className="text-theme-muted" />
          )}

        </div>

      </div>

      <div className="mt-6 flex items-center gap-3 border border-[#2B7FFF33] rounded-lg lg:rounded-xl lg:p-4 p-2 text-[#8EC5FF] bg-[#2B7FFF0D]">

        <ShieldCheck size={20} className="min-w-5" />

        <p>
          Contactless delivery is enabled by default. The driver will leave your order at your door.
        </p>

      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-theme-surface border border-theme-border rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-theme-border">
              <h3 className="font-playfair text-xl text-theme-text flex items-center gap-2">
                <Calendar size={20} className="text-[#00BC7D]" />
                Schedule Delivery
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-theme-surface text-theme-muted"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">

              {/* Date picker */}
              <div>
                <p className="text-sm text-theme-muted mb-3">Select a date</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dateOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setTempDate(d)}
                      className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap border transition ${
                        tempDate === d
                          ? "bg-[#00BC7D] border-[#00BC7D] text-white"
                          : "border-[#1E293B] text-[#94A3B8] hover:border-[#334155]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p className="text-sm text-theme-muted mb-3">Select a time</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTempTime(t)}
                      className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg text-sm border transition ${
                        tempTime === t
                          ? "bg-[#00BC7D] border-[#00BC7D] text-white"
                          : "border-[#1E293B] text-[#CAD5E2] hover:border-[#334155]"
                      }`}
                    >
                      {tempTime === t && <Check size={12} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmSchedule}
                disabled={!tempTime}
                className="w-full bg-[#00BC7D] hover:bg-[#00a86e] transition text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tempTime ? `Confirm ${tempDate}, ${tempTime}` : "Select a time to continue"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}