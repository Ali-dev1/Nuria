import React from "react";
import { ProductRow } from "./ProductRow";

interface ProductTableProps {
  productsData: { products: Record<string, any>[] } | null | undefined;
  isLoading: boolean;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  toggleProductStatus: (id: string, current: boolean) => Promise<void>;
  toggleFeatured: (id: string, current: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  productsData,
  isLoading,
  selectedProducts,
  setSelectedProducts,
  toggleProductStatus,
  toggleFeatured,
  deleteProduct,
}) => {
  const products = productsData?.products || [];

  return (
    <>
      {/* Mobile: Card view */}
      <div className="md:hidden bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map(() => (
            <div key={crypto.randomUUID()} className="p-4 border-b border-border animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : (
          products.map((p: Record<string, any>) => (
            <ProductRow 
              key={p.id}
              p={p}
              variant="mobile"
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              toggleProductStatus={toggleProductStatus}
              toggleFeatured={toggleFeatured}
              deleteProduct={deleteProduct}
            />
          ))
        )}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                    onChange={(e) => setSelectedProducts(e.target.checked ? products.map((p: Record<string, any>) => p.id) : [])}
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map(() => (
                  <tr key={crypto.randomUUID()} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-5"><div className="h-4 bg-muted rounded w-full" /></td>
                  </tr>
                ))
              ) : (
                products.map((p: Record<string, any>) => (
                  <ProductRow 
                    key={p.id}
                    p={p}
                    variant="desktop"
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    toggleProductStatus={toggleProductStatus}
                    toggleFeatured={toggleFeatured}
                    deleteProduct={deleteProduct}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
