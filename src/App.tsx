import React, { useEffect, Suspense } from "react";
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

/* ── Lazy-loaded routes (cuts ~160 KiB unused JS on initial load) ── */
const BooksPage = React.lazy(() => import("./pages/BooksPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = React.lazy(() => import("./pages/OrderConfirmationPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const VendorDashboard = React.lazy(() => import("./pages/vendor/VendorDashboard"));
const VendorRegisterPage = React.lazy(() => import("./pages/vendor/VendorRegisterPage"));
const AddProductPage = React.lazy(() => import("./pages/vendor/AddProductPage"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLoginPage = React.lazy(() => import("./pages/admin/AdminLoginPage"));
const AccountPage = React.lazy(() => import("./pages/AccountPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const AuthorPage = React.lazy(() => import("./pages/AuthorPage"));
const VendorGuidePage = React.lazy(() => import("./pages/vendor/VendorGuidePage"));
const FAQsPage = React.lazy(() => import("./pages/FAQsPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const DeliveryPage = React.lazy(() => import("./pages/DeliveryPage"));
const ReturnsPage = React.lazy(() => import("./pages/ReturnsPage"));
const GiftCardPage = React.lazy(() => import("./pages/GiftCardPage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

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
  const userRole = profile?.role;
  const isActualAdmin = userRole === "admin";
  const isMasterAdmin = profile?.name === "Master Admin";
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

const SEOManager = () => {
  useEffect(() => {
    document.title = "Nuria — Home of African Books";
  }, []);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SEOManager />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AuthInitializer>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={
                <GlobalMaintenanceWrapper>
                  <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/vendor" element={<RoleGuard requiredRole="vendor"><VendorDashboard /></RoleGuard>} />
                    <Route path="/vendor/dashboard" element={<RoleGuard requiredRole="vendor"><VendorDashboard /></RoleGuard>} />
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
            </Suspense>
          </AuthInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
