import React from "react";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import { PriceTag } from "@/components/shared/PriceTag";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

interface ProductInfoProps {
  product: Product;
  loyaltyPoints: number;
  addItem: (item: Product) => void;
  user: User | null;
  toggleWishlist: (id: string) => void;
  wishlistIds: string[];
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  loyaltyPoints,
  addItem,
  user,
  toggleWishlist,
  wishlistIds,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-secondary font-medium capitalize">{product.category.replace("-", " ")}</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">{product.title}</h1>
        <p className="text-muted-foreground mt-1">by <span className="text-foreground font-medium">{product.author}</span></p>
      </div>

      <div className="flex items-center gap-3">
        <StarRating rating={product.rating} size={18} />
        <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
      </div>

      <PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" />

      {product.isbn && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">ISBN:</span> {product.isbn} · <span className="font-medium text-foreground">Format:</span> {product.format === "physical" ? "Paperback" : "E-Book"}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-primary bg-green-100 px-4 py-2.5 rounded-lg font-sans">
        You'll earn <span className="font-bold">{loyaltyPoints} loyalty points</span> on this purchase
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => addItem(product)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-sans font-semibold rounded-lg hover:brightness-90 transition-all shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
        <button
          onClick={() => {
            if (!user) { toast.error("Sign in to save to wishlist"); return; }
            toggleWishlist(product.id);
          }}
          className="p-3 border border-border rounded-lg hover:bg-background transition-colors"
          aria-label={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        {[
          { icon: Truck, label: "Free delivery over KSh 3,000" },
          { icon: Shield, label: "Secure M-Pesa payment" },
          { icon: RotateCcw, label: "7-day returns" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 bg-card rounded-lg">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
