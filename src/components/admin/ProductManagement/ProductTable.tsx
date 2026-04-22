import React from "react";
import { Star, Trash2, Package, Layers, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatPrice } from "@/lib/constants";

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
              [...Array(8)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td colSpan={7} className="px-8 py-8"><div className="h-4 bg-muted/50 rounded-full w-full" /></td>
                </tr>
              ))
            ) : (
              (productsData?.products || []).map((p: any) => (
                <tr key={p.id} className="group hover:bg-muted/5 transition-colors">
                  <td className="px-8 py-6 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(p.id)} 
                      className="w-4 h-4 rounded-lg border-2 border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                      onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} 
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} className="w-14 h-14 rounded-2xl object-cover border border-border shadow-sm group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center border border-border">
                            <Package className="w-6 h-6 text-muted-foreground opacity-30" />
                          </div>
                        )}
                        {p.is_featured && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-0 duration-500">
                            <Star className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium italic mt-0.5">{p.author || "Global Registry"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                      <Layers className="w-3 h-3" />
                      {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-foreground">{formatPrice(p.price)}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter mt-0.5">Retail Value</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <span className={`text-sm font-black ${(p.stock ?? 0) < 10 ? "text-red-500" : "text-foreground"}`}>
                            {p.stock ?? 0}
                         </span>
                         {(p.stock ?? 0) < 10 && <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                      </div>
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                         <div 
                            className={`h-full transition-all duration-1000 ${
                               (p.stock ?? 0) < 10 ? "bg-red-500" : "bg-primary/40"
                            }`}
                            style={{ width: `${Math.min(100, (p.stock ?? 0) * 2)}%` }}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => toggleProductStatus(p.id, p.is_active)} 
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        p.is_active 
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200" 
                        : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                      }`}
                    >
                      {p.is_active ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {p.is_active ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => bulkAction(p.is_featured ? "unfeature" : "feature")} 
                        className={`p-2.5 rounded-xl border border-border transition-all ${p.is_featured ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white text-muted-foreground hover:text-amber-500 hover:border-amber-500"}`}
                        title={p.is_featured ? "Remove Spotlight" : "Spotlight Asset"}
                      >
                        <Star className={`w-4 h-4 ${p.is_featured ? "fill-current" : ""}`} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)} 
                        className="p-2.5 rounded-xl border border-border bg-white text-muted-foreground hover:text-red-500 hover:border-red-500 transition-all"
                        title="Purge Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
