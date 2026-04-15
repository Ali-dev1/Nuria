import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    const unsubscribe = store.initialize();
    return unsubscribe;
  }, []);

  return {
    user: store.user,
    session: store.session,
    loading: store.loading,
    signUp: store.signUp,
    signIn: store.signIn,
    signOut: store.signOut,
    isAuthenticated: !!store.session,
  };
};
