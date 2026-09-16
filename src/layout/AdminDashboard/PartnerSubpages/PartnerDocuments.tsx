import { useState } from "react"
import { ArrowLeft, FileText, Image as ImageIcon, Calendar, Download, X, XCircle, CheckCircle2, Loader2 } from "lucide-react"
import api from "../../../lib/api"

interface PartnerDocumentsProps {
  partnerId: string;
  onBack: () => void;
}

// Using the generated images
const MOCK_DOCS = [
  {
    id: 1,
    title: "Business License",
    type: "PDF",
    size: "2.4 MB",
    date: "Feb 10, 2026",
    status: "Pending",
    image: "/Users/piyushprashant/.gemini/antigravity-ide/brain/59b5a7de-3401-41f5-a8b7-ae7e1dd998c3/doc_placeholder_1_1788881793159.jpg"
  },
  {
    id: 2,
    title: "Tax Identification (EIN)",
    type: "Image",
    size: "1.1 MB",
    date: "Feb 10, 2026",
    status: "Verified",
    image: "/Users/piyushprashant/.gemini/antigravity-ide/brain/59b5a7de-3401-41f5-a8b7-ae7e1dd998c3/doc_placeholder_2_1788881819374.jpg"
  },
  {
    id: 3,
    title: "Food Safety Certificate",
    type: "PDF",
    size: "3.2 MB",
    date: "Feb 11, 2026",
    status: "Rejected",
    image: "/Users/piyushprashant/.gemini/antigravity-ide/brain/59b5a7de-3401-41f5-a8b7-ae7e1dd998c3/doc_placeholder_3_1788881836463.jpg"
  }
];

export default function PartnerDocuments({ partnerId, onBack }: PartnerDocumentsProps) {
  const [selectedDoc, setSelectedDoc] = useState<typeof MOCK_DOCS[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyDocument = async (status: 'Verified' | 'Rejected') => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
      await api.put(`/api/v1/admin/partners/restaurants/${partnerId}/verify-document`, {
        documentId: selectedDoc.id,
        status: status
      });
      alert(`Document ${status} successfully!`);
      setSelectedDoc(null);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to verify document");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Pending</span>;
      case 'Verified':
        return <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Verified</span>;
      case 'Rejected':
        return <span className="absolute top-3 right-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>Verification Documents</h1>
          <p className="text-gray-500 mt-1">Review and approve documents for <span className="font-bold text-gray-900">Spicy Kitchen</span></p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DOCS.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
            
            {/* Image Thumbnail */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              <img src={`file://${doc.image}`} alt={doc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {getStatusBadge(doc.status)}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  {doc.type === 'PDF' ? <FileText size={20} /> : <ImageIcon size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900" style={{ fontFamily: 'serif' }}>{doc.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.type} • {doc.size}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Calendar size={14} />
                  {doc.date}
                </div>
                <button 
                  onClick={() => setSelectedDoc(doc)}
                  className="text-sm font-bold text-gray-900 hover:text-orange-600 transition"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setSelectedDoc(null)}
          ></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>{selectedDoc.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Uploaded on {selectedDoc.date} • {selectedDoc.size}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  <Download size={16} />
                  Download
                </button>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 flex items-center justify-center min-h-[400px]">
              <img 
                src={`file://${selectedDoc.image}`} 
                alt={selectedDoc.title} 
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
              <button 
                onClick={() => handleVerifyDocument('Rejected')}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                Reject Document
              </button>
              <button 
                onClick={() => handleVerifyDocument('Verified')}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                Approve & Verify
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  )
}
