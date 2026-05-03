import { DollarSign, ShoppingCart, Package, Star, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/constants";

interface VendorOverviewProps {
  stats: {
    totalRevenue: number;
    ordersCount: number;
    productsCount: number;
    avgRating: number;
  };
  recentOrders: (Record<string, unknown> & { id: string; total: number; status?: string; created_at?: string; is_simulated?: boolean })[];
  topProducts: (Record<string, unknown> & { id: string; title: string; price: number; stock?: number; is_simulated?: boolean })[];
  isVerified?: boolean;
  vendor?: any;
  setTab?: (tab: string) => void;
}

export const VendorOverview = ({ stats, recentOrders, topProducts, isVerified, vendor, setTab }: VendorOverviewProps) => {
  const navigate = useNavigate();
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const hasNoData = stats.ordersCount === 0 && stats.productsCount === 0;

  // Simulated data for onboarding
  const mockOrders = [
    { id: "sample-1", total: 4500, status: "delivered", created_at: new Date().toISOString(), is_simulated: true },
    { id: "sample-2", total: 1200, status: "pending", created_at: new Date().toISOString(), is_simulated: true },
  ];

  const mockProducts = [
    { id: "sample-p1", title: "Example Best Seller", price: 2500, is_simulated: true },
    { id: "sample-p2", title: "Trending Item", price: 1800, is_simulated: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: formatPrice(stats.totalRevenue), color: "text-secondary", bg: "bg-secondary/10" },
          { icon: ShoppingCart, label: "Total Orders", value: stats.ordersCount, color: "text-secondary", bg: "bg-secondary/10" },
          { icon: Package, label: "Total Products", value: stats.productsCount, color: "text-primary", bg: "bg-primary/5" },
          { icon: Star, label: "Avg Rating", value: stats.avgRating.toFixed(1), color: "text-primary", bg: "bg-primary/5" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bg} ${color}`}><Icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-lg font-bold text-foreground">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {(() => {
        // Filter products with stock < 10
        const lowStock = (topProducts || []).filter(p => (p.stock as number) < 10);
        if (lowStock.length === 0) return null;
        
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3 text-amber-800">
              <Package className="w-5 h-5" />
              <h3 className="font-bold">Low Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStock.map(p => (
                <div key={p.id} className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground truncate max-w-[150px]">{p.title}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                    {p.stock} LEFT
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {hasNoData && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground">Welcome to your Merchant Console!</h3>
              <p className="text-muted-foreground max-w-xl">
                You're just a few steps away from reaching thousands of readers. Follow our quick start guide to get your store live.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <button 
                  onClick={() => navigate('/vendor/products/new')}
                  className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
                >
                  List Your First Product
                </button>
                <button 
                  onClick={() => setTab && setTab('settings')}
                  className="px-5 py-2.5 bg-white border border-border text-foreground rounded-xl font-bold text-sm hover:bg-muted/30 transition-colors"
                >
                  Setup Payments
                </button>
              </div>
            </div>
            <div className="w-full lg:w-80 bg-white rounded-xl border border-border p-5 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" /> Onboarding Checklist
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Register Store", done: !!vendor?.id },
                  { label: "Verify Identity", done: !!isVerified },
                  { label: "Add First Product", done: stats.productsCount > 0 },
                  { label: "Setup Payments", done: !!(vendor?.mpesa_number && vendor?.mpesa_number.length >= 5) },
                  { label: "Complete Profile", done: !!(vendor?.photo_url && vendor?.bio) },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${item.done ? "bg-secondary/10 border-secondary text-secondary" : "border-border"}`}>
                      {item.done && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> 
            {recentOrders.length === 0 ? "Sample Activity" : "Recent Orders"}
          </h3>
          <div className="space-y-4">
            {(recentOrders.length === 0 ? mockOrders : recentOrders).map((o) => (
              <div key={o.id} className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${o.is_simulated ? "opacity-50 grayscale" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    #{o.id.slice(0, 8)}
                    {o.is_simulated && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase tracking-tighter">Sample</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{o.created_at ? new Date(o.created_at).toLocaleDateString() : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatPrice(Number(o.total))}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${statusColors[o.status || "pending"] || statusColors.pending}`}>
                    {o.status || "pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            {topProducts.length === 0 ? "Potential Growth" : "Top Products"}
          </h3>
          <div className="space-y-4">
            {(topProducts.length === 0 ? mockProducts : topProducts).map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 py-2 border-b border-border last:border-0 ${p.is_simulated ? "opacity-50 grayscale" : ""}`}>
                <span className="text-lg font-bold text-muted-foreground/30">#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px] flex items-center gap-2">
                    {p.title}
                    {p.is_simulated && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase tracking-tighter">Sample</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatPrice(Number(p.price))}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
