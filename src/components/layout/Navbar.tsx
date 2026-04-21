import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, signOut } = useAuthStore();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem("hideAnnouncement") !== "true";
    }
    return true;
  });

  const dismissAnnouncement = () => {
    sessionStorage.setItem("hideAnnouncement", "true");
    setShowAnnouncement(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#A1440B] text-white text-[12px] font-sans font-medium py-2 px-4 relative z-[51]">
          <div className="container-nuria flex items-center justify-between">
            <span className="text-left">🚚 Enjoy free delivery within Nairobi for orders above KSh 10,000 | 📞 0794 233 261</span>
            <button onClick={dismissAnnouncement} className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-[#1B4332] shadow-md">
        <div className="container-nuria flex items-center justify-between h-20 px-4 md:px-6">
          {/* Mobile alignment: Menu on left, Logo centered/left, Icons Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white hover:text-white/80 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="shrink-0">
              <img 
                src="/logo.png" 
                alt="Nuria Logo" 
                width="142"
                height="48"
                fetchpriority="high"
                loading="eager"
                className="h-10 sm:h-12 w-auto" 
              />
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isHomePage && (
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-2 text-white hover:text-white/80 transition-colors" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Desktop Nav links - hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-sans font-semibold ml-6 mr-8">
              <Link to="/" className="text-white hover:text-white/80 transition-colors">Home</Link>
              <Link to="/books" className="text-white hover:text-white/80 transition-colors">Shop</Link>
              <Link to="/gift-card" className="text-white hover:text-white/80 transition-colors">Gift Card</Link>
              <Link to="/blog" className="text-white hover:text-white/80 transition-colors">Blog</Link>
              <Link to="/about" className="text-white hover:text-white/80 transition-colors">About Us</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-3 mr-2">
              {(!profile || profile.role === 'customer') && (
                <Link to="/vendor/guide">
                  <Button className="bg-[#A1440B] hover:bg-[#A04415] text-white border-none text-xs font-bold uppercase tracking-wider px-4">
                    SELL ON NURIA
                  </Button>
                </Link>
              )}
              
              {user ? (
                (profile?.role === 'vendor' || profile?.role === 'admin') ? (
                  <Link to={profile.role === 'admin' ? "/admin" : "/vendor"}>
                    <Button className="bg-[#1B4332] border border-white text-white hover:bg-white hover:text-[#1B4332] text-xs font-bold uppercase tracking-wider px-4 transition-colors">
                      MY DASHBOARD
                    </Button>
                  </Link>
                ) : null
              ) : (
                <Link to="/vendor">
                  <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-[#1B4332] text-xs font-bold uppercase tracking-wider px-4 transition-colors">
                    VENDOR LOGIN
                  </Button>
                </Link>
              )}
            </div>

            <Link to="/wishlist" className="p-2 text-white hover:text-white/80 transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative p-2 text-white hover:text-white/80 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#A1440B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1B4332]">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/account" className="p-2 text-white hover:text-white/80 transition-colors ml-1" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-white hover:text-white/80 transition-colors ml-1" aria-label="Sign in">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Expanding search dropdown (for non-home pages) */}
        {searchOpen && !isHomePage && (
          <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="container-nuria">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search books, authors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm text-[#1A1A1A] border-none shadow-xl focus:ring-2 focus:ring-[#A1440B]"
                />
              </div>
            </form>
          </div>
        )}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
