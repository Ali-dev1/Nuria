import React from "react";
import { ProductRow } from "./ProductRow";

interface ProductTableProps {
  productsData: any;
  isLoading: boolean;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  toggleProductStatus: (id: string, current: boolean) => Promise<void>;
  bulkAction: (action: "delete" | "feature" | "unfeature") => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  productsData,
  isLoading,
  selectedProducts,
  setSelectedProducts,
  toggleProductStatus,
  bulkAction,
  deleteProduct,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/5">
              <th className="px-8 py-6 w-16 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-lg border-2 border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  onChange={(e) => setSelectedProducts(e.target.checked ? (productsData?.products || []).map((p: any) => p.id) : [])} 
                />
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asset Details</th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Classification</th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pricing</th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock Level</th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Availability</th>
              <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              ['psk-1', 'psk-2', 'psk-3', 'psk-4', 'psk-5', 'psk-6', 'psk-7', 'psk-8'].map((id) => (
                <tr key={id} className="animate-pulse">
                  <td colSpan={7} className="px-8 py-8"><div className="h-4 bg-muted/50 rounded-full w-full" /></td>
                </tr>
              ))
            ) : (
              (productsData?.products || []).map((p: any) => (
                <ProductRow 
                  key={p.id}
                  p={p}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  toggleProductStatus={toggleProductStatus}
                  bulkAction={bulkAction}
                  deleteProduct={deleteProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
