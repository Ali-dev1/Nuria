import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";

export const useRole = () => {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return "customer";
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching role:", error);
        return "customer";
      }
      return data?.role || "customer";
    },
    enabled: !!user,
  });
};
