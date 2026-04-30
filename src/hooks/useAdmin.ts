import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/integrations/supabase/types";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [
        { count: usersCount }, 
        { count: productsCount }, 
        { count: ordersCount }, 
        { count: vendorsCount },
        { count: pendingOrdersCount },
        { count: pendingVendorsCount },
        revenueRes,
        { count: roleVendorsCount }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("vendors").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("vendors").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("total").in("status", ["delivered", "confirmed"]),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "vendor")
      ]);

      const realRevenue = revenueRes.data?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
      
      // Use actual counts, but keep a sensible fallback if everything is null
      const finalUsers = usersCount || 0;
      const finalProducts = productsCount || 0;
      const finalOrders = ordersCount || 0;
      
      // Use the maximum of the two tables to ensure we catch all vendors
      const finalVendors = Math.max(vendorsCount || 0, roleVendorsCount || 0);

      return {
        users: finalUsers,
        products: finalProducts,
        orders: finalOrders,
        vendors: finalVendors,
        pendingOrders: pendingOrdersCount || 0,
        pendingVendors: pendingVendorsCount || 0,
        revenue: realRevenue,
        isSimulated: false
      };
    },
    refetchInterval: 60000, // Refetch every minute for real-time feel
  });
};

export const useAdminProducts = (options: { search?: string, page: number, pageSize: number }) => {
  return useQuery({
    queryKey: ["admin", "products", options],
    queryFn: async () => {
      let query = supabase.from("products").select("*", { count: "exact" });
      
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,author.ilike.%${options.search}%`);
      }
      
      const from = (options.page - 1) * options.pageSize;
      const to = from + options.pageSize - 1;
      
      const { data, error, count } = await query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      return { products: data, totalCount: count || 0 };
    }
  });
};

export const useAdminOrders = (options?: { 
  limit?: number, 
  page?: number, 
  pageSize?: number,
  status?: "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
}) => {
  return useQuery({
    queryKey: ["admin", "orders", options],
    queryFn: async () => {
      let query = supabase.from("orders").select("*", { count: "exact" });
      
      // Apply status filter if specified
      if (options?.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }
      
      if (options?.page !== undefined && options?.pageSize !== undefined) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      } else if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      query = query.order("created_at", { ascending: false });
      
      const { data: orders, error: ordersError, count } = await query;
      if (ordersError) throw ordersError;
      if (!orders || orders.length === 0) return { data: [], count };

      // Manual join with profiles
      const userIds = Array.from(new Set(orders.map(o => o.user_id)));
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles for orders:", profilesError);
        return { data: orders, count };
      }

      const mergedData = orders.map(order => ({
        ...order,
        profiles: profiles.find(p => p.user_id === order.user_id) || null
      }));

      return { data: mergedData, count };
    }
  });
};

export const useAdminVendors = (options?: { verified?: boolean }) => {
  return useQuery({
    queryKey: ["admin", "vendors", options],
    queryFn: async () => {
      let query = supabase.from("vendors").select("*", { count: "exact" });
      
      if (options?.verified !== undefined) {
        query = query.eq("is_verified", options.verified);
      }
      
      query = query.order("created_at", { ascending: false });
      
      const { data: vendors, error: vendorsError, count } = await query;
      if (vendorsError) throw vendorsError;
      if (!vendors || vendors.length === 0) return { data: [], count };

      // Manual join with profiles to get name (email is on vendors.contact_email, not profiles)
      const userIds = Array.from(new Set(vendors.map(v => v.user_id)));
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles for vendors:", profilesError);
        return { data: vendors, count };
      }

      const mergedData = vendors.map(v => ({
        ...v,
        profiles: {
          ...(profiles?.find(p => p.user_id === v.user_id) ?? { user_id: '', name: null, email: null, role: null }),
          email: v.contact_email || null,
        },
      }));

      return { data: mergedData, count };
    }
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return { data: data || [], count };
    }
  });
};

export const useAdminRoles = () => {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, role");
      if (error) throw error;
      return data;
    }
  });
};

export const useOrderItems = (orderId: string | null) => {
  return useQuery({
    queryKey: ["admin", "order-items", orderId],
    queryFn: async () => {
      if (!orderId) return [];
      const { data, error } = await supabase
        .from("order_items")
        .select("*, products(title, author)")
        .eq("order_id", orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });
};

export const useAdminPosts = () => {
  return useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      // @ts-expect-error - posts table is not in generated types
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Record<string, unknown>[];
    }
  });
};

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*");
      if (error) throw error;
      const settingsMap: Record<string, string> = {};
      (data || []).forEach((s: Tables<"platform_settings">) => { settingsMap[s.key] = s.value; });
      return settingsMap;
    }
  });
};
