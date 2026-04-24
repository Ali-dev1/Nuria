import React from "react";
import { TrendingUp, ShoppingCart, Users, Store, Package, AlertTriangle, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useAdminStats, useAdminOrders, useAdminVendors, useAdminProducts } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type DbOrder = Tables<"orders">;
type DbProduct = Tables<"products">;
type DbVendor = Tables<"vendors">;

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  shipped: "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
  delivered: "bg-green-100 text-green-700 ring-1 ring-green-200",
  cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export const DashboardOverview = ({ setTab }: { setTab: (t: string) => void }) => {
  const { data: stats } = useAdminStats();
  const { data: ordersData } = useAdminOrders({ limit: 10 });
  const { data: vendorsData } = useAdminVendors();
  const { data: productsData } = useAdminProducts({ pageSize: 1000 });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const lowStockProducts = (productsData?.products || []).filter((p: DbProduct) => (p.stock ?? 0) < 10);
  const pendingVendors = (vendorsData?.data || []).filter((v: DbVendor) => v.status === "pending" || !v.is_verified);

  const invalidate = (key: string[]) => queryClient.invalidateQueries({ queryKey: key });

  const verifyVendor = async (id: string, verify: boolean, userId: string) => {
    const { error: vendorError } = await supabase.from("vendors").update({ 
      is_verified: verify,
      status: verify ? "active" : "rejected"
    } as Partial<Tables<"vendors">>).eq("id", id);

    if (vendorError) {
      toast({ title: "Operation failed", description: vendorError.message, variant: "destructive" });
      return;
    }

    // Sync profile role
    const { error: profileError } = await supabase.from("profiles").update({ 
      role: verify ? "vendor" : "customer" 
    }).eq("user_id", userId);

    if (profileError) {
      toast({ title: "Profile sync failed", description: profileError.message, variant: "destructive" });
    } else {
      invalidate(["admin", "vendors"]);
      invalidate(["admin", "stats"]);
      toast({ title: verify ? "Vendor Approved & Role Granted" : "Vendor Rejected" });
    }
  };

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = (ordersData?.data || []).filter((o: DbOrder) => o.created_at?.startsWith(dateStr));
    return { date: d.toLocaleDateString("en-KE", { day: "numeric", month: "short" }), revenue: dayOrders.reduce((s: number, o: DbOrder) => s + Number(o.total), 0) };
  });
  const maxRev = Math.max(...last30.map((d) => d.revenue), 1);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
               <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                  Platform Metrics <ArrowUpRight className="w-6 h-6 text-primary" />
               </h1>
               <p className="text-sm text-muted-foreground mt-1">Real-time performance analytics for Nuria Store</p>
            </div>
         </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: TrendingUp, label: "Total Revenue", value: formatPrice(stats?.revenue || 0), target: "overview", color: "text-green-600" },
          { icon: ShoppingCart, label: "Live Orders", value: stats?.orders || 0, target: "orders", color: "text-blue-600" },
          { icon: Users, label: "Total Users", value: stats?.users || 0, target: "users", color: "text-purple-600" },
          { icon: Store, label: "Partners", value: stats?.vendors || 0, target: "vendors", color: "text-primary" },
          { icon: Package, label: "Inventory", value: stats?.products || 0, target: "products", color: "text-amber-600" },
          { icon: AlertTriangle, label: "Queue", value: stats?.pendingVendors || 0, target: "vendors", color: "text-red-600" },
        ].map(({ icon: Icon, label, value, target, color }) => (
          <button 
            key={label} 
            onClick={() => setTab(target)}
            className="group bg-white rounded-3xl p-6 border border-border text-left transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden active:scale-95"
          >
            <div className={`absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
               <Icon className="w-12 h-12" />
            </div>
            <Icon className={`w-5 h-5 mb-4 ${color}`} />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-foreground truncate">{value}</p>
          </button>
        ))}
      </div>

      {/* Main Insights Area */}
      <div className="grid lg:grid-cols-3 gap-8">
         {/* Revenue Visualization */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-lg font-black text-foreground tracking-tight">Revenue Stream</h3>
                  <p className="text-xs text-muted-foreground italic">Last 30 days of performance</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-primary rounded-full" /> Verified Sales</div>
               </div>
            </div>
            <div className="flex items-end gap-1.5 h-56 group">
               {last30.map((d, i) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                     <div className="w-full bg-primary/5 rounded-2xl overflow-hidden" style={{ height: "100%" }}>
                        <div 
                           className="w-full bg-primary absolute bottom-0 transition-all duration-700 ease-out group-hover:brightness-110" 
                           style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: d.revenue > 0 ? "4px" : "1px" }}
                        />
                     </div>
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all whitespace-nowrap z-10 shadow-xl scale-90 group-hover/bar:scale-100">
                        {d.date}: {formatPrice(d.revenue)}
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 px-1">
               <span>{last30[0]?.date}</span>
               <span>{last30[last30.length - 1]?.date}</span>
            </div>
         </div>

         {/* Priority Applications */}
         <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-foreground tracking-tight">Pending Approval</h3>
               <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {pendingVendors.length} New
               </span>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
               {pendingVendors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
                     <CheckCircle className="w-12 h-12 mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Queue Empty</p>
                  </div>
               ) : (
                  pendingVendors.map((v: DbVendor) => (
                     <div key={v.id} className="p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                           <div>
                              <p className="text-sm font-black text-foreground leading-none mb-1">{v.store_name}</p>
                              <p className="text-[10px] font-bold text-primary mb-1">{v.profiles?.name || "N/A"}</p>
                              <p className="text-[9px] font-medium text-muted-foreground italic truncate max-w-[120px]">{v.profiles?.email}</p>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary font-black text-xs shadow-sm ring-1 ring-border">
                              {v.store_name?.charAt(0)}
                           </div>
                        </div>
                        <button 
                           onClick={() => verifyVendor(v.id, true, v.user_id)} 
                           className="w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all"
                        >
                           Verify Merchant
                        </button>
                     </div>
                  ))
               )}
            </div>
            <button onClick={() => setTab("vendors")} className="mt-6 w-full py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
               View All Applications
            </button>
         </div>
      </div>

      {/* Secondary Row: Orders & Stock */}
      <div className="grid lg:grid-cols-2 gap-8">
         {/* Recent Orders Table-lite */}
         <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-foreground tracking-tight">Recent Sales</h3>
               <Clock className="w-5 h-5 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-4">
               {(ordersData?.data || []).slice(0, 5).map((o: DbOrder) => (
                  <div key={o.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-transparent hover:border-border transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-xs font-black">
                           #{o.id.slice(0, 3)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-foreground">Order {o.id.slice(0, 8)}</p>
                           <p className="text-[10px] font-medium text-muted-foreground italic">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-primary mb-1">{formatPrice(Number(o.total))}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${statusColors[o.status || "pending"]}`}>
                           {o.status || "pending"}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Inventory Alert */}
         <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Stock Watch
               </h3>
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lowStockProducts.length} Items Low</span>
            </div>
            <div className="space-y-4">
               {lowStockProducts.slice(0, 5).map((p: DbProduct) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/30 rounded-2xl border border-red-100/50">
                     <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-black text-foreground truncate">{p.title}</p>
                        <p className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest">Critical Alert</p>
                     </div>
                     <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-red-500/20">
                        {p.stock ?? 0} UNITS
                     </div>
                  </div>
               ))}
               {lowStockProducts.length === 0 && (
                  <div className="py-20 text-center opacity-20">
                     <Package className="w-12 h-12 mx-auto mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Inventory Healthy</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
