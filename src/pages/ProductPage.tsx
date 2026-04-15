import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { StarRating } from "@/components/shared/StarRating";
import { PriceTag } from "@/components/shared/PriceTag";
import { BookCard } from "@/components/books/BookCard";
import { useCartStore } from "@/store/cartStore";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/shared/Skeleton";
import { useState } from "react";
import { toast } from "sonner";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { wishlistIds, toggle } = useWishlist();
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "delivery">("description");

  const { data: relatedData } = useProducts({
    category: product?.category,
    limit: 5,
  });

  const relatedProducts = relatedData?.products || [];
  const related = relatedProducts.filter((p) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="container-nuria py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-[3/4] w-full max-w-md rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-nuria py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Book not found</h1>
        <Link to="/books" className="mt-4 inline-flex items-center gap-2 text-sm text-secondary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to books
        </Link>
      </div>
    );
  }

  const loyaltyPoints = Math.floor(product.price / 10);

  return (
    <div className="container-nuria py-8">
      <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to books
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden max-w-md mx-auto lg:max-w-none w-full shadow-2xl">
          {product.images?.[0] && product.images[0] !== "/placeholder.svg" && !product.images[0].includes("placeholder") ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="absolute inset-0 w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.nextElementSibling) (target.nextElementSibling as HTMLElement).style.display = "flex";
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-muted to-muted/50 text-center" style={{ display: product.images?.[0] && product.images[0] !== "/placeholder.svg" && !product.images[0].includes("placeholder") ? "none" : "flex" }}>
            <div className="flex flex-col items-center">
              <span className="font-display text-sm font-bold text-secondary mb-4 uppercase tracking-[0.2em] opacity-60">Nuria Forest</span>
              <h2 className="font-display text-3xl text-foreground/40 font-bold leading-tight">{product.title}</h2>
              <div className="h-1 w-12 bg-secondary/30 my-6 rounded-full" />
              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Original Cover Coming Soon</p>
            </div>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-lg shadow-lg">SALE</span>
          )}
        </div>

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

          <div className="flex items-center gap-2 text-sm text-[#1B4332] bg-[#D1FAE5] px-4 py-2.5 rounded-lg font-sans">
            🎁 You'll earn <span className="font-bold">{loyaltyPoints} loyalty points</span> on this purchase
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => addItem(product)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B4332] text-white font-sans font-semibold rounded-lg hover:brightness-90 transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => {
                if (!user) { toast.error("Sign in to save to wishlist"); return; }
                toggle(product.id);
              }}
              className="p-3 border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors"
              aria-label={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? "fill-red-500 text-red-500" : "text-[#1A1A1A]"}`} />
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
      </div>

      <div className="mt-12">
        <div className="flex border-b border-border gap-6">
          {(["description", "reviews", "delivery"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-sans font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? "border-[#1B4332] text-[#1A1A1A]" : "border-transparent text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === "description" && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
          )}
          {activeTab === "reviews" && (
            <p className="text-muted-foreground">Reviews coming soon. Be the first to review this book!</p>
          )}
          {activeTab === "delivery" && (
            <div className="space-y-3 text-sm font-sans text-[#6B7280] max-w-lg">
              <p><span className="font-medium text-[#1A1A1A]">Nairobi:</span> 1-2 business days — KSh 200</p>
              <p><span className="font-medium text-[#1A1A1A]">Rest of Kenya:</span> 3-5 business days — KSh 350</p>
              <p><span className="font-medium text-[#1A1A1A]">Free delivery</span> within Nairobi for orders above KSh 10,000</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <BookCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
