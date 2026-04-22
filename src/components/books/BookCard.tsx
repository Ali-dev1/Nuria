import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatPrice } from "@/lib/constants";

interface BookCardProps {
  product: Product;
}

export const BookCard = ({ product }: BookCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { wishlistIds, toggle } = useWishlist();
  const isWished = wishlistIds.includes(product.id);
  const isSoldOut = product.stock === 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ease-in flex flex-col h-full overflow-hidden">
      <Link to={`/books/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-t-xl bg-muted">
        {product.images?.[0] && product.images[0] !== "/placeholder.svg" && !product.images[0].includes("placeholder") ? (
          <img 
            src={product.images[0].includes("unsplash.com") ? `${product.images[0]}&fm=webp&q=80` : product.images[0]} 
            alt={product.title} 
            width="300"
            height="400"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-muted to-muted/50">
            <span className="font-display text-[10px] font-bold text-[#1B4332] mb-1 uppercase tracking-widest opacity-50 text-center">Nuria Store</span>
            <span className="font-display text-xs text-[#1A1A1A]/60 text-center line-clamp-3 leading-tight">{product.title}</span>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[#A1440B] text-white text-[10px] font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}

        {/* Sold Out Badge */}
        {isSoldOut && (
          <span className="absolute top-2 right-2 bg-[#374151] text-white text-[10px] font-bold px-2 py-1 rounded">
            Sold Out
          </span>
        )}

        {/* Wishlist Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) { toast.error("Sign in to save to wishlist"); return; }
            toggle(product.id);
          }}
          className={`absolute ${isSoldOut ? 'top-10' : 'top-2'} right-2 p-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all hover:bg-white/40 hover:scale-110 text-white drop-shadow-lg shadow-xl`}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isWished ? "fill-red-500 text-red-500" : "text-white/80 hover:text-white"}`} />
        </button>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/books/${product.slug}`} className="block flex-1">
          <h3 
            className="font-display text-[14px] font-semibold text-[#1A1A1A] line-clamp-2 leading-tight min-h-[2.5rem]"
            title={product.title}
          >
            {product.title}
          </h3>
          <p 
            className="font-sans text-[12px] text-[#6B7280] mt-1 line-clamp-1"
            title={product.author || ""}
          >
            {product.author}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-sans text-[16px] font-bold text-[#1B4332]">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="font-sans text-[12px] text-[#6B7280] line-through">
                {formatPrice(product.originalPrice ?? 0)}
              </span>
            )}
          </div>
        </Link>
        
        <button
          onClick={() => addItem(product)}
          disabled={isSoldOut}
          className="mt-4 w-full py-2.5 bg-[#1B4332] text-white font-sans text-sm font-medium rounded-lg hover:brightness-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
};
