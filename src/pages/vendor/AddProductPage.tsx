import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";

const AddProductPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", author: "", isbn: "", price: "", originalPrice: "",
    category: "fiction", description: "", stock: "10", format: "physical",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("products").insert({
      title: form.title,
      slug: `${slug}-${Date.now()}`,
      author: form.author || null,
      isbn: form.isbn || null,
      price: Number(form.price),
      original_price: form.originalPrice ? Number(form.originalPrice) : null,
      category: form.category,
      description: form.description || null,
      stock: Number(form.stock),
      format: form.format,
      vendor_id: user.id,
      images: ["/placeholder.svg"],
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product added!" });
      navigate("/vendor");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-nuria py-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link to="/vendor" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Terminal
        </Link>
        
        <div className="mb-10 space-y-2">
          <h1 className="font-display text-5xl font-black text-foreground tracking-tighter">List New Asset</h1>
          <p className="text-xs text-muted-foreground font-medium italic">Initialize a new product entry in the Nuria marketplace registry.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-[2rem] border border-border p-10 shadow-2xl shadow-primary/5">
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="ap-title" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product Title *</label>
                <input id="ap-title" value={form.title} onChange={(e) => update("title", e.target.value)} required placeholder="e.g. The Great Gatsby" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:font-normal placeholder:opacity-30" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ap-author" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Author / Creator</label>
                <input id="ap-author" value={form.author} onChange={(e) => update("author", e.target.value)} placeholder="e.g. F. Scott Fitzgerald" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:font-normal placeholder:opacity-30" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="ap-price" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">List Price (KES) *</label>
                <input id="ap-price" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required placeholder="0.00" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-black placeholder:opacity-30" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ap-oprice" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compare Price</label>
                <input id="ap-oprice" type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} placeholder="MSRP" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-bold placeholder:opacity-30" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ap-stock" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Initial Stock</label>
                <input id="ap-stock" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="Quantity" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-black placeholder:opacity-30" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="ap-cat" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Catalog Category</label>
                <div className="relative">
                  <select id="ap-cat" value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-bold appearance-none">
                    {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="ap-format" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product Format</label>
                <select id="ap-format" value={form.format} onChange={(e) => update("format", e.target.value)} className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-bold appearance-none">
                  <option value="physical">Physical Hardcopy</option>
                  <option value="ebook">Digital E-Book</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="ap-isbn" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Universal ISBN</label>
                <input id="ap-isbn" value={form.isbn} onChange={(e) => update("isbn", e.target.value)} placeholder="000-0-00-000000-0" className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 font-medium placeholder:opacity-30" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ap-desc" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product Narrative</label>
              <textarea id="ap-desc" value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} placeholder="Describe the item's condition, features, or storyline..." className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 transition-all resize-none font-medium placeholder:font-normal placeholder:opacity-30" />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-[1.25rem] hover:scale-[1.01] active:scale-[0.99] transition-all text-xs disabled:opacity-50 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synchronizing...
                </div>
              ) : (
                "Commit to Inventory"
              )}
            </button>
            <p className="text-[9px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">Authorized merchant registry action</p>
          </div>
        </form>
      </div>
    </div>

  );
};

export default AddProductPage;
