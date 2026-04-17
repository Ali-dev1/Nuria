import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus, LogOut, Home, Edit, Trash2, Search, CheckCircle, XCircle, Save, Star, Settings, CreditCard, ChevronDown, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";


type Vendor = { id: string; store_name: string; is_verified: boolean | null; commission_rate: number | null; mpesa_number: string | null; bio: string | null; contact_email: string | null; contact_phone: string | null; logo_url: string | null; banner_url: string | null; user_id: string };
type VProduct = { id: string; title: string; author: string | null; price: number; original_price: number | null; stock: number | null; category: string; is_featured: boolean | null; is_active: boolean | null; created_at: string | null; images: string[] | null; isbn: string | null; description: string | null; format: string | null; slug: string };
type VOrder = { id: string; total: number; status: string | null; created_at: string | null; user_id: string };
type Payout = { id: string; month: string; gross_sales: number; commission: number; net_payout: number; mpesa_reference: string | null; status: string; created_at: string | null };

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const VendorDashboard = () => {
  const { user, signOut } = useAuthStore();
  const { profile, refetch: refetchProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<VProduct[]>([]);
  const [orders, setOrders] = useState<VOrder[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "payouts" | "settings">("overview");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<VProduct>>({});
  const [statusFilter, setStatusFilter] = useState("all");

  // Store settings
  const [storeForm, setStoreForm] = useState({ store_name: "", bio: "", mpesa_number: "", contact_email: "", contact_phone: "" });
  const [savingStore, setSavingStore] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
      
      if (!v) {
        navigate("/vendor/register");
        return;
      } else {
        setVendor(v as Vendor);
        setStoreForm({ store_name: v.store_name, bio: v.bio || "", mpesa_number: v.mpesa_number || "", contact_email: (v as any).contact_email || "", contact_phone: (v as any).contact_phone || "" });
      }

      const effectiveVendorId = v?.id;
      if (!effectiveVendorId) return;

      const [prodsRes, payRes] = await Promise.all([
        supabase.from("products").select("*").eq("vendor_id", user.id).order("created_at", { ascending: false }),
        supabase.from("payouts").select("*").eq("vendor_id", effectiveVendorId).order("created_at", { ascending: false }),
      ]);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, orders(*), products!inner(*)")
        .eq("products.vendor_id", user.id);

      setProducts((prodsRes.data || []) as VProduct[]);
      
      // Extract unique orders from items
      const vendorOrders = (itemsData || [])
        .map((item: any) => item.orders)
        .filter((order: any, index: number, self: any[]) => 
          order && self.findIndex(o => o?.id === order.id) === index
        );
      
      setOrders(vendorOrders as VOrder[]);
      setPayouts((payRes.data || []) as Payout[]);
    } catch (err) {
      console.error("Vendor dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const startEdit = (p: VProduct) => {
    setEditingProduct(p.id);
    setEditForm({ title: p.title, author: p.author, price: p.price, original_price: p.original_price, stock: p.stock, category: p.category, format: p.format, isbn: p.isbn, description: p.description, is_active: p.is_active ?? true });
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
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setProducts((prev) => prev.map((p) => p.id === editingProduct ? { ...p, ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) } as VProduct : p));
    setEditingProduct(null);
    toast({ title: "Product updated" });
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("products").update({ is_active: active }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: active } : p));
  };

  const saveStoreSettings = async () => {
    if (!vendor) return;
    setSavingStore(true);
    const { error } = await supabase.from("vendors").update({
      store_name: storeForm.store_name,
      bio: storeForm.bio,
      mpesa_number: storeForm.mpesa_number,
      contact_email: storeForm.contact_email,
      contact_phone: storeForm.contact_phone,
    }).eq("id", vendor.id);
    setSavingStore(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setVendor((v) => v ? { ...v, ...storeForm } : v);
    toast({ title: "Store settings updated" });
  };

  const uploadImage = async (type: "logo" | "banner", file: File) => {
    if (!vendor || !user) return;
    const path = `vendors/${user.id}/${type}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("book-covers").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data } = supabase.storage.from("book-covers").getPublicUrl(path);
    if (type === "logo") {
      await supabase.from("vendors").update({ logo_url: data.publicUrl }).eq("id", vendor.id);
      setVendor((v) => v ? { ...v, logo_url: data.publicUrl } : v);
    } else {
      await supabase.from("vendors").update({ banner_url: data.publicUrl }).eq("id", vendor.id);
      setVendor((v) => v ? { ...v, banner_url: data.publicUrl } : v);
    }
    toast({ title: `${type === "logo" ? "Logo" : "Banner"} updated` });
  };

  const uploadProductCover = async (file: File) => {
    if (!user || !editingProduct) return;
    const path = `products/${editingProduct}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("book-covers").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data } = supabase.storage.from("book-covers").getPublicUrl(path);
    await supabase.from("products").update({ images: [data.publicUrl] }).eq("id", editingProduct);
    setProducts((prev) => prev.map((p) => p.id === editingProduct ? { ...p, images: [data.publicUrl] } : p));
    toast({ title: "Cover uploaded" });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const filteredProducts = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const avgRating = 4.5; // Placeholder
  const topProducts = [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 3);
  const commissionRate = vendor?.commission_rate ?? 10;
  const currentMonthEarnings = orders
    .filter((o) => o.created_at && new Date(o.created_at).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container-nuria flex items-center justify-between h-16">


          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
               <img src="/logo.png" alt="Nuria" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded">Vendor</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"><Home className="w-4 h-4" /></Link>
            <button onClick={() => { signOut(); navigate("/"); }} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="container-nuria py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, {vendor?.store_name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {vendor?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Verified Vendor</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-yellow-600"><XCircle className="w-4 h-4" /> Pending Verification</span>
              )}
            </p>
          </div>
          <Link to="/vendor/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
          {(["overview", "products", "orders", "payouts", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "settings" ? "Store Settings" : t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, label: "Total Revenue", value: formatPrice(totalRevenue), color: "text-green-600" },
                { icon: ShoppingCart, label: "Total Orders", value: orders.length, color: "text-secondary" },
                { icon: Package, label: "Total Products", value: products.length, color: "text-primary" },
                { icon: Star, label: "Avg Rating", value: avgRating.toFixed(1), color: "text-yellow-600" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="w-5 h-5" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-lg font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link to="/vendor/products/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Add New Product</Link>
              <button onClick={() => setTab("orders")} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80">View Orders</button>
              <button onClick={() => setTab("payouts")} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80">View Payouts</button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
                {orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet</p> : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">#{o.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{o.created_at ? new Date(o.created_at).toLocaleDateString() : ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatPrice(Number(o.total))}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.status || "pending"] || statusColors.pending}`}>{o.status || "pending"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Top Products</h3>
                {topProducts.length === 0 ? <p className="text-sm text-muted-foreground">No products yet</p> : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                        <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(Number(p.price))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
                <Link to="/vendor/products/new" className="mt-4 inline-flex items-center gap-2 text-sm text-secondary hover:underline"><Plus className="w-4 h-4" /> Add your first product</Link>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Cover</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Price</th>
                      <th className="text-right p-3 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <div className="w-10 h-14 bg-muted rounded overflow-hidden">
                            {p.images?.[0] && p.images[0] !== "/placeholder.svg" ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-foreground">{p.title}</td>
                        <td className="p-3 text-muted-foreground capitalize hidden md:table-cell">{p.category.replace("-", " ")}</td>
                        <td className="p-3 text-right text-foreground">{formatPrice(Number(p.price))}</td>
                        <td className="p-3 text-right text-muted-foreground hidden sm:table-cell">{p.stock ?? 0}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => toggleActive(p.id, !(p.is_active ?? true))} className={`text-xs px-2 py-0.5 rounded-full ${(p.is_active ?? true) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {(p.is_active ?? true) ? (p.stock === 0 ? "Out of Stock" : "Active") : "Inactive"}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Inline Edit Form */}
            {editingProduct && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Edit Product</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                    <input value={editForm.title || ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Author</label>
                    <input value={editForm.author || ""} onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Price (KSh)</label>
                    <input type="number" value={editForm.price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Original Price</label>
                    <input type="number" value={editForm.original_price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, original_price: Number(e.target.value) || null }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
                    <input type="number" value={editForm.stock ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, stock: Number(e.target.value) }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                    <select value={editForm.category || ""} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background">
                      {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Format</label>
                    <select value={editForm.format || "physical"} onChange={(e) => setEditForm((f) => ({ ...f, format: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background">
                      <option value="physical">Physical</option>
                      <option value="ebook">E-Book</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">ISBN</label>
                    <input value={editForm.isbn || ""} onChange={(e) => setEditForm((f) => ({ ...f, isbn: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea value={editForm.description || ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Cover Image</label>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80">
                    <Upload className="w-4 h-4" /> Upload Cover
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadProductCover(e.target.files[0])} className="hidden" />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90"><Save className="w-4 h-4 inline mr-1" />Save</button>
                  <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs rounded-full capitalize ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{s}</button>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border overflow-x-auto">
              {filteredOrders.length === 0 ? <p className="text-center text-muted-foreground py-12">No orders found</p> : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Order #</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-3 font-medium text-foreground">#{o.id.slice(0, 8)}</td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
                        <td className="p-3 text-right font-medium text-foreground">{formatPrice(Number(o.total))}</td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.status || "pending"] || statusColors.pending}`}>{o.status || "pending"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Payouts */}
        {tab === "payouts" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Current Month Earnings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatPrice(currentMonthEarnings)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Platform Commission</p>
                <p className="text-2xl font-bold text-foreground mt-1">{commissionRate}%</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-foreground">📅 Payments are processed on the 1st of every month via M-Pesa</p>
              <p className="text-sm text-muted-foreground mt-1">Registered M-Pesa: <strong className="text-foreground">{vendor?.mpesa_number || "Not set"}</strong>
                <button onClick={() => setTab("settings")} className="ml-2 text-secondary text-xs hover:underline">Edit</button>
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <h3 className="font-semibold text-foreground p-4 border-b border-border">Payout History</h3>
              {payouts.length === 0 ? <p className="text-center text-muted-foreground py-12">No payouts yet</p> : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Month</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Gross</th>
                      <th className="text-right p-3 font-medium text-muted-foreground hidden sm:table-cell">Commission</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Net</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Ref</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="p-3 text-foreground">{p.month}</td>
                        <td className="p-3 text-right text-foreground">{formatPrice(Number(p.gross_sales))}</td>
                        <td className="p-3 text-right text-red-600 hidden sm:table-cell">-{formatPrice(Number(p.commission))}</td>
                        <td className="p-3 text-right font-medium text-green-600">{formatPrice(Number(p.net_payout))}</td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.mpesa_reference || "—"}</td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Store Settings */}
        {tab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Store Information</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Store Name</label>
                <input value={storeForm.store_name} onChange={(e) => setStoreForm((f) => ({ ...f, store_name: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                <textarea value={storeForm.bio} onChange={(e) => setStoreForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Contact Email</label>
                  <input value={storeForm.contact_email} onChange={(e) => setStoreForm((f) => ({ ...f, contact_email: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Contact Phone</label>
                  <input value={storeForm.contact_phone} onChange={(e) => setStoreForm((f) => ({ ...f, contact_phone: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">M-Pesa Number</label>
                <input value={storeForm.mpesa_number} onChange={(e) => setStoreForm((f) => ({ ...f, mpesa_number: e.target.value }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Store Images</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Logo</label>
                  {vendor?.logo_url && <img src={vendor.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-cover mb-2" />}
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80">
                    <Upload className="w-4 h-4" /> Upload Logo
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage("logo", e.target.files[0])} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Banner</label>
                  {vendor?.banner_url && <img src={vendor.banner_url} alt="Banner" className="w-full h-20 rounded-lg object-cover mb-2" />}
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80">
                    <Upload className="w-4 h-4" /> Upload Banner
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage("banner", e.target.files[0])} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <button onClick={saveStoreSettings} disabled={savingStore} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50">
              {savingStore ? "Saving…" : "Save Store Settings"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
