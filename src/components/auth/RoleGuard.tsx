import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "vendor" | "customer";
}

/**
 * RoleGuard Component
 * Standardizes access control across the platform.
 * It intelligently waits for auth initialization and respects 'God Mode' test overrides.
 */
export const RoleGuard = ({ children, requiredRole }: RoleGuardProps) => {
  const { user, loading: authLoading } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for all data to be ready
    if (authLoading || profileLoading) return;

    const checkAccess = () => {
      const testRole = localStorage.getItem("nuria_test_role");
      
      // 1. Priority 1: Developer 'God Mode' Override
      // If we are in test mode and the role matches (or no specific role is required), let them in immediately.
      if (testRole) {
        if (!requiredRole || testRole === requiredRole || (requiredRole === "admin" && testRole === "admin")) {
          setAuthorized(true);
          return;
        }
      }

      // 2. Priority 2: Real Auth Check
      // If no valid test role and no user, we must go to login.
      if (!user) {
        navigate("/login");
        return;
      }

      // 3. Priority 3: Database Role Enforcement
      // Extract roles from the profile fetched from Supabase
      const roles = (profile as any)?.user_roles || [];
      const hasActualRole = Array.isArray(roles) 
        ? roles.some((r: any) => r.role === requiredRole)
        : (roles as any)?.role === requiredRole;

      // If they don't have the role and aren't overriding it, kick to home
      if (requiredRole && !hasActualRole) {
        navigate("/");
        return;
      }

      setAuthorized(true);
    };

    checkAccess();
  }, [user, authLoading, profileLoading, requiredRole, profile, navigate]);

  // Loading State - Prevents flickering and race-condition redirects
  if (authLoading || profileLoading || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Synchronizing Identity...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
