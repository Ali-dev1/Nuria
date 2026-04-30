export interface Product {
  id: string;
  title: string;
  slug: string;
  author: string;
  isbn?: string;
  price: number;
  originalPrice?: number;
  category: string;
  vendorId?: string;
  stock: number;
  images: string[];
  description: string;
  format: "physical" | "ebook";
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  qualityScore: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
