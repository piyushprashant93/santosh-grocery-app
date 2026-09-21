import { useState } from "react"

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

  const handleSubmit = () => {
    console.log(form)
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
            className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-theme-text"
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
              className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-theme-text"
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
              className="w-full border border-theme-border rounded-lg px-4 py-3 focus:outline-none text-theme-text"
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