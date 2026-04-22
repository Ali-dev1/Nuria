import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Package, ShoppingCart, Store, 
  Shield, LogOut, LayoutDashboard, FileText, Settings, Menu, X, Search, PanelLeftClose, PanelLeft
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Customers", icon: Users },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "authors", label: "Authors", icon: Users },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-primary/20 rounded-full animate-ping absolute" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-display text-xl tracking-widest uppercase">Loading Dashboard</p>
          <p className="text-primary/60 text-xs font-mono animate-pulse uppercase">Please wait...</p>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? "w-[80px]" : "w-[280px]"} bg-primary text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 shadow-[20px_0_40px_rgba(0,0,0,0.1)] border-r border-white/5`}>
        <div className="flex flex-col h-full overflow-hidden relative">
          {/* Sidebar Background Gradient Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[100px] pointer-events-none" />
          
          <div className={`p-6 flex items-center h-20 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {isSidebarCollapsed ? (
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter text-white font-display leading-none">
                  NURIA <span className="text-primary-foreground/40 text-[10px] font-mono block uppercase tracking-[0.3em] mt-1">Admin</span>
                </h1>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"
              title={isSidebarCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {isSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                title={isSidebarCollapsed ? item.label : ""}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] transition-all duration-300 group relative ${tab === item.id ? "bg-white text-primary font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                {tab === item.id && (
                  <div className="absolute left-[-1rem] w-1.5 h-8 bg-white rounded-full" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-500 ${tab === item.id ? "scale-110 text-primary" : "group-hover:scale-125 group-hover:rotate-6"}`} />
                {!isSidebarCollapsed && (
                  <span className={`whitespace-nowrap tracking-wide ${tab === item.id ? "translate-x-1" : "group-hover:translate-x-1"} transition-transform duration-300`}>
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-6 space-y-4">
            <button 
              onClick={() => signOut()} 
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm transition-all duration-300 ${isSidebarCollapsed ? "justify-center text-red-400 hover:bg-red-400/20" : "text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20"}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="font-bold tracking-widest uppercase text-xs">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-primary/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-primary/5 rounded-xl text-primary">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h2 className="text-2xl font-black text-primary capitalize tracking-tight">{tab.replace("-", " ")}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl">
              <Search className="w-4 h-4 text-primary/40" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm text-primary w-40 placeholder:text-primary/30 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-primary/5 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg p-2">
                <img src="/logo.png" alt="Nuria" className="w-full h-auto object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-primary leading-none">{user?.email?.split("@")[0]}</p>
                <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content Wrapper */}
        <div className="flex-1 overflow-y-auto px-8 py-10 lg:px-12 lg:py-12 bg-gradient-to-b from-background to-card">
          <div className="max-w-[1600px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0,0,0,1)]">
              {tab === "overview" && <DashboardOverview setTab={setTab} />}
              {tab === "products" && <ProductManagement />}
              {tab === "orders" && <OrderManagement />}
              {tab === "users" && <UserManagement />}
              { tab === "vendors" && <VendorManagement /> }
              { tab === "authors" && <AuthorManagement /> }
              { tab === "blog" && <BlogManagement /> }
              {tab === "settings" && <PlatformSettings />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
