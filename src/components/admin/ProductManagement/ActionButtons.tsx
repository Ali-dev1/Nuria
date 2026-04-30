import React from "react";
import { Star, Trash2, ChevronDown } from "lucide-react";

interface ActionButtonsProps {
  id: string;
  isFeatured: boolean;
  isExpanded: boolean;
  toggleFeatured: (id: string, current: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  onToggleExpand: () => void;
  variant?: "mobile" | "desktop";
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  id, isFeatured, isExpanded, toggleFeatured, deleteProduct, onToggleExpand, variant = "desktop" 
}) => {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-1">
        <button 
          onClick={() => toggleFeatured(id, isFeatured)}
          className={`p-1.5 rounded-lg transition-colors ${isFeatured ? "bg-amber-100 text-amber-600" : "text-muted-foreground hover:text-amber-500"}`}
          title={isFeatured ? "Remove from featured" : "Add to featured"}
        >
          <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
        </button>
        <button 
          onClick={onToggleExpand}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
        <button 
          onClick={() => deleteProduct(id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <button 
        onClick={onToggleExpand} 
        className={`p-2 rounded-lg border border-border transition-colors ${isExpanded ? "bg-primary/5 border-primary/20 text-primary" : "bg-white text-muted-foreground hover:text-primary hover:border-primary/30"}`}
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      <button 
        onClick={() => toggleFeatured(id, isFeatured)}
        className={`p-2 rounded-lg border transition-colors ${isFeatured ? "bg-amber-500 border-amber-500 text-white" : "border-border bg-white text-muted-foreground hover:text-amber-500 hover:border-amber-400"}`}
        title={isFeatured ? "Remove from featured" : "Add to featured"}
      >
        <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
      </button>
      <button 
        onClick={() => deleteProduct(id)} 
        className="p-2 rounded-lg border border-border bg-white text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
