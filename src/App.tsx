import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuthStore } from "@/store/authStore";
import Index from "./pages/Index";
import BooksPage from "./pages/BooksPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage";
import AddProductPage from "./pages/vendor/AddProductPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import ContactPage from "./pages/ContactPage";
import AuthorPage from "./pages/AuthorPage";
import VendorGuidePage from "./pages/vendor/VendorGuidePage";
import FAQsPage from "./pages/FAQsPage";
import PrivacyPage from "./pages/PrivacyPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReturnsPage from "./pages/ReturnsPage";
import GiftCardPage from "./pages/GiftCardPage";
import WishlistPage from "./pages/WishlistPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { useSettings } from "@/hooks/useSettings";
import { useProfile } from "@/hooks/useProfile";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { MaintenanceOverlay } from "@/components/shared/MaintenanceOverlay";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { useWishlist } from "@/hooks/useWishlist";

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <BottomNav />
      <Footer />
    </div>
  );
};

const GlobalMaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: settings } = useSettings();
  const { data: profile } = useProfile();
  
  const isMaintenance = settings?.maintenance_mode === "true";
  const roles = (profile as any)?.user_roles || [];
  const isActualAdmin = Array.isArray(roles) 
    ? roles.some((r: any) => r.role === "admin")
    : (roles as any)?.role === "admin";
  const isMasterAdmin = (profile as any)?.name === "Master Admin";
  const bypassMaintenance = isActualAdmin || isMasterAdmin;

  if (isMaintenance && !bypassMaintenance) {
    return <MaintenanceOverlay />;
  }

  return <>{children}</>;
};

const WishlistSynchronizer = () => {
  const { user } = useAuthStore();
  const { syncWishlist } = useWishlist();
  useEffect(() => {
    if (user) {
      syncWishlist();
    }
  }, [user, syncWishlist]);
  return null;
};

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => {
    const unsub = initialize();
    return unsub;
  }, [initialize]);
  return (
    <>
      <WishlistSynchronizer />
      {children}
    </>
  );
};

const App = () => {
  const { data: settings } = useSettings();

  useEffect(() => {
    if (settings?.announcement_text) {
      document.title = `${settings.announcement_text} | Nuria Forest`;
    } else {
      document.title = "Nuria Forest — Kenya's Premier Bookstore";
    }
  }, [settings]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AuthInitializer>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={
                <GlobalMaintenanceWrapper>
                  <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/vendor" element={<RoleGuard requiredRole="vendor"><VendorDashboard /></RoleGuard>} />
                    <Route path="/vendor/register" element={<RoleGuard><VendorRegisterPage /></RoleGuard>} />
                    <Route path="/vendor/products/new" element={<RoleGuard requiredRole="vendor"><AddProductPage /></RoleGuard>} />
                    <Route path="/admin" element={<RoleGuard requiredRole="admin"><AdminDashboard /></RoleGuard>} />
                    
                    {/* Merchant Routes */}
                    <Route path="/vendor/guide" element={<ShopLayout><VendorGuidePage /></ShopLayout>} />
                    <Route path="/sell" element={<ShopLayout><VendorGuidePage /></ShopLayout>} />
                    
                    {/* Core Shop Routes */}
                    <Route path="/" element={<ShopLayout><Index /></ShopLayout>} />
                    <Route path="/books" element={<ShopLayout><BooksPage /></ShopLayout>} />
                    <Route path="/books/:slug" element={<ShopLayout><ProductPage /></ShopLayout>} />
                    <Route path="/author/:slug" element={<ShopLayout><AuthorPage /></ShopLayout>} />
                    <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
                    <Route path="/checkout" element={<ShopLayout><CheckoutPage /></ShopLayout>} />
                    <Route path="/order-confirmation" element={<ShopLayout><OrderConfirmationPage /></ShopLayout>} />
                    <Route path="/account" element={<ShopLayout><AccountPage /></ShopLayout>} />
                    <Route path="/about" element={<ShopLayout><AboutPage /></ShopLayout>} />
                    <Route path="/blog" element={<ShopLayout><BlogPage /></ShopLayout>} />
                    <Route path="/blog/:id" element={<ShopLayout><BlogPost /></ShopLayout>} />
                    <Route path="/contact" element={<ShopLayout><ContactPage /></ShopLayout>} />
                    <Route path="/faqs" element={<ShopLayout><FAQsPage /></ShopLayout>} />
                    <Route path="/privacy" element={<ShopLayout><PrivacyPage /></ShopLayout>} />
                    <Route path="/delivery" element={<ShopLayout><DeliveryPage /></ShopLayout>} />
                    <Route path="/delivery-policy" element={<ShopLayout><DeliveryPage /></ShopLayout>} />
                    <Route path="/returns" element={<ShopLayout><ReturnsPage /></ShopLayout>} />
                    <Route path="/gift-card" element={<ShopLayout><GiftCardPage /></ShopLayout>} />
                    <Route path="/wishlist" element={<ShopLayout><WishlistPage /></ShopLayout>} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </GlobalMaintenanceWrapper>
              } />
            </Routes>
          </AuthInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
