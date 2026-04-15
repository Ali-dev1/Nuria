import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
      <div className="container-nuria py-8 max-w-2xl">
        <Link to="/vendor" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-xl border border-border p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Author</label>
              <input value={form.author} onChange={(e) => update("author", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Price (KSh) *</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Original Price</label>
              <input type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Format</label>
              <select value={form.format} onChange={(e) => update("format", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="physical">Physical</option>
                <option value="ebook">E-Book</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">ISBN</label>
              <input value={form.isbn} onChange={(e) => update("isbn", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <button disabled={loading} type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50">
            {loading ? "Adding…" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
