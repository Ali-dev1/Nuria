import { Link, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { CategoryDrawer } from "./CategoryDrawer";

export const BottomNav = () => {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: Home, path: "/", type: "link" },
    { label: "Categories", icon: Grid, type: "button", onClick: () => setDrawerOpen(true) },
    { label: "Cart", icon: ShoppingBag, path: "/cart", type: "link", badge: totalItems },
    { label: "Account", icon: User, path: user ? "/account" : "/login", type: "link" },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#E5E0D8] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 px-4">
        <div className="flex items-center justify-between h-full max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.type === "button") {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center gap-1 group flex-1"
                >
                  <div className={`p-1 rounded-full transition-colors ${drawerOpen ? "text-[#1B4332]" : "text-[#6B7280] group-hover:text-[#1B4332]"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`font-sans text-[10px] font-medium transition-colors ${drawerOpen ? "text-[#1B4332]" : "text-[#6B7280] group-hover:text-[#1B4332]"}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path!}
                className="flex flex-col items-center justify-center gap-1 group flex-1 relative"
              >
                <div className={`p-1 rounded-full transition-colors ${isActive ? "text-[#1B4332]" : "text-[#6B7280] group-hover:text-[#1B4332]"}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-[25%] bg-[#C2541A] text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 border border-white">
                    {item.badge}
                  </span>
                )}
                <span className={`font-sans text-[10px] font-medium transition-colors ${isActive ? "text-[#1B4332]" : "text-[#6B7280] group-hover:text-[#1B4332]"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <CategoryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
};
