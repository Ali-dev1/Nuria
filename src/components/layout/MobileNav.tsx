import { Link } from "react-router-dom";
import { 
  X, BookOpen, Heart, Globe, 
  User, ShoppingCart, LogOut, Home, Rss
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const { user, signOut } = useAuthStore();
  const { profile } = useProfile();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <button 
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-opacity duration-300 border-none cursor-default" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-[280px] bg-primary shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col text-white">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/" onClick={onClose}>
            <img src="/logo-small.png" alt="Nuria Logo" className="h-10 w-auto" />
          </Link>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-6">
            <Link to="/" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-semibold text-lg">
              <Home className="w-5 h-5 opacity-70" />
              Home
            </Link>
            <Link to="/books" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-semibold text-lg">
              <BookOpen className="w-5 h-5 opacity-70" />
              Shop
            </Link>
            <Link to="/gift-card" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-semibold text-lg">
              <Heart className="w-5 h-5 opacity-70" />
              Gift Card
            </Link>
            <Link to="/blog" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-semibold text-lg">
              <Rss className="w-5 h-5 opacity-70" />
              Blog
            </Link>
            <Link to="/about" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-semibold text-lg">
              <Globe className="w-5 h-5 opacity-70" />
              About Us
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-6">
            <p className="text-[10px] font-sans font-bold text-white/50 uppercase tracking-[0.2em]">Profile</p>
            <div className="space-y-4">
              {user ? (
                <>
                  <Link to="/account" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-medium">
                    <User className="w-5 h-5 opacity-70" />
                    My Account
                  </Link>
                  <Link to="/wishlist" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-medium">
                    <Heart className="w-5 h-5 opacity-70" />
                    Wishlist
                  </Link>
                  <Link to="/cart" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-medium">
                    <ShoppingCart className="w-5 h-5 opacity-70" />
                    Cart
                  </Link>
                  <button 
                    onClick={() => { signOut(); onClose(); }} 
                    className="flex items-center gap-4 text-red-300 hover:text-red-400 transition-colors font-sans font-medium w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={onClose} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors font-sans font-medium">
                  <User className="w-5 h-5 opacity-70" />
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </nav>

        <div className="p-6 bg-black/20 border-t border-white/10 space-y-3">
          {(!profile || profile.role === 'customer') && (
            <Link
              to="/vendor/guide"
              onClick={onClose}
              className="block w-full py-4 text-center text-xs font-sans font-bold bg-secondary text-white rounded-lg uppercase tracking-widest shadow-lg"
            >
              SELL ON NURIA
            </Link>
          )}
          
          {user ? (
            (profile?.role === 'vendor' || profile?.role === 'admin') && (
              <Link
                to={profile.role === 'admin' ? "/admin" : "/vendor"}
                onClick={onClose}
                className="block w-full py-4 text-center text-xs font-sans font-bold border border-white/30 text-white rounded-lg uppercase tracking-widest hover:bg-white/10"
              >
                MY DASHBOARD
              </Link>
            )
          ) : (
            <Link
              to="/vendor"
              onClick={onClose}
              className="block w-full py-4 text-center text-xs font-sans font-bold border border-white/30 text-white rounded-lg uppercase tracking-widest hover:bg-white/10"
            >
              VENDOR LOGIN
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
