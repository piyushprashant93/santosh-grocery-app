import { Routes, Route } from "react-router-dom"

import ProductFoodList from "./ProductFoodList"
import AddMenuItem from "./AddMenuItem"

export default function ProductFoodPanelLayout() {
  return (
    <div className="w-full animate-in fade-in duration-300">
      <Routes>
        <Route path="*" element={<ProductFoodList />} />
        <Route path="product-food" element={<ProductFoodList />} />
        <Route path="product-food/add" element={<AddMenuItem />} />
      </Routes>
    </div>
  )
}
