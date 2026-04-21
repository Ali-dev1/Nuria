import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";

export const useProfile = () => {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;

      return {
        ...data,
        roles: data?.role ? [data.role] : []
      };
    },
    enabled: !!user,
  });
};
