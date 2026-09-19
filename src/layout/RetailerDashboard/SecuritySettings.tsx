import { useState } from "react"
import toast from "react-hot-toast"

export default function SecuritySettings() {

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      const toastId = toast.loading("Updating password...");
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password updated successfully", { id: toastId });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to update password", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  }

  return (
    <div className="border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

      <h3 className="font-playfair text-2xl mb-8">
        Account Security
      </h3>


      <div className="max-w-[720px] space-y-6">

        <div>
          <label className="block text-[#374151] mb-2">
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-black"
          />
        </div>



        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block text-[#374151] mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-black"
            />
          </div>



          <div>
            <label className="block text-[#374151] mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-black"
            />
          </div>

        </div>



        <button
          onClick={handleSubmit}
          className="border border-theme-border bg-theme-surface px-6 py-3 rounded-lg shadow-sm"
        >
          Update Password
        </button>

      </div>

    </div>
  )
}