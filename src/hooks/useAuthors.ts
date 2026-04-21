import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface Author {
  id: string;
  name: string;
  photo_url: string;
  bio: string;
  tags: string[];
  slug: string;
  created_at: string;
}

export const useAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Author[];
    },
  });
};

export const useAuthor = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["author", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Author;
    },
    enabled: !!slug,
  });
};
