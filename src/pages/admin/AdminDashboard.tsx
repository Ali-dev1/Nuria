import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Package, ShoppingCart, Store, 
  LogOut, Activity, FileText, Settings, BookOpen
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

// Extracted Tab Components
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { VendorManagement } from "@/components/admin/VendorManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { PlatformSettings } from "@/components/admin/PlatformSettings";
import { AuthorManagement } from "@/components/admin/AuthorManagement";

type TabType = "overview" | "products" | "orders" | "users" | "vendors" | "blog" | "settings" | "authors";

const AdminDashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("overview");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { navigate("/admin/login"); return; }
      const { data } = await supabase.from("profiles").select("role").eq("user_id", user.id).single();
      if (data?.role === "admin") { setIsAdmin(true); }
      else { navigate("/"); toast({ title: "Access Denied", variant: "destructive" }); }
      setLoading(false);
    };
    checkAdmin();
  }, [user, navigate, toast]);

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Customers", icon: Users },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "authors", label: "Authors", icon: BookOpen },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  // Mobile bottom bar shows first 5 items; "More" items accessible via settings/overflow
  const mobileNavItems = navItems.slice(0, 5);
  const secondaryNavItems = navItems.slice(5);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      {/* Top Header Bar */}
      <header className="h-14 md:h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        {/* Left: Page Title */}
        <h1 className="text-base md:text-lg font-bold text-foreground capitalize">
          {tab === "overview" ? "Dashboard" : tab}
        </h1>

        {/* Right: Logo + Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center p-1">
              <img src="/logo-small.webp" alt="Nuria" className="w-full h-auto brightness-0 invert" />
            </div>
            <span className="text-xs font-bold text-primary hidden sm:block">Nuria Admin</span>
          </div>
          <button 
            onClick={() => signOut()} 
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Desktop: Horizontal Tab Nav */}
      <nav className="hidden md:flex items-center gap-1 px-8 py-2 bg-white border-b border-border overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === item.id 
                ? "bg-primary text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tab === "overview" && <DashboardOverview setTab={setTab} />}
            {tab === "products" && <ProductManagement />}
            {tab === "orders" && <OrderManagement />}
            {tab === "users" && <UserManagement />}
            {tab === "vendors" && <VendorManagement />}
            {tab === "authors" && <AuthorManagement />}
            {tab === "blog" && <BlogManagement />}
            {tab === "settings" && <PlatformSettings />}
          </div>
        </div>
      </main>

      {/* Mobile: Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-1">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[56px] transition-colors ${
                tab === item.id 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${tab === item.id ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          {/* More menu for secondary items */}
          <div className="relative group">
            <button
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[56px] transition-colors ${
                secondaryNavItems.some(i => i.id === tab)
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
              <span className="text-[10px] font-medium">More</span>
            </button>
            {/* Popup menu */}
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl border border-border shadow-lg py-2 min-w-[160px] opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all">
              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    tab === item.id 
                      ? "text-primary bg-primary/5" 
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminDashboard;
