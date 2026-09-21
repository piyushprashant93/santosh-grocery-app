import { X, Building2 } from "lucide-react"

export default function RequestPayoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {

    if (!open) return null

    return (

        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onClose}
        >

            <div
                className="bg-theme-surface max-w-[620px] w-[95%] rounded-2xl shadow-xl max-h-[95vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-center justify-between p-6 border-b bg-[#F8FAFC80]">

                    <h3 className="font-playfair text-2xl">
                        Request Payout
                    </h3>

                    <button onClick={onClose} className="text-theme-muted">
                        <X size={22} />
                    </button>

                </div>



                <div className="p-6 space-y-6">

                    <div className="bg-[#EEF2FF] border border-[#DBEAFE] rounded-xl p-6 text-center">

                        <p className="text-[#2563EB] text-sm tracking-wide">
                            AVAILABLE BALANCE
                        </p>

                        <h2 className="font-playfair text-[36px] mt-2">
                            $12,450.00
                        </h2>

                    </div>



                    <div>

                        <label className="block text-[#374151] mb-2">
                            Payout Amount
                        </label>

                        <div className="border border-theme-border rounded-lg h-12 flex items-center px-3 gap-2">

                            <span className="text-theme-muted text-lg">$</span>

                            <input
                                defaultValue="12450.00"
                                className="w-full outline-none"
                            />

                        </div>

                    </div>



                    <div>

                        <label className="block text-[#374151] mb-2">
                            Destination Account
                        </label>

                        <div className="border border-theme-border rounded-xl p-4 flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] flex items-center justify-center">

                                <Building2 size={20} />

                            </div>

                            <div>

                                <p className="font-medium text-theme-text">
                                    Chase Business Checking
                                </p>

                                <p className="text-sm text-theme-muted">
                                    •••• •••• 4589
                                </p>

                            </div>

                        </div>

                    </div>

                </div>



                <div className="flex justify-end gap-6 border-t p-6 bg-[#F8FAFC80]">

                    <button onClick={onClose} className="text-theme-muted">
                        Cancel
                    </button>

                    <button className="bg-[#2563EB] text-theme-text px-6 py-2 rounded-lg shadow">
                        Confirm Request
                    </button>

                </div>

            </div>

        </div>

    )
}