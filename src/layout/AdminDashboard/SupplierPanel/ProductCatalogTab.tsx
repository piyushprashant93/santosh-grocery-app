export default function ProductCatalogTab() {
  const products = [
    { sku: "PRD-001", name: "Organic Tomatoes (Bulk)", stock: 450, price: "$2.50/kg", status: "In Stock" },
    { sku: "PRD-002", name: "Fresh Lettuce (Crates)", stock: 180, price: "$1.80/kg", status: "In Stock" },
    { sku: "PRD-003", name: "Premium Olive Oil", stock: 25, price: "$15.00/L", status: "Low Stock" },
    { sku: "PRD-004", name: "Bulk Rice Bags", stock: 320, price: "$3.20/kg", status: "In Stock" },
  ];

  return (
    <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          View Only - Admin Access
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">SKU</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Product Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Stock</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Price</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.sku}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{product.name}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{product.stock}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.price}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
