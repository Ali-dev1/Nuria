import { Category, Product } from "./types";

export const CATEGORIES: Category[] = [
  { id: "1", name: "Fiction", slug: "fiction", icon: "BookOpen" },
  { id: "2", name: "Non-Fiction", slug: "non-fiction", icon: "GraduationCap" },
  { id: "3", name: "Children", slug: "children", icon: "Baby" },
  { id: "4", name: "Education", slug: "education", icon: "GraduationCap" },
  { id: "5", name: "Self-Help", slug: "self-help", icon: "Lightbulb" },
  { id: "6", name: "Religion", slug: "religion", icon: "Heart" },
  { id: "7", name: "Business", slug: "business", icon: "Briefcase" },
  { id: "8", name: "History", slug: "history", icon: "Globe" },
  { id: "9", name: "Technology", slug: "technology", icon: "Smartphone" },
  { id: "10", name: "Lifestyle", slug: "lifestyle", icon: "Shirt" },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price).replace("KES", "KSh");
};

export const MOCK_PRODUCTS: Product[] = [];
