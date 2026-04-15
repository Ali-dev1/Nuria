import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialize: () => () => void;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: () => {
    const testRole = localStorage.getItem("nuria_test_role");
    
    const MOCK_UUIDS: Record<string, string> = {
      admin: "00000000-0000-0000-0000-000000000001",
      vendor: "00000000-0000-0000-0000-000000000002",
      customer: "00000000-0000-0000-0000-000000000003",
    };

    if (testRole) {
      set({ 
        user: { 
          id: MOCK_UUIDS[testRole] || "00000000-0000-0000-0000-000000000000", 
          email: `${testRole}@nuria.local`,
          user_metadata: { role: testRole, full_name: `Test ${testRole}` }
        } as any,
        session: { access_token: "dummy-token", user: {} as any } as any,
        loading: false 
      });
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!testRole) {
        set({ session, user: session?.user ?? null, loading: false });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!testRole) {
        set({ session, user: session?.user ?? null, loading: false });
      } else {
        set({ loading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  signUp: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
