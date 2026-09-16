import { useState } from "react"
import { Info, Bold, Italic, Underline, Link2, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function LegalSettingsTab() {
  const [activePolicy, setActivePolicy] = useState('Terms of Service');

  const policies = [
    'Terms of Service',
    'Privacy Policy',
    'Refund Policy',
    'Driver Agreement'
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
        
        {/* Header & Tabs */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Legal & Policies Editor</h2>
          <p className="text-sm text-gray-500 mb-6">Manage terms, privacy policies, and agreements.</p>
          
          <div className="flex flex-wrap gap-2">
            {policies.map(policy => (
              <button
                key={policy}
                onClick={() => setActivePolicy(policy)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activePolicy === policy 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {policy}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Mock Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0">
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Underline size={16} /></button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><AlignLeft size={16} /></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><AlignCenter size={16} /></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><AlignRight size={16} /></button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Link2 size={16} /></button>
          </div>
          
          {/* Text Area */}
          <textarea 
            className="flex-1 w-full p-4 bg-white border border-gray-200 rounded-b-lg text-sm text-gray-700 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition resize-none min-h-[300px]"
            defaultValue={`1. Introduction\nWelcome to HubNepa. By using our platform, you agree to these ${activePolicy}. Please read them carefully.\n\n2. User Responsibilities\nYou are responsible for maintaining the confidentiality of your account credentials...`}
            key={activePolicy} // Re-renders default value on tab switch
          ></textarea>
        </div>

      </div>

      {/* Footer Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Legal Disclaimer</h4>
          <p className="text-xs text-blue-700 mt-1">
            Changes to this section directly impact how users interact with your platform. Please ensure all policies are compliant with local laws. We recommend consulting a legal professional before publishing major updates.
          </p>
        </div>
      </div>

    </div>
  )
}
