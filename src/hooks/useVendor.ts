import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";

export interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  mpesa_number: string;
  is_verified: boolean;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  admin_notes?: string;
  bio?: string;
  phone?: string;
  category?: string;
  banner_url?: string;
  logo_url?: string;
  commission_rate?: number;
}

export const useVendorData = () => {
  const user = useAuthStore((s) => s.user);
  
  return useQuery<Vendor | null>({
    queryKey: ["vendor", "profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Vendor | null;
    },
    enabled: !!user
  });
};

export const useVendorProducts = () => {
  const user = useAuthStore((s) => s.user);
  const { data: vendor } = useVendorData();
  
  return useQuery({
    queryKey: ["vendor", "products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const vendorIdentifier = vendor?.id || user.id;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`vendor_id.eq.${user.id},vendor_id.eq.${vendorIdentifier}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
};

export const useVendorOrders = () => {
  const user = useAuthStore((s) => s.user);
  const { data: vendor } = useVendorData();

  return useQuery({
    queryKey: ["vendor", "orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const vendorIdentifier = vendor?.id || user.id;

      const { data, error } = await supabase
        .from("order_items")
        .select("*, orders(*), products!inner(*)")
        .or(`vendor_id.eq.${user.id},vendor_id.eq.${vendorIdentifier}`, { foreignTable: "products" });
      
      if (error) throw error;

      const orders = (data || [])
        .map((item: any) => item.orders)
        .filter((order: any, index: number, self: any[]) => 
          order && self.findIndex(o => o?.id === order.id) === index
        );
      
      return orders;
    },
    enabled: !!user
  });
};

export const useVendorPayouts = () => {
  const { data: vendor } = useVendorData();
  
  return useQuery({
    queryKey: ["vendor", "payouts", vendor?.id],
    queryFn: async () => {
      if (!vendor?.id) return [];
      try {
        const { data, error } = await supabase
          .from("payouts")
          .select("*")
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            console.warn("Payouts table does not exist yet.");
            return [];
          }
          throw error;
        }
        return data || [];
      } catch (e) {
        console.error("Error fetching payouts:", e);
        return [];
      }
    },
    enabled: !!vendor?.id
  });
};
