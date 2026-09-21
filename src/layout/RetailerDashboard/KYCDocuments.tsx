import { FileText, Upload, CheckCircle, Clock } from "lucide-react"

export default function KYCDocuments({ kyc }: { kyc?: any }) {

  const docs = [
    {
      title: "Business License",
      file: kyc?.businessLicense?.fileName || "business_license.pdf",
      size: "—",
      date: kyc?.businessLicense?.updatedAt ? new Date(kyc.businessLicense.updatedAt).toLocaleDateString() : "—",
      status: kyc?.businessLicense?.status || "Pending"
    },
    {
      title: "Tax Identification",
      file: kyc?.taxId?.fileName || "tax_id.pdf",
      size: "—",
      date: kyc?.taxId?.updatedAt ? new Date(kyc.taxId.updatedAt).toLocaleDateString() : "—",
      status: kyc?.taxId?.status || "Pending"
    }
  ]

  const statusStyles: any = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-6 border border-theme-border bg-theme-surface rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-playfair text-2xl">
            Verification Documents
          </h3>

          <p className="text-theme-muted mt-1">
            Upload official documents to verify your business.
          </p>
        </div>

        {kyc?.isVerified ? (
          <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle size={16}/>
            Verified Seller
          </span>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <Clock size={16}/>
            Pending Verification
          </span>
        )}

      </div>



      <div className="grid md:grid-cols-2 gap-6">

        {docs.map((d, i) => (

          <div
            key={i}
            className="border border-[#E2E8F0] bg-theme-bg rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-sm"
          >

            <div className="flex items-center justify-between mb-4">

              <h4 className="font-playfair text-xl">
                {d.title}
              </h4>

              <span className={`px-3 py-1 rounded-md text-sm capitalize ${statusStyles[d.status] || "bg-gray-100 text-theme-text"}`}>
                {d.status}
              </span>

            </div>



            <div className="border border-[#E2E8F0] rounded-lg p-4 bg-theme-surface flex items-center gap-3">

              <FileText className="text-theme-muted" size={28}/>

              <div>
                <p className="font-medium text-theme-text">
                  {d.file}
                </p>

                <p className="text-sm text-theme-muted">
                  {d.size} • Uploaded on {d.date}
                </p>
              </div>

            </div>



            <button className="mt-4 w-full border border-[#CAD5E2] rounded-lg py-2 bg-theme-bg">
              Re-upload
            </button>

          </div>

        ))}

      </div>



      <div className="border border-[#E2E8F0] bg-theme-bg rounded-lg lg:rounded-xl p-10 shadow-sm text-center">

        <div className="flex justify-center mb-4">
          <Upload size={28} className="text-theme-muted"/>
        </div>

        <h3 className="font-playfair text-xl mb-2">
          Upload Additional Documents
        </h3>

        <p className="text-theme-muted mb-6">
          Need to submit more info? Drag and drop your files here <br/>
          or click to browse.
        </p>

        <button className="border border-[#E2E8F0] bg-theme-bg px-5 py-2 rounded-lg">
          Select Files
        </button>

      </div>

    </div>
  )
}