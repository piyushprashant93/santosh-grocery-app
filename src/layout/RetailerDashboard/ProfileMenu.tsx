import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ setActiveTab }: { setActiveTab: (tab: string) => void;}) {
const navigate = useNavigate();
  const [open,setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.storeName || user.businessName || user.name || "User";
  const userImage = user.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName) + "&background=random";

  useEffect(()=>{
    const handleClick = (e:MouseEvent)=>{
      if(ref.current && !ref.current.contains(e.target as Node)){
        setOpen(false)
      }
    }

    document.addEventListener("mousedown",handleClick)
    return ()=> document.removeEventListener("mousedown",handleClick)
  },[])

  return (
    <div className="relative">

      <div
        onClick={()=>setOpen(true)}
        className="flex items-center gap-3 pl-5 border-l cursor-pointer"
      >
        <div>
          <div className="font-medium text-theme-text">{userName}</div>
          <div className="text-[#62748E] text-sm text-end">Retailer</div>
        </div>

        <img
          src={userImage}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>


      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" />

          <div
            ref={ref}
            className="absolute right-0 top-16 z-50 w-[250px] bg-theme-surface lg:rounded-2xl rounded-lg overflow-hidden shadow-xl border border-theme-border"
          >

            <div className="px-6 py-3 text-base font-bold text-theme-text border-b">
              My Account
            </div>

            <div className="flex flex-col">

             <button
  onClick={() => {
    setActiveTab("settings")
    setOpen(false)
  }}
  className="text-left px-6 py-3 text-base hover:bg-gray-50 text-[#0F172B]"
>
  Profile Settings
</button>

<button
  onClick={() => {
    setActiveTab("finance")
    setOpen(false)
  }}
  className="text-left px-6 py-3 text-base hover:bg-gray-50 text-[#0F172B] border-b"
>
  Billing & Wallet
</button>

<button
  onClick={() => {
    navigate("/sign-in")
    setActiveTab("")
    setOpen(false)
  }}
  className="text-left px-6 py-3 text-base text-[#E7000B] hover:bg-red-50"
>
  Log out
</button>

            </div>

          </div>
        </>
      )}

    </div>
  )
}