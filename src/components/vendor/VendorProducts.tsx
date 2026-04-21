import { useState } from "react";
import { Search, Package, Plus, Edit, Trash2, Upload, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, CATEGORIES } from "@/lib/constants";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface VendorProductsProps {
  products: any[];
  onRefresh: () => void;
}

export const VendorProducts = ({ products, onRefresh }: VendorProductsProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const filteredProducts = products.filter((p) => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    onRefresh();
  };

  const startEdit = (p: any) => {
    setEditingProduct(p.id);
    setEditForm({ ...p });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    const { error } = await supabase.from("products").update({
      title: editForm.title,
      author: editForm.author,
      price: Number(editForm.price),
      original_price: editForm.original_price ? Number(editForm.original_price) : null,
      stock: Number(editForm.stock),
      category: editForm.category,
      format: editForm.format,
      isbn: editForm.isbn,
      description: editForm.description,
      is_active: editForm.is_active,
    }).eq("id", editingProduct);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product updated successfully" });
    setEditingProduct(null);
    onRefresh();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("products").update({ is_active: active }).eq("id", id);
    onRefresh();
  };

  const uploadProductCover = async (file: File) => {
    if (!editingProduct) return;
    setUploading(true);
    try {
      const path = `products/${editingProduct}_${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("book-covers").upload(path, file);
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from("book-covers").getPublicUrl(path);
      await supabase.from("products").update({ images: [publicUrl] }).eq("id", editingProduct);
      setEditForm(prev => ({ ...prev, images: [publicUrl] }));
      toast({ title: "Cover image updated" });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Product Inventory
          </h3>
          <p className="text-xs text-muted-foreground font-medium italic">Manage your marketplace catalog and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search ISBN, title..." 
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-xs bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
            />
          </div>
          <Link to="/vendor/products/new" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            <Plus className="w-3.5 h-3.5" /> New Item
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Package className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Inventory Empty</p>
            <p className="text-[10px] text-muted-foreground mt-1 italic">Start adding products to see them listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Product Information</th>
                  <th className="text-left p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px] hidden md:table-cell">Category</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Unit Price</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px] hidden sm:table-cell">Stock</th>
                  <th className="text-center p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 shadow-inner border border-border/50 group-hover:border-primary/20 transition-colors">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <Package className="w-full h-full p-3 text-muted-foreground/10" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-foreground truncate max-w-[240px] leading-tight mb-1">{p.title}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter bg-muted/50 px-1.5 rounded">{p.isbn || "NO ISBN"}</span>
                             <span className="text-[10px] text-muted-foreground font-medium italic">{p.author || "Unknown Author"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-muted-foreground capitalize hidden md:table-cell">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-lg text-[9px] font-black tracking-widest uppercase">
                        {p.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="p-5 text-right font-black text-foreground text-base tracking-tight">{formatPrice(Number(p.price))}</td>
                    <td className="p-5 text-right text-muted-foreground hidden sm:table-cell">
                       <span className={`font-black text-xs ${p.stock <= 5 ? "text-orange-600 animate-pulse" : "text-foreground"}`}>
                          {p.stock ?? 0}
                       </span>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => toggleActive(p.id, !(p.is_active ?? true))} 
                        className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest transition-all border shadow-sm ${
                          (p.is_active ?? true) 
                            ? (p.stock === 0 
                                ? "bg-orange-50 text-orange-700 border-orange-200" 
                                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:shadow-green-100") 
                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:shadow-red-100"
                        }`}
                      >
                        {(p.is_active ?? true) ? (p.stock === 0 ? "Sold Out" : "In Stock") : "Disabled"}
                      </button>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(p)} className="p-2.5 bg-background border border-border hover:border-primary/30 rounded-xl text-muted-foreground hover:text-primary transition-all shadow-sm" title="Edit Inventory"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-background border border-border hover:border-red-200 rounded-xl text-muted-foreground hover:text-red-600 transition-all shadow-sm" title="Purge Record"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <Edit className="w-5 h-5 text-primary" /> Inventory Console
                 </h3>
                 <p className="text-[10px] text-muted-foreground font-medium italic mt-0.5">Editing: {editForm.title}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid sm:grid-cols-5 gap-8">
                <div className="sm:col-span-2 space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden shadow-inner relative group border border-border">
                    {editForm.images?.[0] ? (
                      <img src={editForm.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                        <Upload className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase">No Image</p>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="flex flex-col items-center text-white">
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Cover</span>
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadProductCover(e.target.files[0])} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                  {uploading && <div className="h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary animate-progress" style={{width: '60%'}} /></div>}
                </div>

                <div className="sm:col-span-3 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product Title</label>
                    <input value={editForm.title || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, title: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Author / Creator</label>
                    <input value={editForm.author || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, author: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price (KES)</label>
                      <input type="number" value={editForm.price ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, price: Number(e.target.value) }))} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 font-black" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">In-Stock</label>
                      <input type="number" value={editForm.stock ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, stock: Number(e.target.value) }))} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 font-black" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Listing Category</label>
                  <select value={editForm.category || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 font-bold appearance-none">
                    {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Marketing Description</label>
                  <textarea value={editForm.description || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex gap-4">
              <button onClick={saveEdit} className="flex-1 inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setEditingProduct(null)} className="px-8 py-4 bg-background border border-border text-muted-foreground font-black uppercase tracking-widest rounded-2xl text-xs hover:bg-muted transition-all">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};
