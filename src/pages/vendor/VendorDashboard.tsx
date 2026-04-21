import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ChevronLeft,
  Store
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useVendorData, useVendorProducts, useVendorOrders, useVendorPayouts } from "@/hooks/useVendor";
import { VendorOverview } from "@/components/vendor/VendorOverview";
import { VendorProducts } from "@/components/vendor/VendorProducts";
import { VendorOrders } from "@/components/vendor/VendorOrders";
import { VendorPayouts } from "@/components/vendor/VendorPayouts";
import { VendorSettings } from "@/components/vendor/VendorSettings";
import { Button } from "@/components/ui/button";

type TabType = "overview" | "products" | "orders" | "payouts" | "settings";

const VendorDashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabType>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { data: vendor, isLoading: vendorLoading, refetch: refetchVendor } = useVendorData();
  const { data: products = [], refetch: refetchProducts } = useVendorProducts();
  const { data: orders = [] } = useVendorOrders();
  const { data: payouts = [] } = useVendorPayouts();

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            Initializing Merchant Console...
          </p>
        </div>
      </div>
    );
  }

  // If they have the role but NO record at all, something is wrong or they need to register
  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] p-4">
        <div className="max-w-md w-full text-center space-y-6 p-10 bg-white rounded-3xl shadow-xl border border-border">
          <h2 className="text-2xl font-bold">Registration Required</h2>
          <p className="text-muted-foreground">You haven't completed your vendor profile yet.</p>
          <Button className="w-full py-4 rounded-xl font-bold" onClick={() => navigate("/vendor/register")}>
            Apply Now
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Inventory", icon: Package },
    { id: "orders", label: "Sales", icon: ShoppingCart },
    { id: "payouts", label: "Financials", icon: CreditCard },
    { id: "settings", label: "Store Settings", icon: Settings },
  ] as const;

  const stats = {
    totalRevenue: orders.reduce((s, o) => s + Number(o.total), 0),
    ordersCount: orders.length,
    productsCount: products.length,
    avgRating: products.length > 0 
      ? products.reduce((acc, p) => acc + (Number((p as any).rating) || 0), 0) / products.length 
      : 4.8, // Healthy fallback for onboarding
  };

  const currentMonthEarnings = orders
    .filter((o) => o.created_at && new Date(o.created_at).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? "w-20" : "w-64"} bg-primary text-white transition-all duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl border-r border-white/5`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`p-6 flex items-center h-16 border-b border-white/5 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSidebarCollapsed ? (
              <h1 className="text-xl font-display font-black tracking-tight flex items-center gap-2">
                <Store className="w-6 h-6 text-secondary" />
                NURIA <span className="text-secondary/60 text-[10px] uppercase tracking-tighter block font-sans">Merchant</span>
              </h1>
            ) : (
              <Store className="w-8 h-8 text-secondary" />
            )}
          </div>
          
          <nav className="flex-1 px-3 space-y-1 mt-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setIsSidebarOpen(false); }}
                title={isSidebarCollapsed ? item.label : ""}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${tab === item.id ? "bg-secondary text-secondary-foreground font-bold shadow-lg shadow-secondary/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${tab === item.id ? "text-secondary-foreground" : "text-white/30 group-hover:text-white"}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-white/5 space-y-2">
            <Link to="/" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors`}>
              <Home className="w-5 h-5" />
              {!isSidebarCollapsed && <span>View Storefront</span>}
            </Link>
            <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300/70 hover:text-red-300 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 shadow-sm z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:flex p-2 hover:bg-muted rounded-xl text-muted-foreground transition-all">
              <Menu className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-muted rounded-xl text-muted-foreground">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="h-6 w-px bg-border hidden lg:block mx-2" />
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-foreground capitalize tracking-tight text-lg">{tab.replace("-", " ")}</h2>
              {vendor?.is_verified && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-foreground">{vendor?.store_name || "Merchant"}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Partner Console</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center overflow-hidden bg-white">
                {vendor?.photo_url ? (
                  <img src={vendor.photo_url} alt={vendor.store_name} className="w-full h-full object-cover" />
                ) : (
                  <img src="/logo.png" alt="Nuria" className="w-8 h-auto object-contain" />
                )}
             </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {vendor?.status === "pending" || (!vendor?.is_verified && vendor?.status !== "rejected") ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-bold text-foreground">Application Pending</h3>
                  <p className="text-muted-foreground">
                    Your merchant application for <span className="font-bold text-foreground">{vendor?.store_name}</span> is currently being reviewed by our team.
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mt-4 border border-border">
                    <p>We usually review applications within 24-48 hours. You will receive access to all merchant tools once approved.</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate("/")}>Back to Storefront</Button>
              </div>
            ) : vendor?.status === "rejected" ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-bold text-foreground">Application Rejected</h3>
                  <p className="text-muted-foreground">
                    Unfortunately, your application for <span className="font-bold text-foreground">{vendor?.store_name}</span> could not be approved at this time.
                  </p>
                  {vendor?.admin_notes && (
                    <div className="p-6 bg-red-50 rounded-xl text-sm text-red-800 mt-4 border border-red-100 text-left">
                      <p className="font-bold mb-1 uppercase text-[10px] tracking-widest">Note from Admin:</p>
                      <p className="italic">"{vendor.admin_notes}"</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground pt-4">
                    You can contact our support team if you believe this was an error.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate("/")}>Back to Storefront</Button>
                </div>
              </div>
            ) : (
              <>
                {tab === "overview" && (
                  <VendorOverview 
                    stats={stats} 
                    recentOrders={orders.slice(0, 5)} 
                    topProducts={[...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5)} 
                    isVerified={vendor?.is_verified}
                    vendor={vendor}
                    setTab={setTab}
                  />
                )}
                {tab === "products" && <VendorProducts products={products} onRefresh={refetchProducts} />}
                {tab === "orders" && <VendorOrders orders={orders} />}
                {tab === "payouts" && <VendorPayouts payouts={payouts} vendor={vendor} currentMonthEarnings={currentMonthEarnings} />}
                {tab === "settings" && <VendorSettings vendor={vendor} user={user} onRefresh={refetchVendor} />}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
