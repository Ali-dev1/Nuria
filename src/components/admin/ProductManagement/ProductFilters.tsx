import React from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductFiltersProps {
  productSearch: string;
  setProductSearch: (search: string) => void;
  selectedProducts: string[];
  bulkAction: (action: "delete" | "feature" | "unfeature") => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  productSearch,
  setProductSearch,
  selectedProducts,
  bulkAction,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">Inventory Nexus</h2>
        <p className="text-sm text-muted-foreground mt-1 italic">Authorized catalog management and oversight</p>
      </div>
      
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        <div className="relative group flex-1 sm:flex-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input 
            value={productSearch} 
            onChange={(e) => setProductSearch(e.target.value)} 
            placeholder="Query ISBN or title…" 
            className="w-full sm:w-64 pl-12 pr-4 py-3 border border-border rounded-2xl text-sm bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm font-medium" 
          />
        </div>
        
        <Link to="/vendor/products/new" className="px-6 py-3 bg-[#1B4332] text-white rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-[#132c21] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Register Asset
        </Link>

        {selectedProducts.length > 0 && (
          <div className="flex gap-2 animate-in zoom-in-95">
            <button onClick={() => bulkAction("feature")} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all">Highlight ({selectedProducts.length})</button>
            <button onClick={() => bulkAction("delete")} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Purge</button>
          </div>
        )}
      </div>
    </div>
  );
};
