import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Package, Heart, MapPin, Award, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/constants";
import { BookCard } from "@/components/books/BookCard";
import { Skeleton } from "@/components/shared/Skeleton";
import type { Product } from "@/lib/types";

const mapProduct = (p: any): Product => ({
  id: p.id, title: p.title, slug: p.slug, author: p.author ?? "",
  isbn: p.isbn ?? undefined, price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  category: p.category, vendorId: p.vendor_id ?? undefined,
  stock: p.stock ?? 0, images: p.images ?? ["/placeholder.svg"],
  description: p.description ?? "",
  format: (p.format as "physical" | "ebook") ?? "physical",
  isFeatured: p.is_featured ?? false, rating: Number(p.rating ?? 0),
  reviewCount: p.review_count ?? 0, createdAt: p.created_at ?? "",
});

type Tab = "orders" | "wishlist" | "addresses" | "loyalty";

const AccountPage = () => {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(title, slug, images))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && tab === "orders",
  });

  const { data: wishlistProducts = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist-products", user?.id],
    queryFn: async () => {
      const { data: wl } = await supabase.from("wishlists").select("product_id").eq("user_id", user!.id);
      if (!wl || wl.length === 0) return [];
      const ids = wl.map((w) => w.product_id);
      const { data } = await supabase.from("products").select("*").in("id", ids);
      return (data ?? []).map(mapProduct);
    },
    enabled: !!user && tab === "wishlist",
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("addresses").select("*").eq("user_id", user!.id).order("is_default", { ascending: false });
      return data ?? [];
    },
    enabled: !!user && tab === "addresses",
  });

  const { data: loyaltyTxns = [] } = useQuery({
    queryKey: ["loyalty-txns", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("loyalty_transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user && tab === "loyalty",
  });

  if (loading) return <div className="container-nuria py-16 text-center"><Skeleton className="h-8 w-48 mx-auto" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: "orders", label: "Orders", icon: Package },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "loyalty", label: "Loyalty", icon: Award },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-[#FFFBEB] text-[#92400E]", // yellow-ish
    confirmed: "bg-[#EFF6FF] text-[#1E40AF]", // blue-ish
    shipped: "bg-[#F5F3FF] text-[#5B21B6]", // purple-ish
    delivered: "bg-[#D1FAE5] text-[#065F46]", // green-ish
    cancelled: "bg-[#FEF2F2] text-[#991B1B]", // red-ish
  };
  const renderOrders = () => {
    if (ordersLoading) {
      return Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />);
    }
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders yet</p>
          <Link to="/books" className="text-sm text-secondary hover:underline mt-2 inline-block">Browse books</Link>
        </div>
      );
    }
    return orders.map((order: any) => (
      <div key={order.id} className="bg-white rounded-2xl p-6 border border-[#E5E0D8] shadow-sm space-y-4 hover:border-[#1B4332]/20 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FAF7F2] rounded-xl text-[#1B4332]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Order #{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="font-sans text-xs text-[#6B7280] mt-0.5">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-6">
            <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full ${statusColor[order.status] || "bg-[#FAF7F2] text-[#6B7280]"}`}>
              {order.status}
            </span>
            <span className="font-sans font-bold text-[#1B4332]">{formatPrice(Number(order.total))}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#FAF7F2] pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {order.order_items?.map((item: any) => (
              <Link
                key={item.id}
                to={`/books/${item.products?.slug}`}
                className="font-sans text-[11px] font-medium text-[#6B7280] hover:text-[#A1440B] transition-colors"
              >
                {item.products?.title} <span className="opacity-50">× {item.quantity}</span>
              </Link>
            ))}
          </div>
          {order.loyalty_points_earned > 0 && (
            <div className="flex sm:justify-end">
              <p className="font-sans text-[11px] font-bold text-[#A1440B] bg-[#A1440B]/5 px-3 py-1 rounded-full flex items-center gap-1">
                +{order.loyalty_points_earned} pts earned
              </p>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderWishlist = () => {
    if (wishlistLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3"><Skeleton className="aspect-[3/4] w-full rounded-lg" /><Skeleton className="h-4 w-3/4" /></div>
          ))}
        </div>
      );
    }
    if (wishlistProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link to="/books" className="text-sm text-secondary hover:underline mt-2 inline-block">Browse books</Link>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((p) => <BookCard key={p.id} product={p} />)}
      </div>
    );
  };
  return (
    <div className="container-nuria py-12">
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="font-sans text-[12px] font-semibold text-[#A1440B] uppercase tracking-[0.2em]">Member Portal</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">My Account</h1>
          <div className="w-[60px] h-[3px] bg-[#A1440B] mt-4 rounded-full" />
          <p className="font-sans text-sm text-[#6B7280] mt-4">{user?.email}</p>
        </div>
        <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-sm">
          <div className="text-right">
            <p className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Loyalty Points</p>
            <p className="font-display text-2xl font-bold text-[#A1440B] leading-none mt-1">{profile?.loyalty_points ?? 0} <span className="text-[10px] font-sans font-medium text-[#6B7280] tracking-normal">pts</span></p>
          </div>
          <div className="w-px h-10 bg-[#E5E0D8]" />
          <button onClick={signOut} className="p-3 bg-[#FAF7F2] text-[#6B7280] hover:text-[#1B4332] hover:bg-[#1B4332]/5 rounded-xl transition-all" aria-label="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#E5E0D8] mb-10 overflow-x-auto scrollbar-hide">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-sans font-semibold border-b-2 -mb-px whitespace-nowrap transition-all duration-200 ${
              tab === key ? "border-[#1B4332] text-[#1B4332]" : "border-transparent text-[#6B7280] hover:text-[#1A1A1A]"
            }`}
          >
            <Icon className={`w-4 h-4 ${tab === key ? "text-[#1B4332]" : "text-[#6B7280]"}`} /> {label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-4">
          {renderOrders()}
        </div>
      )}

      {tab === "wishlist" && (
        {renderWishlist()}
      )}

      {tab === "addresses" && (
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No saved addresses</p>
          ) : (
            addresses.map((addr: any) => (
              <div key={addr.id} className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-foreground">{addr.name}</p>
                  {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">Default</span>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}</p>
                {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "loyalty" && (
        <div className="space-y-4">
          <div className="bg-secondary/5 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-secondary">{profile?.loyalty_points ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Available Points</p>
            <p className="text-xs text-muted-foreground mt-1">100 points = KSh 10 off</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-8 space-y-8 shadow-sm">
            <h3 className="font-display text-xl font-bold text-[#1A1A1A]">Profile Information</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label htmlFor="acc-name" className="block font-sans text-[13px] font-medium text-[#1A1A1A] mb-2">Full Name</label>
                <input id="acc-name" defaultValue={profile?.name || ""} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 transition-all" />
              </div>
              <div>
                <label htmlFor="acc-email" className="block font-sans text-[13px] font-medium text-[#1A1A1A] mb-2">Email Address</label>
                <input id="acc-email" value={user?.email || ""} disabled className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl text-sm bg-[#FAF7F2] text-[#6B7280] font-sans italic" />
              </div>
              <div>
                <label htmlFor="acc-mpesa" className="block font-sans text-[13px] font-medium text-[#1A1A1A] mb-2">M-Pesa Number</label>
                <input id="acc-mpesa" defaultValue={profile?.phone || ""} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 transition-all" placeholder="+254..." />
              </div>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => toast({ title: "Profile updated" })} 
                className="px-8 py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-sans font-bold hover:brightness-90 transition-all shadow-lg shadow-[#1B4332]/10"
              >
                Save Changes
              </button>
            </div>
          </div>

          {loyaltyTxns.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No loyalty transactions yet</p>
          ) : (
            loyaltyTxns.map((txn: any) => (
              <div key={txn.id} className="flex items-center justify-between bg-card rounded-xl p-4">
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{txn.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold text-sm ${txn.points > 0 ? "text-green-600" : "text-red-600"}`}>
                  {txn.points > 0 ? "+" : ""}{txn.points}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
