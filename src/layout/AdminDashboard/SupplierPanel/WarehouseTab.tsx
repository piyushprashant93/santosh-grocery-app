export default function WarehouseTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Warehouse Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Zone Management */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/30">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Zone Management</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Zone A - Refrigerated</span>
              <span className="font-bold text-gray-900">85% Full</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Zone B - Dry Goods</span>
              <span className="font-bold text-gray-900">62% Full</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Zone C - Frozen</span>
              <span className="font-bold text-gray-900">45% Full</span>
            </div>
          </div>
        </div>

        {/* Stock Movement */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/30">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Stock Movement</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Incoming Today:</span>
              <span className="font-bold text-gray-900">45 items</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Outgoing Today:</span>
              <span className="font-bold text-gray-900">62 items</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Adjustments Pending:</span>
              <span className="font-bold text-gray-900">8 items</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
