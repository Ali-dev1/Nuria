import React, { useState } from "react";
import { Star, Package, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { BookStatusBadge } from "./BookStatusBadge";
import { PriceDisplay } from "./PriceDisplay";
import { ActionButtons } from "./ActionButtons";
import { ProductEditPanel } from "./ProductEditPanel";

interface ProductRowProps {
  p: Record<string, unknown>;
  variant: "mobile" | "desktop";
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  toggleProductStatus: (id: string, current: boolean) => Promise<void>;
  toggleFeatured: (id: string, current: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  p,
  variant,
  selectedProducts,
  setSelectedProducts,
  toggleProductStatus,
  toggleFeatured,
  deleteProduct,
}) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editData, setEditData] = useState({
    title: p.title as string,
    author: (p.author as string) || "",
    category: p.category as string,
    price: p.price as number,
    stock: (p.stock as number) ?? 0,
    description: (p.description as string) || "",
    images: (p.images as string[]) || []
  });

  const getCoverImage = (imgs: unknown, url: string | null) => {
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0] && !imgs[0].includes("placeholder")) return imgs[0];
    if (url && url !== "/placeholder.svg" && !url.includes("placeholder")) return url;
    if (typeof imgs === "string" && imgs.length > 5) {
      try {
        const parsed = JSON.parse(imgs);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgs;
      } catch {
        return imgs;
      }
    }
    return null;
  };
  
  const coverImage = getCoverImage(p.images, p.image_url as string | null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const { toast } = await import("@/hooks/use-toast");
      const { error } = await supabase.from("products").update({ 
        title: editData.title,
        author: editData.author,
        category: editData.category,
        price: Number(editData.price), 
        stock: Number(editData.stock),
        description: editData.description,
        images: Array.isArray(editData.images) ? editData.images : [editData.images]
      }).eq("id", p.id);

      if (error) throw error;
      toast.toast({ title: "Product updated" });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsExpanded(false);
    } catch (err: unknown) {
      const { toast } = await import("@/hooks/use-toast");
      toast.toast({ title: "Update failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (variant === "mobile") {
    return (
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={selectedProducts.includes(p.id as string)} 
            className="w-4 h-4 rounded border-border text-primary mt-1 shrink-0"
            onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id as string] : prev.filter(id => id !== p.id))} 
          />
          {coverImage ? (
            <img src={coverImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border shrink-0">
              <Package className="w-5 h-5 text-muted-foreground/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{p.title as string}</p>
            <p className="text-xs text-muted-foreground">{(p.author as string) || "—"}</p>
            <div className="flex items-center gap-3 mt-2">
              <PriceDisplay price={p.price as number} />
              <span className={`text-xs px-1.5 py-0.5 rounded ${p.category ? "bg-muted text-muted-foreground" : ""}`}>
                {(p.category as string) || "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pl-7">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${((p.stock as number) ?? 0) < 10 ? "text-red-500" : "text-muted-foreground"}`}>
              {(p.stock as number) ?? 0} in stock
            </span>
            {((p.stock as number) ?? 0) < 10 && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
          <div className="flex items-center gap-1">
            <ActionButtons 
              id={p.id as string} 
              isFeatured={p.is_featured as boolean} 
              isExpanded={isExpanded} 
              toggleFeatured={toggleFeatured} 
              deleteProduct={deleteProduct} 
              onToggleExpand={() => setIsExpanded(!isExpanded)} 
              variant="mobile"
            />
            <BookStatusBadge isActive={p.is_active as boolean} onClick={() => toggleProductStatus(p.id as string, p.is_active as boolean)} variant="mobile" />
          </div>
        </div>
        {isExpanded && <ProductEditPanel editData={editData} setEditData={setEditData} saving={saving} onSave={handleSave} onCancel={() => setIsExpanded(false)} />}
      </div>
    );
  }

  return (
    <>
      <tr className={`group transition-colors ${isExpanded ? "bg-primary/[0.02]" : "hover:bg-muted/30"}`}>
        <td className="px-4 py-4">
          <input 
            type="checkbox" 
            checked={selectedProducts.includes(p.id as string)} 
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id as string] : prev.filter(id => id !== p.id))} 
          />
        </td>
        <td className="px-4 py-4">
          <button 
            type="button"
            className="flex items-center gap-3 w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="relative shrink-0">
              {coverImage ? (
                <img src={coverImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
              ) : (
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                  <Package className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
              {p.is_featured && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border border-white">
                  <Star className="w-2.5 h-2.5 text-white fill-current" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate max-w-[250px]">{p.title as string}</p>
              <p className="text-xs text-muted-foreground">{(p.author as string) || "—"}</p>
            </div>
          </button>
        </td>
        <td className="px-4 py-4">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {(p.category as string) || "—"}
          </span>
        </td>
        <td className="px-4 py-4">
          <PriceDisplay price={p.price as number} />
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${((p.stock as number) ?? 0) < 10 ? "text-red-500" : "text-foreground"}`}>
              {(p.stock as number) ?? 0}
            </span>
            {((p.stock as number) ?? 0) < 10 && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          <BookStatusBadge isActive={p.is_active as boolean} onClick={() => toggleProductStatus(p.id as string, p.is_active as boolean)} />
        </td>
        <td className="px-4 py-4 text-right">
          <ActionButtons 
            id={p.id as string} 
            isFeatured={p.is_featured as boolean} 
            isExpanded={isExpanded} 
            toggleFeatured={toggleFeatured} 
            deleteProduct={deleteProduct} 
            onToggleExpand={() => setIsExpanded(!isExpanded)} 
          />
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-muted/20">
          <td colSpan={7} className="px-4 py-6 border-b border-border">
            <ProductEditPanel editData={editData} setEditData={setEditData} saving={saving} onSave={handleSave} onCancel={() => setIsExpanded(false)} />
          </td>
        </tr>
      )}
    </>
  );
};
