import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { useVendorData } from "@/hooks/useVendor";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "vendor" | "customer";
}

  /**
   * RoleGuard Component
   * Standardizes access control across the platform.
   * It intelligently waits for auth initialization and profiles before allowing access.
   */
  export const RoleGuard = ({ children, requiredRole }: RoleGuardProps) => {
    const { user, loading: authLoading } = useAuthStore();
    const { data: profile, isLoading: profileLoading } = useProfile();
    const { data: vendor, isLoading: vendorLoading } = useVendorData();
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
  
    useEffect(() => {
      // Wait for all data to be ready
      if (authLoading || profileLoading || (requiredRole === 'vendor' && vendorLoading)) return;
  
      const checkAccess = () => {
        // 1. Auth Check
        if (!user) {
          navigate("/login");
          return;
        }
  
        // 2. Database Role Enforcement
        const profileRole = profile?.role;
  
        // If they don't have the role, kick to home
        if (requiredRole && profileRole !== requiredRole) {
          navigate("/");
          return;
        }

        // 3. Vendor Record Enforcement
        // If they have a record, they can access ANY vendor sub-page
        // If they don't, they are forced to register
        if (requiredRole === "vendor" && !vendor && globalThis.location.pathname !== "/vendor/register") {
          navigate("/vendor/register");
          return;
        }
  
        setAuthorized(true);
      };
  
      checkAccess();
    }, [user, authLoading, profileLoading, vendorLoading, requiredRole, profile, vendor, navigate]);
 
  // Loading State
  if (authLoading || profileLoading || (requiredRole === 'vendor' && vendorLoading) || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
