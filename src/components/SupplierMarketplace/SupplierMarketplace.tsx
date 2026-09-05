import { useState } from "react";
import SupplierMarketplaceList from "./SupplierMarketplaceList";
import SupplierProducts from "./SupplierProducts";
import SupplyCart from "./SupplyCart";

export default function SupplierMarketplace({ role }: { role: "retailer" | "restaurant-panel" }) {
  const [view, setView] = useState<"list" | "products" | "cart">("list");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  if (view === "cart") {
    return (
      <SupplyCart
        role={role}
        onBack={() => {
          if (selectedSupplierId) {
            setView("products");
          } else {
            setView("list");
          }
        }}
      />
    );
  }

  if (view === "products" && selectedSupplierId) {
    return (
      <SupplierProducts
        role={role}
        supplierId={selectedSupplierId}
        onBack={() => setView("list")}
        onGoToCart={() => setView("cart")}
      />
    );
  }

  return (
    <SupplierMarketplaceList
      role={role}
      onSelectSupplier={(id) => {
        setSelectedSupplierId(id);
        setView("products");
      }}
      onGoToCart={() => setView("cart")}
    />
  );
}
