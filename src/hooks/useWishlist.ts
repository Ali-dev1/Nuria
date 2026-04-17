import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";

export const useWishlist = () => {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const { data: wishlistIds = [], ...rest } = useQuery({
    queryKey: ["wishlist", user?.id || "guest"],
    queryFn: async () => {
      if (!user) {
        const local = localStorage.getItem("nuria_guest_wishlist");
        return local ? JSON.parse(local) : [];
      }
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((w) => w.product_id);
    },
  });

  const toggle = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        const local = localStorage.getItem("nuria_guest_wishlist");
        const current: string[] = local ? JSON.parse(local) : [];
        let updated;
        if (current.includes(productId)) {
          updated = current.filter(id => id !== productId);
        } else {
          updated = [...current, productId];
        }
        localStorage.setItem("nuria_guest_wishlist", JSON.stringify(updated));
        return updated;
      }
      
      const isInWishlist = wishlistIds.includes(productId);
      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist", user?.id || "guest"] }),
  });

  const syncWishlist = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const local = localStorage.getItem("nuria_guest_wishlist");
      if (!local) return;
      const ids: string[] = JSON.parse(local);
      if (ids.length === 0) return;

      const { error } = await supabase
        .from("wishlists")
        .upsert(ids.map(id => ({ user_id: user.id, product_id: id })), { onConflict: "user_id,product_id" });
      
      if (error) throw error;
      localStorage.removeItem("nuria_guest_wishlist");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist", user?.id] }),
  });

  return { wishlistIds, toggle: toggle.mutate, isToggling: toggle.isPending, syncWishlist: syncWishlist.mutate, ...rest };
};
