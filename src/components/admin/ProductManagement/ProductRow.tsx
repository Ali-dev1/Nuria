import React, { useState } from "react";
import { Star, Trash2, Package, ChevronDown, Save, X, Edit3, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { ImageUploader } from "../ImageUploader";
import { useQueryClient } from "@tanstack/react-query";

interface ProductRowProps {
  p: any;
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
    title: p.title,
    author: p.author || "",
    category: p.category,
    price: p.price,
    stock: p.stock ?? 0,
    description: p.description || "",
    images: p.images || []
  });

  const getCoverImage = (imgs: any, url: string | null) => {
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0] && !imgs[0].includes("placeholder")) return imgs[0];
    if (url && url !== "/placeholder.svg" && !url.includes("placeholder")) return url;
    if (typeof imgs === "string" && imgs.length > 5) {
      try {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        return imgs;
      } catch {
        return imgs;
      }
    }
    return null;
  };
  
  const coverImage = getCoverImage(p.images, p.image_url);

  const handleSave = async () => {
    setSaving(true);
    const { supabase } = await import("@/lib/supabaseClient");
    const { toast } = await import("@/hooks/use-toast");
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ 
          title: editData.title,
          author: editData.author,
          category: editData.category,
          price: Number(editData.price), 
          stock: Number(editData.stock),
          description: editData.description,
          images: Array.isArray(editData.images) ? editData.images : [editData.images]
        })
        .eq("id", p.id);

      if (error) throw error;

      toast.toast({ title: "Product updated" });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsExpanded(false);
    } catch (error: any) {
      toast.toast({ 
        title: "Update failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  // Shared edit panel
  const EditPanel = () => (
    <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300 mt-4 md:mt-0">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Media</h4>
        <ImageUploader 
          value={Array.isArray(editData.images) ? editData.images[0] : editData.images}
          onChange={(url) => setEditData({...editData, images: [url]})}
          label="Product Cover"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Price (KSH)</label>
            <input 
              type="number" 
              value={editData.price} 
              onChange={e => setEditData({...editData, price: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Stock</label>
            <input 
              type="number" 
              value={editData.stock} 
              onChange={e => setEditData({...editData, stock: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Details</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Title</label>
            <input 
              value={editData.title} 
              onChange={e => setEditData({...editData, title: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Author</label>
            <input 
              value={editData.author} 
              onChange={e => setEditData({...editData, author: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Category</label>
            <input 
              value={editData.category} 
              onChange={e => setEditData({...editData, category: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Description</h4>
          <span className={`text-xs ${editData.description.length > 500 ? "text-amber-600" : "text-muted-foreground"}`}>
            {editData.description.length}/1000
          </span>
        </div>
        <textarea 
          value={editData.description} 
          onChange={e => setEditData({...editData, description: e.target.value.slice(0, 1000)})}
          className="flex-1 w-full p-3 bg-white border border-border rounded-xl text-sm leading-relaxed resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]"
          placeholder="Product description..."
        />
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(false)} 
            className="flex-1 py-2.5 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-2.5 px-4 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === "mobile") {
    return (
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={selectedProducts.includes(p.id)} 
            className="w-4 h-4 rounded border-border text-primary mt-1 shrink-0"
            onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} 
          />
          {coverImage ? (
            <img src={coverImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border shrink-0">
              <Package className="w-5 h-5 text-muted-foreground/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground">{p.author || "—"}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-bold text-foreground">{formatPrice(p.price)}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${p.category ? "bg-muted text-muted-foreground" : ""}`}>
                {p.category || "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pl-7">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${(p.stock ?? 0) < 10 ? "text-red-500" : "text-muted-foreground"}`}>
              {p.stock ?? 0} in stock
            </span>
            {(p.stock ?? 0) < 10 && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => toggleFeatured(p.id, p.is_featured)}
              className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? "bg-amber-100 text-amber-600" : "text-muted-foreground hover:text-amber-500"}`}
              title={p.is_featured ? "Remove from featured" : "Add to featured"}
            >
              <Star className={`w-4 h-4 ${p.is_featured ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={() => toggleProductStatus(p.id, p.is_active)}
              className={`p-1.5 rounded-lg transition-colors ${p.is_active ? "text-green-600" : "text-muted-foreground"}`}
            >
              {p.is_active ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => deleteProduct(p.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {isExpanded && <EditPanel />}
      </div>
    );
  }

  return (
    <>
      <tr className={`group transition-colors ${isExpanded ? "bg-primary/[0.02]" : "hover:bg-muted/30"}`}>
        <td className="px-4 py-4">
          <input 
            type="checkbox" 
            checked={selectedProducts.includes(p.id)} 
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} 
          />
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
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
              <p className="text-sm font-semibold text-foreground truncate max-w-[250px]">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.author || "—"}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {p.category || "—"}
          </span>
        </td>
        <td className="px-4 py-4">
          <p className="text-sm font-bold text-foreground">{formatPrice(p.price)}</p>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${(p.stock ?? 0) < 10 ? "text-red-500" : "text-foreground"}`}>
              {p.stock ?? 0}
            </span>
            {(p.stock ?? 0) < 10 && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          <button 
            onClick={() => toggleProductStatus(p.id, p.is_active)} 
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              p.is_active 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-gray-50 text-gray-500 border border-gray-200"
            }`}
          >
            {p.is_active ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {p.is_active ? "Live" : "Draft"}
          </button>
        </td>
        <td className="px-4 py-4 text-right">
          <div className="flex justify-end gap-1">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className={`p-2 rounded-lg border border-border transition-colors ${isExpanded ? "bg-primary/5 border-primary/20 text-primary" : "bg-white text-muted-foreground hover:text-primary hover:border-primary/30"}`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            <button 
              onClick={() => toggleFeatured(p.id, p.is_featured)}
              className={`p-2 rounded-lg border transition-colors ${p.is_featured ? "bg-amber-500 border-amber-500 text-white" : "border-border bg-white text-muted-foreground hover:text-amber-500 hover:border-amber-400"}`}
              title={p.is_featured ? "Remove from featured" : "Add to featured"}
            >
              <Star className={`w-4 h-4 ${p.is_featured ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={() => deleteProduct(p.id)} 
              className="p-2 rounded-lg border border-border bg-white text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-muted/20">
          <td colSpan={7} className="px-4 py-6 border-b border-border">
            <EditPanel />
          </td>
        </tr>
      )}
    </>
  );
};
