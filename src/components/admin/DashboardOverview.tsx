import React from "react";
import { TrendingUp, ShoppingCart, Users, Store, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
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
      toast({ title: "Failed", description: vendorError.message, variant: "destructive" });
      return;
    }

    const { error: profileError } = await supabase.from("profiles").update({ 
      role: verify ? "vendor" : "customer" 
    }).eq("user_id", userId);

    if (profileError) {
      toast({ title: "Profile update failed", description: profileError.message, variant: "destructive" });
    } else {
      invalidate(["admin", "vendors"]);
      invalidate(["admin", "stats"]);
      toast({ title: verify ? "Vendor approved" : "Vendor rejected" });
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: TrendingUp, label: "Revenue", value: formatPrice(stats?.revenue || 0), target: "overview", color: "text-green-600", bg: "bg-green-50" },
          { icon: ShoppingCart, label: "Orders", value: stats?.orders || 0, target: "orders", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Users, label: "Users", value: stats?.users || 0, target: "users", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Store, label: "Vendors", value: stats?.vendors || 0, target: "vendors", color: "text-primary", bg: "bg-primary/5" },
          { icon: Package, label: "Products", value: stats?.products || 0, target: "products", color: "text-amber-600", bg: "bg-amber-50" },
          { icon: AlertTriangle, label: "Pending", value: stats?.pendingVendors || 0, target: "vendors", color: "text-red-600", bg: "bg-red-50" },
        ].map(({ icon: Icon, label, value, target, color, bg }) => (
          <button 
            key={label} 
            onClick={() => setTab(target)}
            className="group bg-white rounded-xl p-4 border border-border text-left transition-all hover:border-primary/30 hover:shadow-sm active:scale-[0.98]"
          >
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-lg font-bold text-foreground truncate">{value}</p>
          </button>
        ))}
      </div>

      {/* Revenue Chart + Pending Vendors */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Revenue</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <div className="flex items-end gap-1 h-40 sm:h-48">
            {last30.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-muted/30 rounded-md overflow-hidden relative" style={{ height: "100%" }}>
                  <div 
                    className="w-full bg-primary/80 absolute bottom-0 transition-all duration-500 rounded-t-sm hover:bg-primary" 
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: d.revenue > 0 ? "3px" : "1px" }}
                  />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                  {d.date}: {formatPrice(d.revenue)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-3">
            <span>{last30[0]?.date}</span>
            <span>{last30[last30.length - 1]?.date}</span>
          </div>
        </div>

        {/* Pending Vendors */}
        <div className="bg-white rounded-2xl border border-border p-5 md:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-foreground">Pending Approval</h3>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingVendors.length}
            </span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[280px]">
            {pendingVendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 py-8">
                <CheckCircle className="w-8 h-8 mb-2" />
                <p className="text-xs font-medium">All caught up</p>
              </div>
            ) : (
              pendingVendors.map((v: DbVendor) => (
                <div key={v.id} className="p-3 bg-muted/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{v.store_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.profiles?.name || "—"}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {v.store_name?.charAt(0)}
                    </div>
                  </div>
                  <button 
                    onClick={() => verifyVendor(v.id, true, v.user_id)} 
                    className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setTab("vendors")} className="mt-4 w-full py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
            View all vendors →
          </button>
        </div>
      </div>

      {/* Orders + Stock Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-border p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-foreground">Recent Orders</h3>
            <Clock className="w-4 h-4 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            {(ordersData?.data || []).slice(0, 5).map((o: DbOrder) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                    #{o.id.slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">Order {o.id.slice(0, 8)}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold text-primary">{formatPrice(Number(o.total))}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${statusColors[o.status || "pending"]}`}>
                    {o.status || "pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-border p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock
            </h3>
            <span className="text-xs text-muted-foreground">{lowStockProducts.length} items</span>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 5).map((p: DbProduct) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-semibold text-foreground truncate">{p.title}</p>
                </div>
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded shrink-0">
                  {p.stock ?? 0}
                </span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="py-12 text-center opacity-30">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-medium">Stock levels healthy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
