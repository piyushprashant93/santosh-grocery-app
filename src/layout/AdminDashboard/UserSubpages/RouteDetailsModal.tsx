import Dialog from "../../../components/common/Dialog"
import { Phone, Navigation } from "lucide-react"

interface RouteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
}

export default function RouteDetailsModal({ isOpen, onClose, deliveryId }: RouteDetailsModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} hideHeader className="max-w-4xl p-0">
      <div className="flex flex-col h-full">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Route Details</h2>
            <p className="text-gray-500 mt-1">Delivery tracking for Order #ORD-5521</p>
          </div>
          <span className="px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold rounded-lg text-sm border border-gray-200">
            {deliveryId || 'DLV-1023'}
          </span>
        </div>

        {/* Content Split */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[500px]">
          
          {/* Left: Map Area */}
          <div className="flex-1 bg-gray-100 relative min-h-[300px] md:min-h-full">
            {/* Placeholder Map Pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
            
            {/* Map Placeholder Content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
                <Navigation size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Map Integration Pending</p>
              </div>
            </div>

            {/* Overlays */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-theme-surface rounded-xl shadow-lg border border-gray-100 p-4 flex items-center divide-x divide-gray-100">
                <div className="flex-1 flex items-center gap-3 pr-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Total Distance: 4.2 miles</p>
                  </div>
                </div>
                <div className="flex-1 pl-4">
                  <p className="text-sm font-semibold text-gray-900">Est. Time: 25 mins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Sidebar */}
          <div className="w-full md:w-[320px] shrink-0 bg-theme-surface p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col gap-8 overflow-y-auto">
            
            {/* Driver Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Driver Info</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Driver" 
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Mike S.</span>
                    <span className="text-xs text-gray-500">+1 234 567 890</span>
                  </div>
                </div>
                <button className="p-2 bg-theme-surface border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100 transition shadow-sm">
                  <Phone size={16} />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Timeline</h3>
              <div className="relative pl-6 flex flex-col gap-6 mt-2">
                {/* Line */}
                <div className="absolute top-2 bottom-2 left-2 w-[2px] bg-gray-100"></div>

                {/* Steps */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm" />
                  <p className="text-sm font-medium text-gray-900">Picked up from restaurant</p>
                  <p className="text-xs text-gray-500 mt-1">12:20 PM</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm" />
                  <p className="text-sm font-medium text-gray-900">Arrived at location</p>
                  <p className="text-xs text-gray-500 mt-1">12:35 PM</p>
                </div>
                
                <div className="relative">
                  {/* Current Active Step */}
                  <div className="absolute -left-[30px] top-1 w-[14px] h-[14px] rounded-full bg-emerald-500 border-[3px] border-emerald-100 shadow-sm" />
                  <p className="text-sm font-medium text-gray-900">Delivered to customer</p>
                  <p className="text-xs text-gray-500 mt-1">12:45 PM</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </Dialog>
  )
}
