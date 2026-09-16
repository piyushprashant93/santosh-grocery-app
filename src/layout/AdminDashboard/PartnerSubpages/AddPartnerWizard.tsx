import { useState } from "react"
import { ArrowLeft, Check, Store, ShoppingBag, UploadCloud, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../../../lib/api"

export default function AddPartnerWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [partnerType, setPartnerType] = useState<'restaurant' | 'retailer'>('restaurant');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    category: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      
      const payload = {
        type: partnerType,
        ...formData
      };

      await api.post('/api/v1/admin/partners', payload);
      
      alert('Partner created successfully!');
      navigate('/admin/dashboard/partner-management');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to create partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header & Stepper */}
      <div className="mb-8 flex flex-col gap-10">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard/partner-management')}
            className="mt-1 p-1.5 text-gray-900 hover:text-gray-600 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'serif' }}>
              Add New Partner
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Onboard a new restaurant or retail vendor to the platform.
            </p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center px-4">
          {/* Step 1 */}
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step > 1 ? "bg-gray-900 text-white" : step === 1 ? "bg-gray-900 text-white" : "text-gray-500"
            }`}>
              {step > 1 ? <Check size={16} /> : 1}
            </div>
            <div className={`w-16 md:w-24 h-[1px] mx-2 transition-colors duration-300 ${step > 1 ? "bg-gray-900" : "bg-gray-200"}`}></div>
          </div>
          {/* Step 2 */}
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step > 2 ? "bg-gray-900 text-white" : step === 2 ? "bg-gray-900 text-white" : "text-gray-500"
            }`}>
              {step > 2 ? <Check size={16} /> : 2}
            </div>
            <div className={`w-16 md:w-24 h-[1px] mx-2 transition-colors duration-300 ${step > 2 ? "bg-gray-900" : "bg-gray-200"}`}></div>
          </div>
          {/* Step 3 */}
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step === 3 ? "bg-gray-900 text-white" : "text-gray-500"
            }`}>
              3
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
        
        {/* === STEP 1: Partner Information === */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Partner Information</h2>
            <p className="text-sm text-gray-500 mb-8">Select partner type and basic details.</p>

            {/* Type Toggles */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setPartnerType('restaurant')}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  partnerType === 'restaurant' 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Store size={28} className={partnerType === 'restaurant' ? "text-emerald-600" : "text-gray-400"} />
                <span className="font-bold">Restaurant</span>
              </button>
              
              <button 
                onClick={() => setPartnerType('retailer')}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  partnerType === 'retailer' 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag size={28} className={partnerType === 'retailer' ? "text-emerald-600" : "text-gray-400"} />
                <span className="font-bold">Retailer</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tasty Bites" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Owner Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="partner@hubnepa.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
            </div>
          </div>
        )}

        {/* === STEP 2: Location & Details === */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Location & Details</h2>
            <p className="text-sm text-gray-500 mb-8">Address and business categorization.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-gray-200 text-gray-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                >
                  <option value="">Select category</option>
                  <option value="asian">Asian Cuisine</option>
                  <option value="italian">Italian Cuisine</option>
                  <option value="fastfood">Fast Food</option>
                  <option value="grocery">Grocery Store</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Street Address</label>
                <input 
                  type="text" 
                  placeholder="123 Main St" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                <input 
                  type="text" 
                  placeholder="Scranton" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Zip Code</label>
                <input 
                  type="text" 
                  placeholder="18503" 
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition" 
                />
              </div>
            </div>
          </div>
        )}

        {/* === STEP 3: Verification Documents === */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Verification Documents</h2>
            <p className="text-sm text-gray-500 mb-8">Upload required business licenses.</p>

            <div className="flex flex-col gap-6 mb-8">
              {/* Dropzone 1 */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={20} />
                </div>
                <p className="font-bold text-gray-900 mt-2">Upload Business License</p>
                <p className="text-xs text-gray-400">PDF, JPG, or PNG (Max 5MB)</p>
              </div>

              {/* Dropzone 2 */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={20} />
                </div>
                <p className="font-bold text-gray-900 mt-2">Upload Tax ID / EIN</p>
                <p className="text-xs text-gray-400">PDF, JPG, or PNG (Max 5MB)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button 
          onClick={step === 1 ? () => navigate('/admin/dashboard/partner-management') : handleBack}
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          Back
        </button>
        
        {step < 3 ? (
          <button 
            onClick={handleNext}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            Next Step &gt;
          </button>
        ) : (
          <button 
            onClick={handleFinalSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create Partner Account
          </button>
        )}
      </div>

    </div>
  )
}
