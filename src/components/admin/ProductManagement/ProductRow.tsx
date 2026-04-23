import React from "react";
import { Star, Trash2, Package, Layers, AlertCircle, CheckCircle2, Clock, ChevronDown, Save, X, Edit3 } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { ImageUploader } from "../ImageUploader";
import { useQueryClient } from "@tanstack/react-query";

interface ProductRowProps {
  p: any;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  toggleProductStatus: (id: string, current: boolean) => Promise<void>;
  bulkAction: (action: "delete" | "feature" | "unfeature") => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  p,
  selectedProducts,
  setSelectedProducts,
  toggleProductStatus,
  bulkAction,
  deleteProduct,
}) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  
  // Edit States
  const [editData, setEditData] = React.useState({
    title: p.title,
    author: p.author || "",
    category: p.category,
    price: p.price,
    stock: p.stock ?? 0,
    description: p.description || "",
    images: p.images || []
  });

  const getCoverImage = (imgs: any, url: string | null) => {
    // 1. Check plural array (new system)
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0] && !imgs[0].includes("placeholder")) return imgs[0];
    
    // 2. Check singular URL (legacy system - 21k items)
    if (url && url !== "/placeholder.svg" && !url.includes("placeholder")) return url;
    
    // 3. Fallback for strings/JSON
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

      toast.toast({ 
        title: "Asset Synchronized", 
        description: "The product registry has been updated with the new metadata." 
      });
      
      // Silent re-fetch
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsExpanded(false);
    } catch (error: any) {
      toast.toast({ 
        title: "Sync Failed", 
        description: error.message || "An error occurred while updating the database.", 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className={`group transition-colors ${isExpanded ? "bg-primary/[0.03]" : "hover:bg-muted/5"}`}>
        <td className="px-8 py-6 text-center">
          <input 
            type="checkbox" 
            checked={selectedProducts.includes(p.id)} 
            className="w-4 h-4 rounded-lg border-2 border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
            onChange={(e) => setSelectedProducts(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} 
          />
        </td>
        <td className="px-8 py-6" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-5 cursor-pointer">
            <div className="relative shrink-0">
              {coverImage && coverImage !== "/placeholder.svg" ? (
                <img src={coverImage} alt="" className="w-14 h-14 rounded-2xl object-cover border border-border shadow-sm group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center border border-border">
                  <Package className="w-6 h-6 text-muted-foreground opacity-30" />
                </div>
              )}
              {p.is_featured && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
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
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className={`p-2.5 rounded-xl border border-border bg-white text-muted-foreground transition-all ${isExpanded ? "rotate-180 bg-primary/5 border-primary/20 text-primary" : "hover:text-primary hover:border-primary"}`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {!isExpanded && (
              <>
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
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Edit Mode */}
      {isExpanded && (
        <tr className="bg-primary/[0.02]">
          <td colSpan={7} className="px-8 py-10 border-b border-primary/5">
            <div className="grid lg:grid-cols-3 gap-12 animate-in slide-in-from-top-4 duration-500">
              {/* Image & Main Info */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Media Asset
                </h4>
                <ImageUploader 
                  value={Array.isArray(editData.images) ? editData.images[0] : editData.images}
                  onChange={(url) => setEditData({...editData, images: [url]})}
                  label="Product Cover"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Retail Price (KSH)</label>
                    <input 
                      type="number" 
                      value={editData.price} 
                      onChange={e => setEditData({...editData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-black focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Current Stock</label>
                    <input 
                      type="number" 
                      value={editData.stock} 
                      onChange={e => setEditData({...editData, stock: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-black focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" /> Metadata Details
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Title</label>
                    <input 
                      value={editData.title} 
                      onChange={e => setEditData({...editData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Author / Brand</label>
                    <input 
                      value={editData.author} 
                      onChange={e => setEditData({...editData, author: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Category</label>
                    <input 
                      value={editData.category} 
                      onChange={e => setEditData({...editData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-bold" 
                    />
                  </div>
                </div>
              </div>

              {/* Narrative & Actions */}
              <div className="space-y-6 flex flex-col">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Narrative Description</h4>
                  <span className={`text-[10px] font-bold ${editData.description.length > 500 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {editData.description.length} / 1000
                  </span>
                </div>
                <textarea 
                  value={editData.description} 
                  onChange={e => setEditData({...editData, description: e.target.value.slice(0, 1000)})}
                  className="flex-1 w-full p-6 bg-white border border-border rounded-[2rem] text-sm font-medium leading-relaxed resize-none focus:ring-4 focus:ring-primary/5 outline-none"
                  placeholder="Describe the asset for the global marketplace..."
                />
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsExpanded(false)} 
                    className="flex-1 py-4 px-6 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Synchronizing..." : "Apply Metadata"}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
);
