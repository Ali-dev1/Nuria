import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";

type DbProduct = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  isbn: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  vendor_id: string | null;
  stock: number | null;
  image_url: string | null;
  description: string | null;
  format: string | null;
  is_featured: boolean | null;
  rating: number | null;
  review_count: number | null;
  created_at: string | null;
  categories: { slug: string } | null;
};

const mapProduct = (p: DbProduct): Product => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  author: p.author ?? "Unknown Author",
  isbn: p.isbn ?? undefined,
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  category: p.categories?.slug ?? p.category_id ?? "General",
  vendorId: p.vendor_id ?? undefined,
  stock: p.stock ?? 0,
  images: p.image_url ? [p.image_url] : ["/placeholder.svg"],
  description: p.description ?? "",
  format: (p.format as "physical" | "ebook") ?? "physical",
  isFeatured: p.is_featured ?? false,
  rating: Number(p.rating ?? 0),
  reviewCount: p.review_count ?? 0,
  createdAt: p.created_at ?? "",
});

export const useProducts = (options?: { 
  category?: string; 
  featured?: boolean; 
  author?: string;
  search?: string;
  ids?: string[];
  limit?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query;
      
      const selectStr = "*, categories(slug)";
      const isFiltered = !!options?.category;

      if (isFiltered) {
        query = supabase.from("products").select("*, categories!inner(slug)", { count: "exact" }).eq("categories.slug", options.category);
      } else {
        query = supabase.from("products").select("*, categories(slug)", { count: "exact" });
      }
      
      if (options?.featured) query = query.eq("is_featured", true);
      if (options?.author) query = query.ilike("author", `%${options.author}%`);
      
      if (options?.search) {
        const term = options.search.trim();
        query = query.or(`title.ilike.%${term}%,author.ilike.%${term}%,isbn.ilike.%${term}%`);
      }
      
      if (options?.ids && options.ids.length > 0) {
        query = query.in("id", options.ids);
      }
      
      // Pagination Logic
      if (options?.page !== undefined && options?.pageSize !== undefined) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      } else if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      // Sorting Logic
      const sort = options?.sort || "newest";
      switch (sort) {
        case "price-low": query = query.order("price", { ascending: true }); break;
        case "price-high": query = query.order("price", { ascending: false }); break;
        case "rating": query = query.order("rating", { ascending: false }); break;
        case "bestselling": query = query.order("review_count", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false });
      }
      
      const { data, error, count } = await query;
      if (error) throw error;
      
      return {
        products: (data as any[]).map(mapProduct),
        totalCount: count || 0
      };
    },
  });
};

export const useProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return mapProduct(data as any);
    },
    enabled: !!slug,
  });
};
