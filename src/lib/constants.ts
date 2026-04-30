import { Category, Product } from "./types";

export const CATEGORIES: Category[] = [
  { id: "10", name: "All Categories", slug: "", icon: "LayoutGrid" },
  { id: "1", name: "Fiction", slug: "fiction", icon: "BookOpen" },
  { id: "2", name: "Non-Fiction", slug: "non-fiction", icon: "GraduationCap" },
  { id: "3", name: "Children Education", slug: "children-education", icon: "Baby" },
  { id: "4", name: "Self-Help", slug: "self-help", icon: "Lightbulb" },
  { id: "5", name: "Religion", slug: "religion", icon: "Heart" },
  { id: "6", name: "Business", slug: "business", icon: "Briefcase" },
  { id: "7", name: "History", slug: "history", icon: "Globe" },
  { id: "8", name: "Technology", slug: "technology", icon: "Smartphone" },
  { id: "9", name: "Lifestyle", slug: "lifestyle", icon: "Shirt" },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price).replace("KES", "KSh");
};

export const MOCK_PRODUCTS: Product[] = [];
