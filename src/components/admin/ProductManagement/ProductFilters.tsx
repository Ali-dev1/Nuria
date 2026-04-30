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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Products</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your product catalog</p>
      </div>
      
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            value={productSearch} 
            onChange={(e) => setProductSearch(e.target.value)} 
            placeholder="Search products..." 
            className="w-full sm:w-56 pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
          />
        </div>
        
        <Link to="/vendor/products/new" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Product
        </Link>

        {selectedProducts.length > 0 && (
          <div className="flex gap-2 animate-in fade-in">
            <button onClick={() => bulkAction("feature")} className="px-3 py-2.5 text-xs font-semibold bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              Feature ({selectedProducts.length})
            </button>
            <button onClick={() => bulkAction("delete")} className="px-3 py-2.5 text-xs font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
